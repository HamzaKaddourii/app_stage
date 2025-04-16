<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Salle;
use App\Models\BonAchat;

class Reservation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'salle_id',
        'date_debut',
        'date_fin',
        'statut',
        'commentaire',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
    ];

    /**
     * Get the user that owns the reservation.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the salle associated with the reservation.
     */
    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }

    /**
     * Get the bon d'achat associated with the reservation.
     */
    public function bonAchat()
    {
        return $this->hasOne(BonAchat::class);
    }
}
