<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Meal extends Model
{
    protected $fillable = [
        'external_id',
        'name',
        'category',
        'meal_category_id',
        'area',
        'instructions',
        'image_url',
        'tags',
        'youtube_url',
        'ingredients',
        'measures',
        'price',
        'size',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'ingredients' => 'array',
            'measures' => 'array',
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function mealCategory(): BelongsTo
    {
        return $this->belongsTo(MealCategory::class, 'meal_category_id');
    }
}
