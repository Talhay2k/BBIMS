<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BloodUnit extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = [];

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'unitNumber' => $this->unit_number,
            'bloodType' => $this->blood_type,
            'component' => $this->component,
            'facilityId' => $this->facility_id,
            'facilityName' => $this->facility_name,
            'location' => $this->location,
            'temperatureZone' => $this->temperature_zone,
            'volumeMl' => (int) $this->volume_ml,
            'collectionDate' => (string) $this->collection_date,
            'expiryDate' => (string) $this->expiry_date,
            'status' => $this->status,
            'donorId' => $this->donor_id,
            'donorCode' => $this->donor_code,
            'testingStatus' => $this->testing_status,
            'notes' => $this->notes,
        ];
    }
}
