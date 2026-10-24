
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { apivalue } from '../../data/AllData';

const menuItems = [
  { img: "/assets/images/menu-1.png", alt: "Meal 1", badge: "Seasonal" },
  { img: "/assets/images/menu-2.png", alt: "Meal 2", badge: "" },
  { img: "/assets/images/menu-3.png", alt: "Meal 3", badge: "" },
  { img: "/assets/images/menu-4.png", alt: "Meal 4", badge: "New" },
  { img: "/assets/images/menu-5.png", alt: "Meal 5", badge: "" },
  { img: "/assets/images/menu-6.png", alt: "Meal 6", badge: "" }
];

const Menu = () => {
  const api = useContext(apivalue);
  const meals = Array.isArray(api) ? api.slice(0, 6) : [];

  return (
    <section className="section menu" aria-label="menu-label" id="menu">
      <div className="container">
        <p className="section-subtitle text-center label-2">
          Special Selection
        </p>

        <h2 className="headline-1 section-title text-center">
          Delicious Menu
        </h2>

        <ul className="grid-list">
          {meals.map((meal, index) => {
            const item = menuItems[index];

            return (
              <li key={meal.idMeal}>
                <div className="menu-card hover:card">
                  <figure
                    className="card-banner img-holder"
                    style={{ "--width": 100, "--height": 100 }}
                  >
                    <img
                      src={item.img}
                      width="100"
                      height="100"
                      loading="lazy"
                      alt={meal.strMeal || item.alt}
                      className="img-cover"
                    />
                  </figure>

                  <div>
                    <div className="title-wrapper">
                      <h3 className="title-3">
                        <Link
                          to={`/singleMenus/${meal.idMeal}`}
                          className="card-title"
                        >
                          {meal.strMeal}
                        </Link>
                      </h3>

                      {item.badge && (
                        <span className="badge label-1">
                          {item.badge}
                        </span>
                      )}

                      <span className="span title-2">
                        {meal.price != null
                          ? `${Number(meal.price).toFixed(2)} ر.س`
                          : 'السعر غير محدد'}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="menu-text text-center">
          During winter daily from{' '}
          <span className="span">7:00 pm</span>
          {' '}to{' '}
          <span className="span">9:00 pm</span>
        </p>

        <Link to="/menus" className="btn btn-primary">
          <span className="text text-1">View All Menu</span>
          <span className="text text-2" aria-hidden="true">
            View All Menu
          </span>
        </Link>

        <img
          src="/assets/images/shape-5.png"
          width="921"
          height="1036"
          loading="lazy"
          alt="shape"
          className="shape shape-2 move-anim"
        />

        <img
          src="/assets/images/shape-6.png"
          width="343"
          height="345"
          loading="lazy"
          alt="shape"
          className="shape shape-3 move-anim"
        />
      </div>
    </section>
  );
};

export default Menu;
