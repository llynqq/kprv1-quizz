import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import anime from 'animejs';

export function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create blobs
    const geometry = new THREE.IcosahedronGeometry(4, 32);
    
    // Blob 1: Blue
    const material1 = new THREE.MeshBasicMaterial({ color: '#2563eb', transparent: true, opacity: 0.2 });
    const blob1 = new THREE.Mesh(geometry, material1);
    blob1.position.set(-5, 2, -10);
    scene.add(blob1);

    // Blob 2: Indigo / Purple
    const material2 = new THREE.MeshBasicMaterial({ color: '#4f46e5', transparent: true, opacity: 0.2 });
    const blob2 = new THREE.Mesh(geometry, material2);
    blob2.position.set(5, -2, -10);
    scene.add(blob2);
    
    // Blob 3: Cyan / Teal
    const material3 = new THREE.MeshBasicMaterial({ color: '#06b6d4', transparent: true, opacity: 0.15 });
    const blob3 = new THREE.Mesh(geometry, material3);
    blob3.position.set(0, 0, -15);
    scene.add(blob3);

    camera.position.z = 5;

    // Anime.js animations
    anime({
      targets: blob1.position,
      x: [-8, -2, -8],
      y: [0, 5, 0],
      duration: 18000,
      easing: 'easeInOutSine',
      loop: true
    });

    anime({
      targets: blob2.position,
      x: [8, 2, 8],
      y: [-5, 0, -5],
      duration: 21000,
      easing: 'easeInOutSine',
      loop: true
    });

    anime({
      targets: blob3.position,
      x: [-4, 4, -4],
      y: [-3, 3, -3],
      duration: 25000,
      easing: 'easeInOutSine',
      loop: true
    });

    // Scale animations
    anime({
      targets: [blob1.scale, blob2.scale, blob3.scale],
      x: [1, 1.8, 1],
      y: [1, 1.4, 1],
      z: [1, 1.6, 1],
      duration: 15000,
      easing: 'easeInOutSine',
      loop: true,
      delay: anime.stagger(2000)
    });

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      blob1.rotation.x += 0.001;
      blob1.rotation.y += 0.002;
      blob2.rotation.x += 0.002;
      blob2.rotation.y += 0.001;
      blob3.rotation.x -= 0.001;
      blob3.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material1.dispose();
      material2.dispose();
      material3.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ filter: 'blur(100px)' }}
    />
  );
}
