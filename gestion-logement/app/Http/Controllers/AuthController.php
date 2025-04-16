<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Créer un nouvel utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'utilisateur', // Par défaut, un nouvel utilisateur est un utilisateur standard
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Inscription réussie!'
        ], 201);
    }

    /**
     * Connecter un utilisateur et générer un token
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['Les identifiants fournis sont incorrects.'],
                ]);
            }

            // Supprimer les anciens tokens si nécessaire
            if ($request->has('device_name')) {
                $user->tokens()->where('name', $request->device_name)->delete();
                $token = $user->createToken($request->device_name)->plainTextToken;
            } else {
                $user->tokens()->delete(); // Supprimer tous les tokens précédents
                $token = $user->createToken('auth_token')->plainTextToken;
            }

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Connexion réussie!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Déconnecter l'utilisateur (révoquer le token)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    /**
     * Obtenir les informations de l'utilisateur actuellement connecté
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Mettre à jour les informations de l'utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateUser(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Mettre à jour les champs fournis
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('password') && !empty($request->password)) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'user' => $user,
            'message' => 'Profil mis à jour avec succès'
        ]);
    }

    /**
     * Envoyer un email de récupération de mot de passe
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Vérifier si l'utilisateur existe
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Aucun utilisateur trouvé avec cette adresse email'
            ], 404);
        }

        // Générer un token unique
        $token = Str::random(60);

        // Stocker le token dans la base de données
        DB::table('password_resets')->where('email', $request->email)->delete();
        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now()
        ]);

        // Préparer l'URL de réinitialisation
        $resetUrl = env('FRONTEND_URL', 'http://localhost:3000') . '/reset-password?token=' . $token . '&email=' . urlencode($request->email);
        
        try {
            // Tenter d'envoyer l'email
            Mail::send('emails.reset_password', ['resetUrl' => $resetUrl, 'user' => $user], function ($message) use ($request) {
                $message->to($request->email);
                $message->subject('Réinitialisation de votre mot de passe');
            });
            
            return response()->json([
                'message' => 'Nous avons envoyé par email le lien de réinitialisation de votre mot de passe!',
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            // En cas d'erreur d'envoi d'email, retourner le lien directement
            Log::error("Erreur mail: " . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de l\'envoi du mail.',
                'reset_link' => $resetUrl,
                'error' => $e->getMessage(),
                'status' => 'email_error'
            ]);
        }
    }

    /**
     * Vérifier la validité d'un token de réinitialisation
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function checkResetToken(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email'
        ]);

        $resetRecord = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'message' => 'Ce lien de réinitialisation n\'est pas valide.'
            ], 400);
        }

        // Vérifier si le token n'a pas expiré (24 heures)
        $createdAt = Carbon::parse($resetRecord->created_at);
        if (Carbon::now()->diffInHours($createdAt) > 24) {
            return response()->json([
                'message' => 'Ce lien de réinitialisation a expiré.'
            ], 400);
        }

        return response()->json([
            'message' => 'Le token est valide.'
        ]);
    }

    /**
     * Réinitialiser le mot de passe
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $resetRecord = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'message' => 'Ce lien de réinitialisation n\'est pas valide.'
            ], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Nous ne pouvons pas trouver un utilisateur avec cette adresse email.'
            ], 404);
        }

        // Mettre à jour le mot de passe
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token de réinitialisation
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Votre mot de passe a été réinitialisé!'
        ]);
    }
}
