
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";

const API_URL = "http://127.0.0.1:8080/api";

const initialForm = {
  name: "",
  is_active: true,
};

function getToken() {
  return (
    sessionStorage.getItem("auth_token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

function getAuthConfig() {
  const token = getToken();

  return {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

function isActive(value) {
  return value === true || value === 1 || value === "1";
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
    "تعذّر تنفيذ العملية. تحققي من اتصال Laravel ثم حاولي مجددًا."
  );
}

function getCategoriesFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...initialForm });
  const [notice, setNotice] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/admin/meal-categories`,
        getAuthConfig()
      );

      setCategories(getCategoriesFromResponse(response.data));
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = categories.filter((category) =>
    String(category.name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const activeCount = categories.filter((category) =>
    isActive(category.is_active)
  ).length;

  const inactiveCount = categories.length - activeCount;

  function resetForm() {
    setForm({ ...initialForm });
    setEditingId(null);
    setShowForm(false);
  }

  function openAddForm() {
    resetForm();
    setNotice(null);
    setShowForm(true);
  }

  function openEditForm(category) {
    setEditingId(category.id);
    setForm({
      name: category.name || "",
      is_active: isActive(category.is_active),
    });
    setNotice(null);
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
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
        text: "يرجى إدخال اسم التصنيف.",
      });
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      is_active: form.is_active,
    };

    try {
      const response =
        editingId !== null
          ? await axios.put(
              `${API_URL}/meal-categories/${editingId}`,
              payload,
              getAuthConfig()
            )
          : await axios.post(
              `${API_URL}/meal-categories`,
              payload,
              getAuthConfig()
            );

      setNotice({
        type: "success",
        text:
          response.data?.message ||
          (editingId !== null
            ? "تم تعديل التصنيف بنجاح."
            : "تمت إضافة التصنيف بنجاح."),
      });

      resetForm();
      await loadCategories();
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(category) {
    setNotice(null);
    setProcessingId(category.id);

    try {
      const nextStatus = !isActive(category.is_active);

      const response = await axios.patch(
        `${API_URL}/meal-categories/${category.id}`,
        {
          name: category.name,
          is_active: nextStatus,
        },
        getAuthConfig()
      );

      setNotice({
        type: "success",
        text:
          response.data?.message ||
          (nextStatus
            ? "تم تفعيل التصنيف بنجاح."
            : "تم تعطيل التصنيف بنجاح."),
      });

      await loadCategories();
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setProcessingId(null);
    }
  }

  async function deleteCategory(category) {
    const mealsCount = Number(category.meals_count || 0);

    if (mealsCount > 0) {
      setNotice({
        type: "error",
        text: `لا يمكن حذف التصنيف "${category.name}" لأنه مرتبط بـ ${mealsCount} وجبة. انقلي الوجبات إلى تصنيف آخر أولًا.`,
      });
      return;
    }

    const confirmed = window.confirm(
      `هل أنتِ متأكدة من حذف التصنيف "${category.name}"؟`
    );

    if (!confirmed) return;

    setNotice(null);
    setProcessingId(category.id);

    try {
      const response = await axios.delete(
        `${API_URL}/meal-categories/${category.id}`,
        getAuthConfig()
      );

      if (editingId === category.id) {
        resetForm();
      }

      setNotice({
        type: "success",
        text: response.data?.message || "تم حذف التصنيف بنجاح.",
      });

      await loadCategories();
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <AdminLayout
      active="categories"
      eyebrow="GRILLI / CATEGORY MANAGEMENT"
      title="إدارة التصنيفات"
      description="نظّمي قائمة الطعام من خلال إضافة التصنيفات وتعديلها والتحكم في ظهورها للعملاء."
    >
      <section className="admin-section">
        <style>{`
          .categories-page-stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
            margin: 0 0 24px;
          }

          .categories-page-stat {
            min-width: 0;
            padding: 20px;
            border: 1px solid rgba(212, 160, 23, .2);
            border-radius: 12px;
            background: rgba(212, 160, 23, .045);
          }

          .categories-page-stat span {
            display: block;
            margin-bottom: 10px;
            opacity: .75;
            font-size: 13px;
          }

          .categories-page-stat strong {
            display: block;
            font-size: 28px;
            line-height: 1.2;
            font-weight: 800;
          }

          .categories-page .admin-section-heading {
            gap: 16px;
            flex-wrap: wrap;
          }

          .categories-page .admin-section-heading h2 {
            margin-bottom: 8px;
          }

          .categories-page .admin-section-heading p {
            line-height: 1.8;
          }

          .categories-page .category-form-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
            margin-top: 20px;
          }

          .categories-page .category-field {
            display: flex;
            flex-direction: column;
            gap: 9px;
            min-width: 0;
          }

          .categories-page .category-field > span {
            font-size: 13px;
            font-weight: 700;
          }

          .categories-page .category-field input[type="text"] {
            width: 100%;
            min-height: 46px;
            padding: 11px 14px;
            border: 1px solid rgba(128, 128, 128, .3);
            border-radius: 8px;
            background: transparent;
            color: inherit;
            font: inherit;
            outline: none;
            box-sizing: border-box;
          }

          .categories-page .category-field input[type="text"]:focus {
            border-color: #d4a017;
            box-shadow: 0 0 0 3px rgba(212, 160, 23, .12);
          }

          .categories-page .category-active-toggle {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 15px;
            font-size: 13px;
            cursor: pointer;
          }

          .categories-page .category-active-toggle input {
            width: 17px;
            height: 17px;
            accent-color: #d4a017;
          }

          .categories-page .category-form-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
            margin-top: 22px;
          }

          .categories-page .category-feedback {
            padding: 13px 16px;
            margin: 16px 0;
            border-radius: 8px;
            line-height: 1.8;
            overflow-wrap: anywhere;
          }

          .categories-page .category-feedback.success {
            background: rgba(35, 125, 75, .12);
            border: 1px solid rgba(35, 125, 75, .3);
          }

          .categories-page .category-feedback.error {
            background: rgba(180, 55, 45, .1);
            border: 1px solid rgba(180, 55, 45, .3);
          }

          .categories-page .category-toolbar {
            display: flex;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;
            margin: 20px 0;
          }

          .categories-page .category-search {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1 1 260px;
            min-width: 0;
            padding: 0 14px;
            min-height: 46px;
            border: 1px solid rgba(128, 128, 128, .28);
            border-radius: 8px;
          }

          .categories-page .category-search input {
            width: 100%;
            min-width: 0;
            border: 0;
            outline: none;
            background: transparent;
            color: inherit;
            font: inherit;
          }

          .categories-page .category-results {
            font-size: 13px;
            opacity: .75;
            white-space: nowrap;
          }

          .categories-page .category-table-wrap {
            width: 100%;
            overflow-x: auto;
          }

          .categories-page .category-table {
            width: 100%;
            border-collapse: collapse;
            text-align: right;
            min-width: 650px;
          }

          .categories-page .category-table th,
          .categories-page .category-table td {
            padding: 15px 12px;
            border-bottom: 1px solid rgba(128, 128, 128, .18);
            vertical-align: middle;
          }

          .categories-page .category-table th {
            font-size: 12px;
            font-weight: 800;
            opacity: .75;
            white-space: nowrap;
          }

          .categories-page .category-table td {
            font-size: 13px;
          }

          .categories-page .category-table tbody tr {
            transition: background .2s;
          }

          .categories-page .category-table tbody tr:hover {
            background: rgba(212, 160, 23, .045);
          }

          .categories-page .category-name {
            font-weight: 800;
          }

          .categories-page .category-count {
            display: inline-flex;
            justify-content: center;
            min-width: 34px;
            padding: 5px 9px;
            border-radius: 7px;
            background: rgba(128, 128, 128, .12);
            font-weight: 800;
          }

          .categories-page .category-status {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
          }

          .categories-page .category-status::before {
            content: "";
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
          }

          .categories-page .category-status.active {
            background: rgba(46, 139, 87, .13);
            color: #318456;
          }

          .categories-page .category-status.inactive {
            background: rgba(128, 128, 128, .13);
            color: #8a8a8a;
          }

          .categories-page .category-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .categories-page .category-actions button {
            white-space: nowrap;
          }

          .categories-page .category-actions button:disabled,
          .categories-page .category-form-actions button:disabled {
            opacity: .55;
            cursor: not-allowed;
          }

          .categories-page .category-empty {
            text-align: center;
            padding: 38px 16px;
          }

          .categories-page .category-empty ion-icon {
            font-size: 34px;
            opacity: .65;
          }

          .categories-page .category-empty h3 {
            margin: 12px 0 8px;
          }

          .categories-page .category-empty p {
            opacity: .75;
            line-height: 1.8;
          }

          @media (max-width: 700px) {
            .categories-page-stats {
              grid-template-columns: 1fr;
              gap: 10px;
            }

            .categories-page-stat {
              padding: 15px;
            }

            .categories-page-stat strong {
              font-size: 24px;
            }

            .categories-page .category-form-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .categories-page .category-form-actions button {
              flex: 1 1 140px;
            }
          }
        `}</style>

        <div className="categories-page">
          {notice && (
            <div
              className={`category-feedback ${notice.type}`}
              role="alert"
            >
              {notice.text}
            </div>
          )}

          <div className="categories-page-stats">
            <div className="categories-page-stat">
              <span>إجمالي التصنيفات</span>
              <strong>{categories.length}</strong>
            </div>

            <div className="categories-page-stat">
              <span>التصنيفات النشطة</span>
              <strong>{activeCount}</strong>
            </div>

            <div className="categories-page-stat">
              <span>التصنيفات المعطّلة</span>
              <strong>{inactiveCount}</strong>
            </div>
          </div>

          <div className="admin-section-heading">
            <div>
              <span className="admin-kicker">CATEGORY COLLECTION</span>
              <h2>تصنيفات قائمة الطعام</h2>
              <p>
                إجمالي التصنيفات: {categories.length} — نتائج البحث:{" "}
                {filteredCategories.length}
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
              {showForm ? "إغلاق النموذج" : "إضافة تصنيف"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="admin-section"
              style={{ margin: "24px 0" }}
            >
              <h3>
                {editingId !== null
                  ? "تعديل بيانات التصنيف"
                  : "إضافة تصنيف جديد"}
              </h3>

              <div className="category-form-grid">
                <label className="category-field">
                  <span>اسم التصنيف *</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="مثال: الوجبات الرئيسية"
                    maxLength={255}
                    autoComplete="off"
                    required
                    disabled={saving}
                  />
                </label>
              </div>

              <label className="category-active-toggle">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  disabled={saving}
                />
                إتاحة هذا التصنيف للعملاء
              </label>

              <div className="category-form-actions">
                <button
                  type="submit"
                  className="admin-button"
                  disabled={saving}
                >
                  <ion-icon name="save-outline" />
                  {saving
                    ? "جارٍ الحفظ..."
                    : editingId !== null
                      ? "حفظ التعديلات"
                      : "حفظ التصنيف"}
                </button>

                <button
                  type="button"
                  className="admin-button"
                  disabled={saving}
                  onClick={resetForm}
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          <div className="category-toolbar">
            <label className="category-search">
              <ion-icon name="search-outline" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحثي باسم التصنيف..."
                aria-label="البحث عن تصنيف"
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

            <span className="category-results">
              {filteredCategories.length} نتيجة
            </span>

            <button
              type="button"
              className="admin-button"
              onClick={loadCategories}
              disabled={loading}
            >
              <ion-icon name="refresh-outline" />
              {loading ? "جارٍ التحديث..." : "تحديث"}
            </button>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <ion-icon name="sync-outline" />
              <h3>جارٍ تحميل التصنيفات...</h3>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="admin-empty-state category-empty">
              <ion-icon name="pricetags-outline" />
              <h3>
                {search
                  ? "لم نعثر على تصنيفات مطابقة"
                  : "لا توجد تصنيفات"}
              </h3>
              <p>
                {search
                  ? "جرّبي البحث باسم آخر."
                  : "أضيفي تصنيفًا جديدًا ليظهر هنا."}
              </p>

              {search && (
                <button
                  type="button"
                  className="admin-button"
                  onClick={() => setSearch("")}
                >
                  عرض جميع التصنيفات
                </button>
              )}
            </div>
          ) : (
            <div className="category-table-wrap">
              <table className="category-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم التصنيف</th>
                    <th>عدد الوجبات</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category, index) => {
                    const active = isActive(category.is_active);
                    const processing = processingId === category.id;

                    return (
                      <tr key={category.id}>
                        <td>{index + 1}</td>

                        <td>
                          <span className="category-name">
                            {category.name}
                          </span>
                        </td>

                        <td>
                          <span className="category-count">
                            {Number(category.meals_count || 0)}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`category-status ${
                              active ? "active" : "inactive"
                            }`}
                          >
                            {active ? "نشط" : "معطّل"}
                          </span>
                        </td>

                        <td>
                          <div className="category-actions">
                            <button
                              type="button"
                              className="admin-button"
                              onClick={() => openEditForm(category)}
                              disabled={processing || saving}
                            >
                              <ion-icon name="create-outline" />
                              تعديل
                            </button>

                            <button
                              type="button"
                              className="admin-button"
                              onClick={() => toggleStatus(category)}
                              disabled={processing || saving}
                            >
                              <ion-icon
                                name={
                                  active
                                    ? "eye-off-outline"
                                    : "checkmark-circle-outline"
                                }
                              />
                              {processing
                                ? "جارٍ التنفيذ..."
                                : active
                                  ? "تعطيل"
                                  : "تفعيل"}
                            </button>

                            <button
                              type="button"
                              className="admin-button"
                              style={{ background: "#7d2929" }}
                              onClick={() => deleteCategory(category)}
                              disabled={processing || saving}
                            >
                              <ion-icon name="trash-outline" />
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

