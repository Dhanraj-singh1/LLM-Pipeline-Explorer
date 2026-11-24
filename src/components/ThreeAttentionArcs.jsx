import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Attention Arcs in Iron Man Aesthetic
 * Renders circular token arrangement with glowing Stark repulsor beam arcs connecting tokens.
 */
export const ThreeAttentionArcs = ({ tokens, attentionData, threshold = 0.08 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 10, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffd700, 2, 40);
    pointLight.position.set(0, 8, 5);
    scene.add(pointLight);

    // Arrange tokens in a circle on XZ plane
    const radius = 5.5;
    const tokenPositions = [];
    const n = tokens.length;

    const group = new THREE.Group();
    scene.add(group);

    tokens.forEach((token, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      tokenPositions.push(new THREE.Vector3(x, 0, z));

      // Token Node Mesh
      const nodeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(token.color),
        emissive: new THREE.Color(token.color),
        emissiveIntensity: 0.5,
        roughness: 0.3
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(x, 0, z);
      group.add(node);
    });

    // Outer Target Reticle Ring
    const reticleGeo = new THREE.RingGeometry(radius - 0.2, radius + 0.2, 64);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const reticle = new THREE.Mesh(reticleGeo, reticleMat);
    reticle.rotation.x = Math.PI / 2;
    group.add(reticle);

    // Draw Quadratic Bezier Energy Arcs between tokens with attention > threshold
    const matrix = attentionData.averageMatrix || [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const weight = matrix[i]?.[j] ?? 0;
        if (weight < threshold) continue;

        const start = tokenPositions[i];
        const end = tokenPositions[j];

        // Midpoint lifted up in Y proportional to distance and weight
        const dist = start.distanceTo(end);
        const midY = Math.min(4.5, dist * 0.45 + weight * 2);
        const mid = new THREE.Vector3(
          (start.x + end.x) / 2,
          midY,
          (start.z + end.z) / 2
        );

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(24);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

        const arcMat = new THREE.LineBasicMaterial({
          color: weight > 0.25 ? 0xffd700 : 0x00f5ff,
          transparent: true,
          opacity: Math.min(0.9, 0.2 + weight * 1.5),
          linewidth: 2
        });

        const arcLine = new THREE.Line(arcGeo, arcMat);
        group.add(arcLine);
      }
    }

    // Drag to rotate
    let isDragging = false;
    let prevX = 0;
    let rotX = 0.3;
    let rotY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      rotY += dx * 0.007;
      prevX = e.clientX;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      group.rotation.y = rotY;
      group.rotation.x = rotX;
      renderer.render(scene, camera);
    };

    animate();

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
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [tokens, attentionData, threshold]);

  return (
    <div className="relative w-full h-[460px] rounded-xl overflow-hidden border border-amber-500/30 bg-[#040609] hud-corner">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col space-y-1">
        <span className="font-orbitron text-xs font-bold text-amber-400 tracking-wider">
          3D ATTENTION REPULSOR BEAMS
        </span>
        <span className="font-mono text-[10px] text-cyan-400">
          ATTENTION WEIGHT &gt; {(threshold * 100).toFixed(0)}% // DRAG TO ROTATE
        </span>
      </div>
    </div>
  );
};
