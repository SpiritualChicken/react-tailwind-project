import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ/objFileLoader';
import TopNavigation from './TopNavigation';
import PreviewImages from './PreviewImages';
import { FaCloudUploadAlt } from "react-icons/fa";

function CreateCanvas() {
    const [tattooTextures, setTattooTextures] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imagePositions, setImagePositions] = useState([]);
    const [imageRotations, setImageRotations] = useState([]);
    const [imageScales, setImageScales] = useState([]);
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const sceneRef = useRef(null);
    const dynamicTextureRef = useRef(null);
    const humanoidRef = useRef(null);

    const handleFileUpload = useCallback((event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newTextures = Array.from(files).map(file => URL.createObjectURL(file));
            setTattooTextures(prevTextures => [...prevTextures, ...newTextures]);
            setImagePositions(prevPositions => [...prevPositions, ...newTextures.map(() => ({ x: 300, y: 500 }))]);
            setImageRotations(prevRotations => [...prevRotations, ...newTextures.map(() => 0)]);
            setImageScales(prevScales => [...prevScales, ...newTextures.map(() => 1)]);
        }
    }, []);

    const handleDelete = useCallback((index) => {
        setTattooTextures(prevTextures => prevTextures.filter((_, i) => i !== index));
        setImagePositions(prevPositions => prevPositions.filter((_, i) => i !== index));
        setImageRotations(prevRotations => prevRotations.filter((_, i) => i !== index));
        setImageScales(prevScales => prevScales.filter((_, i) => i !== index));
    }, []);

    const handleSelect = useCallback((index) => {
        setSelectedImageIndex(index);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;

        const initializeBabylon = async () => {
            if (!engineRef.current) {
                engineRef.current = new BABYLON.Engine(canvasRef.current, true);
            }
            if (!sceneRef.current) {
                sceneRef.current = new BABYLON.Scene(engineRef.current);
                const camera = new BABYLON.ArcRotateCamera("Camera", 2, Math.PI / 2, 100, BABYLON.Vector3.Zero(), sceneRef.current);
                camera.attachControl(canvasRef.current, true);
                new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), sceneRef.current);

                dynamicTextureRef.current = new BABYLON.DynamicTexture("dynamicTexture", { width: 1024, height: 1024 }, sceneRef.current);
                dynamicTextureRef.current.hasAlpha = true; // Enable alpha
            }

            if (!humanoidRef.current) {
                try {
                    humanoidRef.current = await createHumanoidModel(sceneRef.current);
                } catch (error) {
                    console.error("Error loading humanoid model:", error);
                }
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
    }, []);

    useEffect(() => {
        if (humanoidRef.current) {
            applyTattoosToModel(humanoidRef.current, tattooTextures, imagePositions, imageRotations, imageScales);
        }
    }, [tattooTextures, imagePositions, imageRotations, imageScales]);

    const applyTattoosToModel = useCallback((mesh, textures, positions, rotations, scales) => {
        if (!sceneRef.current || textures.length === 0) return;

        const context = dynamicTextureRef.current.getContext();
        context.clearRect(0, 0, 1024, 1024);

        textures.forEach((textureURL, index) => {
            const image = new Image();
            image.onload = () => {
                const { x, y } = positions[index];
                const rotation = rotations[index];
                const scale = scales[index];
                context.save();
                context.translate(x + 128, y + 128); // Center the image
                context.rotate((rotation * Math.PI) / 180);
                context.scale(scale, scale);
                context.drawImage(image, -128, -128, 256, 256); // Adjust size as needed
                context.restore();
                dynamicTextureRef.current.update();
            };
            image.src = textureURL;
        });

        const material = new BABYLON.StandardMaterial("material", sceneRef.current);
        material.diffuseTexture = dynamicTextureRef.current;
        material.backFaceCulling = false;
        material.alpha = 1.0;
        mesh.material = material;
    }, []);

    const createHumanoidModel = useCallback((scene) => {
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("", 'assets/', "Arm_Right_Vertical.obj", scene, (newMeshes) => {
                if (newMeshes.length > 0) {
                    resolve(newMeshes[0]); // Resolve with the first mesh
                } else {
                    reject("No meshes were loaded");
                }
            });
        });
    }, []);

    const handleSliderChange = useCallback((index, axis, value) => {
        setImagePositions(prevPositions => {
            const updatedPositions = [...prevPositions];
            updatedPositions[index][axis] = value;
            return updatedPositions;
        });
    }, []);

    const handleRotationChange = useCallback((index, value) => {
        setImageRotations(prevRotations => {
            const updatedRotations = [...prevRotations];
            updatedRotations[index] = value;
            return updatedRotations;
        });
    }, []);

    const handleScaleChange = useCallback((index, value) => {
        setImageScales(prevScales => {
            const updatedScales = [...prevScales];
            updatedScales[index] = value;
            return updatedScales;
        });
    }, []);

    return (
        <div className="flex h-screen">
            <div className="flex flex-col flex-1">
                <TopNavigation />
                <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-3 gap-4 p-4 pl-20 h-full">
                    <div className="md:block md:col-span-1 h-full flex flex-col">
                        <div className='border rounded-lg border-dashed border-black text-center mb-4 bg-slate-100 '>
                            <label className='w-5 h-3 text-center border-r-1 border-dashed'>
                                <input type="file" accept='image/*' className='pt-2' onChange={handleFileUpload} multiple hidden />
                                <div className='w-full h-full rounded-md border-dashed border-black items-center p-5'>
                                    <FaCloudUploadAlt size={70} className='upload-icon item w-full mt-3' />
                                    <p className='mt-2'>Drag and drop or Click here <br/> to upload an image</p> 
                                    <span className="block text-sm mt-2 text-slate-600">Upload any image from desktop</span>
                                </div>
                            </label>
                        </div>
                        <div className='canvas-side-elements mb-4'>
                            <h2>Control Panel</h2>
                            <div>
                                <label>X Position:</label>
                                <input 
                                    type="range" 
                                    min="-1000" 
                                    max="1000" 
                                    value={imagePositions[selectedImageIndex]?.x || 0} 
                                    onChange={(e) => handleSliderChange(selectedImageIndex, 'x', parseInt(e.target.value))} 
                                />
                            </div>
                            <div>
                                <label>Y Position:</label>
                                <input 
                                    type="range" 
                                    min="-1000" 
                                    max="1000" 
                                    value={imagePositions[selectedImageIndex]?.y || 0} 
                                    onChange={(e) => handleSliderChange(selectedImageIndex, 'y', parseInt(e.target.value))} 
                                />
                            </div>
                            <div>
                                <label>Rotate:</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="360" 
                                    value={imageRotations[selectedImageIndex] || 0} 
                                    onChange={(e) => handleRotationChange(selectedImageIndex, parseInt(e.target.value))} 
                                />
                            </div>
                            <div>
                                <label>Scale:</label>
                                <input 
                                    type="range" 
                                    min="0.1" 
                                    max="5" 
                                    step="0.1" 
                                    value={imageScales[selectedImageIndex] || 1} 
                                    onChange={(e) => handleScaleChange(selectedImageIndex, parseFloat(e.target.value))} 
                                />
                            </div>
                        </div>
                        <div className='canvas-side-elements'>
                            <h1>Layers</h1>
                            <PreviewImages images={tattooTextures} onDelete={handleDelete} onSelect={handleSelect} />
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
