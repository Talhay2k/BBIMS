<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscardLog extends Model
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
            'discardDate' => (string) $this->discard_date,
            'reason' => $this->reason,
            'performedBy' => $this->performed_by,
            'facilityName' => $this->facility_name,
        ];
    }
}
