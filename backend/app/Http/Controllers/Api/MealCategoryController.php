<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MealCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MealCategoryController extends Controller
{
    /**
     * Public: return active categories only.
     */
    public function index(): JsonResponse
    {
        $categories = MealCategory::query()
            ->where('is_active', true)
            ->withCount('meals')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    /**
     * Admin: return all categories, including inactive ones.
     */
    public function adminIndex(): JsonResponse
    {
        $categories = MealCategory::query()
            ->withCount('meals')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    /**
     * Create a category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:meal_categories,name',
            ],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;

        $category = MealCategory::create($validated);

        return response()->json([
            'message' => 'تمت إضافة التصنيف بنجاح.',
            'category' => $category->loadCount('meals'),
        ], 201);
    }

    /**
     * Update category name and/or active status.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $category = MealCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('meal_categories', 'name')
                    ->ignore($category->id),
            ],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (empty($validated)) {
            return response()->json([
                'message' => 'لم يتم إرسال أي تعديلات.',
            ], 422);
        }

        $oldName = $category->name;

        $category->update($validated);

        // Keep the legacy category text synchronized with its relation.
        if (
            isset($validated['name']) &&
            $oldName !== $category->name
        ) {
            $category->meals()->update([
                'category' => $category->name,
            ]);
        }

        return response()->json([
            'message' => 'تم تحديث التصنيف بنجاح.',
            'category' => $category->fresh()->loadCount('meals'),
        ]);
    }

    /**
     * Delete only categories that have no linked meals.
     */
    public function destroy(string $id): JsonResponse
    {
        $category = MealCategory::withCount('meals')->findOrFail($id);

        if ($category->meals_count > 0) {
            return response()->json([
                'message' =>
                    'لا يمكن حذف هذا التصنيف لأنه يحتوي على وجبات. انقلي الوجبات إلى تصنيف آخر أولًا.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'تم حذف التصنيف بنجاح.',
        ]);
    }
}
