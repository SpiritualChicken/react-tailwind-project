import React, { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { AdvancedDynamicTexture } from '@babylonjs/gui';
import TopNavigation from './TopNavigation';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ/objFileLoader';
import PreviewImages from './PreviewImages';
import { debounce } from 'lodash'; // Import debounce from lodash

function CreateCanvas() {
    const [tattooTextures, setTattooTextures] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imagePositions, setImagePositions] = useState([]);
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const sceneRef = useRef(null);
    const dynamicTextureRef = useRef(null);

    function handleFileUpload(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newTextures = Array.from(files).map(file => URL.createObjectURL(file));
            setTattooTextures([...tattooTextures, ...newTextures]);
            setImagePositions([...imagePositions, ...newTextures.map(() => ({ x: 0, y: 0 }))]);
        }
    }

    function handleDelete(index) {
        const updatedTextures = [...tattooTextures];
        updatedTextures.splice(index, 1);
        setTattooTextures(updatedTextures);

        const updatedPositions = [...imagePositions];
        updatedPositions.splice(index, 1);
        setImagePositions(updatedPositions);
    }

    useEffect(() => {
        if (!canvasRef.current) return;

        const initializeBabylon = async () => {
            if (!engineRef.current) {
                engineRef.current = new BABYLON.Engine(canvasRef.current, true);
            }
            if (!sceneRef.current) {
                sceneRef.current = new BABYLON.Scene(engineRef.current);
                const camera = new BABYLON.ArcRotateCamera("Camera", 2, Math.PI / 2, 80, BABYLON.Vector3.Zero(), sceneRef.current);
                camera.attachControl(canvasRef.current, true);
                new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), sceneRef.current);

                dynamicTextureRef.current = new BABYLON.DynamicTexture("dynamicTexture", { width: 1024, height: 1024 }, sceneRef.current);
                dynamicTextureRef.current.hasAlpha = true; // Enable alpha
            }

            try {
                const humanoid = await createHumanoidModel(sceneRef.current);
                applyTattoosToModel(humanoid, tattooTextures, imagePositions);
            } catch (error) {
                console.error("Error loading humanoid model:", error);
            }

            engineRef.current.runRenderLoop(() => {
                if (sceneRef.current) {
                    sceneRef.current.render();
                }
            });

            const handleResize = () => {
                if (engineRef.current) {
                    engineRef.current.resize();
                }
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                if (engineRef.current) {
                    engineRef.current.stopRenderLoop();
                    engineRef.current.dispose();
                }
            };
        };

        initializeBabylon();
    }, [tattooTextures, imagePositions]);

    const applyTattoosToModel = debounce((mesh, textures, positions) => {
        if (!sceneRef.current || textures.length === 0) return;

        const context = dynamicTextureRef.current.getContext();
        context.clearRect(0, 0, 1024, 1024);

        textures.forEach((textureURL, index) => {
            const image = new Image();
            image.onload = () => {
                const { x, y } = positions[index];
                context.clearRect(x, y, 256, 256); // Clear the area where the image will be drawn
                context.drawImage(image, x, y, 256, 256); // Adjust size as needed
                dynamicTextureRef.current.update();
            };
            image.src = textureURL;
        });

        const material = new BABYLON.StandardMaterial("material", sceneRef.current);
        material.diffuseTexture = dynamicTextureRef.current;
        material.backFaceCulling = false;
        material.alpha = 1.0;
        mesh.material = material;
    }, 200); // Debounce with a 200ms delay

    function createHumanoidModel(scene) {
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("", 'assets/', "Arm_Right_Vertical.obj", scene, (newMeshes) => {
                if (newMeshes.length > 0) {
                    resolve(newMeshes[0]); // Resolve with the first mesh
                } else {
                    reject("No meshes were loaded");
                }
            });
        });
    }

    const handleSliderChange = (axis, value) => {
        const updatedPositions = [...imagePositions];
        updatedPositions[selectedImageIndex][axis] = value;
        setImagePositions(updatedPositions);
        applyTattoosToModel(sceneRef.current.meshes[0], tattooTextures, updatedPositions); // Update the model with new positions
    };

    return (
        <div className="flex h-screen">
            <div className="flex flex-col flex-1">
                <TopNavigation />
                <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-3 gap-4 p-4 pl-20 h-full">
                    <div className="md:block md:col-span-1 h-full flex flex-col">
                        <div className='canvas-side-elements mb-4'>
                            <h1>Upload</h1>
                            <input type="file" className='pt-2' onChange={handleFileUpload} multiple />
                        </div>
                        <div className='canvas-side-elements'>
                            <h1>Layers</h1>
                            <PreviewImages images={tattooTextures} onDelete={handleDelete} />
                        </div>
                        <div className='canvas-side-elements'>
                            <h2>Adjust Image Position</h2>
                            <div>
                                <label>X Position:</label>
                                <input 
                                    type="range" 
                                    min="-512" 
                                    max="512" 
                                    value={imagePositions[selectedImageIndex]?.x || 0} 
                                    onChange={(e) => handleSliderChange('x', parseInt(e.target.value))} 
                                />
                            </div>
                            <div>
                                <label>Y Position:</label>
                                <input 
                                    type="range" 
                                    min="-512" 
                                    max="512" 
                                    value={imagePositions[selectedImageIndex]?.y || 0} 
                                    onChange={(e) => handleSliderChange('y', parseInt(e.target.value))} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                        <canvas ref={canvasRef} id="renderCanvas" className='rounded-md' style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCanvas;
