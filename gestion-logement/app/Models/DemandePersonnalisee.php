<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Salle;

class DemandePersonnalisee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'titre',
        'description',
        'capacite_tables',
        'capacite_chaises',
        'equipement_pc',
        'equipement_datashow',
        'has_internet',
        'date_souhaitee',
        'duree_souhaitee',
        'statut',
        'reponse_admin',
        'salle_id',
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
        'date_souhaitee' => 'date',
    ];

    /**
     * Get the user that owns the demand.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the salle that was assigned to this demand (if any).
     */
    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }
}
