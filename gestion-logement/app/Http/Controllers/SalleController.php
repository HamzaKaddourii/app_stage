<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SalleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Salle::query();
        
        // Ajouter un log pour déboguer
        \Log::info('Requête de filtrage de salles', ['request' => $request->all()]);
        
        // Filtrage par capacité de tables (seulement si la valeur n'est pas vide)
        if ($request->has('min_tables') && $request->min_tables !== '' && $request->min_tables !== null) {
            $query->where('capacite_tables', '>=', $request->min_tables);
        }
        
        // Filtrage par capacité de chaises (seulement si la valeur n'est pas vide)
        if ($request->has('min_chaises') && $request->min_chaises !== '' && $request->min_chaises !== null) {
            $query->where('capacite_chaises', '>=', $request->min_chaises);
        }
        
        // Filtrage par équipements - assouplissement des conditions
        // Conversion de différents formats possibles de booléens
        if ($request->has('pc') && in_array($request->pc, [true, 'true', 1, '1'], true)) {
            $query->where('equipement_pc', true);
        }
        
        if ($request->has('datashow') && in_array($request->datashow, [true, 'true', 1, '1'], true)) {
            $query->where('equipement_datashow', true);
        }
        
        if ($request->has('internet') && in_array($request->internet, [true, 'true', 1, '1'], true)) {
            $query->where('has_internet', true);
        }
        
        // Tri par prix
        if ($request->has('sort') && $request->sort === 'prix_asc') {
            $query->orderBy('prix_horaire', 'asc');
        } elseif ($request->has('sort') && $request->sort === 'prix_desc') {
            $query->orderBy('prix_horaire', 'desc');
        } else {
            // Par défaut, tri par nom
            $query->orderBy('nom', 'asc');
        }
        
        $salles = $query->get();
        
        return response()->json($salles);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Cette action est réservée aux administrateurs
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacite_tables' => 'required|integer|min:0',
            'capacite_chaises' => 'required|integer|min:0',
            'equipement_pc' => 'nullable|boolean',
            'equipement_datashow' => 'nullable|boolean',
            'has_internet' => 'nullable|boolean',
            'prix_horaire' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        $data = $request->except('image');
        
        // Gestion de l'image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/salles', $filename);
            $data['image_path'] = 'storage/salles/' . $filename;
        }
        
        $salle = Salle::create($data);
        
        return response()->json($salle, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $salle = Salle::findOrFail($id);
        return response()->json($salle);
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
        // Cette action est réservée aux administrateurs
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $salle = Salle::findOrFail($id);
        
        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'capacite_tables' => 'sometimes|integer|min:0',
            'capacite_chaises' => 'sometimes|integer|min:0',
            'equipement_pc' => 'nullable|boolean',
            'equipement_datashow' => 'nullable|boolean',
            'has_internet' => 'nullable|boolean',
            'prix_horaire' => 'sometimes|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        $data = $request->except('image');
        
        // Gestion de l'image
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image si elle existe
            if ($salle->image_path && file_exists(public_path($salle->image_path))) {
                unlink(public_path($salle->image_path));
            }
            
            $image = $request->file('image');
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/salles', $filename);
            $data['image_path'] = 'storage/salles/' . $filename;
        }
        
        $salle->update($data);
        
        return response()->json($salle);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Cette action est réservée aux administrateurs
        if (!Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $salle = Salle::findOrFail($id);
        
        // Vérifier si la salle a des réservations associées
        if ($salle->reservations()->count() > 0) {
            return response()->json(['message' => 'Impossible de supprimer une salle avec des réservations associées'], 422);
        }
        
        // Supprimer l'image si elle existe
        if ($salle->image_path && file_exists(public_path($salle->image_path))) {
            unlink(public_path($salle->image_path));
        }
        
        $salle->delete();
        
        return response()->json(null, 204);
    }
}
