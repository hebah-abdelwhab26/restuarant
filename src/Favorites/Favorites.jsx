
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "./FavoritesContext";
import { useCart } from "react-use-cart";
import Header from "../Home/Header";
import Topbar from "../Home/Topbar";

const sizeLabels = {
  small: "صغيرة",
  medium: "متوسطة",
  large: "كبيرة",
};

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addItem } = useCart();

  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

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

  const getSizeLabel = (size) => {
    return (
      sizeLabels[String(size || "medium").toLowerCase()] || "متوسطة"
    );
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

  const handleRemoveFavorite = (item) => {
    toggleFavorite(item);
    showToast("تمت إزالة الوجبة من المفضلة");
  };

  return (
    <div className="favorites-page">
      <style>{`
        .favorites-page {
          --fav-gold: #d4a017;
          --fav-gold-light: #f2d58a;
          --fav-bg: #11110f;
          --fav-panel: #22221e;
          --fav-text: #f8f4e9;
          --fav-muted: #c0bcae;
          min-height: 100vh;
          padding-bottom: 55px;
          background: var(--fav-bg);
          color: var(--fav-text);
        }

        .fav-main {
          width: min(1160px, calc(100% - 36px));
          margin: 0 auto;
          padding: 120px 0 55px;
        }

        .fav-heading {
          text-align: center;
          margin-bottom: 35px;
        }

        .fav-eyebrow {
          color: var(--fav-gold-light);
          font-size: 14px;
          margin-bottom: 9px;
        }

        .fav-title {
          color: var(--fav-text);
          font-size: clamp(28px, 4vw, 38px);
          font-weight: 800;
          margin: 0;
        }

        .fav-subtitle {
          color: var(--fav-muted);
          font-size: 14px;
          line-height: 1.9;
          margin: 12px auto 0;
          max-width: 500px;
        }

        .fav-count {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 18px;
          padding: 8px 14px;
          border: 1px solid rgba(212, 160, 23, 0.25);
          border-radius: 30px;
          color: var(--fav-gold-light);
          background: rgba(212, 160, 23, 0.07);
          font-size: 13px;
        }

        .fav-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          direction: rtl;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .fav-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(212, 160, 23, 0.16);
          border-radius: 17px;
          background: var(--fav-panel);
          transition: transform 0.25s, border-color 0.25s,
            box-shadow 0.25s;
        }

        .fav-card:hover {
          transform: translateY(-5px);
          border-color: rgba(212, 160, 23, 0.48);
          box-shadow: 0 13px 30px rgba(0, 0, 0, 0.2);
        }

        .fav-image-wrap {
          position: relative;
          height: 215px;
          overflow: hidden;
          background: #302e26;
        }

        .fav-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s;
        }

        .fav-card:hover .fav-image {
          transform: scale(1.045);
        }

        .fav-remove-btn {
          position: absolute;
          top: 13px;
          right: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 39px;
          height: 39px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          background: rgba(17, 17, 15, 0.85);
          color: #ff7580;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }

        .fav-remove-btn:hover {
          transform: scale(1.07);
          background: #3a2424;
        }

        .fav-remove-btn ion-icon {
          font-size: 21px;
        }

        .fav-category {
          position: absolute;
          right: 13px;
          bottom: 13px;
          max-width: calc(100% - 26px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 6px 11px;
          border: 1px solid rgba(242, 213, 138, 0.3);
          border-radius: 20px;
          background: rgba(17, 17, 15, 0.85);
          color: var(--fav-gold-light);
          font-size: 11px;
        }

        .fav-card-content {
          padding: 19px;
          text-align: right;
        }

        .fav-meal-title {
          min-height: 32px;
          margin: 0 0 12px;
          color: var(--fav-text);
          font-size: 20px;
          font-weight: 800;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .fav-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 16px;
        }

        .fav-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.035);
          color: var(--fav-muted);
          font-size: 12px;
        }

        .fav-meta-item ion-icon {
          color: var(--fav-gold);
          font-size: 16px;
        }

        .fav-price-row {
          padding: 13px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .fav-price {
          color: var(--fav-gold-light);
          font-size: 22px;
          font-weight: 800;
        }

        .fav-actions {
          display: flex;
          gap: 9px;
          margin-top: 16px;
        }

        .fav-details-btn,
        .fav-cart-btn {
          min-height: 43px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, color 0.2s,
            transform 0.2s;
        }

        .fav-details-btn {
          flex: 1;
          padding: 10px;
          border: 1px solid rgba(212, 160, 23, 0.6);
          background: transparent;
          color: var(--fav-gold-light);
          text-decoration: none;
        }

        .fav-details-btn:hover {
          background: var(--fav-gold);
          color: #191811;
        }

        .fav-cart-btn {
          flex: 1;
          padding: 10px;
          border: 1px solid var(--fav-gold);
          background: var(--fav-gold);
          color: #191811;
        }

        .fav-cart-btn:hover {
          background: var(--fav-gold-light);
          transform: translateY(-2px);
        }

        .fav-actions ion-icon {
          font-size: 18px;
        }

        .fav-empty {
          padding: 55px 20px;
          border: 1px dashed rgba(212, 160, 23, 0.28);
          border-radius: 17px;
          background: var(--fav-panel);
          text-align: center;
        }

        .fav-empty-icon {
          color: var(--fav-gold);
          font-size: 48px;
        }

        .fav-empty h3 {
          color: var(--fav-text);
          font-size: 22px;
          margin: 15px 0 8px;
        }

        .fav-empty p {
          color: var(--fav-muted);
          font-size: 14px;
          line-height: 1.9;
          margin-bottom: 20px;
        }

        .fav-browse-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 9px;
          background: var(--fav-gold);
          color: #191811;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          transition: background 0.2s;
        }

        .fav-browse-btn:hover {
          background: var(--fav-gold-light);
        }

        .fav-toast {
          position: fixed;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          width: max-content;
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

        @media (max-width: 900px) {
          .fav-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 17px;
          }

          .fav-image-wrap {
            height: 200px;
          }
        }

        @media (max-width: 600px) {
          .fav-main {
            width: calc(100% - 24px);
            padding-top: 105px;
            padding-bottom: 35px;
          }

          .fav-title {
            font-size: 28px;
          }

          .fav-grid {
            gap: 12px;
          }

          .fav-image-wrap {
            height: 155px;
          }

          .fav-card-content {
            padding: 12px;
          }

          .fav-meal-title {
            font-size: 16px;
          }

          .fav-meta-item {
            font-size: 11px;
            padding: 5px 7px;
          }

          .fav-price {
            font-size: 17px;
          }

          .fav-actions {
            gap: 6px;
            flex-direction: column;
          }

          .fav-details-btn,
          .fav-cart-btn {
            width: 100%;
            min-height: 39px;
            font-size: 12px;
          }

          .fav-remove-btn {
            top: 9px;
            right: 9px;
            width: 34px;
            height: 34px;
          }
        }

        @media (max-width: 360px) {
          .fav-grid {
            grid-template-columns: 1fr;
          }

          .fav-image-wrap {
            height: 205px;
          }

          .fav-card-content {
            padding: 17px;
          }

          .fav-meal-title {
            font-size: 19px;
          }

          .fav-price {
            font-size: 21px;
          }

          .fav-actions {
            flex-direction: row;
          }
        }
      `}</style>

      <Topbar />
      <Header />

      <main className="fav-main">
        <header className="fav-heading">
          <p className="fav-eyebrow">وجباتك المفضلة في مكان واحد</p>
          <h1 className="fav-title">قائمة المفضلة</h1>
          <p className="fav-subtitle">
            احتفظي بوجباتك المفضلة لتعودي إليها وتطلبيها متى شئتِ.
          </p>

          <div className="fav-count">
            <ion-icon name="heart" />
            {favorites.length} وجبة في المفضلة
          </div>
        </header>

        {favorites.length === 0 ? (
          <div className="fav-empty">
            <ion-icon
              name="heart-outline"
              className="fav-empty-icon"
            />
            <h3>قائمة المفضلة فارغة</h3>
            <p>
              لم تضيفي أي وجبة إلى المفضلة حتى الآن.
              <br />
              تصفحي قائمة الوجبات واختاري ما يعجبك.
            </p>
            <Link to="/menus" className="fav-browse-btn">
              <ion-icon name="restaurant-outline" />
              تصفحي الوجبات
            </Link>
          </div>
        ) : (
          <ul className="fav-grid">
            {favorites.map((item) => (
              <li key={item.idMeal} style={{ minWidth: 0 }}>
                <article className="fav-card">
                  <div className="fav-image-wrap">
                    <img
                      src={item.strMealThumb}
                      alt={item.strMeal || "وجبة"}
                      className="fav-image"
                      loading="lazy"
                    />

                    <button
                      type="button"
                      className="fav-remove-btn"
                      onClick={() => handleRemoveFavorite(item)}
                      aria-label={`إزالة ${item.strMeal} من المفضلة`}
                      title="إزالة من المفضلة"
                    >
                      <ion-icon name="heart" />
                    </button>

                    <span className="fav-category">
                      {item.strCategory || "وجبة مميزة"}
                    </span>
                  </div>

                  <div className="fav-card-content">
                    <h2 className="fav-meal-title">
                      {item.strMeal}
                    </h2>

                    <div className="fav-meta">
                      {item.strArea && (
                        <span className="fav-meta-item">
                          <ion-icon name="location-outline" />
                          {item.strArea}
                        </span>
                      )}

                      <span className="fav-meta-item">
                        <ion-icon name="restaurant-outline" />
                        الحجم: {getSizeLabel(item.size)}
                      </span>
                    </div>

                    <div className="fav-price-row">
                      <span className="fav-price">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <div className="fav-actions">
                      <Link
                        to={`/singleMenus/${item.idMeal}`}
                        className="fav-details-btn"
                      >
                        <ion-icon name="eye-outline" />
                        التفاصيل
                      </Link>

                      <button
                        type="button"
                        className="fav-cart-btn"
                        onClick={() => handleAddToCart(item)}
                        aria-label={`إضافة ${item.strMeal} إلى السلة`}
                      >
                        <ion-icon name="bag-add-outline" />
                        أضيفي للسلة
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>

      {toast && (
        <div className="fav-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
