<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodRequest extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = [];

    protected $casts = [
        'units_assigned' => 'array',
    ];

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'requestCode' => $this->request_code,
            'hospitalName' => $this->hospital_name,
            'patientName' => $this->patient_name,
            'patientAge' => (int) $this->patient_age,
            'patientGender' => $this->patient_gender,
            'requiredBloodType' => $this->required_blood_type,
            'component' => $this->component,
            'unitsRequested' => (int) $this->units_requested,
            'unitsAssigned' => $this->units_assigned ?? [],
            'urgency' => $this->urgency,
            'status' => $this->status,
            'requestDate' => (string) $this->request_date,
            'requiredByDate' => (string) $this->required_by_date,
            'dispatchTemperatureC' => $this->dispatch_temperature_c !== null ? (float) $this->dispatch_temperature_c : null,
            'courierTrackingCode' => $this->courier_tracking_code,
            'notes' => $this->notes,
        ];
    }
}
