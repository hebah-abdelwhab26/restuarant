
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create the meal categories table.
        Schema::create('meal_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Keep the existing category column for backward compatibility.
        Schema::table('meals', function (Blueprint $table) {
            $table->foreignId('meal_category_id')
                ->nullable()
                ->after('category')
                ->constrained('meal_categories')
                ->nullOnDelete();
        });

        // Preserve existing categories and link old meals to them.
        $existingCategories = DB::table('meals')
            ->select('category')
            ->whereNotNull('category')
            ->distinct()
            ->get();

        foreach ($existingCategories as $item) {
            $name = trim((string) $item->category);

            if ($name === '') {
                continue;
            }

            $category = DB::table('meal_categories')
                ->where('name', $name)
                ->first();

            if (!$category) {
                $now = now();

                $categoryId = DB::table('meal_categories')->insertGetId([
                    'name' => $name,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            } else {
                $categoryId = $category->id;
            }

            DB::table('meals')
                ->where('category', $item->category)
                ->whereNull('meal_category_id')
                ->update([
                    'meal_category_id' => $categoryId,
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meals', function (Blueprint $table) {
            $table->dropConstrainedForeignId('meal_category_id');
        });

        Schema::dropIfExists('meal_categories');
    }
};
