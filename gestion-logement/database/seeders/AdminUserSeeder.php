<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Créer un utilisateur administrateur
        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'role' => 'administrateur',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        
        // Message de confirmation
        $this->command->info('Utilisateur administrateur créé avec succès!');
    }
}
