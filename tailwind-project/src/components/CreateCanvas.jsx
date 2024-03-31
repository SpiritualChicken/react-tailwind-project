import React, { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';

function CreateCanvas() {
    const [tattooTexture, setTattooTexture] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Function to handle file upload
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageDataUrl = e.target.result;
                setTattooTexture(imageDataUrl); // Set the uploaded image as tattoo texture
                setImageLoaded(true);
            };
            reader.readAsDataURL(file);
        }
    }

    // Function to create 3D scene
    function renderScene() {
        // Create Babylon.js scene and add 3D model
        const canvas = document.getElementById('renderCanvas');
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        const humanoid = createHumanoidModel(scene); // Function to create humanoid model
        engine.runRenderLoop(() => {
            scene.render();
        });
        window.addEventListener("resize", () => {
            engine.resize();
        });

        // Apply tattoo texture to the model if loaded
        if (imageLoaded && tattooTexture) {
            applyTattooToModel(scene, humanoid, tattooTexture);
        }
    }

    // Function to apply the tattoo texture to the 3D model
    function applyTattooToModel(scene, mesh, texture) {
        const material = new BABYLON.StandardMaterial("tattooMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture(texture, scene);
        mesh.material = material;
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

        const rightArm = leftArm.clone("rightArm");
        rightArm.position.x = 0.7;
        rightArm.rotation.z = -Math.PI / 4;

        // Create legs
        const leftLeg = BABYLON.MeshBuilder.CreateCylinder("leftLeg", { diameterTop: 0.3, diameterBottom: 0.3, height: 1 }, scene);
        leftLeg.position.x = -0.3;
        leftLeg.position.y = -1;

        const rightLeg = leftLeg.clone("rightLeg");
        rightLeg.position.x = 0.3;
        rightLeg.position.y = -1;

        // Group all parts together
        const humanoid = BABYLON.Mesh.MergeMeshes([body, head, leftArm, rightArm, leftLeg, rightLeg]);

        return humanoid;
    }

    // Render Babylon.js scene when component mounts
    useEffect(() => {
        renderScene();
    }, []);

    // Render Babylon.js scene when imageLoaded or tattooTexture changes
    useEffect(() => {
        if (imageLoaded) {
            renderScene();
        }
    }, [imageLoaded, tattooTexture]);

    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            <canvas id="renderCanvas" style={{ width: '100%', height: '100%' }}></canvas>
        </div>
    );
}

export default CreateCanvas;