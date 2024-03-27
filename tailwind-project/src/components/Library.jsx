import React from "react";

function Library ()  {
    return (
        <div className="text-center border border-solid border-black h-full rounded-md bg-white">
            <script src="https://cdn.babylonjs.com/viewer/babylon.viewer.js"></script>
            <h1>Tattoo Library</h1>
            <div className="mt-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-2 py-1 border border-solid border-grey-300 rounded-md"
                />
            </div>
        </div>
    )
}

export default Library;