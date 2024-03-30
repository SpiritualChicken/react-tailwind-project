import React from "react";
import placeHolderImg from "../assets/Placeholder.jpg"; 
 


function Library ()  {
    return (
        <div className="text-center border border-solid border-black h-full rounded-md bg-white">
            <h1>Tattoo Library</h1>
            <div className="mt-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-2 py-1 border border-solid border-grey-300 rounded-md"
                />
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 px-2 pt-2">
                {[...Array(10)].map((_, index) => ( // Loop to create 10 images
                    <img key={index} className="rounder-md" src={placeHolderImg} width="full" loading="lazy" alt={`Image ${index + 1}`} />
                ))}
            </div>
        </div>
    )
}

export default Library;