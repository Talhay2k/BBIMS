<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\BloodRequest;
use App\Models\BloodUnit;
use App\Models\DiscardLog;
use App\Models\DonationDrive;
use App\Models\Donor;
use App\Models\Facility;
use App\Models\StorageEquipment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@bloodmatrix.org'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $jsonPath = base_path('server-data.json');
        if (File::exists($jsonPath)) {
            $data = json_decode(File::get($jsonPath), true);

            if (! empty($data['facilities'])) {
                foreach ($data['facilities'] as $item) {
                    Facility::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'code' => $item['code'],
                            'name' => $item['name'],
                            'type' => $item['type'],
                            'city' => $item['city'],
                            'phone' => $item['phone'],
                            'refrigerators_count' => $item['refrigeratorsCount'] ?? 0,
                            'freezers_count' => $item['freezersCount'] ?? 0,
                            'agitators_count' => $item['agitatorsCount'] ?? 0,
                            'status' => $item['status'] ?? 'Operational',
                            'total_units_in_stock' => $item['totalUnitsInStock'] ?? 0,
                            'available_units' => $item['availableUnits'] ?? 0,
                        ]
                    );
                }
            }

            if (! empty($data['equipment'])) {
                foreach ($data['equipment'] as $item) {
                    StorageEquipment::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'facility_id' => $item['facilityId'],
                            'name' => $item['name'],
                            'type' => $item['type'],
                            'current_temp_c' => $item['currentTempC'] ?? 4.0,
                            'target_temp_c' => $item['targetTempC'] ?? 4.0,
                            'status' => $item['status'] ?? 'Normal',
                            'capacity_units' => $item['capacityUnits'] ?? 100,
                            'occupied_units' => $item['occupiedUnits'] ?? 0,
                        ]
                    );
                }
            }

            if (! empty($data['donors'])) {
                foreach ($data['donors'] as $item) {
                    Donor::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'donor_code' => $item['donorCode'],
                            'full_name' => $item['fullName'],
                            'blood_type' => $item['bloodType'],
                            'age' => $item['age'],
                            'gender' => $item['gender'],
                            'phone' => $item['phone'],
                            'email' => $item['email'],
                            'address' => $item['address'] ?? '',
                            'last_donation_date' => $item['lastDonationDate'] ?? null,
                            'eligibility_status' => $item['eligibilityStatus'] ?? 'Eligible',
                            'deferral_reason' => $item['deferralReason'] ?? null,
                            'total_donations_count' => $item['totalDonationsCount'] ?? 0,
                            'hemoglobin_gdl' => $item['hemoglobinGdl'] ?? 14.0,
                            'blood_pressure' => $item['bloodPressure'] ?? '120/80',
                            'weight_kg' => $item['weightKg'] ?? 70.0,
                            'notes' => $item['notes'] ?? null,
                        ]
                    );
                }
            }

            if (! empty($data['inventory'])) {
                foreach ($data['inventory'] as $item) {
                    BloodUnit::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'unit_number' => $item['unitNumber'],
                            'blood_type' => $item['bloodType'],
                            'component' => $item['component'],
                            'facility_id' => $item['facilityId'] ?? null,
                            'facility_name' => $item['facilityName'] ?? null,
                            'location' => $item['location'] ?? null,
                            'temperature_zone' => $item['temperatureZone'] ?? null,
                            'volume_ml' => $item['volumeMl'] ?? 450,
                            'collection_date' => $item['collectionDate'],
                            'expiry_date' => $item['expiryDate'],
                            'status' => $item['status'] ?? 'Available',
                            'donor_id' => $item['donorId'] ?? null,
                            'donor_code' => $item['donorCode'] ?? null,
                            'testing_status' => $item['testingStatus'] ?? 'Tested & Passed',
                            'notes' => $item['notes'] ?? null,
                        ]
                    );
                }
            }

            if (! empty($data['requests'])) {
                foreach ($data['requests'] as $item) {
                    BloodRequest::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'request_code' => $item['requestCode'],
                            'hospital_name' => $item['hospitalName'],
                            'patient_name' => $item['patientName'],
                            'patient_age' => $item['patientAge'],
                            'patient_gender' => $item['patientGender'],
                            'required_blood_type' => $item['requiredBloodType'],
                            'component' => $item['component'],
                            'units_requested' => $item['unitsRequested'] ?? 1,
                            'units_assigned' => $item['unitsAssigned'] ?? [],
                            'urgency' => $item['urgency'] ?? 'Routine',
                            'status' => $item['status'] ?? 'Pending',
                            'request_date' => $item['requestDate'],
                            'required_by_date' => $item['requiredByDate'],
                            'dispatch_temperature_c' => $item['dispatchTemperatureC'] ?? null,
                            'courier_tracking_code' => $item['courierTrackingCode'] ?? null,
                            'notes' => $item['notes'] ?? null,
                        ]
                    );
                }
            }

            if (! empty($data['drives'])) {
                foreach ($data['drives'] as $item) {
                    DonationDrive::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'drive_code' => $item['driveCode'],
                            'name' => $item['name'],
                            'organizer' => $item['organizer'],
                            'location' => $item['location'],
                            'start_date' => $item['startDate'],
                            'end_date' => $item['endDate'],
                            'target_units' => $item['targetUnits'] ?? 100,
                            'collected_units' => $item['collectedUnits'] ?? 0,
                            'registered_donors_count' => $item['registeredDonorsCount'] ?? 0,
                            'status' => $item['status'] ?? 'Active',
                            'facility_id' => $item['facilityId'] ?? null,
                        ]
                    );
                }
            }

            if (! empty($data['auditLogs'])) {
                foreach ($data['auditLogs'] as $item) {
                    AuditLog::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'timestamp' => $item['timestamp'],
                            'user_staff' => $item['userStaff'],
                            'action' => $item['action'],
                            'entity_type' => $item['entityType'],
                            'entity_id' => $item['entityId'],
                            'details' => $item['details'],
                            'digital_signature_hash' => $item['digitalSignatureHash'],
                        ]
                    );
                }
            }

            if (! empty($data['discardLogs'])) {
                foreach ($data['discardLogs'] as $item) {
                    DiscardLog::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'unit_number' => $item['unitNumber'],
                            'blood_type' => $item['bloodType'],
                            'component' => $item['component'],
                            'discard_date' => $item['discardDate'],
                            'reason' => $item['reason'],
                            'performed_by' => $item['performedBy'],
                            'facility_name' => $item['facilityName'],
                        ]
                    );
                }
            }
        }
    }
}
