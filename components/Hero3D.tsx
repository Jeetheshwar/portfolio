import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Hero3D: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();

        // 1. CAMERA: FROM USER'S "PERFECT" CODE
        // Z=5.0
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
        camera.position.set(0, 0, 5.0);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.enableRotate = false;
        controls.enablePan = false;
        controls.target.set(0, 0, 0);

        // 3. LIGHTING (From User's Code)
        scene.add(new THREE.AmbientLight(0xffffff, 1.2));

        const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
        keyLight.position.set(2, 2, 8);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xccccff, 2.0);
        fillLight.position.set(-2, 2, 5);
        scene.add(fillLight);

        // Spotlights
        const redLeft = new THREE.SpotLight(0xff0000, 100.0);
        redLeft.position.set(-2, 1, 4);
        redLeft.lookAt(0, 0, 0);
        scene.add(redLeft);

        const redRight = new THREE.SpotLight(0xff0000, 100.0);
        redRight.position.set(2, 1, 4);
        redRight.lookAt(0, 0, 0);
        scene.add(redRight);

        const rimLeft = new THREE.SpotLight(0xffffff, 15.0);
        rimLeft.position.set(-6, 4, -4);
        rimLeft.lookAt(0, 0, 0);
        scene.add(rimLeft);

        const rimRight = new THREE.SpotLight(0xffffff, 15.0);
        rimRight.position.set(6, 4, -4);
        rimRight.lookAt(0, 0, 0);
        scene.add(rimRight);

        const loader = new FBXLoader();
        let mixer: THREE.AnimationMixer | null = null;
        let modelGroup: THREE.Group | null = null; // Reference to control position
        const clock = new THREE.Clock();

        // Using robo_vox.fbx as requested
        loader.load('/models/robo_vox.fbx', (fbx) => {
            console.log('✅ Loaded FBX (Hybrid: Perfect Pos + Clean Materials)');

            mixer = new THREE.AnimationMixer(fbx);

            // Debug: Log all animation names to help us identify the right one
            console.log("Found Animations:", fbx.animations.map(c => c.name));

            // Smart Filter: explicit "Idle" or "Stand" usually denotes the main loop
            // "shaky legs" in "Longest" mode suggests "Longest" might be a locomotor (Walk/Run) that moves the Root weirdly,
            // or just a bad clip.
            const idleClip = fbx.animations.find(c => /idle|stand|waving/i.test(c.name));
            const targetClip = idleClip || fbx.animations.reduce((prev, current) => (prev.duration > current.duration) ? prev : current);

            console.log("Playing Animation:", targetClip.name);

            const action = mixer.clipAction(targetClip);
            action.reset();
            action.play();
            // CROSSFADE: If we were switching, we'd fade, but for init just play.
            // OPTIONAL: If 'shaky' is due to frame rate, sometimes slightly slowing down helps, but 1.0 is standard.
            action.timeScale = 1.0;

            // CLEAN SLATE LOGIC (BUT KEEPING CENTERING LOGIC)
            let bestMesh: THREE.Mesh | null = null;
            let maxVerts = 0;

            fbx.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const m = child as THREE.Mesh;
                    m.frustumCulled = false;

                    // 1. Hide Backgrounds
                    if (/plane|background|sky|floor/i.test(m.name)) {
                        m.visible = false;
                        return;
                    }

                    // 2. DO NOT MODIFY MATERIALS (User Request)
                    // We skip the whole "isRedParts / applyMaterial" block
                    // prompting the original textures to show.

                    // 3. Find Best Mesh (For Centering)
                    const count = m.geometry.attributes.position ? m.geometry.attributes.position.count : 0;
                    if (count > maxVerts) {
                        maxVerts = count;
                        bestMesh = m;
                    }
                }
            });

            if (bestMesh) {
                const wrapper = new THREE.Group();
                modelGroup = wrapper; // Save reference
                wrapper.add(fbx);
                scene.add(wrapper);

                const box = new THREE.Box3().setFromObject(bestMesh);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                fbx.position.set(0, 0, 0);
                fbx.scale.set(1, 1, 1);
                fbx.updateMatrixWorld(true);

                fbx.position.copy(center).multiplyScalar(-1);

                // TRANSFORM FROM USER "PERFECT" CODE

                // SCALE: 3.8
                const targetHeight = 3.8;
                const scale = targetHeight / size.y;
                wrapper.scale.set(scale, scale, scale);

                // ROTATION: 0
                wrapper.rotation.y = 0;

                // POSITION: -0.5
                wrapper.position.set(0, -0.5, 0);
            }

        }, undefined, (e) => console.error('Error', e));

        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);

            // LOCK ROOT MOTION:
            // If the animation moves the model, we force it back to center every frame.
            if (modelGroup) {
                modelGroup.position.set(0, -0.5, 0); // Keep user's preferred Y
                // Note: If the FBX itself (child) is moving away from wrapper origin, we might need to reset FBX position too.
                // usually mixer moves the bone, which moves the mesh.
                // If the mesh moves, we can't easily stop it without complex bone retargeting.
                // But often 'modelGroup.position.set' is enough if the wrapper itself isn't moving (wrapper never moves).
                // If the ANIMATION moves the 'Root' bone, the mesh moves *relative* to the wrapper.
            }

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
            if (mountRef.current?.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full pointer-events-none" />;
};

export default Hero3D;