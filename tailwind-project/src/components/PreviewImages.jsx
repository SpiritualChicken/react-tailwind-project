import React from 'react';

function PreviewImages({ images, onDelete, onSelect, selectedImageIndex }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
                <div 
                    key={index} 
                    className={`relative border ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'} rounded-lg p-2 cursor-pointer`}
                    onClick={() => onSelect(index)}
                >
                    <img 
                        src={image} 
                        alt={`tattoo-${index}`} 
                        className="w-full h-16 object-cover rounded" 
                    />
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(index);
                        }} 
                        className="absolute top-1 right-1 bg-rose-500 text-white px-2 py-1 rounded"
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    );
}

export default PreviewImages;