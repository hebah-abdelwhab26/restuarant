
import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { apivalue } from "../../data/AllData";
import AdminLayout from "../AdminLayout";

export default function Dashboard() {
  const contextMeals = useContext(apivalue);
  const meals = Array.isArray(contextMeals) ? contextMeals : [];

  const featuredMeals = useMemo(() => meals.slice(0, 4), [meals]);

  return (
    <AdminLayout
      active="dashboard"
      eyebrow="GRILLI / OVERVIEW"
      title="إدارة المطعم"
      description="نظرة عامة على قائمة الطعام وإدارة الوجبات."
    >
      <section className="admin-welcome">
        <div>
          <span className="admin-kicker">مرحبًا بك في GRILLI</span>
          <h2>كل تفاصيل مطعمك، في مكان واحد.</h2>
          <p>
            تابعي قائمة الطعام وانتقلي إلى إدارة الوجبات من لوحة تحكم موحدة.
          </p>
          <Link to="/admin/meals" className="admin-button">
            <ion-icon name="restaurant-outline" />
            إدارة الوجبات
          </Link>
        </div>

        <div className="admin-welcome-mark" aria-hidden="true">
          <ion-icon name="restaurant-outline" />
          <span>GRILLI</span>
          <small>GOOD FOOD · GOOD MOOD</small>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <span className="admin-kicker">MENU OVERVIEW</span>
            <h2>ملخص قائمة الطعام</h2>
          </div>
          <Link to="/admin/meals" className="admin-text-link">
            عرض جميع الوجبات <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="admin-stats-grid">
          <article className="admin-stat-card">
            <span className="admin-stat-icon">
              <ion-icon name="restaurant-outline" />
            </span>
            <span className="admin-stat-label">إجمالي الوجبات المحمّلة</span>
            <strong>{meals.length}</strong>
            <small>من بيانات قائمة الطعام</small>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon">
              <ion-icon name="grid-outline" />
            </span>
            <span className="admin-stat-label">أقسام الطعام</span>
            <strong>
              {
                new Set(
                  meals
                    .map((meal) => meal.strCategory ?? meal.category)
                    .filter(Boolean)
                ).size
              }
            </strong>
            <small>الأقسام الموجودة في البيانات</small>
          </article>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div>
            <span className="admin-kicker">RECENT MENU</span>
            <h2>وجبات من قائمتك</h2>
          </div>
        </div>

        {featuredMeals.length > 0 ? (
          <div className="admin-meal-preview-grid">
            {featuredMeals.map((meal, index) => (
              <article
                className="admin-meal-preview"
                key={meal.idMeal ?? meal.id ?? `${meal.strMeal}-${index}`}
              >
                <span className="admin-preview-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{meal.strMeal ?? meal.title ?? "وجبة"}</h3>
                  <p>{meal.strCategory ?? meal.category ?? "بدون تصنيف"}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-empty-state">
            لا توجد وجبات محمّلة حاليًا. تحققي من اتصال قائمة الطعام.
          </p>
        )}
      </section>
    </AdminLayout>
  );
}
