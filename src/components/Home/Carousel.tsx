import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import left from "../../assets/left.png?w=100&format=webp";
import right from "../../assets/right.png?w=100&format=webp";
import center from "./center.png?w=600&format=webp";
import east from "./east.png?w=600&format=webp";
import north from "./north.png?w=600&format=webp";
import south from "./south.png?w=600&format=webp";
const Carousal: React.FC = () => {
  const localImages = [north, center, south, east];
  const [slideDirection, setSlideDirection] = useState("right");
  const imageRoutes: { [key: string]: string } = {
    "/north.png": "/north",
    "/center.png": "/center",
    "/south.png": "/south",
    "/east.png": "/east",
  };
  const images = [
    {
      image: north,
      url: "/north",
    },
    {
      image: center,
      url: "/center",
    },
    {
      image: south,
      url: "/south.png",
    },
    {
      image: east,
      url: "/east.png",
    }
  ]
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const handlePrev = () => {
    setSlideDirection("right");
    setActiveCampaignIndex((prev) =>
      prev === 0 ? localImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setSlideDirection("left");
    setActiveCampaignIndex((prev) =>
      prev === localImages.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setActiveCampaignIndex((prev) =>
        prev === localImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div className="relative flex h-auto cursor-pointer  items-center justify-center">
        <button className="absolute left-[-100px] h-full" onClick={handlePrev}>
          <img src={left} className="h-full w-full" />
        </button>

        <Link to={imageRoutes[localImages[activeCampaignIndex]]}>
          {localImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt="Campaign Image"
              className={`w-full object-cover  ${
                index === activeCampaignIndex
                  ? slideDirection === "right"
                    ? "slide-in-left"
                    : "slide-in-right"
                  : "slide-out"
              }`}
              style={{
                display: index === activeCampaignIndex ? "block" : "none",
              }}
            />
          ))}
        </Link>

        <button className="absolute right-[-100px] h-full" onClick={handleNext}>
          <img src={right} className="h-full w-full" />
        </button>
      </div>
    </div>
  );
};

export default Carousal;
