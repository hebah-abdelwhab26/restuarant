import { useState, useEffect } from "react";
import "./HeroSlider.css"; 

const slides = [
  {
    img: "./assets/images/hero-slider-1.jpg",
    subtitle: "Tradational & Hygine",
    title: "For the love of\ndelicious food",
    text: "Come with family & feel the joy of mouthwatering food",
  },
  {
    img: "./assets/images/hero-slider-2.jpg",
    subtitle: "delightful experience",
    title: "Flavors Inspired by\nthe Seasons",
    text: "Come with family & feel the joy of mouthwatering food",
  },
  {
    img: "./assets/images/hero-slider-3.jpg",
    subtitle: "amazing & delicious",
    title: "Where every flavor\ntells a story",
    text: "Come with family & feel the joy of mouthwatering food",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="hero text-center" aria-label="home" id="home">
      <ul className="hero-slider">
        {slides.map((slide, index) => (
          <li
            key={index}
            className={`slider-item ${index === current ? "active" : ""}`}
          >
            <div className="slider-bg">
              <img
                src={slide.img}
                width={1880}
                height={950}
                alt=""
                className="img-cover"
              />
            </div>
            <p className="label-2 section-subtitle">{slide.subtitle}</p>
            <h1 className="display-1 hero-title">
              {slide.title.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h1>
            <p className="body-2 hero-text">{slide.text}</p>
            <a href="#" className="btn btn-primary">
              <span className="text text-1">View Our Menu</span>
              <span className="text text-2" aria-hidden="true">
                View Our Menu
              </span>
            </a>
          </li>
        ))}
      </ul>

      <button className="slider-btn prev" onClick={prevSlide}>
        <ion-icon name="chevron-back"></ion-icon>
      </button>

      <button className="slider-btn next" onClick={nextSlide}>
        <ion-icon name="chevron-forward"></ion-icon>
      </button>

      <a href="#" className="hero-btn has-after">
        <img
          src="./assets/images/hero-icon.png"
          width={48}
          height={48}
          alt="booking icon"
        />
        <span className="label-2 text-center span">Book A Table</span>
      </a>
    </section>
  );
}

