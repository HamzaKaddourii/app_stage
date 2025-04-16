<?php

namespace App\Http\Controllers;

use App\Models\DemandePersonnalisee;
use App\Models\Salle;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DemandePersonnaliseeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Si c'est un administrateur, il peut voir toutes les demandes
        // Sinon, l'utilisateur ne voit que ses propres demandes
        if ($request->user() && $request->user()->isAdmin()) {
            $demandes = DemandePersonnalisee::with(['user', 'salle'])->orderBy('created_at', 'desc')->get();
        } else {
            $demandes = DemandePersonnalisee::with(['salle'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($demandes);
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
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'capacite_tables' => 'nullable|integer|min:0',
            'capacite_chaises' => 'nullable|integer|min:0',
            'equipement_pc' => 'nullable|boolean',
            'equipement_datashow' => 'nullable|boolean',
            'has_internet' => 'nullable|boolean',
            'date_souhaitee' => 'nullable|date',
            'duree_souhaitee' => 'nullable|string|max:255',
        ]);

        // Créer la demande personnalisée
        $demande = DemandePersonnalisee::create([
            'user_id' => $request->user()->id,
            'titre' => $request->titre,
            'description' => $request->description,
            'capacite_tables' => $request->capacite_tables,
            'capacite_chaises' => $request->capacite_chaises,
            'equipement_pc' => $request->equipement_pc ?? false,
            'equipement_datashow' => $request->equipement_datashow ?? false,
            'has_internet' => $request->has_internet ?? false,
            'date_souhaitee' => $request->date_souhaitee,
            'duree_souhaitee' => $request->duree_souhaitee,
            'statut' => 'en_attente',
        ]);

        return response()->json($demande, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $demande = DemandePersonnalisee::with(['user', 'salle'])->findOrFail($id);
        
        // Vérifier si l'utilisateur est autorisé à voir cette demande
        if (!Auth::user()->isAdmin() && Auth::user()->id !== $demande->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        return response()->json($demande);
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
        $demande = DemandePersonnalisee::findOrFail($id);
        
        // Vérifier si l'utilisateur est autorisé à modifier cette demande
        if (!Auth::user()->isAdmin() && Auth::user()->id !== $demande->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        // Validation différente selon le rôle de l'utilisateur
        if (Auth::user()->isAdmin()) {
            $request->validate([
                'statut' => 'sometimes|in:en_attente,validee,refusee',
                'reponse_admin' => 'nullable|string',
                'salle_id' => 'nullable|exists:salles,id',
            ]);
            
            // Si l'admin valide, chercher une salle correspondante si non fournie
            if ($request->statut === 'validee' && !$request->salle_id) {
                // Recherche des salles qui correspondent aux critères demandés
                $sallesCorrespondantes = Salle::query()
                    ->when($demande->capacite_tables, function ($query, $capacite) {
                        return $query->where('capacite_tables', '>=', $capacite);
                    })
                    ->when($demande->capacite_chaises, function ($query, $capacite) {
                        return $query->where('capacite_chaises', '>=', $capacite);
                    })
                    ->when($demande->equipement_pc, function ($query, $value) {
                        if ($value) return $query->where('equipement_pc', true);
                    })
                    ->when($demande->equipement_datashow, function ($query, $value) {
                        if ($value) return $query->where('equipement_datashow', true);
                    })
                    ->when($demande->has_internet, function ($query, $value) {
                        if ($value) return $query->where('has_internet', true);
                    })
                    ->first();
                
                if ($sallesCorrespondantes) {
                    $demande->salle_id = $sallesCorrespondantes->id;
                }
            }
            
            // Mettre à jour la demande avec les informations de l'admin
            $demande->update([
                'statut' => $request->statut ?? $demande->statut,
                'reponse_admin' => $request->reponse_admin,
                'salle_id' => $request->salle_id ?? $demande->salle_id,
            ]);
        } else {
            // L'utilisateur standard ne peut modifier que certains champs et uniquement si le statut est "en_attente"
            if ($demande->statut !== 'en_attente') {
                return response()->json(['message' => 'Impossible de modifier une demande déjà traitée'], 422);
            }
            
            $request->validate([
                'titre' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'capacite_tables' => 'nullable|integer|min:0',
                'capacite_chaises' => 'nullable|integer|min:0',
                'equipement_pc' => 'nullable|boolean',
                'equipement_datashow' => 'nullable|boolean',
                'has_internet' => 'nullable|boolean',
                'date_souhaitee' => 'nullable|date',
                'duree_souhaitee' => 'nullable|string|max:255',
            ]);
            
            // Mettre à jour la demande avec les infos de l'utilisateur standard
            $demande->update($request->only([
                'titre', 'description', 'capacite_tables', 'capacite_chaises',
                'equipement_pc', 'equipement_datashow', 'has_internet',
                'date_souhaitee', 'duree_souhaitee'
            ]));
        }
        
        return response()->json($demande);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $demande = DemandePersonnalisee::findOrFail($id);
        
        // Vérifier si l'utilisateur est autorisé à supprimer cette demande
        if (!Auth::user()->isAdmin() && Auth::user()->id !== $demande->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        // Un utilisateur ne peut supprimer que les demandes en attente
        if (!Auth::user()->isAdmin() && $demande->statut !== 'en_attente') {
            return response()->json(['message' => 'Impossible de supprimer une demande déjà traitée'], 422);
        }
        
        $demande->delete();
        
        return response()->json(null, 204);
    }

    /**
     * Get all pending demands for admin.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPendingDemands()
    {
        // Vérifier si l'utilisateur est un administrateur
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $demandes = DemandePersonnalisee::with('user')
            ->where('statut', 'en_attente')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($demandes);
    }

    /**
     * Get suggestions for existing rooms that match the demand criteria.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getSuggestions($id)
    {
        $demande = DemandePersonnalisee::findOrFail($id);
        
        // Vérifier si l'utilisateur est autorisé
        if (!Auth::user()->isAdmin() && Auth::user()->id !== $demande->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        // Recherche des salles qui correspondent aux critères demandés
        $sallesCorrespondantes = Salle::query()
            ->when($demande->capacite_tables, function ($query, $capacite) {
                return $query->where('capacite_tables', '>=', $capacite);
            })
            ->when($demande->capacite_chaises, function ($query, $capacite) {
                return $query->where('capacite_chaises', '>=', $capacite);
            })
            ->when($demande->equipement_pc, function ($query, $value) {
                if ($value) return $query->where('equipement_pc', true);
            })
            ->when($demande->equipement_datashow, function ($query, $value) {
                if ($value) return $query->where('equipement_datashow', true);
            })
            ->when($demande->has_internet, function ($query, $value) {
                if ($value) return $query->where('has_internet', true);
            })
            ->get();
            
        return response()->json($sallesCorrespondantes);
    }
}
