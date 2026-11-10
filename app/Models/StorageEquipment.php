<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StorageEquipment extends Model
{
    use HasFactory;

    protected $table = 'storage_equipments';

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
            'facilityId' => $this->facility_id,
            'name' => $this->name,
            'type' => $this->type,
            'currentTempC' => (float) $this->current_temp_c,
            'targetTempC' => (float) $this->target_temp_c,
            'status' => $this->status,
            'capacityUnits' => (int) $this->capacity_units,
            'occupiedUnits' => (int) $this->occupied_units,
        ];
    }
}
