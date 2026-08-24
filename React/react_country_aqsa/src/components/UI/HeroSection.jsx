import { FaLongArrowAltRight } from "react-icons/fa";

export const HeroSection = () => {
  return (
    <main className="hero-section main">
      <div className="container grid grid-two-cols">
        <div className="hero-content">
          <h1 className="heading-xl">
              Explore Pakistan and the World Around It.
          </h1>
          <p className="paragraph">
            Discover Pakistan's rich history, culture, and beauty — from the
            mountains of the north to the coast of Karachi. Sort, search, and
            filter through countries to find the details you need.
          </p>
          <button className="btn btn-darken btn-inline bg-white-box">
            Start Exploring <FaLongArrowAltRight />
          </button>
        </div>
        <div className="hero-image">
          <img
            src="/images/world.png"
            alt="Pakistan and the world"
            className="banner-image"
          />
        </div>
      </div>
    </main>
  );
};
