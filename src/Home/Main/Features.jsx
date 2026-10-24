import React from 'react'

function Features() {
  return (
    <div>
  {/* 
  - #FEATURES
*/}
 <article>
      <main>
  <section className="section features text-center" aria-label="features">
    <div className="container">
      <p className="section-subtitle label-2">Why Choose Us</p>
      <h2 className="headline-1 section-title">Our Strength</h2>
      <ul className="grid-list">
        <li className="feature-item">
          <div className="feature-card">
            <div className="card-icon">
              <img
                src="./assets/images/features-icon-1.png"
                width={100}
                height={80}
                loading="lazy"
                alt="icon"
              />
            </div>
            <h3 className="title-2 card-title">Hygienic Food</h3>
            <p className="label-1 card-text">
              Lorem Ipsum is simply dummy printing and typesetting.
            </p>
          </div>
        </li>
        <li className="feature-item">
          <div className="feature-card">
            <div className="card-icon">
              <img
                src="./assets/images/features-icon-2.png"
                width={100}
                height={80}
                loading="lazy"
                alt="icon"
              />
            </div>
            <h3 className="title-2 card-title">Fresh Environment</h3>
            <p className="label-1 card-text">
              Lorem Ipsum is simply dummy printing and typesetting.
            </p>
          </div>
        </li>
        <li className="feature-item">
          <div className="feature-card">
            <div className="card-icon">
              <img
                src="./assets/images/features-icon-3.png"
                width={100}
                height={80}
                loading="lazy"
                alt="icon"
              />
            </div>
            <h3 className="title-2 card-title">Skilled Chefs</h3>
            <p className="label-1 card-text">
              Lorem Ipsum is simply dummy printing and typesetting.
            </p>
          </div>
        </li>
        <li className="feature-item">
          <div className="feature-card">
            <div className="card-icon">
              <img
                src="./assets/images/features-icon-4.png"
                width={100}
                height={80}
                loading="lazy"
                alt="icon"
              />
            </div>
            <h3 className="title-2 card-title">Event &amp; Party</h3>
            <p className="label-1 card-text">
              Lorem Ipsum is simply dummy printing and typesetting.
            </p>
          </div>
        </li>
      </ul>
      <img
        src="./assets/images/shape-7.png"
        width={208}
        height={178}
        loading="lazy"
        alt="shape"
        className="shape shape-1"
      />
      <img
        src="./assets/images/shape-8.png"
        width={120}
        height={115}
        loading="lazy"
        alt="shape"
        className="shape shape-2"
      />
    </div>
  </section>
</main>
     </article>

    </div>
  )
}

export default Features