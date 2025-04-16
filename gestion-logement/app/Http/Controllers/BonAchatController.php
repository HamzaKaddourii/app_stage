<?php

namespace App\Http\Controllers;

use App\Models\BonAchat;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BonAchatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $bonsAchat = BonAchat::with(['user', 'reservation'])->get();
        return response()->json($bonsAchat);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'reservation_id' => 'required|exists:reservations,id',
            'montant' => 'required|numeric|min:0',
        ]);

        // Générer un code unique pour le bon d'achat
        $code = Str::upper(Str::random(8));
        
        // Définir une date d'expiration (par exemple, 6 mois à partir de maintenant)
        $dateExpiration = Carbon::now()->addMonths(6);

        $bonAchat = BonAchat::create([
            'user_id' => $request->user_id,
            'reservation_id' => $request->reservation_id,
            'code' => $code,
            'montant' => $request->montant,
            'date_expiration' => $dateExpiration,
            'is_used' => false,
        ]);

        return response()->json($bonAchat, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $bonAchat = BonAchat::with(['user', 'reservation'])->findOrFail($id);
        return response()->json($bonAchat);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $bonAchat = BonAchat::findOrFail($id);
        
        $request->validate([
            'is_used' => 'sometimes|boolean',
        ]);

        $bonAchat->update($request->only(['is_used']));
        
        return response()->json($bonAchat);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $bonAchat = BonAchat::findOrFail($id);
        $bonAchat->delete();
        
        return response()->json(null, 204);
    }

    /**
     * Generate a new bon d'achat when a reservation is validated.
     *
     * @param  \App\Models\Reservation  $reservation
     * @return \App\Models\BonAchat
     */
    public function generateFromReservation(Reservation $reservation)
    {
        // Calculer le montant du bon d'achat (par exemple, 5% du prix de la réservation)
        $heureDebut = Carbon::parse($reservation->date_debut);
        $heureFin = Carbon::parse($reservation->date_fin);
        $dureeHeures = $heureDebut->diffInHours($heureFin);
        
        $prixTotal = $dureeHeures * $reservation->salle->prix_horaire;
        $montantBonAchat = $prixTotal * 0.05; // 5% du prix total
        
        // Générer un code unique
        $code = 'BON-' . Str::upper(Str::random(6));
        
        // Définir une date d'expiration (6 mois)
        $dateExpiration = Carbon::now()->addMonths(6);
        
        // Créer le bon d'achat
        $bonAchat = BonAchat::create([
            'user_id' => $reservation->user_id,
            'reservation_id' => $reservation->id,
            'code' => $code,
            'montant' => $montantBonAchat,
            'date_expiration' => $dateExpiration,
            'is_used' => false,
        ]);
        
        return $bonAchat;
    }
}
