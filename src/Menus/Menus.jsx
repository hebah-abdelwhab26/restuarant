
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import Header from "../Home/Header";
import Topbar from "../Home/Topbar";
import { apivalue } from "../data/AllData";
import { useFavorites } from "../Favorites/FavoritesContext";

const API_URL = "http://127.0.0.1:8080/api";

const sizeLabels = {
  small: "صغيرة",
  medium: "متوسطة",
  large: "كبيرة",
};

export default function Menus() {
  const data = useContext(apivalue);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [apiCategories, setApiCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [toast, setToast] = useState("");
  const [animatedId, setAnimatedId] = useState(null);

  const toastTimer = useRef(null);
  const animationTimer = useRef(null);

  const meals = Array.isArray(data) ? data : [];

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const response = await axios.get(
          `${API_URL}/meal-categories`,
          { timeout: 10000 }
        );

        const result = response.data;
        const list = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.categories)
          ? result.categories
          : [];

        if (mounted) {
          setApiCategories(
            list.filter((category) => category.is_active !== false)
          );
          setCategoriesError("");
        }
      } catch (error) {
        console.error("Failed to load meal categories:", error);

        if (mounted) {
          setCategoriesError(
            "تعذّر تحميل التصنيفات من الخادم. تحققي من اتصال Laravel."
          );
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

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(animationTimer.current);
    };
  }, []);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const categories = apiCategories
    .map((category) => String(category.name || "").trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const filteredData = meals.filter((item) => {
    const name = String(item.strMeal || "").toLowerCase();
    const id = String(item.idMeal || "");
    const category = String(item.strCategory || "");
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      name.includes(searchValue) || id.includes(searchValue);

    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

  const renderMealCard = (item) => (
    <article className="menus-meal-card" key={item.idMeal}>
      <div className="menus-image-wrap">
        <img
          src={item.strMealThumb}
          alt={item.strMeal || "وجبة"}
          className="menus-meal-image"
          loading="lazy"
        />

        <span className="menus-category-badge">
          {item.strCategory || "وجبة مميزة"}
        </span>

        <button
          type="button"
          className={`menus-favorite-btn ${
            isFavorite(item.idMeal) ? "is-favorite" : ""
          }`}
          onClick={() => handleToggleFavorite(item)}
          aria-label={
            isFavorite(item.idMeal)
              ? "إزالة من المفضلة"
              : "إضافة إلى المفضلة"
          }
        >
          <ion-icon
            name={
              isFavorite(item.idMeal) ? "heart" : "heart-outline"
            }
            className={
              animatedId === item.idMeal ? "heart-animate" : ""
            }
          />
        </button>
      </div>

      <div className="menus-card-content">
        <h3 className="menus-meal-title">
          {item.strMeal || "وجبة"}
        </h3>

        <div className="menus-meal-meta">
          {item.strArea && (
            <span className="menus-meta-item">
              <ion-icon name="location-outline" />
              {item.strArea}
            </span>
          )}

          <span className="menus-meta-item">
            <ion-icon name="restaurant-outline" />
            الحجم: {getSizeLabel(item.size)}
          </span>
        </div>

        <div className="menus-price-row">
          <span className="menus-price">
            {formatPrice(item.price)}
          </span>
        </div>

        <div className="menus-card-actions">
          <Link
            to={`/singleMenus/${item.idMeal}`}
            className="menus-details-btn"
          >
            التفاصيل
            <ion-icon name="arrow-back-outline" />
          </Link>

          <button
            type="button"
            className="menus-cart-btn"
            onClick={() => handleAddToCart(item)}
            aria-label={`إضافة ${item.strMeal} إلى السلة`}
            title="إضافة إلى السلة"
          >
            <ion-icon name="bag-add-outline" />
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <div className="menus-page">
      <style>{`
        .menus-page {
          --menus-gold: #d4a017;
          --menus-gold-light: #f2d58a;
          --menus-bg: #11110f;
          --menus-panel: #22221e;
          --menus-text: #f8f4e9;
          --menus-muted: #c0bcae;
          min-height: 100vh;
          padding-bottom: 55px;
          background: var(--menus-bg);
          color: var(--menus-text);
        }

        .menus-main {
          width: min(1160px, calc(100% - 36px));
          margin: 0 auto;
          padding: 120px 0 55px;
        }

        .menus-heading {
          text-align: center;
          margin-bottom: 28px;
        }

        .menus-eyebrow {
          color: var(--menus-gold-light);
          font-size: 14px;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
        }

        .menus-page-title {
          color: var(--menus-text);
          font-size: clamp(28px, 4vw, 39px);
          line-height: 1.4;
          margin: 0;
          font-weight: 800;
        }

        .menus-heading-description {
          max-width: 550px;
          margin: 12px auto 0;
          color: var(--menus-muted);
          font-size: 14px;
          line-height: 1.9;
        }

        .menus-search-wrap {
          position: relative;
          width: min(530px, 100%);
          margin: 0 auto 27px;
        }

        .menus-search-icon {
          position: absolute;
          top: 50%;
          right: 17px;
          transform: translateY(-50%);
          color: var(--menus-gold);
          font-size: 21px;
          pointer-events: none;
        }

        .menus-search-input {
          width: 100%;
          min-height: 51px;
          padding: 13px 48px 13px 16px;
          border: 1px solid rgba(212, 160, 23, 0.28);
          border-radius: 12px;
          outline: none;
          background: var(--menus-panel);
          color: var(--menus-text);
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .menus-search-input::placeholder {
          color: #a6a193;
        }

        .menus-search-input:focus {
          border-color: var(--menus-gold);
          box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.1);
        }

        .menus-filter-heading {
          margin: 0 0 13px;
          text-align: right;
          color: var(--menus-text);
          font-size: 15px;
          font-weight: 700;
        }

        .menus-category-list {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          overflow-x: auto;
          padding: 3px 2px 13px;
          margin-bottom: 23px;
          direction: rtl;
          scrollbar-width: thin;
          scrollbar-color: #5b4a22 transparent;
        }

        .menus-category-list::-webkit-scrollbar {
          height: 4px;
        }

        .menus-category-list::-webkit-scrollbar-thumb {
          background: #5b4a22;
          border-radius: 10px;
        }

        .menus-category-btn {
          flex: 0 0 auto;
          min-height: 39px;
          padding: 9px 17px;
          border: 1px solid rgba(212, 160, 23, 0.25);
          border-radius: 30px;
          background: var(--menus-panel);
          color: var(--menus-muted);
          font-family: inherit;
          font-size: 13px;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }

        .menus-category-btn:hover {
          border-color: var(--menus-gold);
          color: var(--menus-gold-light);
        }

        .menus-category-btn.active {
          background: var(--menus-gold);
          color: #191811;
          border-color: var(--menus-gold);
          font-weight: 800;
        }

        .menus-results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          color: var(--menus-muted);
          font-size: 13px;
        }

        .menus-results-count {
          color: var(--menus-gold-light);
          font-weight: 700;
        }

        .menus-clear-btn {
          padding: 6px 0;
          border: none;
          background: transparent;
          color: var(--menus-gold-light);
          font-family: inherit;
          font-size: 13px;
          cursor: pointer;
        }

        .menus-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          direction: rtl;
        }

        .menus-meal-card {
          min-width: 0;
          overflow: hidden;
          background: var(--menus-panel);
          border: 1px solid rgba(212, 160, 23, 0.15);
          border-radius: 17px;
          transition: transform 0.25s ease, border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .menus-meal-card:hover {
          transform: translateY(-5px);
          border-color: rgba(212, 160, 23, 0.5);
          box-shadow: 0 13px 30px rgba(0, 0, 0, 0.2);
        }

        .menus-image-wrap {
          position: relative;
          height: 215px;
          overflow: hidden;
          background: #302e26;
        }

        .menus-meal-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .menus-meal-card:hover .menus-meal-image {
          transform: scale(1.045);
        }

        .menus-category-badge {
          position: absolute;
          right: 13px;
          bottom: 13px;
          max-width: calc(100% - 75px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 6px 11px;
          border: 1px solid rgba(242, 213, 138, 0.3);
          border-radius: 20px;
          background: rgba(17, 17, 15, 0.85);
          color: var(--menus-gold-light);
          font-size: 11px;
          backdrop-filter: blur(8px);
        }

        .menus-favorite-btn {
          position: absolute;
          top: 13px;
          right: 13px;
          z-index: 2;
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          background: rgba(17, 17, 15, 0.82);
          color: #fff;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.2s, transform 0.2s;
        }

        .menus-favorite-btn ion-icon {
          font-size: 21px;
        }

        .menus-favorite-btn:hover {
          transform: scale(1.07);
          background: #383126;
        }

        .menus-favorite-btn.is-favorite {
          color: #ff7580;
        }

        .menus-card-content {
          padding: 19px;
          text-align: right;
        }

        .menus-meal-title {
          min-height: 32px;
          margin: 0 0 12px;
          color: var(--menus-text);
          font-size: 20px;
          font-weight: 800;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .menus-meal-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 16px;
        }

        .menus-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.035);
          color: var(--menus-muted);
          font-size: 12px;
        }

        .menus-meta-item ion-icon {
          color: var(--menus-gold);
          font-size: 16px;
        }

        .menus-price-row {
          padding: 13px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .menus-price {
          color: var(--menus-gold-light);
          font-size: 22px;
          font-weight: 800;
        }

        .menus-card-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
        }

        .menus-details-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 43px;
          padding: 10px 12px;
          border: 1px solid rgba(212, 160, 23, 0.6);
          border-radius: 9px;
          color: var(--menus-gold-light);
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }

        .menus-details-btn:hover {
          background: var(--menus-gold);
          color: #191811;
        }

        .menus-details-btn ion-icon {
          font-size: 17px;
        }

        .menus-cart-btn {
          flex: 0 0 44px;
          width: 44px;
          height: 43px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--menus-gold);
          border-radius: 9px;
          background: var(--menus-gold);
          color: #191811;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .menus-cart-btn ion-icon {
          font-size: 21px;
        }

        .menus-cart-btn:hover {
          background: var(--menus-gold-light);
          transform: translateY(-2px);
        }

        .menus-empty {
          grid-column: 1 / -1;
          padding: 55px 20px;
          border: 1px dashed rgba(212, 160, 23, 0.25);
          border-radius: 15px;
          text-align: center;
          background: var(--menus-panel);
        }

        .menus-empty ion-icon {
          color: var(--menus-gold);
          font-size: 42px;
        }

        .menus-empty h3 {
          margin: 13px 0 7px;
          color: var(--menus-text);
          font-size: 20px;
        }

        .menus-empty p {
          color: var(--menus-muted);
          font-size: 13px;
        }

        .menus-reset-btn {
          margin-top: 8px;
          padding: 10px 18px;
          border: 1px solid var(--menus-gold);
          border-radius: 8px;
          background: var(--menus-gold);
          color: #191811;
          font-family: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .menus-toast {
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

        .menus-category-message {
          margin: 0 0 14px;
          color: var(--menus-gold-light);
          font-size: 13px;
          line-height: 1.8;
        }

        @media (max-width: 900px) {
          .menus-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 17px;
          }

          .menus-image-wrap {
            height: 200px;
          }

          .menus-card-content {
            padding: 16px;
          }
        }

        @media (max-width: 600px) {
          .menus-main {
            width: calc(100% - 24px);
            padding-top: 105px;
            padding-bottom: 35px;
          }

          .menus-heading {
            margin-bottom: 23px;
          }

          .menus-page-title {
            font-size: 28px;
          }

          .menus-heading-description {
            font-size: 13px;
          }

          .menus-category-list {
            gap: 8px;
          }

          .menus-category-btn {
            padding: 8px 13px;
            min-height: 36px;
            font-size: 12px;
          }

          .menus-grid {
            gap: 12px;
          }

          .menus-image-wrap {
            height: 155px;
          }

          .menus-card-content {
            padding: 12px;
          }

          .menus-meal-title {
            font-size: 16px;
            margin-bottom: 10px;
          }

          .menus-meta-item {
            font-size: 11px;
            padding: 5px 7px;
          }

          .menus-price {
            font-size: 17px;
          }

          .menus-card-actions {
            gap: 7px;
            margin-top: 12px;
          }

          .menus-details-btn {
            min-height: 39px;
            padding: 8px 5px;
            gap: 4px;
            font-size: 11px;
          }

          .menus-cart-btn {
            flex-basis: 39px;
            width: 39px;
            height: 39px;
          }

          .menus-favorite-btn {
            top: 9px;
            right: 9px;
            width: 34px;
            height: 34px;
          }

          .menus-favorite-btn ion-icon {
            font-size: 19px;
          }

          .menus-category-badge {
            right: 8px;
            bottom: 8px;
            max-width: calc(100% - 55px);
            padding: 5px 8px;
            font-size: 10px;
          }
        }

        @media (max-width: 360px) {
          .menus-grid {
            grid-template-columns: 1fr;
          }

          .menus-image-wrap {
            height: 205px;
          }

          .menus-card-content {
            padding: 17px;
          }

          .menus-meal-title {
            font-size: 19px;
          }

          .menus-price {
            font-size: 21px;
          }
        }
      `}</style>

      <Topbar />
      <Header />

      <main className="menus-main">
        <header className="menus-heading">
          <p className="menus-eyebrow">نكهات تستحق التجربة</p>
          <h1 className="menus-page-title">قائمة الوجبات</h1>
          <p className="menus-heading-description">
            اكتشفي وجباتنا المتنوعة واختاري ما يناسب ذوقك.
          </p>
        </header>

        <div className="menus-search-wrap">
          <ion-icon
            name="search-outline"
            className="menus-search-icon"
          />
          <input
            type="search"
            className="menus-search-input"
            placeholder="ابحثي باسم الوجبة أو رقمها..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="البحث عن وجبة"
          />
        </div>

        <section aria-label="تصنيفات الوجبات">
          <h2 className="menus-filter-heading">
            تصفحي حسب التصنيف
          </h2>

          {categoriesLoading && (
            <p className="menus-category-message" role="status">
              جارٍ تحميل التصنيفات...
            </p>
          )}

          {categoriesError && (
            <p className="menus-category-message" role="alert">
              {categoriesError}
            </p>
          )}

          <div className="menus-category-list">
            <button
              type="button"
              className={`menus-category-btn ${
                selectedCategory === "all" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("all")}
              aria-pressed={selectedCategory === "all"}
            >
              جميع الوجبات
            </button>

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`menus-category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <div className="menus-results-bar">
          <span>
            عدد الوجبات:{" "}
            <span className="menus-results-count">
              {filteredData.length}
            </span>
          </span>

          {(search || selectedCategory !== "all") && (
            <button
              type="button"
              className="menus-clear-btn"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
            >
              مسح البحث والتصفية
            </button>
          )}
        </div>

        <section className="menus-grid" aria-label="الوجبات المتاحة">
          {meals.length === 0 ? (
            <div className="menus-empty">
              <ion-icon name="restaurant-outline" />
              <h3>جارٍ تحميل الوجبات</h3>
              <p>يرجى الانتظار قليلًا.</p>
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => renderMealCard(item))
          ) : (
            <div className="menus-empty">
              <ion-icon name="search-outline" />
              <h3>لم نعثر على وجبات مطابقة</h3>
              <p>جرّبي تغيير كلمة البحث أو اختيار تصنيف آخر.</p>
              <button
                type="button"
                className="menus-reset-btn"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
              >
                عرض جميع الوجبات
              </button>
            </div>
          )}
        </section>
      </main>

      {toast && (
        <div className="menus-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

