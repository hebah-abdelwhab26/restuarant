<?php

namespace Database\Seeders;

use App\Models\Meal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use RuntimeException;

class MealSeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('../public/Api.json');

        if (!File::exists($path)) {
            throw new RuntimeException("Meals file not found: {$path}");
        }

        $json = json_decode(
            File::get($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        $meals = $json['meals'] ?? [];

        DB::transaction(function () use ($meals) {
            foreach ($meals as $item) {
                $ingredients = [];
                $measures = [];

                for ($i = 1; $i <= 20; $i++) {
                    $ingredient = trim(
                        (string) ($item["strIngredient{$i}"] ?? '')
                    );

                    $measure = trim(
                        (string) ($item["strMeasure{$i}"] ?? '')
                    );

                    if ($ingredient !== '') {
                        $ingredients[] = $ingredient;
                        $measures[] = $measure;
                    }
                }

                Meal::updateOrCreate(
                    ['external_id' => (string) $item['idMeal'],
                    ],
                    [
                        'name' => $item['strMeal'] ?? 'Unnamed meal',
                        'category' => $item['strCategory'] ?? null,
                        'area' => $item['strArea'] ?? null,
                        'instructions' => $item['strInstructions'] ?? null,
                        'image_url' => $item['strMealThumb'] ?? null,
                        'tags' => $item['strTags'] ?? null,
                        'youtube_url' => $item['strYoutube'] ?? null,
                        'ingredients' => $ingredients,
                        'measures' => $measures,
                    ]
                );
            }
        });

        $this->command->info(
            'Meals imported successfully: ' . count($meals)
        );
    }
}
