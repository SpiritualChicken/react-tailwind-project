import React from 'react';

function PreviewImages({ images, onDelete, onSelect }) {
    return (
        <div>
            {images.map((image, index) => (
                <div key={index} className="flex items-center mb-2">
                    <img 
                        src={image} 
                        alt={`tattoo-${index}`} 
                        className="w-16 h-16 mr-2 cursor-pointer" 
                        onClick={() => onSelect(index)} 
                    />
                    <button onClick={() => onDelete(index)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </div>
            ))}
        </div>
    );
}

export default PreviewImages;
