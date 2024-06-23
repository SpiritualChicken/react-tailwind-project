import React from 'react';

function PreviewImages({ images, onDelete, onSelect, selectedImageIndex }) {
    return (
        <div>
            {images.map((image, index) => (
                <div 
                    key={index} 
                    className={`flex items-center m-3 p-2 border ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'} rounded-lg`}
                >
                    <img 
                        src={image} 
                        alt={`tattoo-${index}`} 
                        className="w-16 h-16 mr-2 cursor-pointer" 
                        onClick={() => onSelect(index)} 
                    />
                    <button 
                        onClick={() => onDelete(index)} 
                        className="bg-rose-500 text-white px-2 py-1 rounded"
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    );
}

export default PreviewImages;