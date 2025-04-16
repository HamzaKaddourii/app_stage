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
        Schema::create('salles', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->integer('capacite_tables');
            $table->integer('capacite_chaises');
            $table->boolean('equipement_pc')->default(false);
            $table->boolean('equipement_datashow')->default(false);
            $table->boolean('has_internet')->default(false);
            $table->string('image_path')->nullable();
            $table->decimal('prix_horaire', 8, 2);
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
        Schema::dropIfExists('salles');
    }
};
