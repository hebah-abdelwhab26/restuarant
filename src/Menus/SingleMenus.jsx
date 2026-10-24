
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apivalue } from "../data/AllData";
import Header from "../Home/Header";
import Topbar from "../Home/Topbar";
import { useCart } from "react-use-cart";
import { useFavorites } from "../Favorites/FavoritesContext";

const sizeLabels = {
  small: "صغيرة",
  medium: "متوسطة",
  large: "كبيرة",
};

export default function SingleMenus() {
  const { id } = useParams();
  const data = useContext(apivalue);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [animatedId, setAnimatedId] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const animationTimer = useRef(null);

  const meals = Array.isArray(data) ? data : [];

  const product = meals.find(
    (item) => String(item.idMeal) === String(id)
  );

  const otherProducts = meals
    .filter((item) => String(item.idMeal) !== String(product?.idMeal))
    .slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(animationTimer.current);
    };
  }, [id]);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === "" ||
      !Number.isFinite(Number(price))
    ) {
      return "السعر غير متاح";
    }

    return `${Number(price).toFixed(2)} ر.س`;
  };

  const handleAddToCart = (item) => {
    if (
      item.price === null ||
      item.price === undefined ||
      item.price === "" ||
      !Number.isFinite(Number(item.price))
    ) {
      showToast("سعر هذه الوجبة غير متاح حاليًا");
      return;
    }

    addItem({
      id: String(item.idMeal),
      name: item.strMeal,
      price: Number(item.price),
      image: item.strMealThumb,
      size: item.size || "medium",
    });

    showToast("تمت إضافة الوجبة إلى السلة");
  };

  const handleToggleFavorite = (item) => {
    const wasFavorite = isFavorite(item.idMeal);

    toggleFavorite(item);
    setAnimatedId(item.idMeal);

    clearTimeout(animationTimer.current);
    animationTimer.current = setTimeout(() => {
      setAnimatedId(null);
    }, 700);

    showToast(
      wasFavorite
        ? "تمت الإزالة من المفضلة"
        : "تمت الإضافة إلى المفضلة"
    );
  };

  const getSizeLabel = (size) => {
    return sizeLabels[String(size || "medium").toLowerCase()] || "متوسطة";
  };

  const renderActions = (item) => (
    <div className="sm-actions">
      <button
        type="button"
        onClick={() => handleToggleFavorite(item)}
        aria-label={
          isFavorite(item.idMeal)
            ? "إزالة من المفضلة"
            : "إضافة إلى المفضلة"
        }
        className={`sm-icon-btn ${
          isFavorite(item.idMeal) ? "is-favorite" : ""
        }`}
      >
        <ion-icon
          name={isFavorite(item.idMeal) ? "heart" : "heart-outline"}
          className={animatedId === item.idMeal ? "heart-animate" : ""}
        />
      </button>

      <button
        type="button"
        onClick={() => handleAddToCart(item)}
        aria-label={`إضافة ${item.strMeal} إلى السلة`}
        className="sm-icon-btn"
      >
        <ion-icon name="cart-outline" />
      </button>
    </div>
  );

  const renderMealCard = (item, isMain = false) => (
    <article
      className={`sm-meal-card ${isMain ? "sm-main-card" : "sm-related-card"}`}
      key={item.idMeal}
    >
      <div className="sm-image-wrap">
        <img
          src={item.strMealThumb}
          alt={item.strMeal}
          className="sm-meal-image"
          loading={isMain ? "eager" : "lazy"}
        />
        {renderActions(item)}
        <span className="sm-category-badge">
          {item.strCategory || "وجبة مميزة"}
        </span>
      </div>

      <div className="sm-card-content">
        <h3 className="sm-meal-name">{item.strMeal}</h3>

        <div className="sm-meta-row">
          {item.strArea && (
            <span className="sm-meta-item">
              <ion-icon name="location-outline" />
              {item.strArea}
            </span>
          )}

          <span className="sm-meta-item">
            <ion-icon name="restaurant-outline" />
            الحجم: {getSizeLabel(item.size)}
          </span>
        </div>

        <div className="sm-price-row">
          <span className="sm-price">{formatPrice(item.price)}</span>
          {!isMain && (
            <Link
              to={`/singleMenus/${item.idMeal}`}
              className="sm-details-link"
            >
              التفاصيل
              <ion-icon name="arrow-back-outline" />
            </Link>
          )}
        </div>

        {isMain && (
          <>
            {item.strInstructions && (
              <div className="sm-description">
                <h4>عن الوجبة</h4>
                <p>{item.strInstructions}</p>
              </div>
            )}

            {item.strTags && (
              <div className="sm-tags">
                {String(item.strTags)
                  .split(",")
                  .filter(Boolean)
                  .map((tag) => (
                    <span key={tag.trim()} className="sm-tag">
                      {tag.trim()}
                    </span>
                  ))}
              </div>
            )}

            <button
              type="button"
              className="sm-add-btn"
              onClick={() => handleAddToCart(item)}
            >
              <ion-icon name="bag-add-outline" />
              أضف إلى السلة
            </button>

            <Link to="/menus" className="sm-back-link">
              <ion-icon name="arrow-forward-outline" />
              العودة إلى قائمة الوجبات
            </Link>
          </>
        )}
      </div>
    </article>
  );

  return (
    <div className="single-menus-page">
      <style>{`
        .single-menus-page {
          --sm-gold: #d4a017;
          --sm-gold-light: #f2d58a;
          --sm-dark: #171714;
          --sm-panel: #22221e;
          --sm-text: #f8f4e9;
          --sm-muted: #c0bcae;
          color: var(--sm-text);
          background: #11110f;
          min-height: 100vh;
          padding-bottom: 55px;
        }

      .sm-main-section {
  width: min(1100px, calc(100% - 36px));
  margin: 0 auto;
  padding: 120px 0 65px;
  scroll-margin-top: 120px;
}

        .sm-breadcrumb {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--sm-muted);
          font-size: 13px;
          margin-bottom: 22px;
        }

        .sm-breadcrumb a {
          color: var(--sm-gold-light);
          text-decoration: none;
        }

        .sm-main-card {
          display: grid;
          grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.2fr);
          direction: rtl;
          align-items: stretch;
          overflow: hidden;
          background: var(--sm-panel);
          border: 1px solid rgba(212, 160, 23, 0.23);
          border-radius: 22px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);
        }

        .sm-image-wrap {
          position: relative;
          min-width: 0;
          overflow: hidden;
          background: #2b2a24;
        }

        .sm-main-card .sm-image-wrap {
          min-height: 360px;
          max-height: 440px;
        }

        .sm-meal-image {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 240px;
          max-height: 440px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .sm-image-wrap:hover .sm-meal-image {
          transform: scale(1.035);
        }

        .sm-actions {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          display: flex;
          gap: 8px;
        }

        .sm-icon-btn {
          width: 40px;
          height: 40px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          background: rgba(17, 17, 15, 0.78);
          color: #fff;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          backdrop-filter: blur(8px);
        }

        .sm-icon-btn ion-icon {
          font-size: 21px;
        }

        .sm-icon-btn:hover {
          background: var(--sm-gold);
          color: #171714;
          transform: translateY(-2px);
        }

        .sm-icon-btn.is-favorite {
          color: #ff6b78;
        }

        .sm-category-badge {
          position: absolute;
          bottom: 15px;
          right: 15px;
          max-width: calc(100% - 30px);
          padding: 7px 13px;
          border: 1px solid rgba(242, 213, 138, 0.35);
          border-radius: 30px;
          background: rgba(17, 17, 15, 0.83);
          color: var(--sm-gold-light);
          font-size: 12px;
          backdrop-filter: blur(8px);
        }

        .sm-card-content {
          min-width: 0;
          padding: 32px 30px;
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .sm-meal-name {
          margin: 0 0 16px;
          color: var(--sm-text);
          font-size: clamp(24px, 3vw, 34px);
          line-height: 1.5;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .sm-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 22px;
        }

        .sm-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9px;
          color: var(--sm-muted);
          background: rgba(255, 255, 255, 0.035);
          font-size: 13px;
        }

        .sm-meta-item ion-icon {
          color: var(--sm-gold);
          font-size: 17px;
        }

        .sm-price-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding: 15px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.09);
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
        }

        .sm-price {
          color: var(--sm-gold-light);
          font-size: 25px;
          font-weight: 800;
        }

        .sm-description {
          width: 100%;
          margin-top: 22px;
        }

        .sm-description h4 {
          color: var(--sm-gold-light);
          font-size: 17px;
          font-weight: 700;
          margin: 0 0 9px;
        }

        .sm-description p {
          color: #d0cdc3;
          font-size: 14px;
          line-height: 2;
          margin: 0;
          white-space: pre-line;
          overflow-wrap: anywhere;
        }

        .sm-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 15px;
        }

        .sm-tag {
          color: var(--sm-gold-light);
          background: rgba(212, 160, 23, 0.09);
          border: 1px solid rgba(212, 160, 23, 0.2);
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
        }

        .sm-add-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 49px;
          margin-top: 25px;
          border: 1px solid var(--sm-gold);
          border-radius: 10px;
          background: var(--sm-gold);
          color: #191811;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .sm-add-btn ion-icon {
          font-size: 21px;
        }

        .sm-add-btn:hover {
          background: var(--sm-gold-light);
          transform: translateY(-2px);
        }

        .sm-back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 18px;
          color: var(--sm-muted);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s;
        }

        .sm-back-link:hover {
          color: var(--sm-gold-light);
        }

        .sm-related-section {
          padding: 42px 0 25px;
          background: #191916;
          border-top: 1px solid rgba(212, 160, 23, 0.13);
        }

        .sm-related-inner {
          width: min(1100px, calc(100% - 36px));
          margin: 0 auto;
        }

        .sm-related-heading {
          margin: 0 0 8px;
          color: var(--sm-text);
          font-size: clamp(23px, 3vw, 30px);
          text-align: center;
        }

        .sm-related-subtitle {
          color: var(--sm-muted);
          font-size: 13px;
          text-align: center;
          margin: 0 0 28px;
        }

        .sm-related-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          direction: rtl;
        }

        .sm-related-card {
          min-width: 0;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid rgba(212, 160, 23, 0.16);
          background: var(--sm-panel);
          transition: transform 0.25s, border-color 0.25s;
        }

        .sm-related-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 160, 23, 0.5);
        }

        .sm-related-card .sm-image-wrap {
          height: 190px;
        }

        .sm-related-card .sm-meal-image {
          min-height: 0;
          max-height: none;
          height: 100%;
        }

        .sm-related-card .sm-card-content {
          padding: 18px;
        }

        .sm-related-card .sm-meal-name {
          width: 100%;
          font-size: 19px;
          margin-bottom: 12px;
        }

        .sm-related-card .sm-meta-row {
          margin-bottom: 12px;
        }

        .sm-related-card .sm-meta-item {
          font-size: 12px;
          padding: 6px 8px;
        }

        .sm-related-card .sm-price {
          font-size: 19px;
        }

        .sm-details-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--sm-gold-light);
          text-decoration: none;
          font-size: 13px;
        }

        .sm-details-link:hover {
          color: #fff;
        }

        .sm-toast {
          position: fixed;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          max-width: calc(100% - 30px);
          padding: 13px 22px;
          border: 1px solid rgba(212, 160, 23, 0.4);
          border-radius: 12px;
          background: #24231e;
          color: #fff;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.3);
          text-align: center;
          font-size: 14px;
        }

        .sm-loading {
          min-height: 300px;
          display: grid;
          place-items: center;
          color: var(--sm-muted);
          text-align: center;
        }

        @media (max-width: 768px) {
          .sm-main-section {
            width: min(100% - 24px, 550px);
            padding-top: 25px;
            padding-bottom: 40px;
          }

          .sm-main-card {
            grid-template-columns: 1fr;
            border-radius: 17px;
          }

          .sm-main-card .sm-image-wrap {
            height: 270px;
            min-height: 0;
            max-height: 270px;
          }

          .sm-main-card .sm-meal-image {
            height: 270px;
            min-height: 0;
            max-height: 270px;
          }

          .sm-card-content {
            padding: 23px 20px;
          }

          .sm-meal-name {
            font-size: 25px;
          }

          .sm-price {
            font-size: 22px;
          }

          .sm-related-inner {
            width: calc(100% - 24px);
          }

          .sm-related-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 13px;
          }

          .sm-related-card .sm-image-wrap {
            height: 150px;
          }

          .sm-related-card .sm-card-content {
            padding: 13px;
          }

          .sm-related-card .sm-meal-name {
            font-size: 16px;
          }

          .sm-related-card .sm-price-row {
            align-items: flex-start;
          }
        }

        @media (max-width: 430px) {
          .sm-related-grid {
            grid-template-columns: 1fr;
          }

          .sm-related-card .sm-image-wrap {
            height: 190px;
          }

          .sm-related-card .sm-card-content {
            padding: 17px;
          }

          .sm-breadcrumb {
            font-size: 12px;
          }
        }
      `}</style>

      <Topbar />
      <Header />

      <main className="sm-main-section">
        {product ? (
          <>
            <nav className="sm-breadcrumb" aria-label="مسار التنقل">
              <Link to="/menus">قائمة الوجبات</Link>
              <ion-icon name="chevron-back-outline" />
              <span>{product.strMeal}</span>
            </nav>

            {renderMealCard(product, true)}
          </>
        ) : (
          <div className="sm-loading">
            <h3>
              {meals.length === 0
                ? "جارٍ تحميل الوجبات..."
                : "عذرًا، لم يتم العثور على الوجبة"}
            </h3>
          </div>
        )}
      </main>

      {product && otherProducts.length > 0 && (
        <section className="sm-related-section">
          <div className="sm-related-inner">
            <h2 className="sm-related-heading">قد يعجبك أيضًا</h2>
            <p className="sm-related-subtitle">
              اكتشف المزيد من وجباتنا المميزة
            </p>

            <div className="sm-related-grid">
              {otherProducts.map((item) => renderMealCard(item))}
            </div>
          </div>
        </section>
      )}

      {toast && (
        <div className="sm-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
