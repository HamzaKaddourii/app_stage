<?php

namespace App\Models;

use App\Models\User;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BonAchat extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'reservation_id',
        'code',
        'montant',
        'is_used',
        'date_expiration',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_expiration' => 'datetime',
        'is_used' => 'boolean',
    ];

    /**
     * Get the user that owns the bon d'achat.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the reservation that generated the bon d'achat.
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
