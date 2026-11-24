import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D High-Dimensional Vector Universe in Iron Man / Stark Industries Aesthetic
 * Renders tokens as glowing Stark Arc Reactor nodes floating in 3D embedding space.
 */
export const ThreeUniverse = ({ tokens, selectedToken, onSelectToken }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070a, 0.03);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // Ambient and Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const arcLight = new THREE.PointLight(0x00f5ff, 2.5, 50);
    arcLight.position.set(0, 10, 5);
    scene.add(arcLight);

    const goldLight = new THREE.PointLight(0xffd700, 1.8, 40);
    goldLight.position.set(-8, -5, -4);
    scene.add(goldLight);

    // Tactical Stark Coordinate Grid Plane
    const gridHelper = new THREE.GridHelper(24, 24, 0xef4444, 0x223046);
    gridHelper.position.y = -3;
    scene.add(gridHelper);

    // Holographic Ambient Particle Field (Stark HUD Dust)
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00f5ff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Token Node Meshes
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const nodeMeshes = [];
    const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const ringGeo = new THREE.RingGeometry(0.45, 0.52, 24);

    tokens.forEach((token, idx) => {
      const isSelected = selectedToken?.id === token.id;
      const [x, y, z] = token.coords3D;

      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.userData = { token };

      // Inner Core Sphere
      const sphereMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xffd700 : new THREE.Color(token.color),
        emissive: isSelected ? 0xffd700 : new THREE.Color(token.color),
        emissiveIntensity: isSelected ? 0.9 : 0.4,
        roughness: 0.2,
        metalness: 0.8
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Outer Arc Ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffd700 : 0x00f5ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      // Connecting guideline to ground grid
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -3 - y, 0)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0xffd700 : 0x00f5ff,
        transparent: true,
        opacity: isSelected ? 0.5 : 0.15
      });
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);

      nodeGroup.add(group);
      nodeMeshes.push({ group, ring, token });
    });

    // Raycasting for Token Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeGroup.children, true);

      if (intersects.length > 0) {
        let current = intersects[0].object;
        while (current && !current.userData?.token && current.parent) {
          current = current.parent;
        }
        if (current?.userData?.token) {
          onSelectToken(current.userData.token);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Interactive Drag to Rotate Camera Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let angleX = 0;
    let angleY = 0.3;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      angleX += dx * 0.006;
      angleY = Math.max(-0.4, Math.min(1.2, angleY + dy * 0.006));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(5, Math.min(25, camera.position.z + e.deltaY * 0.01));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera orbit positioning
      const radius = camera.position.z;
      camera.position.x = radius * Math.sin(angleX) * Math.cos(angleY);
      camera.position.y = radius * Math.sin(angleY) + 3;
      camera.position.z = radius * Math.cos(angleX) * Math.cos(angleY);
      camera.lookAt(0, 0, 0);

      // Rotate token rings and pulse
      nodeMeshes.forEach(({ ring, token }, idx) => {
        ring.rotation.z = elapsedTime * 1.5 + idx;
        ring.rotation.x = Math.PI / 2 + Math.sin(elapsedTime * 2 + idx) * 0.2;
      });

      // Subtle particle drift
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight || 450;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [tokens, selectedToken, onSelectToken]);

  return (
    <div className="relative w-full h-[460px] rounded-xl overflow-hidden border border-amber-500/30 bg-[#040609] hud-corner">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Stark Tactical Overlay Labels */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col space-y-1">
        <span className="font-orbitron text-xs font-bold text-amber-400 tracking-wider">
          MARK-85 TACTICAL VECTOR SPACE
        </span>
        <span className="font-mono text-[10px] text-cyan-400">
          DIM: 16-D PROJECTION // CLICK TO INSPECT
        </span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none font-mono text-[9px] text-slate-400 bg-black/60 px-2 py-1 rounded border border-white/10">
        DRAG TO ROTATE // SCROLL TO ZOOM
      </div>

      {/* Selected Token Badge */}
      {selectedToken && (
        <div className="absolute top-3 right-3 font-mono text-xs bg-red-950/80 border border-red-500/60 px-3 py-1.5 rounded-lg text-amber-300 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedToken.color }}></span>
          <span className="font-bold">"{selectedToken.cleanText}"</span>
          <span className="text-[10px] text-slate-400">[POS: {selectedToken.position}]</span>
        </div>
      )}
    </div>
  );
};
