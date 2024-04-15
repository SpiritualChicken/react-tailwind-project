import React, { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import TopNavigation from './TopNavigation';
import '@babylonjs/loaders';
import PreviewImages from './PreviewImages';

function CreateCanvas() {
    const [tattooTextures, setTattooTextures] = useState([]);
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const sceneRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const pickedDecalRef = useRef(null);

    function handleFileUpload(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newTextures = Array.from(files).map(file => URL.createObjectURL(file));
            setTattooTextures([...tattooTextures, ...newTextures]);
            setImageLoaded(true);
        }
    }

    function handleDelete(index) {
        const updatedTextures = [...tattooTextures];
        updatedTextures.splice(index, 1);
        setTattooTextures(updatedTextures);
    }

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize the engine and scene if they haven't been already
        if (!engineRef.current) {
            engineRef.current = new BABYLON.Engine(canvasRef.current, true);
        }
        if (!sceneRef.current) {
            sceneRef.current = new BABYLON.Scene(engineRef.current);
            const camera = new BABYLON.ArcRotateCamera("Camera", 1, Math.PI / 2, 7, BABYLON.Vector3.Zero(), sceneRef.current);
            camera.attachControl(canvasRef.current, true);
            new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), sceneRef.current);
        }
    
        // Load the model and apply tattoos
        (async () => {
            try {
                const humanoid = await createHumanoidModel(sceneRef.current);
                applyTattoosToModel(humanoid, tattooTextures);
            } catch (error) {
                console.error("Error loading humanoid model:", error);
            }
        })();

        engineRef.current.runRenderLoop(() => {
            if (sceneRef.current) {
                sceneRef.current.render();
            }
        });

        // Handling mouse events for decal interaction
        const onPointerDown = (evt) => {
            if (evt.button !== 0) return; // Only proceed for left click
            let pickInfo = sceneRef.current.pick(sceneRef.current.pointerX, sceneRef.current.pointerY);
            if (pickInfo.hit && pickInfo.pickedMesh.name.includes("decal")) {
                pickedDecalRef.current = pickInfo.pickedMesh;
                sceneRef.current.activeCamera.detachControl(canvasRef.current);
            }
        };
    
        // Pointer move event to update the decal position
        const onPointerMove = (evt) => {
            if (pickedDecalRef.current) {
                let pickInfo = sceneRef.current.pick(sceneRef.current.pointerX, sceneRef.current.pointerY, (mesh) => {
                    return mesh !== pickedDecalRef.current; // Ensure we pick other meshes, not the decal itself
                });
                if (pickInfo.hit) {
                    // Calculate the correct position on the model's surface
                    let normal = pickInfo.getNormal(true, true);
                    let position = pickInfo.pickedPoint;
    
                    if (position && normal) {
                        pickedDecalRef.current.position = position;
                        pickedDecalRef.current.setDirection(normal.scale(-1)); // Orient the decal correctly based on the surface normal
                    }
                }
            }
        };
    
        // Pointer up event to finalize the decal movement
        const onPointerUp = (evt) => {
            if (pickedDecalRef.current) {
                sceneRef.current.activeCamera.attachControl(canvasRef.current, true);
                pickedDecalRef.current = null;
            }
        };
    
        // Add event listeners
        canvasRef.current.addEventListener("pointerdown", onPointerDown);
        canvasRef.current.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    
        // Cleanup
        return () => {
            canvasRef.current.removeEventListener("pointerdown", onPointerDown);
            canvasRef.current.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
        };
    }, [tattooTextures]);
    function applyTattoosToModel(mesh, textures) {
        if (!sceneRef.current || textures.length === 0) return;
        
        textures.forEach((textureURL, index) => {
            const scene = sceneRef.current;
            const dynamicTexture = new BABYLON.DynamicTexture(`dynamicTattoo${index}`, 512, scene, false);
            dynamicTexture.hasAlpha = true;
            const context = dynamicTexture.getContext();

            const image = new Image();
            image.onload = () => {
                context.drawImage(image, 0, 0, 512, 512);
                dynamicTexture.update();
            };
            image.src = textureURL;

            const decalMaterial = new BABYLON.StandardMaterial(`decalMat${index}`, scene);
            decalMaterial.diffuseTexture = dynamicTexture;
            decalMaterial.zOffset = -2;

            const decalSize = new BABYLON.Vector3(1, 1, 1); // Adjust size as needed
            const decal = BABYLON.MeshBuilder.CreateDecal("decal" + index, mesh, {
                position: new BABYLON.Vector3(0, 0, 0.1 * index),
                normal: new BABYLON.Vector3(0, 0, 1),
                size: decalSize,
                angle: 0
            });
            decal.material = decalMaterial;
        });
    }

    function createHumanoidModel(scene) {
        // Define the model path
        const modelPath = '././public/assets/LeftArm.glb';
    
        // Return a new promise
        return new Promise((resolve, reject) => {
            // Use SceneLoader to import the mesh
            BABYLON.SceneLoader.ImportMesh("", modelPath, "", scene, (newMeshes) => {
                // Assuming the first mesh is the humanoid model you're interested in
                const humanoid = newMeshes[0];
                if (humanoid) {
                    // Adjust position or any other properties as needed
                    humanoid.position.y = 1;
    
                    // Resolve the promise with the loaded humanoid mesh
                    resolve(humanoid);
                } else {
                    // If no meshes were loaded, reject the promise
                    reject(new Error("Failed to load the humanoid model"));
                }
            });
        });
    }

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
                    </div>
                    <div className="md:col-span-2 flex flex-col">
                        <canvas ref={canvasRef} id="renderCanvas" className='rounded-md' style={{ width: '100%', height: '100%' }}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCanvas;