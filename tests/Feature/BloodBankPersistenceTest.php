<?php

use App\Models\BloodRequest;
use App\Models\BloodUnit;
use App\Models\DonationDrive;
use App\Models\Donor;
use App\Models\User;

test('blood unit can be created via api and persists in database', function () {
    $payload = [
        'bloodType' => 'O-',
        'component' => 'Packed Red Blood Cells',
        'facilityId' => 'fac-1',
        'location' => 'Main Cold Vault Ref-01',
        'volumeMl' => 450,
        'donorCode' => 'DNR-1001',
    ];

    $response = $this->postJson('/api/inventory', $payload);

    $response->assertCreated();
    $data = $response->json();

    expect($data)->toHaveKey('id')
        ->and($data['bloodType'])->toBe('O-')
        ->and($data['component'])->toBe('Packed Red Blood Cells');

    $this->assertDatabaseHas('blood_units', [
        'id' => $data['id'],
        'blood_type' => 'O-',
    ]);
});

test('blood unit status can be updated and saved in database', function () {
    $unit = BloodUnit::create([
        'id' => 'unit-test-'.uniqid(),
        'unit_number' => 'BLD-TEST-'.rand(1000, 9999),
        'blood_type' => 'A+',
        'component' => 'Whole Blood',
        'collection_date' => now()->toDateString(),
        'expiry_date' => now()->addDays(35)->toDateString(),
        'status' => 'Available',
    ]);

    $response = $this->putJson("/api/inventory/{$unit->id}/status", [
        'status' => 'Quarantined',
        'notes' => 'Flagged for re-testing',
    ]);

    $response->assertOk();

    $this->assertDatabaseHas('blood_units', [
        'id' => $unit->id,
        'status' => 'Quarantined',
    ]);
});

test('donor can be registered and saved in database', function () {
    $payload = [
        'fullName' => 'Sarah Connor',
        'bloodType' => 'O+',
        'age' => 29,
        'gender' => 'Female',
        'phone' => '+1 (555) 012-3456',
        'email' => 'sarah@example.com',
        'hemoglobinGdl' => 14.2,
        'bloodPressure' => '118/76',
        'weightKg' => 64.0,
    ];

    $response = $this->postJson('/api/donors', $payload);

    $response->assertCreated();
    $data = $response->json();

    expect($data['fullName'])->toBe('Sarah Connor')
        ->and($data['bloodType'])->toBe('O+');

    $this->assertDatabaseHas('donors', [
        'id' => $data['id'],
        'full_name' => 'Sarah Connor',
    ]);
});

test('blood request can be created and persisted in database', function () {
    $payload = [
        'hospitalName' => 'City General Emergency ER',
        'patientName' => 'Arthur Pendelton',
        'patientAge' => 54,
        'patientGender' => 'Male',
        'requiredBloodType' => 'O-',
        'component' => 'Packed Red Blood Cells',
        'unitsRequested' => 2,
        'urgency' => 'Emergency (Stat)',
    ];

    $response = $this->postJson('/api/requests', $payload);

    $response->assertCreated();
    $data = $response->json();

    expect($data['patientName'])->toBe('Arthur Pendelton')
        ->and($data['status'])->toBe('Pending');

    $this->assertDatabaseHas('blood_requests', [
        'id' => $data['id'],
        'patient_name' => 'Arthur Pendelton',
    ]);
});

test('dashboard page provides database units to authenticated users', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $unit = BloodUnit::create([
        'id' => 'unit-dashboard-'.uniqid(),
        'unit_number' => 'BLD-DASH-'.rand(1000, 9999),
        'blood_type' => 'AB-',
        'component' => 'Platelets',
        'collection_date' => now()->toDateString(),
        'expiry_date' => now()->addDays(5)->toDateString(),
        'status' => 'Available',
    ]);

    $response = $this->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('initialUnits')
        ->has('initialDonors')
        ->has('initialRequests')
    );
});

test('blood unit can be updated and deleted via api', function () {
    $unit = BloodUnit::create([
        'id' => 'unit-crud-'.uniqid(),
        'unit_number' => 'BLD-CRUD-'.rand(1000, 9999),
        'blood_type' => 'B+',
        'component' => 'Whole Blood',
        'volume_ml' => 450,
        'collection_date' => now()->toDateString(),
        'expiry_date' => now()->addDays(30)->toDateString(),
        'status' => 'Available',
    ]);

    // Update
    $updateRes = $this->putJson("/api/inventory/{$unit->id}", [
        'bloodType' => 'B-',
        'volumeMl' => 500,
        'notes' => 'Corrected blood group after re-typing',
    ]);
    $updateRes->assertOk();
    $this->assertDatabaseHas('blood_units', [
        'id' => $unit->id,
        'blood_type' => 'B-',
        'volume_ml' => 500,
    ]);

    // Delete
    $deleteRes = $this->deleteJson("/api/inventory/{$unit->id}");
    $deleteRes->assertOk();
    $this->assertDatabaseMissing('blood_units', [
        'id' => $unit->id,
    ]);
});

test('donor can be updated and deleted via api', function () {
    $donor = Donor::create([
        'id' => 'dnr-crud-'.uniqid(),
        'donor_code' => 'DNR-CRUD-'.rand(1000, 9999),
        'full_name' => 'John Doe',
        'blood_type' => 'A+',
        'age' => 35,
        'gender' => 'Male',
        'phone' => '+1 555-0001',
        'email' => 'john@example.com',
        'address' => 'District 1',
    ]);

    // Update
    $updateRes = $this->putJson("/api/donors/{$donor->id}", [
        'fullName' => 'Jonathan Doe',
        'phone' => '+1 555-9999',
    ]);
    $updateRes->assertOk();
    $this->assertDatabaseHas('donors', [
        'id' => $donor->id,
        'full_name' => 'Jonathan Doe',
        'phone' => '+1 555-9999',
    ]);

    // Delete
    $deleteRes = $this->deleteJson("/api/donors/{$donor->id}");
    $deleteRes->assertOk();
    $this->assertDatabaseMissing('donors', [
        'id' => $donor->id,
    ]);
});

test('blood request can be updated and deleted via api', function () {
    $req = BloodRequest::create([
        'id' => 'req-crud-'.uniqid(),
        'request_code' => 'REQ-CRUD-'.rand(1000, 9999),
        'hospital_name' => 'Metro General',
        'patient_name' => 'Jane Smith',
        'patient_age' => 42,
        'patient_gender' => 'Female',
        'required_blood_type' => 'AB+',
        'component' => 'Platelets',
        'units_requested' => 1,
        'urgency' => 'Routine',
        'status' => 'Pending',
        'request_date' => now()->toDateTimeString(),
        'required_by_date' => now()->addHours(6)->toDateTimeString(),
    ]);

    // Update
    $updateRes = $this->putJson("/api/requests/{$req->id}", [
        'urgency' => 'Emergency (Stat)',
        'unitsRequested' => 3,
    ]);
    $updateRes->assertOk();
    $this->assertDatabaseHas('blood_requests', [
        'id' => $req->id,
        'urgency' => 'Emergency (Stat)',
        'units_requested' => 3,
    ]);

    // Delete
    $deleteRes = $this->deleteJson("/api/requests/{$req->id}");
    $deleteRes->assertOk();
    $this->assertDatabaseMissing('blood_requests', [
        'id' => $req->id,
    ]);
});

test('donation drive can be updated and deleted via api', function () {
    $drive = DonationDrive::create([
        'id' => 'drv-crud-'.uniqid(),
        'drive_code' => 'DRV-CRUD-'.rand(10, 99),
        'name' => 'Community Blood Camp',
        'organizer' => 'Health Dept',
        'location' => 'Town Center',
        'start_date' => now()->toDateString(),
        'end_date' => now()->addDays(2)->toDateString(),
        'target_units' => 50,
        'collected_units' => 0,
        'registered_donors_count' => 5,
        'status' => 'Scheduled',
    ]);

    // Update
    $updateRes = $this->putJson("/api/drives/{$drive->id}", [
        'targetUnits' => 120,
        'status' => 'Active',
    ]);
    $updateRes->assertOk();
    $this->assertDatabaseHas('donation_drives', [
        'id' => $drive->id,
        'target_units' => 120,
        'status' => 'Active',
    ]);

    // Delete
    $deleteRes = $this->deleteJson("/api/drives/{$drive->id}");
    $deleteRes->assertOk();
    $this->assertDatabaseMissing('donation_drives', [
        'id' => $drive->id,
    ]);
});
