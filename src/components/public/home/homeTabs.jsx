/* eslint-disable react/prop-types */
import { useState } from "react";
import "./home.css";
import { saveScrollPosition } from "../../../utils/scrollPage";
import { useHomeTabContext } from "../../../contexts/homeTabContext";

const HomeTabs = () => {
  const { selectedTab, setSelectedTab} =useHomeTabContext() 
  
  return (
    <div className="text-white border-b border-y-[#4B5563] flex justify-between px-6 mt-3 w-full">
      <h2
        onClick={() => {
          saveScrollPosition('home-trending')
          setSelectedTab("all")
        }}
        className={`
          font-openSans       
          ${selectedTab === "all" ? "hometab border-y-[#f33f5e]" : "hometab border-transparent"}        
        `
        }
      >
        All
      </h2>
      <h2
        onClick={() => {
          setSelectedTab("trending");
        }}
        className={`
          font-openSans
          ${selectedTab === "trending"? "hometab border-y-[#f33f5e]": "hometab border-transparent"}
        `
        }
      >
        Trending
      </h2>
    </div>
  );

  // return (
  //   <div className='flex justify-between px-6 pt-4 ' >
  //     <p>All</p>
  //     <p>Trending</p>

  //   </div>
  //);
};

export default HomeTabs;
