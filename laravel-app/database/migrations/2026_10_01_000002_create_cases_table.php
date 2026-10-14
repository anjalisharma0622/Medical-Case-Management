<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            $table->string('case_number', 50)->unique();
            $table->string('patient_reference', 100);
            $table->string('surgeon_name', 255);
            $table->string('implant_type', 255);
            $table->enum('status', [
                'Draft',
                'Planning',
                'In Review',
                'Approved',
                'Completed',
                'Cancelled'
            ])->default('Draft')->index();
            $table->enum('priority', ['Low', 'Medium', 'High'])->default('Medium')->index();
            $table->date('surgery_date')->nullable();
            
            // Foreign key referencing users.id
            $table->foreignId('created_by')
                  ->constrained('users')
                  ->onDelete('restrict');

            $table->timestamps();

            // Additional indexes for fast search and listing
            $table->index('surgeon_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
