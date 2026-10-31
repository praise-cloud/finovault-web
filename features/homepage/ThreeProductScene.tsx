'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeProductSceneProps {
  className?: string;
}

export function ThreeProductScene({ className }: ThreeProductSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Group holding the entire 3D product showcase
    const productGroup = new THREE.Group();
    scene.add(productGroup);

    // Dynamic procedural canvas texture for the device screen
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const ctx = screenCanvas.getContext('2d');
    if (ctx) {
      // Background
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, 512, 1024);

      // Top Header Bar
      ctx.fillStyle = '#1D4ED8';
      ctx.fillRect(0, 0, 512, 140);

      // Vault Badge
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Montserrat, sans-serif';
      ctx.fillText('FINOVAULT', 40, 75);

      ctx.fillStyle = '#93C5FD';
      ctx.font = '20px monospace';
      ctx.fillText('ENCRYPTED VAULT v2.1', 40, 110);

      // Fuel Gauge Graphic Card
      ctx.fillStyle = '#18181B';
      ctx.roundRect(30, 180, 452, 280, 24);
      ctx.fill();

      // Card border
      ctx.strokeStyle = '#27272A';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Fuel gauge title
      ctx.fillStyle = '#A1A1AA';
      ctx.font = '18px monospace';
      ctx.fillText('SAFE DAILY ALLOWANCE', 60, 230);

      // Fuel Gauge Amount
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 56px Montserrat, sans-serif';
      ctx.fillText('$35.00 / day', 60, 305);

      // Green progress bar
      ctx.fillStyle = '#27272A';
      ctx.roundRect(60, 345, 392, 28, 14);
      ctx.fill();

      ctx.fillStyle = '#22C55E';
      ctx.roundRect(60, 345, 320, 28, 14);
      ctx.fill();

      ctx.fillStyle = '#4ADE80';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('82% IN THE GREEN • NO OVERSPEND', 60, 410);

      // Quick Campus Hangouts
      ctx.fillStyle = '#18181B';
      ctx.roundRect(30, 490, 452, 240, 24);
      ctx.fill();

      ctx.fillStyle = '#A1A1AA';
      ctx.font = '18px monospace';
      ctx.fillText('RECENT TRANSACTIONS', 60, 540);

      // Tx 1
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Montserrat, sans-serif';
      ctx.fillText('Timo Campus Coffee', 60, 595);
      ctx.fillStyle = '#F87171';
      ctx.fillText('-$3.50', 380, 595);

      // Tx 2
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Montserrat, sans-serif';
      ctx.fillText('Cascavelle Lunch', 60, 665);
      ctx.fillStyle = '#F87171';
      ctx.fillText('-$8.00', 380, 665);

      // Bottom Security Status
      ctx.fillStyle = '#1D4ED8';
      ctx.roundRect(30, 760, 452, 100, 20);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px Montserrat, sans-serif';
      ctx.fillText('BIOMETRIC VAULT LOCKED', 60, 810);
      ctx.fillStyle = '#93C5FD';
      ctx.font = '16px monospace';
      ctx.fillText('Tap to unlock with Face ID', 60, 838);

      // Home indicator bar
      ctx.fillStyle = '#FFFFFF';
      ctx.roundRect(176, 990, 160, 8, 4);
      ctx.fill();
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;

    // 3D Phone Body Geometry
    const phoneWidth = 2.6;
    const phoneHeight = 5.2;
    const phoneDepth = 0.22;
    const radius = 0.28;

    // Custom Rounded Box
    const shape = new THREE.Shape();
    const x = -phoneWidth / 2;
    const y = -phoneHeight / 2;
    const w = phoneWidth;
    const h = phoneHeight;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + w - radius, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + radius);
    shape.lineTo(x + w, y + h - radius);
    shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    shape.lineTo(x + radius, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      depth: phoneDepth,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const phoneGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    phoneGeometry.center();

    // Materials
    // Body: Black Brushed Titanium
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.92,
      roughness: 0.22,
    });

    const phoneMesh = new THREE.Mesh(phoneGeometry, titaniumMaterial);
    productGroup.add(phoneMesh);

    // Front Screen Mesh
    const screenGeo = new THREE.PlaneGeometry(phoneWidth * 0.92, phoneHeight * 0.94);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: true,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = phoneDepth / 2 + 0.045;
    productGroup.add(screenMesh);

    // Outer Neon Blue Rim
    const rimGeo = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.65,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2.4;
    productGroup.add(rimMesh);

    // Floating Geometric Currency Token 1 (Gold Coin)
    const coinGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
    });
    const coin1 = new THREE.Mesh(coinGeo, goldMat);
    coin1.position.set(2.0, 1.8, 0.8);
    coin1.rotation.set(0.6, 0.8, 0.4);
    productGroup.add(coin1);

    // Floating Geometric Token 2 (Blue Security Diamond)
    const diamondGeo = new THREE.OctahedronGeometry(0.36);
    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.85,
      roughness: 0.1,
    });
    const diamond1 = new THREE.Mesh(diamondGeo, blueMat);
    diamond1.position.set(-2.0, -1.6, 0.9);
    productGroup.add(diamond1);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.2);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const bluePointLight = new THREE.PointLight(0x2563eb, 4, 15);
    bluePointLight.position.set(-4, -3, 4);
    scene.add(bluePointLight);

    // Mouse Tracking for Smooth 3D Gyroscopic Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.08;
    let targetRotY = -0.15;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const yNorm = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = xNorm;
      mouseY = yNorm;
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35 + 0.05;
    };

    const handleMouseLeave = () => {
      targetRotX = 0.05;
      targetRotY = -0.12;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp rotation towards mouse
      productGroup.rotation.y += (targetRotY - productGroup.rotation.y) * 0.06;
      productGroup.rotation.x += (targetRotX - productGroup.rotation.x) * 0.06;

      // Subtle breathing float
      productGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Spin floating accessories
      coin1.rotation.y += 0.02;
      coin1.position.y = 1.8 + Math.sin(elapsedTime * 2 + 1) * 0.12;

      diamond1.rotation.x += 0.015;
      diamond1.rotation.z += 0.015;
      diamond1.position.y = -1.6 + Math.cos(elapsedTime * 1.8) * 0.1;

      rimMesh.rotation.z = elapsedTime * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
      phoneGeometry.dispose();
      titaniumMaterial.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTexture.dispose();
      coinGeo.dispose();
      goldMat.dispose();
      diamondGeo.dispose();
      blueMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[460px] md:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className || ''}`}
      aria-label="Interactive 3D Finovault Product Device"
    />
  );
}
