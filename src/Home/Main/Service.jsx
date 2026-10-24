import React from 'react'


const Service = () => {
  return (
     <article>
      <main>
    <section id='offer'
      className="section service bg-black-10 text-center"
      aria-label="service"
    >
      <div className="container">

        <p className="section-subtitle label-2">Flavors For Royalty</p>

        <h2 className="headline-1 section-title">We Offer Top Notch</h2>

        <p className="section-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry lorem Ipsum has been the industry standard dummy text ever.
        </p>

        <ul className="grid-list">

          {/* Card 1 */}
          <li>
            <div className="service-card">
              <a href="#" className="has-before hover:shine">
                <figure
                  className="card-banner img-holder"
                  style={{ "--width": 285, "--height": 336 }}
                >
                  <img
                    src="/assets/images/service-1.jpg"
                    width="285"
                    height="336"
                    loading="lazy"
                    alt="Breakfast"
                    className="img-cover"
                  />
                </figure>
              </a>

              <div className="card-content">
                <h3 className="title-4 card-title">
                  <a href="#">Breakfast</a>
                </h3>
                <a href="#" className="btn-text hover-underline label-2">
                  View Menu
                </a>
              </div>
            </div>
          </li>

          {/* Card 2 */}
          <li>
            <div className="service-card">
              <a href="#" className="has-before hover:shine">
                <figure
                  className="card-banner img-holder"
                  style={{ "--width": 285, "--height": 336 }}
                >
                  <img
                    src="/assets/images/service-2.jpg"
                    width="285"
                    height="336"
                    loading="lazy"
                    alt="Appetizers"
                    className="img-cover"
                  />
                </figure>
              </a>

              <div className="card-content">
                <h3 className="title-4 card-title">
                  <a href="#">Appetizers</a>
                </h3>
                <a href="#" className="btn-text hover-underline label-2">
                  View Menu
                </a>
              </div>
            </div>
          </li>

          {/* Card 3 */}
          <li>
            <div className="service-card">
              <a href="#" className="has-before hover:shine">
                <figure
                  className="card-banner img-holder"
                  style={{ "--width": 285, "--height": 336 }}
                >
                  <img
                    src="/assets/images/service-3.jpg"
                    width="285"
                    height="336"
                    loading="lazy"
                    alt="Drinks"
                    className="img-cover"
                  />
                </figure>
              </a>

              <div className="card-content">
                <h3 className="title-4 card-title">
                  <a href="#">Drinks</a>
                </h3>
                <a href="#" className="btn-text hover-underline label-2">
                  View Menu
                </a>
              </div>
            </div>
          </li>

        </ul>

        <img
          src="/assets/images/shape-1.png"
          width="246"
          height="412"
          loading="lazy"
          alt="shape"
          className="shape shape-1 move-anim"
        />

        <img
          src="/assets/images/shape-2.png"
          width="343"
          height="345"
          loading="lazy"
          alt="shape"
          className="shape shape-2 move-anim"
        />

      </div>
    </section>
   </main>
     </article>
  );
};

export default Service;
