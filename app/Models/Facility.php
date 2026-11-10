<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
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
            'code' => $this->code,
            'name' => $this->name,
            'type' => $this->type,
            'city' => $this->city,
            'phone' => $this->phone,
            'refrigeratorsCount' => (int) $this->refrigerators_count,
            'freezersCount' => (int) $this->freezers_count,
            'agitatorsCount' => (int) $this->agitators_count,
            'status' => $this->status,
            'totalUnitsInStock' => (int) $this->total_units_in_stock,
            'availableUnits' => (int) $this->available_units,
        ];
    }
}
