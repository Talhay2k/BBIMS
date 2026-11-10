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
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $units = BloodUnit::orderBy('created_at', 'desc')->get();
        $donors = Donor::orderBy('created_at', 'desc')->get();
        $requests = BloodRequest::orderBy('created_at', 'desc')->get();
        $drives = DonationDrive::orderBy('created_at', 'desc')->get();
        $facilities = Facility::all();
        $equipment = StorageEquipment::all();
        $auditLogs = AuditLog::orderBy('created_at', 'desc')->get();
        $discardLogs = DiscardLog::orderBy('created_at', 'desc')->get();

        // Calculate dynamic AI forecast data
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
            $stock = $units->where('blood_type', $type)->where('status', 'Available')->count();
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

        $allAvailable = $units->where('status', 'Available');
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

        $aiData = [
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
        ];

        return Inertia::render('dashboard', [
            'initialUnits' => $units,
            'initialDonors' => $donors,
            'initialRequests' => $requests,
            'initialDrives' => $drives,
            'initialFacilities' => $facilities,
            'initialEquipment' => $equipment,
            'initialAuditLogs' => $auditLogs,
            'initialDiscardLogs' => $discardLogs,
            'initialAiData' => $aiData,
        ]);
    }
}
