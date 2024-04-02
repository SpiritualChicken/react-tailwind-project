import React, { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import TopNavigation from './TopNavigation';
import PreviewImages from './PreviewImages';

function CreateCanvas() {
    const [tattooTextures, setTattooTextures] = useState([]);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    

    // Function to handle file upload
    function handleFileUpload(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newTextures = Array.from(files).map(file => {
                return URL.createObjectURL(file);
            });
            setTattooTextures([...tattooTextures, ...newTextures]);
            setImageLoaded(true);
        }
    }

    function handleDelete(index) {
        const updatedTextures = [...tattooTextures];
        updatedTextures.splice(index, 1);
        setTattooTextures(updatedTextures);
    }

    // Function to create 3D scene
    function renderScene() {
        // Create Babylon.js scene and add 3D model
        const canvas = document.getElementById('renderCanvas');
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 7, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        const humanoid = createHumanoidModel(scene); // Function to create humanoid model
        engine.runRenderLoop(() => {
            scene.render();
        });
        window.addEventListener("resize", () => {
            engine.resize();
        });

        // Apply tattoo textures to the model if loaded
        if (imageLoaded && tattooTextures.length > 0) {
            applyTattoosToModel(scene, humanoid, tattooTextures);
        }

        // Add event listeners for mouse movements
        canvas.addEventListener('mousemove', handleMouseMove);
    }

    // Function to handle mouse move events
    function handleMouseMove(event) {
        const canvas = document.getElementById('renderCanvas');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePosition({ x, y });
    }

    // Function to apply the tattoo textures to the 3D model
    function applyTattoosToModel(scene, mesh, textures) {
        mesh.material = new BABYLON.MultiMaterial("multiMat", scene);
        textures.forEach((texture, index) => {
            const material = new BABYLON.StandardMaterial("tattooMaterial" + index, scene);
            material.diffuseTexture = new BABYLON.Texture(texture, scene);
            mesh.material.subMaterials.push(material);
        });

        // Update texture position based on mouse position
        mesh.material.subMaterials.forEach(material => {
            material.diffuseTexture.uOffset = mousePosition.x / scene.getEngine().getRenderWidth();
            material.diffuseTexture.vOffset = mousePosition.y / scene.getEngine().getRenderHeight();
        });
    }

    // Function to create 3D humanoid model
    function createHumanoidModel(scene) {
        // Create body
        const body = BABYLON.MeshBuilder.CreateCylinder("body", { diameterTop: 0.5, diameterBottom: 0.5, height: 2 }, scene);

        // Create head
        const head = BABYLON.MeshBuilder.CreateSphere("head", { diameter: 0.6 }, scene);
        head.position.y = 1.5;

        // Create arms
        const leftArm = BABYLON.MeshBuilder.CreateCylinder("leftArm", { diameterTop: 0.2, diameterBottom: 0.2, height: 1 }, scene);
        leftArm.position.x = -0.7;
        leftArm.position.y = 0.5;
        leftArm.rotation.z = Math.PI / 4;

        const rightArm = BABYLON.MeshBuilder.CreateCylinder("rightArm", { diameterTop: 0.2, diameterBottom: 0.2, height: 1 }, scene);
        rightArm.position.x = 0.7;
        rightArm.position.y = 0.5;
        rightArm.rotation.z = -Math.PI / 4;

        // Create legs
        const leftLeg = BABYLON.MeshBuilder.CreateCylinder("leftLeg", { diameterTop: 0.3, diameterBottom: 0.3, height: 1 }, scene);
        leftLeg.position.x = -0.3;
        leftLeg.position.y = -1;

        const rightLeg = BABYLON.MeshBuilder.CreateCylinder("rightLeg", { diameterTop: 0.3, diameterBottom: 0.3, height: 1 }, scene);
        rightLeg.position.x = 0.3;
        rightLeg.position.y = -1;

        // Group all parts together
        const humanoid = BABYLON.Mesh.MergeMeshes([body, head, leftArm, rightArm, leftLeg, rightLeg]);

        return humanoid;
    }
    

    // Render Babylon.js scene when component mounts
    useEffect(() => {
        renderScene();

        return () => {
            // Cleanup event listeners when component unmounts
            const canvas = document.getElementById('renderCanvas');
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Render Babylon.js scene when imageLoaded or tattooTextures changes
    useEffect(() => {
        if (imageLoaded) {
            renderScene();
        }
    }, [imageLoaded, tattooTextures]);

    return (
<div className="flex h-screen">
    <div className="flex flex-col flex-1">
        <TopNavigation />
        <div className="grid grid-cols-1 xl-grid-cols-3 md:grid-cols-3 gap-4 p-4 pl-20 h-full">
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
                <canvas id="renderCanvas" className='rounded-md' style={{ width: '100%', height: '100%' }}></canvas>
            </div>
        </div>
    </div>
</div>
    );
}

export default CreateCanvas;