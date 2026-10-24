
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique();
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('area')->nullable();
            $table->longText('instructions')->nullable();
            $table->text('image_url')->nullable();
            $table->text('tags')->nullable();
            $table->text('youtube_url')->nullable();
            $table->json('ingredients')->nullable();
            $table->json('measures')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};
