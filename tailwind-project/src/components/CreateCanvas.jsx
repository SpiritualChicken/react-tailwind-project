import React from "react";
import SideBar from "./SideBar";
import TopNavigation from "./TopNavigation";

function CreateCanvas() {
    return (
      
      <div className='flex'>
        <SideBar />
        <div className='content-container' >
        <TopNavigation />
        {/* insert tatto library */}
        {/* insert design canvas */}
        </div>
      </div>
    );
  }
  
  export default CreateCanvas;