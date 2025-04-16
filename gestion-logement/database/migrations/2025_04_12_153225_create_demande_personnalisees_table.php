<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('demande_personnalisees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->text('description');
            $table->integer('capacite_tables')->nullable();
            $table->integer('capacite_chaises')->nullable();
            $table->boolean('equipement_pc')->default(false);
            $table->boolean('equipement_datashow')->default(false);
            $table->boolean('has_internet')->default(false);
            $table->date('date_souhaitee')->nullable();
            $table->string('duree_souhaitee')->nullable();
            $table->enum('statut', ['en_attente', 'validee', 'refusee'])->default('en_attente');
            $table->text('reponse_admin')->nullable();
            $table->foreignId('salle_id')->nullable()->constrained(); // Si une salle existante correspond
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('demande_personnalisees');
    }
};
