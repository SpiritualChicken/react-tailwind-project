import React from "react";

function PreviewImages({ images, onDelete }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            {images.map((image, index) => (
                <div key={index} className="relative">
                    <img src={image} alt={`Tattoo ${index}`} className="rounded-md" style={{ width: '100px', height: '100px' }} />
                    <button onClick={() => onDelete(index)} className="absolute top-0 right-0 px-1 bg-red-500 text-white text-xs rounded-md">X</button>
                    <span className="absolute bottom-0 left-0 px-1 bg-black text-white text-xs rounded-md">Tattoo {index + 1}</span>
                </div>
            ))}
        </div>
    );
}

export default PreviewImages;