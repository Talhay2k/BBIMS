<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donor extends Model
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
            'donorCode' => $this->donor_code,
            'fullName' => $this->full_name,
            'bloodType' => $this->blood_type,
            'age' => (int) $this->age,
            'gender' => $this->gender,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address ?? '',
            'lastDonationDate' => (string) ($this->last_donation_date ?? ''),
            'eligibilityStatus' => $this->eligibility_status,
            'deferralReason' => $this->deferral_reason,
            'totalDonationsCount' => (int) $this->total_donations_count,
            'hemoglobinGdl' => (float) $this->hemoglobin_gdl,
            'bloodPressure' => $this->blood_pressure,
            'weightKg' => (float) $this->weight_kg,
            'notes' => $this->notes,
        ];
    }
}
