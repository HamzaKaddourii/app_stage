<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\BonAchatController;
use App\Http\Controllers\DemandePersonnaliseeController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Routes publiques
Route::get('salles', [SalleController::class, 'index']);
Route::get('salles/{id}', [SalleController::class, 'show']);

// Routes d'authentification
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Routes de récupération de mot de passe
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('reset-password/check', [AuthController::class, 'checkResetToken']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Routes d'authentification nécessitant une connexion
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/user/update', [AuthController::class, 'updateUser']);

    // Routes pour les salles (admin uniquement pour modification)
    Route::post('salles', [SalleController::class, 'store'])->middleware('admin');
    Route::put('salles/{id}', [SalleController::class, 'update'])->middleware('admin');
    Route::delete('salles/{id}', [SalleController::class, 'destroy'])->middleware('admin');

    // Routes pour les réservations
    Route::apiResource('reservations', ReservationController::class);
    Route::get('user-reservations/{userId}', [ReservationController::class, 'getByUser']);
    Route::get('salle-reservations/{salleId}', [ReservationController::class, 'getBySalle']);

    // Routes pour les bons d'achat
    Route::apiResource('bons-achat', BonAchatController::class);
    
    // Routes pour les demandes personnalisées
    Route::apiResource('demandes-personnalisees', DemandePersonnaliseeController::class);
    Route::get('pending-demands', [DemandePersonnaliseeController::class, 'getPendingDemands'])->middleware('admin');
    Route::get('demandes-personnalisees/{id}/suggestions', [DemandePersonnaliseeController::class, 'getSuggestions']);
});
