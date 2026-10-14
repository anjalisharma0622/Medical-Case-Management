<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalCase extends Model
{
    use HasFactory;

    /**
     * Associated database table.
     */
    protected $table = 'cases';

    /**
     * Allowed mass assignable attributes.
     */
    protected $fillable = [
        'case_number',
        'patient_reference',
        'surgeon_name',
        'implant_type',
        'status',
        'priority',
        'surgery_date',
        'created_by',
    ];

    /**
     * Type casting for dates and enumerations.
     */
    protected $casts = [
        'surgery_date' => 'date:Y-m-d',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Valid allowed status values.
     */
    public const STATUS_DRAFT = 'Draft';
    public const STATUS_PLANNING = 'Planning';
    public const STATUS_IN_REVIEW = 'In Review';
    public const STATUS_APPROVED = 'Approved';
    public const STATUS_COMPLETED = 'Completed';
    public const STATUS_CANCELLED = 'Cancelled';

    public const STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_PLANNING,
        self::STATUS_IN_REVIEW,
        self::STATUS_APPROVED,
        self::STATUS_COMPLETED,
        self::STATUS_CANCELLED,
    ];

    /**
     * Valid allowed priority values.
     */
    public const PRIORITY_LOW = 'Low';
    public const PRIORITY_MEDIUM = 'Medium';
    public const PRIORITY_HIGH = 'High';

    public const PRIORITIES = [
        self::PRIORITY_LOW,
        self::PRIORITY_MEDIUM,
        self::PRIORITY_HIGH,
    ];

    /**
     * Relationship: The user who created this case record.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope: Filter by status if provided.
     */
    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        if ($status && in_array($status, self::STATUSES, true)) {
            return $query->where('status', $status);
        }
        return $query;
    }

    /**
     * Scope: Filter by priority (Bonus).
     */
    public function scopePriority(Builder $query, ?string $priority): Builder
    {
        if ($priority && in_array($priority, self::PRIORITIES, true)) {
            return $query->where('priority', $priority);
        }
        return $query;
    }

    /**
     * Scope: Search by Case Number or Surgeon Name.
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        $term = trim($search);

        return $query->where(function (Builder $q) use ($term) {
            $q->where('case_number', 'like', "%{$term}%")
              ->orWhere('surgeon_name', 'like', "%{$term}%")
              ->orWhere('patient_reference', 'like', "%{$term}%");
        });
    }
}
