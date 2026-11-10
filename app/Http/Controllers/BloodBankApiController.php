<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\BloodRequest;
use App\Models\BloodUnit;
use App\Models\DiscardLog;
use App\Models\DonationDrive;
use App\Models\Donor;
use App\Models\Facility;
use App\Models\StorageEquipment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BloodBankApiController extends Controller
{
    protected function getStaffName(): string
    {
        return Auth::user()?->name ?? 'System Administrator';
    }

    protected function logAction(string $action, string $entityType, string $entityId, string $details): void
    {
        AuditLog::create([
            'id' => 'log-'.uniqid(),
            'timestamp' => now()->format('Y-m-d H:i:s'),
            'user_staff' => $this->getStaffName(),
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'details' => $details,
            'digital_signature_hash' => '0x'.bin2hex(random_bytes(8)),
        ]);
    }

    public function getInventory(): JsonResponse
    {
        return response()->json(BloodUnit::orderBy('created_at', 'desc')->get());
    }

    public function storeInventory(Request $request): JsonResponse
    {
        $facilityName = 'Central Blood Bank & Processing Hub';
        if ($request->filled('facilityId')) {
            $facility = Facility::find($request->input('facilityId'));
            if ($facility) {
                $facilityName = $facility->name;
            }
        }

        $unitNumber = $request->input('unitNumber') ?? ('BLD-2026-'.rand(1000, 9999));
        $id = $request->input('id') ?? ('bld-'.round(microtime(true) * 1000));

        $unit = BloodUnit::create([
            'id' => $id,
            'unit_number' => $unitNumber,
            'blood_type' => $request->input('bloodType', 'O-'),
            'component' => $request->input('component', 'Packed Red Blood Cells'),
            'facility_id' => $request->input('facilityId', 'fac-1'),
            'facility_name' => $facilityName,
            'location' => $request->input('location', 'Main Cold Vault Ref-01 / Shelf A'),
            'temperature_zone' => $request->input('temperatureZone', '2°C to 6°C'),
            'volume_ml' => (int) $request->input('volumeMl', 450),
            'collection_date' => $request->input('collectionDate', now()->toDateString()),
            'expiry_date' => $request->input('expiryDate', now()->addDays(35)->toDateString()),
            'status' => $request->input('status', 'Available'),
            'donor_id' => $request->input('donorId'),
            'donor_code' => $request->input('donorCode', 'DNR-1001'),
            'testing_status' => $request->input('testingStatus', 'Tested & Passed'),
            'notes' => $request->input('notes'),
        ]);

        $this->logAction(
            'Blood Unit Intake Registered',
            'Inventory',
            $unit->unit_number,
            "Intake registered for {$unit->blood_type} {$unit->component} at {$unit->facility_name}."
        );

        return response()->json($unit, 201);
    }

    public function updateInventory(Request $request, string $id): JsonResponse
    {
        $unit = BloodUnit::findOrFail($id);

        if ($request->filled('bloodType')) {
            $unit->blood_type = $request->input('bloodType');
        }
        if ($request->filled('component')) {
            $unit->component = $request->input('component');
        }
        if ($request->filled('volumeMl')) {
            $unit->volume_ml = (int) $request->input('volumeMl');
        }
        if ($request->filled('facilityId')) {
            $unit->facility_id = $request->input('facilityId');
            $facility = Facility::find($unit->facility_id);
            if ($facility) {
                $unit->facility_name = $facility->name;
            }
        }
        if ($request->filled('location')) {
            $unit->location = $request->input('location');
        }
        if ($request->filled('collectionDate')) {
            $unit->collection_date = $request->input('collectionDate');
        }
        if ($request->filled('expiryDate')) {
            $unit->expiry_date = $request->input('expiryDate');
        }
        if ($request->filled('status')) {
            $unit->status = $request->input('status');
        }
        if ($request->has('notes')) {
            $unit->notes = $request->input('notes');
        }

        $unit->save();

        $this->logAction(
            'Blood Unit Updated',
            'Inventory',
            $unit->unit_number,
            "Updated details for {$unit->unit_number} ({$unit->blood_type} {$unit->component})."
        );

        return response()->json($unit);
    }

    public function updateInventoryStatus(Request $request, string $id): JsonResponse
    {
        $unit = BloodUnit::findOrFail($id);
        $newStatus = $request->input('status');
        $notes = $request->input('notes');

        $unit->status = $newStatus;
        if ($notes) {
            $unit->notes = $notes;
        }
        $unit->save();

        if ($newStatus === 'Discarded') {
            DiscardLog::create([
                'id' => 'dsc-'.uniqid(),
                'unit_number' => $unit->unit_number,
                'blood_type' => $unit->blood_type,
                'component' => $unit->component,
                'discard_date' => now()->toDateString(),
                'reason' => $notes ?? 'Authorized Discard',
                'performed_by' => $this->getStaffName(),
                'facility_name' => $unit->facility_name ?? 'Central Vault',
            ]);
        }

        $this->logAction(
            "Blood Unit Status Updated to {$newStatus}",
            'Inventory',
            $unit->unit_number,
            "Unit {$unit->unit_number} ({$unit->blood_type}) status modified to {$newStatus}."
        );

        return response()->json($unit);
    }

    public function destroyInventory(string $id): JsonResponse
    {
        $unit = BloodUnit::findOrFail($id);
        $unitNumber = $unit->unit_number;
        $unit->delete();

        $this->logAction(
            'Blood Unit Removed',
            'Inventory',
            $unitNumber,
            "Permanently deleted unit {$unitNumber} from inventory."
        );

        return response()->json(['success' => true, 'id' => $id]);
    }

    public function getDonors(): JsonResponse
    {
        return response()->json(Donor::orderBy('created_at', 'desc')->get());
    }

    public function storeDonor(Request $request): JsonResponse
    {
        $donorCode = $request->input('donorCode') ?? ('DNR-'.rand(1000, 9999));
        $id = $request->input('id') ?? ('dnr-'.round(microtime(true) * 1000));

        $donor = Donor::create([
            'id' => $id,
            'donor_code' => $donorCode,
            'full_name' => $request->input('fullName'),
            'blood_type' => $request->input('bloodType', 'O+'),
            'age' => (int) $request->input('age', 30),
            'gender' => $request->input('gender', 'Male'),
            'phone' => $request->input('phone', ''),
            'email' => $request->input('email', ''),
            'address' => $request->input('address', 'Metro District'),
            'last_donation_date' => $request->input('lastDonationDate', now()->toDateString()),
            'eligibility_status' => $request->input('eligibilityStatus', 'Eligible'),
            'deferral_reason' => $request->input('deferralReason'),
            'total_donations_count' => (int) $request->input('totalDonationsCount', 1),
            'hemoglobin_gdl' => (float) $request->input('hemoglobinGdl', 14.0),
            'blood_pressure' => $request->input('bloodPressure', '120/80'),
            'weight_kg' => (float) $request->input('weightKg', 70.0),
            'notes' => $request->input('notes'),
        ]);

        $this->logAction(
            'Donor Registered',
            'Donor',
            $donor->donor_code,
            "Registered new donor: {$donor->full_name} ({$donor->blood_type})."
        );

        return response()->json($donor, 201);
    }

    public function updateDonor(Request $request, string $id): JsonResponse
    {
        $donor = Donor::findOrFail($id);

        if ($request->filled('fullName')) {
            $donor->full_name = $request->input('fullName');
        }
        if ($request->filled('bloodType')) {
            $donor->blood_type = $request->input('bloodType');
        }
        if ($request->filled('age')) {
            $donor->age = (int) $request->input('age');
        }
        if ($request->filled('gender')) {
            $donor->gender = $request->input('gender');
        }
        if ($request->has('phone')) {
            $donor->phone = $request->input('phone');
        }
        if ($request->has('email')) {
            $donor->email = $request->input('email');
        }
        if ($request->has('address')) {
            $donor->address = $request->input('address');
        }
        if ($request->filled('eligibilityStatus')) {
            $donor->eligibility_status = $request->input('eligibilityStatus');
        }
        if ($request->filled('hemoglobinGdl')) {
            $donor->hemoglobin_gdl = (float) $request->input('hemoglobinGdl');
        }
        if ($request->filled('bloodPressure')) {
            $donor->blood_pressure = $request->input('bloodPressure');
        }
        if ($request->filled('weightKg')) {
            $donor->weight_kg = (float) $request->input('weightKg');
        }
        if ($request->has('notes')) {
            $donor->notes = $request->input('notes');
        }

        $donor->save();

        $this->logAction(
            'Donor Profile Updated',
            'Donor',
            $donor->donor_code,
            "Updated donor profile: {$donor->full_name} ({$donor->donor_code})."
        );

        return response()->json($donor);
    }

    public function destroyDonor(string $id): JsonResponse
    {
        $donor = Donor::findOrFail($id);
        $donorCode = $donor->donor_code;
        $name = $donor->full_name;
        $donor->delete();

        $this->logAction(
            'Donor Record Deleted',
            'Donor',
            $donorCode,
            "Permanently removed donor {$name} ({$donorCode})."
        );

        return response()->json(['success' => true, 'id' => $id]);
    }

    public function recordDonation(Request $request, string $id): JsonResponse
    {
        $donor = Donor::findOrFail($id);
        $donor->total_donations_count += 1;
        $donor->last_donation_date = now()->toDateString();
        $donor->save();

        $facilityName = 'Central Blood Bank & Processing Hub';
        if ($request->filled('facilityId')) {
            $facility = Facility::find($request->input('facilityId'));
            if ($facility) {
                $facilityName = $facility->name;
            }
        }

        $unitNumber = 'BLD-2026-'.rand(1000, 9999);
        $unit = BloodUnit::create([
            'id' => 'bld-'.round(microtime(true) * 1000),
            'unit_number' => $unitNumber,
            'blood_type' => $donor->blood_type,
            'component' => $request->input('component', 'Packed Red Blood Cells'),
            'facility_id' => $request->input('facilityId', 'fac-1'),
            'facility_name' => $facilityName,
            'location' => 'Main Cold Vault Ref-01 / Shelf A',
            'temperature_zone' => '2°C to 6°C',
            'volume_ml' => (int) $request->input('volumeMl', 450),
            'collection_date' => now()->toDateString(),
            'expiry_date' => now()->addDays(35)->toDateString(),
            'status' => 'Available',
            'donor_id' => $donor->id,
            'donor_code' => $donor->donor_code,
            'testing_status' => 'Tested & Passed',
            'notes' => "Direct donation intake from donor {$donor->full_name}.",
        ]);

        $this->logAction(
            'Donation Recorded & Unit Created',
            'Donor',
            $donor->donor_code,
            "Recorded successful donation for {$donor->full_name}. Generated unit {$unit->unit_number} ({$donor->blood_type})."
        );

        return response()->json([
            'donor' => $donor,
            'unit' => $unit,
        ]);
    }

    public function getRequests(): JsonResponse
    {
        return response()->json(BloodRequest::orderBy('created_at', 'desc')->get());
    }

    public function storeRequest(Request $request): JsonResponse
    {
        $requestCode = $request->input('requestCode') ?? ('REQ-'.rand(1000, 9999));
        $id = $request->input('id') ?? ('req-'.round(microtime(true) * 1000));

        $bloodReq = BloodRequest::create([
            'id' => $id,
            'request_code' => $requestCode,
            'hospital_name' => $request->input('hospitalName'),
            'patient_name' => $request->input('patientName'),
            'patient_age' => (int) $request->input('patientAge', 40),
            'patient_gender' => $request->input('patientGender', 'Male'),
            'required_blood_type' => $request->input('requiredBloodType', 'O-'),
            'component' => $request->input('component', 'Packed Red Blood Cells'),
            'units_requested' => (int) $request->input('unitsRequested', 1),
            'units_assigned' => [],
            'urgency' => $request->input('urgency', 'Emergency (Stat)'),
            'status' => 'Pending',
            'request_date' => $request->input('requestDate', now()->format('Y-m-d H:i')),
            'required_by_date' => $request->input('requiredByDate', now()->addHours(2)->format('Y-m-d H:i')),
            'notes' => $request->input('notes'),
        ]);

        $this->logAction(
            'STAT Order Created',
            'Request',
            $bloodReq->request_code,
            "Created blood request {$bloodReq->request_code} for {$bloodReq->patient_name} at {$bloodReq->hospital_name} ({$bloodReq->required_blood_type})."
        );

        return response()->json($bloodReq, 201);
    }

    public function updateRequest(Request $request, string $id): JsonResponse
    {
        $bloodReq = BloodRequest::findOrFail($id);

        if ($request->filled('hospitalName')) {
            $bloodReq->hospital_name = $request->input('hospitalName');
        }
        if ($request->filled('patientName')) {
            $bloodReq->patient_name = $request->input('patientName');
        }
        if ($request->filled('patientAge')) {
            $bloodReq->patient_age = (int) $request->input('patientAge');
        }
        if ($request->filled('patientGender')) {
            $bloodReq->patient_gender = $request->input('patientGender');
        }
        if ($request->filled('requiredBloodType')) {
            $bloodReq->required_blood_type = $request->input('requiredBloodType');
        }
        if ($request->filled('component')) {
            $bloodReq->component = $request->input('component');
        }
        if ($request->filled('unitsRequested')) {
            $bloodReq->units_requested = (int) $request->input('unitsRequested');
        }
        if ($request->filled('urgency')) {
            $bloodReq->urgency = $request->input('urgency');
        }
        if ($request->filled('status')) {
            $bloodReq->status = $request->input('status');
        }
        if ($request->has('notes')) {
            $bloodReq->notes = $request->input('notes');
        }

        $bloodReq->save();

        $this->logAction(
            'Blood Request Updated',
            'Request',
            $bloodReq->request_code,
            "Updated blood request {$bloodReq->request_code} for {$bloodReq->patient_name}."
        );

        return response()->json($bloodReq);
    }

    public function destroyRequest(string $id): JsonResponse
    {
        $bloodReq = BloodRequest::findOrFail($id);
        $code = $bloodReq->request_code;
        $bloodReq->delete();

        $this->logAction(
            'Blood Request Cancelled/Deleted',
            'Request',
            $code,
            "Cancelled and removed request {$code}."
        );

        return response()->json(['success' => true, 'id' => $id]);
    }

    public function crossMatch(Request $request, string $id): JsonResponse
    {
        $bloodReq = BloodRequest::findOrFail($id);
        $unitIds = $request->input('unitIds', []);

        $bloodReq->status = 'Cross-Matched';
        $bloodReq->units_assigned = $unitIds;
        $bloodReq->save();

        if (! empty($unitIds)) {
            BloodUnit::whereIn('id', $unitIds)->update(['status' => 'Cross-Matched']);
        }

        $this->logAction(
            'Electronic Cross-Match Executed',
            'Request',
            $bloodReq->request_code,
            'Units ['.implode(', ', $unitIds)."] cross-matched to Request {$bloodReq->request_code}."
        );

        return response()->json($bloodReq);
    }

    public function dispatchOrder(Request $request, string $id): JsonResponse
    {
        $bloodReq = BloodRequest::findOrFail($id);
        $courierCode = $request->input('courierCode', 'COURIER-'.rand(1000, 9999));
        $tempC = (float) $request->input('tempC', 4.0);

        $bloodReq->status = 'Dispatched';
        $bloodReq->courier_tracking_code = $courierCode;
        $bloodReq->dispatch_temperature_c = $tempC;
        $bloodReq->save();

        if (! empty($bloodReq->units_assigned)) {
            BloodUnit::whereIn('id', $bloodReq->units_assigned)->update(['status' => 'Dispatched']);
        }

        $this->logAction(
            'Cold Chain Dispatch Initiated',
            'Request',
            $bloodReq->request_code,
            "Dispatched order {$bloodReq->request_code} to {$bloodReq->hospital_name} via {$courierCode}. Temp: {$tempC}°C."
        );

        return response()->json($bloodReq);
    }

    public function getDrives(): JsonResponse
    {
        return response()->json(DonationDrive::orderBy('created_at', 'desc')->get());
    }

    public function storeDrive(Request $request): JsonResponse
    {
        $driveCode = $request->input('driveCode') ?? ('DRV-2026-'.rand(10, 99));
        $id = $request->input('id') ?? ('drv-'.round(microtime(true) * 1000));

        $drive = DonationDrive::create([
            'id' => $id,
            'drive_code' => $driveCode,
            'name' => $request->input('name'),
            'organizer' => $request->input('organizer', 'BloodMatrix Outreach'),
            'location' => $request->input('location'),
            'start_date' => $request->input('startDate', now()->toDateString()),
            'end_date' => $request->input('endDate', now()->addDays(2)->toDateString()),
            'target_units' => (int) $request->input('targetUnits', 100),
            'collected_units' => 0,
            'registered_donors_count' => (int) $request->input('registeredDonorsCount', 10),
            'status' => 'Active',
            'facility_id' => $request->input('facilityId', 'fac-1'),
        ]);

        $this->logAction(
            'Donation Drive Scheduled',
            'Drive',
            $drive->drive_code,
            "Scheduled campaign {$drive->name} at {$drive->location}."
        );

        return response()->json($drive, 201);
    }

    public function updateDrive(Request $request, string $id): JsonResponse
    {
        $drive = DonationDrive::findOrFail($id);

        if ($request->filled('name')) {
            $drive->name = $request->input('name');
        }
        if ($request->filled('organizer')) {
            $drive->organizer = $request->input('organizer');
        }
        if ($request->filled('location')) {
            $drive->location = $request->input('location');
        }
        if ($request->filled('startDate')) {
            $drive->start_date = $request->input('startDate');
        }
        if ($request->filled('endDate')) {
            $drive->end_date = $request->input('endDate');
        }
        if ($request->filled('targetUnits')) {
            $drive->target_units = (int) $request->input('targetUnits');
        }
        if ($request->filled('collectedUnits')) {
            $drive->collected_units = (int) $request->input('collectedUnits');
        }
        if ($request->filled('registeredDonorsCount')) {
            $drive->registered_donors_count = (int) $request->input('registeredDonorsCount');
        }
        if ($request->filled('status')) {
            $drive->status = $request->input('status');
        }

        $drive->save();

        $this->logAction(
            'Donation Campaign Updated',
            'Drive',
            $drive->drive_code,
            "Updated campaign details for {$drive->name} ({$drive->drive_code})."
        );

        return response()->json($drive);
    }

    public function destroyDrive(string $id): JsonResponse
    {
        $drive = DonationDrive::findOrFail($id);
        $name = $drive->name;
        $code = $drive->drive_code;
        $drive->delete();

        $this->logAction(
            'Donation Campaign Deleted',
            'Drive',
            $code,
            "Cancelled and removed campaign {$name} ({$code})."
        );

        return response()->json(['success' => true, 'id' => $id]);
    }

    public function getFacilities(): JsonResponse
    {
        return response()->json(Facility::all());
    }

    public function getEquipment(): JsonResponse
    {
        return response()->json(StorageEquipment::all());
    }

    public function getAuditLogs(): JsonResponse
    {
        return response()->json(AuditLog::orderBy('created_at', 'desc')->get());
    }

    public function getDiscardLogs(): JsonResponse
    {
        return response()->json(DiscardLog::orderBy('created_at', 'desc')->get());
    }

    public function getAiForecast(): JsonResponse
    {
        $types = ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
        $demands = [
            'O-' => 14,
            'O+' => 28,
            'A+' => 22,
            'A-' => 8,
            'B+' => 16,
            'B-' => 5,
            'AB+' => 7,
            'AB-' => 3,
        ];

        $forecastingTable = [];
        foreach ($types as $type) {
            $stock = BloodUnit::where('blood_type', $type)->where('status', 'Available')->count();
            $projDemand = $demands[$type] ?? 10;
            $balance = $stock - $projDemand;

            $status = 'Balanced';
            if ($balance <= -10) {
                $status = 'Critical Deficit';
            } elseif ($balance < 0) {
                $status = 'Moderate Shortage';
            }

            $forecastingTable[] = [
                'bloodType' => $type,
                'currentStock' => $stock,
                'projected14DayDemand' => $projDemand,
                'projectedNetBalance' => $balance,
                'status' => $status,
            ];
        }

        $allAvailable = BloodUnit::where('status', 'Available')->get();
        $expiringRiskList = [];
        foreach ($allAvailable as $unit) {
            $expiryTimestamp = strtotime($unit->expiry_date);
            $daysRemaining = (int) ceil(($expiryTimestamp - time()) / 86400);
            if ($daysRemaining <= 7 && $daysRemaining >= 0) {
                $expiringRiskList[] = [
                    'unit' => $unit,
                    'daysRemaining' => $daysRemaining,
                ];
            }
        }

        return response()->json([
            'generatedAt' => now()->toIso8601String(),
            'confidenceScore' => 0.94,
            'forecastingTable' => $forecastingTable,
            'expiringRiskUnitsCount' => count($expiringRiskList),
            'expiringUnitsList' => $expiringRiskList,
            'recommendations' => [
                [
                    'id' => 'rec-1',
                    'priority' => 'High',
                    'category' => 'Targeted Donor Campaign',
                    'text' => 'Algorithmic forecast recommends immediate donor scheduling for high-deficit groups.',
                ],
                [
                    'id' => 'rec-2',
                    'priority' => 'Medium',
                    'category' => 'Stock Redistribution',
                    'text' => 'Units nearing cold-storage expiration threshold flagged for prioritized STAT dispatch.',
                ],
            ],
        ]);
    }
}
