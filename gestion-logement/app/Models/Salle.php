<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Reservation;

class Salle extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'description',
        'capacite_tables',
        'capacite_chaises',
        'equipement_pc',
        'equipement_datashow',
        'has_internet',
        'image_path',
        'prix_horaire',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'equipement_pc' => 'boolean',
        'equipement_datashow' => 'boolean',
        'has_internet' => 'boolean',
        'prix_horaire' => 'decimal:2',
    ];

    /**
     * Get the reservations for the salle.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
