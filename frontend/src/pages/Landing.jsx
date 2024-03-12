import React from "react";
import bgImg from "./bg.png";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div
      style={{ backgroundImage: `url(${bgImg})` }}
      className="w-screen h-screen flex justify-center items-center bg-center bg-no-repeat bg-cover"
    >
      <div className=" p-6 rounded-xl">
        <div className="text-center text-main-yellow">
          <h1 className="drop-shadow-xl text-9xl century-gothic font-extrabold mx-8 my-4 mt-">
            SentiMetry
          </h1>
          <h2 className="drop-shadow-xl linden-hill-regular text-2xl text-white">
            Navigate Your Inner Landscape, One Entry at a Time
          </h2>
        </div>

        <div className="px-20">
          <Login />
        </div>
      </div>
    </div>
  );
}
