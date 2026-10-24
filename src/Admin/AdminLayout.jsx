
import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./styles/admin.css";


const navigation = [
  {
    to: "/admin",
    label: "الرئيسية",
    icon: "grid-outline",
    end: true,
  },
  {
    to: "/admin/meals",
    label: "الوجبات",
    icon: "restaurant-outline",
    end: true,
  },
  {
    to: "/admin/categories",
    label: "التصنيفات",
    icon: "pricetags-outline",
    end: true,
  },
  {
    to: "/#reserv",
    label: "حجز طاولة",
    icon: "calendar-outline",
    end: false,
  },
];


export default function AdminLayout({
  active = "dashboard",
  eyebrow = "GRILLI / ADMINISTRATION",
  title,
  description,
  children,
}) {
  return (
    <div className="admin-layout" dir="rtl">
      <header className="admin-header">
        <Link to="/admin" className="admin-brand">
          <span className="admin-brand-icon">
            <ion-icon name="restaurant-outline" />
          </span>

          <span className="admin-brand-copy">
            <strong>GRILLI</strong>
            <small>RESTAURANT MANAGEMENT</small>
          </span>
        </Link>

        <nav className="admin-nav" aria-label="القائمة الرئيسية">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
              aria-current={undefined}
            >
              <ion-icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-header-actions">
          <Link to="/" className="admin-site-link">
            <span>زيارة الموقع</span>
            <ion-icon name="arrow-up-outline" />
          </Link>

          <div className="admin-user">
            <span className="admin-avatar">
              <ion-icon name="person-outline" />
            </span>

            <span className="admin-user-copy">
              <strong>مدير المطعم</strong>
              <small>ADMINISTRATOR</small>
            </span>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-page-heading">
          <div>
            <span className="admin-eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="admin-heading-mark" aria-hidden="true">
            <span>G.</span>
          </div>
        </div>

        {children}
      </main>

      <footer className="admin-footer">
        <span>
          GRILLI <span className="admin-footer-dot">•</span> RESTAURANT
          MANAGEMENT
        </span>
        <span>CRAFTED FOR EXCELLENCE</span>
      </footer>
    </div>
  );
}
