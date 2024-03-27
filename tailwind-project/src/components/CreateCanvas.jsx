import React from "react";
import SideBar from "./SideBar";
import TopNavigation from "./TopNavigation";
import Library from "./Library";
import Scene from "./Scene";


function CreateCanvas() {
    return (
        <div className="flex h-screen content-container">
          <script src="https://cdn.babylonjs.com/viewer/babylon.viewer.js"></script>
            <SideBar />
            <div className="flex flex-col flex-1">
                <TopNavigation />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pl-20 h-full">
                    <div className="hidden md:block md:col-span-1 h-full flex flex-col">
                        <Library className="flex-1"/>
                    </div>
                    <div className="md:col-span-2  h-full flex flex-col">
                        <div className=" bg-white text-center flex-1 border border-full border-black rounded-md h-full">
                          <h3> Design Canvas </h3>
                          <Scene />  
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCanvas;