import React from 'react'

const Reservation = () => {
  return (
     <article>
      <main>
    <section id='reserv' className="reservation">
      <div className="container">

        <div className="form reservation-form bg-black-10">

          {/* Left Form */}
          <form className="form-left">

            <h2 className="headline-1 text-center">
              Online Reservation
            </h2>

            <p className="form-text text-center">
              Booking request{" "}
              <a href="tel:+88123123456" className="link">
                +88-123-123456
              </a>{" "}
              or fill out the order form
            </p>

            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                autoComplete="off"
                className="input-field"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                autoComplete="off"
                className="input-field"
              />
            </div>

            <div className="input-wrapper">

              <div className="icon-wrapper">
                <ion-icon name="person-outline" aria-hidden="true"></ion-icon>

                <select name="person" className="input-field">
                  <option value="1">1 Person</option>
                  <option value="2">2 Person</option>
                  <option value="3">3 Person</option>
                  <option value="4">4 Person</option>
                  <option value="5">5 Person</option>
                  <option value="6">6 Person</option>
                  <option value="7">7 Person</option>
                </select>

                <ion-icon name="chevron-down" aria-hidden="true"></ion-icon>
              </div>

              <div className="icon-wrapper">
                <ion-icon name="calendar-clear-outline" aria-hidden="true"></ion-icon>

                <input
                  type="date"
                  name="reservation-date"
                  className="input-field"
                />

                <ion-icon name="chevron-down" aria-hidden="true"></ion-icon>
              </div>

              <div className="icon-wrapper">
                <ion-icon name="time-outline" aria-hidden="true"></ion-icon>

                <select name="time" className="input-field">
                  <option value="08:00">08 : 00 am</option>
                  <option value="09:00">09 : 00 am</option>
                  <option value="10:00">10 : 00 am</option>
                  <option value="11:00">11 : 00 am</option>
                  <option value="12:00">12 : 00 am</option>
                  <option value="13:00">01 : 00 pm</option>
                  <option value="14:00">02 : 00 pm</option>
                  <option value="15:00">03 : 00 pm</option>
                  <option value="16:00">04 : 00 pm</option>
                  <option value="17:00">05 : 00 pm</option>
                  <option value="18:00">06 : 00 pm</option>
                  <option value="19:00">07 : 00 pm</option>
                  <option value="20:00">08 : 00 pm</option>
                  <option value="21:00">09 : 00 pm</option>
                  <option value="22:00">10 : 00 pm</option>
                </select>

                <ion-icon name="chevron-down" aria-hidden="true"></ion-icon>
              </div>

            </div>

            <textarea
              name="message"
              placeholder="Message"
              autoComplete="off"
              className="input-field"
            ></textarea>

            <button type="submit" className="btn btn-secondary">
              <span className="text text-1">Book A Table</span>
              <span className="text text-2" aria-hidden="true">
                Book A Table
              </span>
            </button>

          </form>

          {/* Right Info */}
          <div id='contact'
            className="form-right text-center"
            style={{
              backgroundImage:
                "url('/assets/images/form-pattern.png')",
                textAlign:"center"
            }}
          >
            <h2 className="headline-1 text-center">
              Contact Us
            </h2>

            <p className="contact-label">Booking Request</p>

            <a
              href="tel:+88123123456"
              className="body-1 contact-number hover-underline"
            >
              +88-123-123456
            </a>

            <div className="separator"></div>

            <p className="contact-label">Location</p>

            <address className="body-4">
              Restaurant St, Delicious City,
              <br />
              London 9578, UK
            </address>

            <p className="contact-label">Lunch Time</p>

            <p className="body-4">
              Monday to Sunday
              <br />
              11.00 am - 2.30pm
            </p>

            <p className="contact-label">Dinner Time</p>

            <p className="body-4">
              Monday to Sunday
              <br />
              05.00 pm - 10.00pm
            </p>

          </div>

        </div>

      </div>
    </section>
    </main>
     </article>
  );
};

export default Reservation;
