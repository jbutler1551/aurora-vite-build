import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/lib/theme-context';

interface AetherSphereProps {
  size?: number;
  className?: string;
}

export function AetherSphere({ size = 300, className = '' }: AetherSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Aurora colors for dark mode (cyan, emerald, purple, pink)
    const auroraColors = [
      new THREE.Color(0x22d3ee), // cyan-400
      new THREE.Color(0x34d399), // emerald-400
      new THREE.Color(0xa855f7), // purple-500
      new THREE.Color(0xec4899), // pink-500
    ];

    // Configuration - theme aware
    const config = {
      minDensity: 500,
      maxDensity: 1000,
      radius: 100,
      rotationSpeed: 1.0,
      instability: 9.0,
      color: isDark ? 0xFFFFFF : 0x5C4A2A // White in dark mode, brown in light mode
    };

    // Three.js Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDark ? 0x0a0a0a : 0xebe3d3, 0.0015); // Match background color

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);
    camera.position.z = 280;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Group for sphere elements
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Data storage
    const initialPositions: { x: number; y: number; z: number; phi: number; theta: number }[] = [];
    const randomOffsets: number[] = [];

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const colorfulIndices: number[] = []; // Track which particles are colorful (for dark mode animation)

    for (let i = 0; i < config.maxDensity; i++) {
      const phi = Math.acos(-1 + (2 * i) / config.maxDensity);
      const theta = Math.sqrt(config.maxDensity * Math.PI) * phi;

      const r = config.radius;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);

      positions.push(x, y, z);
      initialPositions.push({ x, y, z, phi, theta });
      randomOffsets.push(Math.random());

      // Set colors - in dark mode: 80% white, 20% will be animated aurora colors
      if (isDark) {
        const isColorful = Math.random() < 0.2; // 20% chance of being a colorful particle
        if (isColorful) {
          colorfulIndices.push(i);
          // Start with a random aurora color - use full saturation
          const startColor = auroraColors[Math.floor(Math.random() * auroraColors.length)];
          colors.push(startColor.r, startColor.g, startColor.b);
        } else {
          // White particle - slightly dimmer so colorful ones stand out
          colors.push(0.85, 0.85, 0.85);
        }
      } else {
        // Light mode - all brown
        const brownColor = new THREE.Color(0x5C4A2A);
        colors.push(brownColor.r, brownColor.g, brownColor.b);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Create soft dot texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 10,
      map: texture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.NormalBlending,
      depthWrite: false,
      sizeAttenuation: true,
      vertexColors: true // Use per-vertex colors
    });

    const particles = new THREE.Points(geometry, material);
    particles.geometry.setDrawRange(0, config.minDensity);
    sphereGroup.add(particles);

    // Lines (Neural Links)
    const lineGeometry = new THREE.BufferGeometry();
    const linePos = new Float32Array(config.maxDensity * 20 * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePos, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0xFFFFFF : 0x5C4A2A, // White in dark mode, brown in light mode
      transparent: true,
      opacity: isDark ? 0.25 : 0.25,
      blending: THREE.NormalBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    sphereGroup.add(lines);

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001;

      // Density breathing
      const oscDensity = (Math.sin(time * 0.5) + 1) / 2;
      const currentDensity = Math.floor(
        config.minDensity + (config.maxDensity - config.minDensity) * oscDensity
      );

      // Neural link breathing
      const oscLinks = (Math.sin(time * 0.25) + 1) / 2;
      const currentLinkCount = Math.floor(10 + 90 * oscLinks);

      // Rotation
      sphereGroup.rotation.y += config.rotationSpeed * 0.005;

      // Particle update
      const posArray = particles.geometry.attributes.position.array as Float32Array;
      const jitterAmt = config.instability * 2.0;
      const msTime = Date.now() * 0.002;

      for (let i = 0; i < currentDensity; i++) {
        const initPos = initialPositions[i];
        const r = config.radius;

        let x = r * Math.cos(initPos.theta) * Math.sin(initPos.phi);
        let y = r * Math.sin(initPos.theta) * Math.sin(initPos.phi);
        let z = r * Math.cos(initPos.phi);

        if (config.instability > 0) {
          const offset = randomOffsets[i];
          x += Math.sin(msTime + offset * 10) * jitterAmt;
          y += Math.cos(msTime + offset * 20) * jitterAmt;
          z += Math.sin(msTime * 1.5 + offset) * jitterAmt;
        }

        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.setDrawRange(0, currentDensity);

      // Animate colors for the colorful particles in dark mode
      if (isDark && colorfulIndices.length > 0) {
        const colorArray = particles.geometry.attributes.color.array as Float32Array;
        for (const idx of colorfulIndices) {
          // Each colorful particle cycles through aurora colors at its own pace
          const colorTime = time * 0.5 + randomOffsets[idx] * Math.PI * 2;
          const colorIndex = Math.floor((Math.sin(colorTime) + 1) / 2 * auroraColors.length) % auroraColors.length;
          const nextColorIndex = (colorIndex + 1) % auroraColors.length;
          const blend = ((Math.sin(colorTime) + 1) / 2 * auroraColors.length) % 1;

          // Interpolate between colors for smooth transitions
          const currentColor = auroraColors[colorIndex];
          const nextColor = auroraColors[nextColorIndex];

          colorArray[idx * 3] = currentColor.r + (nextColor.r - currentColor.r) * blend;
          colorArray[idx * 3 + 1] = currentColor.g + (nextColor.g - currentColor.g) * blend;
          colorArray[idx * 3 + 2] = currentColor.b + (nextColor.b - currentColor.b) * blend;
        }
        particles.geometry.attributes.color.needsUpdate = true;
      }

      // Line update
      const linePositions = lines.geometry.attributes.position.array as Float32Array;
      let lineIdx = 0;
      const linkFactor = Math.floor(currentLinkCount / 5);

      if (linkFactor > 0) {
        for (let i = 0; i < currentDensity; i++) {
          for (let j = 1; j <= linkFactor; j++) {
            const neighborIdx = (i + j) % currentDensity;

            const x1 = posArray[i * 3];
            const y1 = posArray[i * 3 + 1];
            const z1 = posArray[i * 3 + 2];

            const x2 = posArray[neighborIdx * 3];
            const y2 = posArray[neighborIdx * 3 + 1];
            const z2 = posArray[neighborIdx * 3 + 2];

            const d2 = (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2;

            if (d2 < (config.radius * 0.8) ** 2) {
              linePositions[lineIdx++] = x1;
              linePositions[lineIdx++] = y1;
              linePositions[lineIdx++] = z1;

              linePositions[lineIdx++] = x2;
              linePositions[lineIdx++] = y2;
              linePositions[lineIdx++] = z2;
            }
          }
        }
      }

      lines.geometry.setDrawRange(0, lineIdx / 3);
      lines.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [size, isDark]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
