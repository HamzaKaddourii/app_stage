<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Salle;
use App\Http\Controllers\BonAchatController;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Reservation::with(['user', 'salle']);

        // Filtrage par statut si fourni
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtrage par date si fournie
        if ($request->has('date')) {
            $date = Carbon::parse($request->date)->format('Y-m-d');
            $query->whereDate('date_debut', '<=', $date)
                  ->whereDate('date_fin', '>=', $date);
        }

        // Filtrage par utilisateur si fourni
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $reservations = $query->get();

        return response()->json($reservations);
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
            'salle_id' => 'required|exists:salles,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'commentaire' => 'nullable|string',
        ]);

        // Vérifier la disponibilité de la salle pour les dates demandées
        $conflits = Reservation::where('salle_id', $request->salle_id)
            ->where('statut', 'validee')
            ->where(function($query) use ($request) {
                $query->whereBetween('date_debut', [$request->date_debut, $request->date_fin])
                      ->orWhereBetween('date_fin', [$request->date_debut, $request->date_fin])
                      ->orWhere(function($q) use ($request) {
                          $q->where('date_debut', '<=', $request->date_debut)
                            ->where('date_fin', '>=', $request->date_fin);
                      });
            })
            ->count();

        if ($conflits > 0) {
            return response()->json(['message' => 'La salle est déjà réservée pour cette période.'], 422);
        }

        // Créer la réservation
        $reservation = Reservation::create([
            'user_id' => $request->user_id,
            'salle_id' => $request->salle_id,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'statut' => 'en_attente',
            'commentaire' => $request->commentaire,
        ]);

        return response()->json($reservation, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $reservation = Reservation::with(['user', 'salle', 'bonAchat'])->findOrFail($id);
        return response()->json($reservation);
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
        $reservation = Reservation::findOrFail($id);
        
        $request->validate([
            'statut' => 'sometimes|in:en_attente,validee,refusee',
            'commentaire' => 'nullable|string',
        ]);

        // Si la réservation est validée et qu'elle n'était pas validée avant
        $statutPrecedent = $reservation->statut;
        $nouveauStatut = $request->statut ?? $statutPrecedent;

        $reservation->update($request->only(['statut', 'commentaire']));

        // Si la réservation vient d'être validée, générer un bon d'achat
        if ($nouveauStatut === 'validee' && $statutPrecedent !== 'validee') {
            $bonAchatController = new BonAchatController();
            $bonAchat = $bonAchatController->generateFromReservation($reservation);
            
            return response()->json([
                'reservation' => $reservation,
                'bonAchat' => $bonAchat,
                'message' => 'Réservation validée et bon d\'achat généré avec succès!'
            ]);
        }
        
        return response()->json($reservation);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();
        
        return response()->json(null, 204);
    }

    /**
     * Get all reservations for a user.
     *
     * @param  int  $userId
     * @return \Illuminate\Http\Response
     */
    public function getByUser($userId)
    {
        $reservations = Reservation::with(['salle', 'bonAchat'])
            ->where('user_id', $userId)
            ->orderBy('date_debut', 'desc')
            ->get();
            
        return response()->json($reservations);
    }

    /**
     * Get all reservations for a salle.
     *
     * @param  int  $salleId
     * @return \Illuminate\Http\Response
     */
    public function getBySalle($salleId)
    {
        $reservations = Reservation::with(['user', 'bonAchat'])
            ->where('salle_id', $salleId)
            ->orderBy('date_debut', 'desc')
            ->get();
            
        return response()->json($reservations);
    }
}
