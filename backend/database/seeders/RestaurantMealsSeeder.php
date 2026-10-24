<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RestaurantMealsSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $meals = [
            // Chicken
            ['Grilled Chicken Breast', 1, 38, 'medium', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435'],
            ['Crispy Chicken Burger', 1, 29, 'medium', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086'],
            ['Chicken Alfredo Pasta', 1, 34, 'medium', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a'],
            ['Spicy Chicken Wings', 1, 27, 'medium', 'https://images.unsplash.com/photo-1527477396000-e27163b481c2'],
            ['Chicken Shawarma Plate', 1, 32, 'medium', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783'],
            ['Chicken Biryani', 1, 35, 'medium', 'https://images.unsplash.com/photo-1563379091339-03246963d96c'],
            ['Creamy Mushroom Chicken', 1, 39, 'medium', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435'],

            // Beef
            ['Classic Beef Burger', 2, 32, 'medium', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'],
            ['Beef Steak', 2, 65, 'large', 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092'],
            ['Beef Lasagna', 2, 42, 'medium', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3'],
            ['Beef Tacos', 2, 30, 'medium', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b'],
            ['Beef Kofta', 2, 37, 'medium', 'https://images.unsplash.com/photo-1529042410759-befb1204b468'],
            ['BBQ Beef Ribs', 2, 68, 'large', 'https://images.unsplash.com/photo-1544025162-d76694265947'],

            // Seafood
            ['Grilled Salmon', 3, 59, 'medium', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'],
            ['Shrimp Alfredo', 3, 45, 'medium', 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7'],
            ['Fish and Chips', 3, 39, 'medium', 'https://images.unsplash.com/photo-1579208575657-c595a05383b7'],
            ['Seafood Paella', 3, 55, 'large', 'https://images.unsplash.com/photo-1534080564583-6be75777b70a'],
            ['Garlic Butter Shrimp', 3, 46, 'medium', 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b'],
            ['Tuna Salad', 3, 31, 'medium', 'https://images.unsplash.com/photo-1540420773420-3366772f4999'],

            // Vegetarian
            ['Mediterranean Salad', 4, 24, 'medium', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'],
            ['Vegetable Pasta', 4, 28, 'medium', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601'],
            ['Margherita Pizza', 4, 33, 'medium', 'https://images.unsplash.com/photo-1579751626657-72bc17010498'],
            ['Falafel Plate', 4, 22, 'medium', 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb6'],
            ['Grilled Vegetable Bowl', 4, 26, 'medium', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'],
            ['Mushroom Risotto', 4, 36, 'medium', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371'],

            // Desserts
            ['Chocolate Brownie', 5, 18, 'small', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c'],
            ['Classic Cheesecake', 5, 22, 'small', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad'],
            ['Tiramisu', 5, 24, 'small', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9'],
            ['Chocolate Cake', 5, 21, 'small', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'],
            ['Vanilla Ice Cream', 5, 14, 'small', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb'],
        ];

        foreach ($meals as [$name, $categoryId, $price, $size, $image]) {
            $category = DB::table('meal_categories')
                ->where('id', $categoryId)
                ->first();

            if (!$category) {
                throw new \RuntimeException(
                    "Meal category ID {$categoryId} does not exist."
                );
            }

            // Skip existing meals with the same name.
            $existing = DB::table('meals')->where('name', $name)->exists();

            if ($existing) {
                continue;
            }

            $externalId = 'local-' . Str::uuid();

            DB::table('meals')->insert([
                'external_id' => $externalId,
                'name' => $name,
                'category' => $category->name,
                'meal_category_id' => $categoryId,
                'area' => 'International',
                'instructions' => "Prepared fresh to order. Serve hot and enjoy {$name}.",
                'image_url' => $image . '?auto=format&fit=crop&w=900&q=80',
                'tags' => json_encode(['Restaurant', 'Fresh'], JSON_UNESCAPED_UNICODE),
                'youtube_url' => null,
                'ingredients' => json_encode([], JSON_UNESCAPED_UNICODE),
                'measures' => json_encode([], JSON_UNESCAPED_UNICODE),
                'price' => $price,
                'size' => $size,
                'is_active' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
