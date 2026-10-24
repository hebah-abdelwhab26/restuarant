
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MealController;
use App\Http\Controllers\Api\MealCategoryController;

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes
Route::get('/meals', [MealController::class, 'index']);
Route::get('/meals/{id}', [MealController::class, 'show']);
Route::get('/meal-categories', [MealCategoryController::class, 'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Admin-only routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Meals
    Route::post('/meals', [MealController::class, 'store']);
    Route::put('/meals/{id}', [MealController::class, 'update']);
    Route::patch('/meals/{id}', [MealController::class, 'update']);
    Route::delete('/meals/{id}', [MealController::class, 'destroy']);

    // Categories management
    Route::get('/admin/meal-categories', [
        MealCategoryController::class,
        'adminIndex',
    ]);

    Route::post('/meal-categories', [
        MealCategoryController::class,
        'store',
    ]);

    Route::put('/meal-categories/{id}', [
        MealCategoryController::class,
        'update',
    ]);

    Route::patch('/meal-categories/{id}', [
        MealCategoryController::class,
        'update',
    ]);

    Route::delete('/meal-categories/{id}', [
        MealCategoryController::class,
        'destroy',
    ]);
});
