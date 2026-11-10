<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
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
            'timestamp' => (string) $this->timestamp,
            'userStaff' => $this->user_staff,
            'action' => $this->action,
            'entityType' => $this->entity_type,
            'entityId' => $this->entity_id,
            'details' => $this->details,
            'digitalSignatureHash' => $this->digital_signature_hash,
        ];
    }
}
