<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonationDrive extends Model
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
            'driveCode' => $this->drive_code,
            'name' => $this->name,
            'organizer' => $this->organizer,
            'location' => $this->location,
            'startDate' => (string) $this->start_date,
            'endDate' => (string) $this->end_date,
            'targetUnits' => (int) $this->target_units,
            'collectedUnits' => (int) $this->collected_units,
            'registeredDonorsCount' => (int) $this->registered_donors_count,
            'status' => $this->status,
            'facilityId' => $this->facility_id,
        ];
    }
}
