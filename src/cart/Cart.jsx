
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import toast from "react-hot-toast";
import Header from "../Home/Header";
import Topbar from "../Home/Topbar";

const sizeLabels = {
  small: "صغيرة",
  medium: "متوسطة",
  large: "كبيرة",
};

export default function Cart() {
  const {
    items,
    updateItemQuantity,
    removeItem,
    cartTotal,
    totalItems,
    isEmpty,
  } = useCart();

  // استبدلي هذا الرقم برقم واتساب المطعم الفعلي
  // مع رمز الدولة، ومن دون + أو مسافات.
  const phoneNumber = "201226078048";

  const formatPrice = (price) =>
    `${Number(price || 0).toFixed(2)} ر.س`;

  const handleCheckout = () => {
    if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
      toast.error("يرجى التحقق من رقم واتساب المطعم");
      return;
    }

    if (items.length === 0) {
      toast.error("السلة فارغة");
      return;
    }

    const lines = items.map((item) => {
      const size = sizeLabels[item.size] || sizeLabels.medium;
      const itemTotal = Number(item.price || 0) * item.quantity;

      return [
        `🍽 ${item.name}`,
        `الحجم: ${size}`,
        `الكمية: ${item.quantity}`,
        `سعر الوجبة: ${formatPrice(item.price)}`,
        `الإجمالي: ${formatPrice(itemTotal)}`,
      ].join("\n");
    });

    const message = [
      "🍽 طلب جديد من المطعم",
      "",
      ...lines,
      "",
      `عدد الوجبات: ${totalItems}`,
      `الإجمالي النهائي: ${formatPrice(cartTotal)}`,
    ].join("\n\n");

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="restaurant-cart-page">
      <style>{`
        .restaurant-cart-page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse at top, rgba(201, 157, 74, 0.09), transparent 48%),
            #101010;
          color: #f8f4ec;
          padding-bottom: 70px;
          direction: ltr;
        }

        .restaurant-cart-page * {
          box-sizing: border-box;
        }

        .restaurant-cart-page .cart-main {
          width: min(1120px, calc(100% - 36px));
          margin: 0 auto;
          padding-top: 145px;
        }

        .restaurant-cart-page .cart-heading {
          text-align: center;
          margin-bottom: 36px;
        }

        .restaurant-cart-page .cart-eyebrow {
          color: #d4ad65;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .restaurant-cart-page .cart-title {
          color: #f8f0df;
          font-size: clamp(27px, 4vw, 39px);
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
        }

        .restaurant-cart-page .cart-count {
          display: inline-block;
          margin-top: 13px;
          color: #cfc6b5;
          font-size: 14px;
        }

        .restaurant-cart-page .cart-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .restaurant-cart-page .cart-item {
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(212, 173, 101, 0.2);
          border-radius: 16px;
          background: linear-gradient(155deg, #20201e, #171716);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.17);
          transition: border-color 0.25s, transform 0.25s;
        }

        .restaurant-cart-page .cart-item:hover {
          border-color: rgba(212, 173, 101, 0.55);
          transform: translateY(-3px);
        }

        .restaurant-cart-page .cart-image-wrap {
          height: 175px;
          padding: 12px 12px 0;
        }

        .restaurant-cart-page .cart-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          border-radius: 10px;
          background: #292824;
        }

        .restaurant-cart-page .cart-item-content {
          padding: 17px 17px 19px;
          text-align: center;
        }

        .restaurant-cart-page .cart-item-name {
          color: #fff5e3;
          font-size: 19px;
          font-weight: 700;
          line-height: 1.5;
          overflow-wrap: anywhere;
          margin: 0 0 10px;
        }

        .restaurant-cart-page .cart-meta {
          color: #bfb7a8;
          font-size: 13px;
          margin: 5px 0;
        }

        .restaurant-cart-page .cart-size {
          display: inline-block;
          margin: 6px 0 10px;
          padding: 5px 12px;
          border: 1px solid rgba(212, 173, 101, 0.35);
          border-radius: 20px;
          color: #e1bf7c;
          background: rgba(212, 173, 101, 0.07);
          font-size: 12px;
        }

        .restaurant-cart-page .cart-price {
          color: #e0bd79;
          font-size: 14px;
          margin: 5px 0;
        }

        .restaurant-cart-page .cart-quantity {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 17px;
          margin: 16px 0;
        }

        .restaurant-cart-page .quantity-btn {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #a98243;
          border-radius: 9px;
          background: transparent;
          color: #f1d49c;
          font-size: 21px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .restaurant-cart-page .quantity-btn:hover:not(:disabled) {
          background: #d4ad65;
          color: #171717;
        }

        .restaurant-cart-page .quantity-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .restaurant-cart-page .quantity-number {
          min-width: 20px;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
        }

        .restaurant-cart-page .cart-line-total {
          color: #f3e8d1;
          font-size: 14px;
          margin: 10px 0 16px;
        }

        .restaurant-cart-page .cart-remove-btn {
          border: 1px solid rgba(255, 107, 107, 0.4);
          border-radius: 8px;
          background: rgba(255, 107, 107, 0.06);
          color: #ff8585;
          padding: 8px 17px;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .restaurant-cart-page .cart-remove-btn:hover {
          background: rgba(255, 107, 107, 0.15);
        }

        .restaurant-cart-page .cart-summary {
          width: min(520px, 100%);
          margin: 38px auto 0;
          padding: 26px;
          border: 1px solid rgba(212, 173, 101, 0.28);
          border-radius: 16px;
          background: #1b1b19;
          text-align: center;
        }

        .restaurant-cart-page .summary-label {
          color: #c6bcaa;
          font-size: 14px;
          margin: 0 0 9px;
        }

        .restaurant-cart-page .summary-total {
          color: #e7c47f;
          font-size: clamp(25px, 4vw, 34px);
          font-weight: 700;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .restaurant-cart-page .checkout-btn {
          width: 100%;
          min-height: 49px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 22px;
          padding: 12px 18px;
          border: none;
          border-radius: 10px;
          background: #c7a15c;
          color: #171510;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .restaurant-cart-page .checkout-btn:hover {
          background: #e0bd79;
          transform: translateY(-1px);
        }

        .restaurant-cart-page .continue-shopping {
          display: inline-block;
          margin-top: 18px;
          color: #d9bd83;
          font-size: 13px;
          text-decoration: none;
        }

        .restaurant-cart-page .continue-shopping:hover {
          color: #fff0cc;
          text-decoration: underline;
        }

        .restaurant-cart-page .empty-cart {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 35px 20px;
          border: 1px solid rgba(212, 173, 101, 0.2);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .restaurant-cart-page .empty-cart-icon {
          font-size: 45px;
          margin-bottom: 15px;
        }

        .restaurant-cart-page .empty-cart h2 {
          color: #f5e9d1;
          font-size: 25px;
          margin: 0 0 10px;
        }

        .restaurant-cart-page .empty-cart p {
          color: #bdb5a7;
          font-size: 14px;
          margin: 0;
        }

        .restaurant-cart-page .browse-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 23px;
          padding: 12px 25px;
          border-radius: 9px;
          background: #c7a15c;
          color: #171510;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: background 0.2s;
        }

        .restaurant-cart-page .browse-btn:hover {
          background: #e0bd79;
        }

        @media (max-width: 900px) {
          .restaurant-cart-page .cart-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 17px;
          }

          .restaurant-cart-page .cart-main {
            padding-top: 130px;
          }
        }

        @media (max-width: 560px) {
          .restaurant-cart-page .cart-main {
            width: calc(100% - 26px);
            padding-top: 120px;
          }

          .restaurant-cart-page .cart-heading {
            margin-bottom: 25px;
          }

          .restaurant-cart-page .cart-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 16px;
          }

          .restaurant-cart-page .cart-item {
            display: grid;
            grid-template-columns: 120px minmax(0, 1fr);
            align-items: stretch;
          }

          .restaurant-cart-page .cart-image-wrap {
            height: 100%;
            min-height: 210px;
            padding: 10px 0 10px 10px;
          }

          .restaurant-cart-page .cart-image {
            min-height: 190px;
          }

          .restaurant-cart-page .cart-item-content {
            padding: 15px 10px;
          }

          .restaurant-cart-page .cart-item-name {
            font-size: 16px;
          }

          .restaurant-cart-page .cart-meta,
          .restaurant-cart-page .cart-price,
          .restaurant-cart-page .cart-line-total {
            font-size: 12px;
          }

          .restaurant-cart-page .cart-quantity {
            gap: 10px;
            margin: 12px 0;
          }

          .restaurant-cart-page .quantity-btn {
            width: 30px;
            height: 30px;
          }

          .restaurant-cart-page .cart-summary {
            margin-top: 25px;
            padding: 22px 16px;
          }
        }

        @media (max-width: 360px) {
          .restaurant-cart-page .cart-item {
            grid-template-columns: 95px minmax(0, 1fr);
          }

          .restaurant-cart-page .cart-image-wrap {
            padding-left: 7px;
          }

          .restaurant-cart-page .cart-item-content {
            padding: 12px 7px;
          }
        }
      `}</style>

      <Topbar />
      <Header />

      <main className="cart-main">
        <div className="cart-heading">
          <p className="cart-eyebrow">YOUR ORDER</p>
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-count">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </span>
        </div>

        {isEmpty ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>اكتشفي وجباتنا وأضيفي وجباتك المفضلة إلى السلة.</p>
            <Link to="/menus" className="browse-btn">
              تصفحي الوجبات
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-grid">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-image-wrap">
                    <img
                      src={item.image || item.strMealThumb}
                      alt={item.name || "وجبة"}
                      className="cart-image"
                      loading="lazy"
                    />
                  </div>

                  <div className="cart-item-content">
                    <h2 className="cart-item-name">{item.name}</h2>

                    <p className="cart-meta">
                      سعر الوحدة: {formatPrice(item.price)}
                    </p>

                    <span className="cart-size">
                      الحجم: {sizeLabels[item.size] || "متوسطة"}
                    </span>

                    <div
                      className="cart-quantity"
                      aria-label={`كمية ${item.name}`}
                    >
                      <button
                        type="button"
                        className="quantity-btn"
                        aria-label={`تقليل كمية ${item.name}`}
                        disabled={item.quantity <= 1}
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateItemQuantity(item.id, item.quantity - 1);
                          }
                        }}
                      >
                        −
                      </button>

                      <span className="quantity-number">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        className="quantity-btn"
                        aria-label={`زيادة كمية ${item.name}`}
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="cart-line-total">
                      الإجمالي:{" "}
                      {formatPrice(Number(item.price || 0) * item.quantity)}
                    </p>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => {
                        removeItem(item.id);
                        toast.success("تم حذف الوجبة من السلة");
                      }}
                    >
                      حذف الوجبة
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <p className="summary-label">الإجمالي لجميع الوجبات</p>
              <p className="summary-total">{formatPrice(cartTotal)}</p>

              <button
                type="button"
                className="checkout-btn"
                onClick={handleCheckout}
              >
                <ion-icon
                  name="logo-whatsapp"
                  style={{ fontSize: "21px" }}
                />
                إتمام الطلب عبر واتساب
              </button>

              <Link to="/menus" className="continue-shopping">
                ← متابعة تصفح الوجبات
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
