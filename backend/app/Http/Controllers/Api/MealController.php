<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class MealController extends Controller
{
    /**
     * عرض الوجبات المنشورة.
     */
    public function index(): JsonResponse
    {
        $meals = Meal::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->get()
            ->map(fn (Meal $meal) => $this->formatMeal($meal));

        return response()->json([
            'meals' => $meals,
        ]);
    }

    /**
     * عرض تفاصيل وجبة منشورة.
     */
    public function show(string $id): JsonResponse
    {
        $meal = Meal::query()
            ->where('external_id', $id)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'meal' => $this->formatMeal($meal),
        ]);
    }

    /**
     * إضافة وجبة جديدة.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'external_id' => [
                'nullable',
                'string',
                'max:255',
                'unique:meals,external_id',
            ],

            'name' => ['required', 'string', 'max:255'],
           'meal_category_id' => [
    'required',
    'integer',
    'exists:meal_categories,id',
],
            'area' => ['nullable', 'string', 'max:255'],
            'instructions' => ['required', 'string'],

            'size' => [
                'required',
                Rule::in(['small', 'medium', 'large']),
            ],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'image_url' => ['nullable', 'url', 'max:2048'],
            'tags' => ['nullable', 'string', 'max:1000'],
            'youtube_url' => ['nullable', 'url', 'max:2048'],

            'ingredients' => ['nullable', 'array'],
            'ingredients.*' => ['nullable', 'string', 'max:255'],

            'measures' => ['nullable', 'array'],
            'measures.*' => ['nullable', 'string', 'max:255'],

            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $validated['external_id'] =
            $validated['external_id'] ?? 'local_' . Str::uuid();
$category = \App\Models\MealCategory::findOrFail(
    $validated['meal_category_id']
);

$validated['category'] = $category->name;
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['ingredients'] = $validated['ingredients'] ?? [];
        $validated['measures'] = $validated['measures'] ?? [];

        if ($request->hasFile('image')) {
            $validated['image_url'] = $this->saveMealImage(
                $request->file('image')
            );
        }

        unset($validated['image']);

        $meal = Meal::create($validated);

        return response()->json([
            'message' => 'تمت إضافة الوجبة بنجاح.',
            'meal' => $this->formatMeal($meal),
        ], 201);
    }

    /**
     * تعديل وجبة موجودة.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $meal = Meal::where('external_id', $id)->firstOrFail();

        $validated = $request->validate([
            'external_id' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('meals', 'external_id')->ignore($meal->id),
            ],

            'name' => ['sometimes', 'required', 'string', 'max:255'],
           'meal_category_id' => [
    'sometimes',
    'required',
    'integer',
    'exists:meal_categories,id',
],
            'area' => ['sometimes', 'nullable', 'string', 'max:255'],
            'instructions' => ['sometimes', 'required', 'string'],

            'size' => [
                'sometimes',
                'required',
                Rule::in(['small', 'medium', 'large']),
            ],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'image_url' => ['sometimes', 'nullable', 'url', 'max:2048'],
            'tags' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'youtube_url' => ['sometimes', 'nullable', 'url', 'max:2048'],

            'ingredients' => ['sometimes', 'array'],
            'ingredients.*' => ['nullable', 'string', 'max:255'],

            'measures' => ['sometimes', 'array'],
            'measures.*' => ['nullable', 'string', 'max:255'],

            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $oldImageUrl = $meal->image_url;
        if (isset($validated['meal_category_id'])) {
    $category = \App\Models\MealCategory::findOrFail(
        $validated['meal_category_id']
    );

    $validated['category'] = $category->name;
}
        $newImageUploaded = $request->hasFile('image');

        if ($newImageUploaded) {
            $validated['image_url'] = $this->saveMealImage(
                $request->file('image')
            );
        }

        unset($validated['image']);

        $meal->update($validated);

        // حذف الصورة المحلية القديمة بعد حفظ التعديل.
        if ($newImageUploaded) {
            $this->deleteMealImage($oldImageUrl);
        }

        return response()->json([
            'message' => 'تم تحديث الوجبة بنجاح.',
            'meal' => $this->formatMeal($meal->fresh()),
        ]);
    }

    /**
     * حذف وجبة وصورتها المحلية.
     */
    public function destroy(string $id): JsonResponse
    {
        $meal = Meal::where('external_id', $id)->firstOrFail();

        $imageUrl = $meal->image_url;

        $meal->delete();

        $this->deleteMealImage($imageUrl);

        return response()->json([
            'message' => 'تم حذف الوجبة بنجاح.',
        ]);
    }

    /**
     * حفظ صورة الوجبة داخل public/uploads/meals.
     */
    private function saveMealImage($image): string
    {
        $directory = public_path('uploads/meals');

        File::ensureDirectoryExists($directory);

        $extension = strtolower($image->extension());
        $filename = Str::uuid() . '.' . $extension;

        $image->move($directory, $filename);

        return url('uploads/meals/' . $filename);
    }

    /**
     * حذف صورة محلية تابعة لمجلد صور الوجبات فقط.
     */
    private function deleteMealImage(?string $imageUrl): void
    {
        if (!$imageUrl) {
            return;
        }

        $path = parse_url($imageUrl, PHP_URL_PATH);

        if (
            !$path ||
            !str_starts_with($path, '/uploads/meals/')
        ) {
            return;
        }

        $filename = basename($path);

        if (
            $filename === '' ||
            $filename === '.' ||
            $filename === '..'
        ) {
            return;
        }

        $filePath = public_path('uploads/meals/' . $filename);

        if (is_file($filePath)) {
            unlink($filePath);
        }
    }

    /**
     * توحيد شكل بيانات الوجبة المرسلة إلى React.
     */
    private function formatMeal(Meal $meal): array
    {
        return [
            'idMeal' => $meal->external_id,
            'strMeal' => $meal->name,
            'strCategory' => $meal->category,
            'meal_category_id' => $meal->meal_category_id,
            'strArea' => $meal->area,
            'strInstructions' => $meal->instructions,
            'strMealThumb' => $meal->image_url,
            'strTags' => $meal->tags,
            'strYoutube' => $meal->youtube_url,
            'ingredients' => $meal->ingredients ?? [],
            'measures' => $meal->measures ?? [],
            'price' => $meal->price,
            'size' => $meal->size,
            'is_active' => (bool) $meal->is_active,
        ];
    }
}
