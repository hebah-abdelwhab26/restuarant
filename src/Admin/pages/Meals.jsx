
import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apivalue } from "../../data/AllData";
import AdminLayout from "../AdminLayout";

const API_URL = "http://127.0.0.1:8080/api";

const initialForm = {
  name: "",
  meal_category_id: "",
  area: "",
  instructions: "",
  price: "",
  size: "medium",
  image_url: "",
  tags: "",
  youtube_url: "",
  ingredients: "",
  measures: "",
  is_active: true,
};

function getToken() {
  return (
    sessionStorage.getItem("auth_token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

function getErrorMessage(error) {
  if (error.response?.status === 401) {
    return "انتهت جلسة الدخول. سجّلي الدخول مجددًا.";
  }

  if (error.response?.status === 403) {
    return "ليس لديكِ صلاحية المدير لتنفيذ هذه العملية.";
  }

  const errors = error.response?.data?.errors;

  if (errors) {
    return Object.values(errors).flat().join(" ");
  }

  return (
    error.response?.data?.message ||
    "تعذّر تنفيذ العملية. تحققي من تشغيل Laravel ثم حاولي مجددًا."
  );
}

function splitList(value) {
  return String(value ?? "")
    .split(/[,،\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value ?? "";
}

function getMealId(meal) {
  return meal?.idMeal ?? meal?.id;
}

function getMealName(meal) {
  return meal?.strMeal ?? meal?.title ?? meal?.name ?? "";
}

function getMealImage(meal) {
  return (
    meal?.strMealThumb ??
    meal?.images?.[0] ??
    meal?.image_url ??
    meal?.image ??
    meal?.thumbnail ??
    ""
  );
}

function getMealSizeLabel(size) {
  const labels = {
    small: "صغيرة",
    medium: "متوسطة",
    large: "كبيرة",
  };

  return labels[size] ?? "غير محدد";
}

export default function Meals() {
  const contextMeals = useContext(apivalue);

  const meals = useMemo(
    () => (Array.isArray(contextMeals) ? contextMeals : []),
    [contextMeals]
  );

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...initialForm });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      setCategoriesLoading(true);
      setCategoriesError("");

      try {
        const response = await axios.get(
          `${API_URL}/meal-categories`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const result = response.data;

        const receivedCategories = Array.isArray(result)
          ? result
          : Array.isArray(result.categories)
            ? result.categories
            : Array.isArray(result.data)
              ? result.data
              : Array.isArray(result.meal_categories)
                ? result.meal_categories
                : [];

        if (mounted) {
          setCategories(receivedCategories);
        }
      } catch (error) {
        console.error("Failed to load meal categories:", error);

        if (mounted) {
          setCategoriesError(getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredMeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return meals;
    }

    return meals.filter((meal) => {
      const name = getMealName(meal).toLowerCase();

      const category = String(
        meal.strCategory ?? meal.category ?? ""
      ).toLowerCase();

      const size = getMealSizeLabel(meal.size).toLowerCase();

      return (
        name.includes(query) ||
        category.includes(query) ||
        size.includes(query)
      );
    });
  }, [meals, search]);

  function formatPrice(price) {
    return `${Number(price ?? 0).toLocaleString("ar-SA")} ر.س`;
  }

  function releasePreview() {
    setImagePreview((previous) => {
      if (previous.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }

      return "";
    });
  }

  function resetForm() {
    releasePreview();
    setForm({ ...initialForm });
    setSelectedImage(null);
    setEditingId(null);
    setShowForm(false);
  }

  function openAddForm() {
    resetForm();
    setNotice(null);
    setShowForm(true);
  }

  function openEditForm(meal) {
    resetForm();

    const id = getMealId(meal);

    if (id === undefined || id === null || id === "") {
      setNotice({
        type: "error",
        text: "تعذّر تحديد معرّف الوجبة لتعديلها.",
      });

      return;
    }

    const currentImage = getMealImage(meal);
    const currentCategoryName = String(
      meal.strCategory ?? meal.category ?? ""
    ).trim();

    const matchingCategory = categories.find(
      (category) =>
        String(category.name ?? "").trim().toLowerCase() ===
        currentCategoryName.toLowerCase()
    );

    const categoryId =
      meal.meal_category_id ??
      matchingCategory?.id ??
      "";

    setForm({
      name: getMealName(meal),
      meal_category_id:
        categoryId === null || categoryId === ""
          ? ""
          : String(categoryId),
      area: meal.strArea ?? meal.area ?? "",
      instructions:
        meal.strInstructions ??
        meal.description ??
        meal.instructions ??
        "",
      price: String(meal.price ?? ""),
      size: ["small", "medium", "large"].includes(meal.size)
        ? meal.size
        : "medium",
      image_url: currentImage,
      tags: meal.strTags ?? meal.tags ?? "",
      youtube_url: meal.strYoutube ?? meal.youtube_url ?? "",
      ingredients: joinList(meal.ingredients),
      measures: joinList(meal.measures),
      is_active:
        meal.is_active === false ||
        meal.is_active === 0 ||
        meal.is_active === "0"
          ? false
          : true,
    });

    setEditingId(String(id));
    setImagePreview(currentImage);
    setShowForm(true);
    setNotice(null);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setNotice({
        type: "error",
        text: "اختاري صورة بصيغة JPG أو PNG أو WEBP.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice({
        type: "error",
        text: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت.",
      });

      event.target.value = "";
      return;
    }

    releasePreview();

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setNotice(null);
  }

  async function handleSaveMeal(event) {
    event.preventDefault();
    setNotice(null);

    const token = getToken();

    if (!token) {
      setNotice({
        type: "error",
        text: "يجب تسجيل الدخول بحساب المدير أولًا.",
      });

      return;
    }

    if (!form.name.trim()) {
      setNotice({
        type: "error",
        text: "اسم الوجبة حقل مطلوب.",
      });

      return;
    }

    if (
      !form.meal_category_id ||
      !categories.some(
        (category) =>
          String(category.id) === String(form.meal_category_id)
      )
    ) {
      setNotice({
        type: "error",
        text: "اختاري تصنيفًا صحيحًا من القائمة. إذا لم تظهر تصنيفات، تحققي من تحميلها أو أضيفي تصنيفًا أولًا.",
      });

      return;
    }

    if (!form.instructions.trim()) {
      setNotice({
        type: "error",
        text: "اكتبي وصف الوجبة وطريقة تحضيرها.",
      });

      return;
    }

    if (!["small", "medium", "large"].includes(form.size)) {
      setNotice({
        type: "error",
        text: "اختاري حجمًا صحيحًا للوجبة.",
      });

      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setNotice({
        type: "error",
        text: "أدخلي سعرًا صحيحًا غير سالب.",
      });

      return;
    }

    if (
      form.youtube_url.trim() &&
      !/^https?:\/\/\S+$/i.test(form.youtube_url.trim())
    ) {
      setNotice({
        type: "error",
        text: "رابط الفيديو غير صحيح.",
      });

      return;
    }

    if (
      form.image_url.trim() &&
      !selectedImage &&
      !/^https?:\/\/\S+$/i.test(form.image_url.trim())
    ) {
      setNotice({
        type: "error",
        text: "رابط الصورة يجب أن يبدأ بـ http:// أو https://.",
      });

      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      meal_category_id: Number(form.meal_category_id),
      area: form.area.trim(),
      instructions: form.instructions.trim(),
      price: Number(form.price),
      size: form.size,
      tags: form.tags.trim(),
      youtube_url: form.youtube_url.trim(),
      ingredients: splitList(form.ingredients),
      measures: splitList(form.measures),
      is_active: form.is_active ? 1 : 0,
    };

    if (form.image_url.trim() && !selectedImage) {
      payload.image_url = form.image_url.trim();
    }

    const wasEditing = editingId !== null;
    const currentEditingId = editingId;

    try {
      let response;

      if (selectedImage) {
        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, String(value));
          }
        });

        formData.append("image", selectedImage);

        if (wasEditing) {
          formData.append("_method", "PATCH");

          response = await axios.post(
            `${API_URL}/meals/${encodeURIComponent(currentEditingId)}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
        } else {
          response = await axios.post(`${API_URL}/meals`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
        }
      } else if (wasEditing) {
        response = await axios.patch(
          `${API_URL}/meals/${encodeURIComponent(currentEditingId)}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
      } else {
        response = await axios.post(`${API_URL}/meals`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }

      resetForm();

      setNotice({
        type: "success",
        text:
          response.data?.message ||
          (wasEditing
            ? "تم تحديث الوجبة بنجاح."
            : "تمت إضافة الوجبة بنجاح."),
      });

      window.dispatchEvent(new Event("grilli:refresh-meals"));
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMeal(meal) {
    const id = getMealId(meal);

    if (id === undefined || id === null || id === "") {
      setNotice({
        type: "error",
        text: "لم يتم العثور على معرّف الوجبة.",
      });

      return;
    }

    const token = getToken();

    if (!token) {
      setNotice({
        type: "error",
        text: "يجب تسجيل الدخول بحساب المدير قبل الحذف.",
      });

      return;
    }

    const confirmed = window.confirm(
      `هل أنتِ متأكدة من حذف وجبة "${getMealName(meal)}" وصورتها المحلية؟`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(String(id));
    setNotice(null);

    try {
      const response = await axios.delete(
        `${API_URL}/meals/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setNotice({
        type: "success",
        text: response.data?.message || "تم حذف الوجبة بنجاح.",
      });

      window.dispatchEvent(new Event("grilli:refresh-meals"));
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout
      active="meals"
      eyebrow="GRILLI / MENU MANAGEMENT"
      title="إدارة الوجبات"
      description="أضيفي الوجبات وعدّلي تفاصيلها وصورها وأحجامها، أو احذفي الوجبات غير المطلوبة."
    >
      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <span className="admin-kicker">MENU COLLECTION</span>
            <h2>قائمة الطعام</h2>
            <p>
              إجمالي الوجبات: {meals.length} — نتائج البحث:{" "}
              {filteredMeals.length}
            </p>
          </div>

          <button
            type="button"
            className="admin-button"
            onClick={() => {
              if (showForm) {
                resetForm();
                setNotice(null);
              } else {
                openAddForm();
              }
            }}
          >
            <ion-icon
              name={showForm ? "close-outline" : "add-outline"}
            />
            {showForm ? "إغلاق النموذج" : "إضافة وجبة"}
          </button>
        </div>

        {notice && (
          <div
            role="alert"
            style={{
              padding: "12px 16px",
              margin: "16px 0",
              borderRadius: "8px",
              background:
                notice.type === "success" ? "#183b2b" : "#482323",
              color: "#fff",
            }}
          >
            {notice.text}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSaveMeal}
            className="admin-section"
            style={{ marginBottom: 24 }}
          >
            <h3>
              {editingId !== null
                ? "تعديل بيانات الوجبة"
                : "إضافة وجبة جديدة"}
            </h3>

            <div
              className="admin-meals-toolbar"
              style={{ alignItems: "flex-start" }}
            >
              <label style={{ flex: "1 1 220px" }}>
                اسم الوجبة *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="مثال: Chicken Burger"
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
              </label>

              <label style={{ flex: "1 1 220px" }}>
                التصنيف *
                <select
                  name="meal_category_id"
                  value={form.meal_category_id}
                  onChange={handleChange}
                  required
                  disabled={categoriesLoading || categories.length === 0}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                    padding: 10,
                  }}
                >
                  <option value="">
                    {categoriesLoading
                      ? "جارٍ تحميل التصنيفات..."
                      : categories.length === 0
                        ? "لا توجد تصنيفات متاحة"
                        : "اختاري التصنيف"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {categoriesError ? (
                  <small style={{ color: "#d9534f", display: "block", marginTop: 6 }}>
                    تعذّر تحميل التصنيفات: {categoriesError}
                  </small>
                ) : categories.length === 0 && !categoriesLoading ? (
                  <small style={{ display: "block", marginTop: 6 }}>
                    أضيفي تصنيفًا أولًا من صفحة إدارة التصنيفات.
                  </small>
                ) : null}
              </label>

              <label style={{ flex: "1 1 160px" }}>
                السعر بالريال *
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="35"
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
              </label>

              <label style={{ flex: "1 1 160px" }}>
                حجم الوجبة *
                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  required
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                    padding: 10,
                  }}
                >
                  <option value="small">صغيرة</option>
                  <option value="medium">متوسطة</option>
                  <option value="large">كبيرة</option>
                </select>
              </label>

              <label style={{ flex: "1 1 220px" }}>
                منطقة المطبخ
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  maxLength={255}
                  placeholder="مثال: Saudi Arabia"
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
              </label>

              <label style={{ flex: "1 1 100%" }}>
                اختيار صورة من الجهاز
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
                <small>
                  الصيغ المقبولة: JPG وPNG وWEBP، بحد أقصى 5 ميجابايت.
                  {selectedImage
                    ? ` الصورة المختارة: ${selectedImage.name}`
                    : ""}
                </small>
              </label>

              {imagePreview && (
                <div style={{ flex: "1 1 100%" }}>
                  <p>معاينة الصورة</p>
                  <img
                    src={imagePreview}
                    alt="معاينة صورة الوجبة"
                    style={{
                      width: 190,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid #ccc",
                    }}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <label style={{ flex: "1 1 100%" }}>
                أو رابط الصورة
                <input
                  name="image_url"
                  type="url"
                  value={form.image_url}
                  onChange={(event) => {
                    handleChange(event);

                    if (!selectedImage) {
                      setImagePreview(event.target.value);
                    }
                  }}
                  placeholder="https://example.com/meal.jpg"
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
                <small>
                  عند اختيار صورة من الجهاز، ستكون لها الأولوية على الرابط.
                </small>
              </label>

              <label style={{ flex: "1 1 100%" }}>
                وصف الوجبة وطريقة التحضير *
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="اكتبي وصف الوجبة وطريقة تحضيرها..."
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
              </label>

              <label style={{ flex: "1 1 220px" }}>
                المكونات
                <textarea
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  rows={3}
                  placeholder="دجاج، خبز، خس، جبن"
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
                <small>
                  افصلي بين المكونات بفاصلة أو اكتبي كل مكوّن في سطر.
                </small>
              </label>

              <label style={{ flex: "1 1 220px" }}>
                مقادير المكونات
                <textarea
                  name="measures"
                  value={form.measures}
                  onChange={handleChange}
                  rows={3}
                  placeholder="200 غرام، قطعة واحدة، شريحتان"
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
                <small>رتّبي المقادير بنفس ترتيب المكونات.</small>
              </label>

              <label style={{ flex: "1 1 220px" }}>
                الوسوم
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  maxLength={1000}
                  placeholder="حار، مشوي، الأكثر طلبًا"
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
              </label>

              <label style={{ flex: "1 1 220px" }}>
                رابط فيديو التحضير
                <input
                  name="youtube_url"
                  type="url"
                  value={form.youtube_url}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/..."
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                  }}
                />
              </label>

              <label
                style={{
                  flex: "1 1 100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                عرض الوجبة في قائمة الطعام
              </label>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="submit"
                className="admin-button"
                disabled={
                  saving ||
                  categoriesLoading ||
                  categories.length === 0
                }
              >
                <ion-icon name="save-outline" />
                {saving
                  ? "جارٍ الحفظ..."
                  : editingId !== null
                    ? "حفظ التعديلات"
                    : "حفظ الوجبة"}
              </button>

              <button
                type="button"
                className="admin-button"
                disabled={saving}
                onClick={() => {
                  resetForm();
                  setNotice(null);
                }}
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        <div className="admin-meals-toolbar">
          <label className="admin-search">
            <ion-icon name="search-outline" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحثي باسم الوجبة أو التصنيف أو الحجم..."
              aria-label="البحث عن وجبة"
            />

            {search && (
              <button
                type="button"
                className="admin-clear-search"
                onClick={() => setSearch("")}
                aria-label="مسح البحث"
              >
                <ion-icon name="close-outline" />
              </button>
            )}
          </label>

          <span className="admin-results-count">
            {filteredMeals.length} نتيجة
          </span>
        </div>

        {meals.length === 0 ? (
          <div className="admin-empty-state">
            <ion-icon name="restaurant-outline" />
            <h3>لا توجد وجبات محمّلة</h3>
            <p>تحققي من اتصال Laravel API ثم أعيدي تحميل الصفحة.</p>
          </div>
        ) : filteredMeals.length === 0 ? (
          <div className="admin-empty-state">
            <ion-icon name="search-outline" />
            <h3>لم نعثر على نتائج</h3>
            <p>جرّبي اسم وجبة أو تصنيفًا أو حجمًا مختلفًا.</p>
            <button
              type="button"
              className="admin-button"
              onClick={() => setSearch("")}
            >
              عرض جميع الوجبات
            </button>
          </div>
        ) : (
          <div className="admin-meal-grid">
            {filteredMeals.map((meal, index) => {
              const image = getMealImage(meal);
              const name = getMealName(meal) || "بدون اسم";
              const category =
                meal.strCategory ?? meal.category ?? "غير محدد";
              const id = getMealId(meal);

              return (
                <article
                  className="admin-meal-card"
                  key={id ?? `${name}-${index}`}
                >
                  <div className="admin-meal-card-image">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="admin-meal-image-placeholder">
                        <ion-icon name="restaurant-outline" />
                      </div>
                    )}

                    <span className="admin-meal-category">
                      {category}
                    </span>
                  </div>

                  <div className="admin-meal-card-body">
                    <span className="admin-meal-index">
                      MEAL {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{name}</h3>

                    <p style={{ margin: "8px 0" }}>
                      حجم الوجبة:{" "}
                      <strong>{getMealSizeLabel(meal.size)}</strong>
                    </p>

                    <div className="admin-meal-card-footer">
                      <div>
                        <small>السعر</small>
                        <strong className="admin-price">
                          {formatPrice(meal.price)}
                        </strong>
                      </div>

                      <span className="admin-meal-id">
                        #{String(id ?? "—")}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 14,
                      }}
                    >
                      <button
                        type="button"
                        className="admin-button"
                        onClick={() => openEditForm(meal)}
                        style={{ flex: 1 }}
                      >
                        <ion-icon name="create-outline" />
                        تعديل
                      </button>

                      <button
                        type="button"
                        className="admin-button"
                        disabled={deletingId === String(id)}
                        onClick={() => handleDeleteMeal(meal)}
                        style={{
                          flex: 1,
                          background: "#7d2929",
                        }}
                      >
                        <ion-icon name="trash-outline" />
                        {deletingId === String(id)
                          ? "جارٍ الحذف..."
                          : "حذف"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

