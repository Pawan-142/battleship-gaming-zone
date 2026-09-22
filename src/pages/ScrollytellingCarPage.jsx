import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Compass, 
  Zap, 
  ShieldCheck, 
  Battery, 
  Gauge, 
  RotateCw, 
  Sparkles,
  Layers,
  ChevronRight,
  Crosshair,
  Calendar,
  Flame,
  Activity
} from 'lucide-react';
import { BorderTrail } from '../components/motion/BorderTrail';
import { SlidingNumber } from '../components/motion/SlidingNumber';
import './Scrollytelling.css';

// Color themes for the 3D car body and underglow
const COLOR_THEMES = [
  { id: 'crimson', name: 'Metallic Wine Crimson', hex: '#6e1022', accent: '#cb2957', glow: 'rgba(203, 41, 87, 0.5)' },
  { id: 'cyan', name: 'Cyber Neon Cyan', hex: '#0a3d4d', accent: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)' },
  { id: 'violet', name: 'Ultraviolet Phantom', hex: '#3b124d', accent: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)' },
  { id: 'amber', name: 'Solar Flare Gold', hex: '#523408', accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
  { id: 'emerald', name: 'Hyper Green Laser', hex: '#0a4224', accent: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' },
];

export const ScrollytellingCarPage = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeTheme, setActiveTheme] = useState(COLOR_THEMES[0]);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [telemetry, setTelemetry] = useState({ speed: 0, power: 98, gforce: "0.2G" });

  // Web Audio Synth
  const audioContextRef = useRef(null);
  const oscRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const car1Ref = useRef(null);
  const car2Ref = useRef(null);
  const sparksRef = useRef(null);
  const materialsRef = useRef({ bodyMat: null, underGlow: null, topTipMat: null });
  const animFrameIdRef = useRef(null);

  // Scroll Progress Tracking (0.0 to 1.0)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4
  });

  // ---------------------------------------------------------------------------
  // 3D BUMPER CAR BUILDER (REAL 3D WEBGL MESH)
  // ---------------------------------------------------------------------------
  const createBumperCar = (bodyColorHex = 0x6e1022, accentColorHex = 0xCB2957, number = "07") => {
    const carGroup = new THREE.Group();

    // 1. Thick Rubber 360° Wrap-around Bumper Collar
    const bumperTorusGeom = new THREE.TorusGeometry(1.86, 0.42, 32, 64);
    bumperTorusGeom.rotateX(Math.PI / 2);
    bumperTorusGeom.scale(1.0, 0.72, 1.32);

    const bumperMat = new THREE.MeshStandardMaterial({
      color: 0x111114,
      roughness: 0.88,
      metalness: 0.12,
    });
    const bumperMesh = new THREE.Mesh(bumperTorusGeom, bumperMat);
    bumperMesh.position.y = 0.32;
    bumperMesh.castShadow = true;
    bumperMesh.receiveShadow = true;
    carGroup.add(bumperMesh);
    carGroup.userData.bumperMesh = bumperMesh;

    // Heavy Rubber Bottom Floor Lip
    const lipGeom = new THREE.CylinderGeometry(1.82, 1.88, 0.22, 48);
    lipGeom.scale(0.96, 1.0, 1.28);
    const lipMesh = new THREE.Mesh(lipGeom, bumperMat);
    lipMesh.position.y = 0.16;
    carGroup.add(lipMesh);

    // 2. Sculpted Metallic Clearcoat Fiberglass Body
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: bodyColorHex,
      roughness: 0.14,
      metalness: 0.62,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.98,
      ior: 1.52,
    });
    carGroup.userData.bodyMat = bodyMat;

    // Lower Main Hull Tub
    const hullGeom = new THREE.CylinderGeometry(1.42, 1.62, 0.65, 48);
    hullGeom.scale(0.95, 1.0, 1.25);
    const hullMesh = new THREE.Mesh(hullGeom, bodyMat);
    hullMesh.position.y = 0.58;
    hullMesh.castShadow = true;
    carGroup.add(hullMesh);

    // Sloping Front Hood
    const hoodGeom = new THREE.SphereGeometry(1.24, 36, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    hoodGeom.scale(0.98, 0.54, 1.22);
    const hoodMesh = new THREE.Mesh(hoodGeom, bodyMat);
    hoodMesh.position.set(0, 0.68, 0.48);
    hoodMesh.castShadow = true;
    carGroup.add(hoodMesh);

    // Dual Raised Center Hood Strakes
    const strakeGeom = new THREE.CylinderGeometry(0.042, 0.042, 1.15, 16);
    strakeGeom.rotateX(Math.PI / 2.7);

    const leftStrake = new THREE.Mesh(strakeGeom, bodyMat);
    leftStrake.position.set(-0.26, 0.94, 0.58);
    leftStrake.castShadow = true;
    carGroup.add(leftStrake);

    const rightStrake = new THREE.Mesh(strakeGeom, bodyMat);
    rightStrake.position.set(0.26, 0.94, 0.58);
    rightStrake.castShadow = true;
    carGroup.add(rightStrake);

    // Rear High Cowl Deck
    const rearDeckGeom = new THREE.CylinderGeometry(1.15, 1.35, 0.72, 32, 1, false, Math.PI * 0.75, Math.PI * 1.5);
    rearDeckGeom.scale(0.96, 1.0, 0.95);
    const rearDeck = new THREE.Mesh(rearDeckGeom, bodyMat);
    rearDeck.position.set(0, 0.92, -0.72);
    rearDeck.castShadow = true;
    carGroup.add(rearDeck);

    // Sleek Front Recessed LED Headlights
    const slotGeom = new THREE.BoxGeometry(0.36, 0.08, 0.06);
    slotGeom.rotateY(0.22);
    const darkHousingMat = new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 0.9 });
    const ledGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfffae0,
      emissiveIntensity: 3.6,
      roughness: 0.1,
    });

    const leftSlot = new THREE.Mesh(slotGeom, darkHousingMat);
    leftSlot.position.set(-0.58, 0.7, 1.38);
    const leftLed = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.035), ledGlowMat);
    leftLed.position.set(0, 0, 0.02);
    leftSlot.add(leftLed);
    carGroup.add(leftSlot);

    const rightSlotGeom = new THREE.BoxGeometry(0.36, 0.08, 0.06);
    rightSlotGeom.rotateY(-0.22);
    const rightSlot = new THREE.Mesh(rightSlotGeom, darkHousingMat);
    rightSlot.position.set(0.58, 0.7, 1.38);
    const rightLed = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.035), ledGlowMat);
    rightLed.position.set(0, 0, 0.02);
    rightSlot.add(rightLed);
    carGroup.add(rightSlot);

    // 3. Dual Sport Bucket Seats with Headrests
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1c1e24, roughness: 0.65 });
    
    // Left & Right Cushions
    const cushionGeom = new THREE.BoxGeometry(0.48, 0.16, 0.62);
    const leftCushion = new THREE.Mesh(cushionGeom, leatherMat);
    leftCushion.position.set(-0.28, 0.74, -0.32);
    carGroup.add(leftCushion);

    const rightCushion = new THREE.Mesh(cushionGeom, leatherMat);
    rightCushion.position.set(0.28, 0.74, -0.32);
    carGroup.add(rightCushion);

    // Backrests
    const backrestGeom = new THREE.BoxGeometry(0.48, 0.78, 0.18);
    const leftBack = new THREE.Mesh(backrestGeom, leatherMat);
    leftBack.position.set(-0.28, 1.22, -0.65);
    leftBack.rotation.x = 0.12;
    carGroup.add(leftBack);

    const rightBack = new THREE.Mesh(backrestGeom, leatherMat);
    rightBack.position.set(0.28, 1.22, -0.65);
    rightBack.rotation.x = 0.12;
    carGroup.add(rightBack);

    // Headrests
    const headrestGeom = new THREE.SphereGeometry(0.22, 24, 20);
    headrestGeom.scale(1.0, 1.2, 0.75);
    const leftHead = new THREE.Mesh(headrestGeom, leatherMat);
    leftHead.position.set(-0.28, 1.76, -0.72);
    carGroup.add(leftHead);

    const rightHead = new THREE.Mesh(headrestGeom, leatherMat);
    rightHead.position.set(0.28, 1.76, -0.72);
    carGroup.add(rightHead);

    // 4. Angled Sport Steering Column & Wheel
    const columnGeom = new THREE.CylinderGeometry(0.045, 0.05, 0.68, 16);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x18181c, metalness: 0.8, roughness: 0.3 });
    const colMesh = new THREE.Mesh(columnGeom, metalMat);
    colMesh.position.set(0, 0.98, 0.28);
    colMesh.rotation.x = -0.52;
    carGroup.add(colMesh);

    const steerGroup = new THREE.Group();
    steerGroup.position.set(0, 1.22, 0.12);
    steerGroup.rotation.x = 1.05;

    const wheelRimGeom = new THREE.TorusGeometry(0.32, 0.038, 16, 32);
    const wheelRim = new THREE.Mesh(wheelRimGeom, metalMat);
    steerGroup.add(wheelRim);

    const centerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16), metalMat);
    centerHub.rotation.x = Math.PI / 2;
    steerGroup.add(centerHub);

    carGroup.add(steerGroup);
    carGroup.userData.steerWheel = steerGroup;

    // 5. Telescoping Steel Power Mast
    const poleGroup = new THREE.Group();
    const mastGeom = new THREE.CylinderGeometry(0.028, 0.028, 3.2, 16);
    const chromeMastMat = new THREE.MeshStandardMaterial({ color: 0x222228, metalness: 0.95, roughness: 0.15 });
    const mast = new THREE.Mesh(mastGeom, chromeMastMat);
    mast.position.set(0, 2.94, -1.14);
    poleGroup.add(mast);

    const topTipMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: accentColorHex,
      emissiveIntensity: 3.2,
    });
    carGroup.userData.topTipMat = topTipMat;
    const topTip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.35, 16), topTipMat);
    topTip.position.set(0, 4.64, -1.14);
    poleGroup.add(topTip);
    carGroup.add(poleGroup);

    // 6. Underglow Light & Forward Headlamp Beams
    const underGlow = new THREE.PointLight(accentColorHex, 4.5, 6.0);
    underGlow.position.set(0, 0.22, 0);
    carGroup.add(underGlow);
    carGroup.userData.underGlow = underGlow;

    const spot = new THREE.SpotLight(0xfffae0, 5.0, 24, Math.PI / 4, 0.4, 1.2);
    spot.position.set(0, 0.72, 1.45);
    spot.target.position.set(0, 0, 12);
    carGroup.add(spot);
    carGroup.add(spot.target);

    return carGroup;
  };

  // ---------------------------------------------------------------------------
  // INITIALIZE THREE.JS 3D SCENE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x05070b);
    scene.fog = new THREE.FogExp2(0x05070b, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    camera.position.set(4.2, 2.4, 6.8);
    camera.lookAt(0, 1.0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    mainKeyLight.position.set(8, 16, 10);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 2048;
    mainKeyLight.shadow.mapSize.height = 2048;
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.8);
    rimLight.position.set(-10, 8, -10);
    scene.add(rimLight);

    // Arena Floor (Reflective Concrete with Neon Matrix Grid)
    const floorGeom = new THREE.PlaneGeometry(120, 120);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080b12,
      roughness: 0.18,
      metalness: 0.85,
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Grid Floor Overlay
    const grid = new THREE.GridHelper(120, 60, 0x00f0ff, 0x162338);
    grid.position.y = 0.01;
    scene.add(grid);

    // 3D Cars
    const car1 = createBumperCar(
      parseInt(activeTheme.hex.replace('#', '0x')),
      parseInt(activeTheme.accent.replace('#', '0x')),
      "07"
    );
    scene.add(car1);
    car1Ref.current = car1;

    // Secondary Opponent Car (#04 Slate Gray)
    const car2 = createBumperCar(0x1e2430, 0x00f0ff, "04");
    car2.position.set(12, 0, 15);
    scene.add(car2);
    car2Ref.current = car2;

    // Spark Particles for collision
    const particleCount = 80;
    const sparkGeom = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(particleCount * 3);
    const sparkVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      sparkPositions[i * 3] = 0;
      sparkPositions[i * 3 + 1] = 0.5;
      sparkPositions[i * 3 + 2] = 15;
      sparkVelocities.push({
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 6 + 1.5,
        z: (Math.random() - 0.5) * 8,
      });
    }
    sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffdd44,
      size: 0.12,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sparks = new THREE.Points(sparkGeom, sparkMat);
    scene.add(sparks);
    sparksRef.current = { points: sparks, velocities: sparkVelocities, count: particleCount };

    // Mouse Parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (cameraRef.current) {
        cameraRef.current.position.x += mouse.x * 0.015;
        cameraRef.current.position.y += -mouse.y * 0.01;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Update 3D car color theme in real-time
  useEffect(() => {
    if (!car1Ref.current) return;
    const hexVal = parseInt(activeTheme.hex.replace('#', '0x'));
    const accentVal = parseInt(activeTheme.accent.replace('#', '0x'));

    if (car1Ref.current.userData.bodyMat) {
      car1Ref.current.userData.bodyMat.color.setHex(hexVal);
    }
    if (car1Ref.current.userData.underGlow) {
      car1Ref.current.userData.underGlow.color.setHex(accentVal);
    }
    if (car1Ref.current.userData.topTipMat) {
      car1Ref.current.userData.topTipMat.emissive.setHex(accentVal);
    }
  }, [activeTheme]);

  // ---------------------------------------------------------------------------
  // SCROLL-DRIVEN 3D VEHICLE & CAMERA CHOREOGRAPHY
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (p) => {
      if (!car1Ref.current || !car2Ref.current || !cameraRef.current) return;

      const car1 = car1Ref.current;
      const car2 = car2Ref.current;
      const camera = cameraRef.current;

      // Update active chapter & HUD telemetry based on real 3D movement
      if (p <= 0.20) {
        setCurrentChapter(1);
        setTelemetry({ speed: Math.round(p * 50), power: 100, gforce: "0.2G" });
      } else if (p <= 0.44) {
        setCurrentChapter(2);
        setTelemetry({ speed: Math.round(24 + (p - 0.20) * 80), power: 97, gforce: "1.4G" });
      } else if (p <= 0.68) {
        setCurrentChapter(3);
        setTelemetry({ speed: Math.round(38 + (p - 0.44) * 40), power: 94, gforce: "0.8G" });
      } else if (p <= 0.86) {
        setCurrentChapter(4);
        setTelemetry({ speed: Math.round(48 + (p - 0.68) * 30), power: 91, gforce: "1.8G" });
      } else {
        setCurrentChapter(5);
        setTelemetry({ speed: 52, power: 88, gforce: "2.1G" });
      }

      // Dynamic Audio Synth pitch linked to 3D speed
      if (isAudioActive && oscRef.current && audioContextRef.current) {
        const targetFreq = 55 + p * 120;
        oscRef.current.frequency.setTargetAtTime(targetFreq, audioContextRef.current.currentTime, 0.1);
      }

      // -----------------------------------------------------------------------
      // 3D CHOREOGRAPHY TIMELINE
      // -----------------------------------------------------------------------

      // CHAPTER 1: PRE-GRID STATIONARY & REVEAL (0.00 -> 0.20)
      if (p <= 0.20) {
        const sub = p / 0.20;
        car1.position.set(0, 0, 0);
        car1.rotation.set(0, 0.5 * (1 - sub), 0);

        camera.position.set(
          3.8 + Math.sin(sub * 0.5) * 1.2,
          2.0 - sub * 0.3,
          6.5 - sub * 1.2
        );
        camera.lookAt(0, 0.9, 0);

        car2.position.set(15, 0, 15);
      }
      // CHAPTER 2: HIGH-TORQUE ACCELERATION & DRIFT VECTORING (0.20 -> 0.44)
      else if (p > 0.20 && p <= 0.44) {
        const sub = (p - 0.20) / (0.44 - 0.20);
        const dist = sub * 8.0;

        const angle = sub * 1.4;
        const radius = 6.0;
        const posX = -Math.sin(angle) * radius;
        const posZ = dist;

        car1.position.set(posX, 0, posZ);
        car1.rotation.set(0, -angle, -0.06);

        if (car1.userData.steerWheel) {
          car1.userData.steerWheel.rotation.z = -0.7 * Math.sin(sub * Math.PI);
        }

        camera.position.set(
          posX + Math.sin(angle + 0.6) * 4.2,
          1.6 + sub * 0.4,
          posZ - Math.cos(angle + 0.6) * 4.2
        );
        camera.lookAt(car1.position.x, 0.8, car1.position.z);

        car2.position.set(12 - sub * 5, 0, 12 + sub * 2);
      }
      // CHAPTER 3: MULTI-CAR APPROACH & COLLISION COURSE (0.44 -> 0.68)
      else if (p > 0.44 && p <= 0.68) {
        const sub = (p - 0.44) / (0.68 - 0.44);

        const targetX = 0;
        const targetZ = 16.0;
        const c1StartX = -3.5;
        const c1StartZ = 10.0;
        const c2StartX = 4.0;
        const c2StartZ = 18.0;

        car1.position.set(
          c1StartX + (targetX - 0.8 - c1StartX) * sub,
          0,
          c1StartZ + (targetZ - c1StartZ) * sub
        );
        car1.rotation.set(0, 0.35, 0);

        car2.position.set(
          c2StartX + (targetX + 0.8 - c2StartX) * sub,
          0,
          c2StartZ + (targetZ - c2StartZ) * sub
        );
        car2.rotation.set(0, -2.8, 0);

        camera.position.set(
          -4.2 + sub * 1.5,
          2.2 + sub * 0.3,
          16.0 + Math.sin(sub * Math.PI) * 2.0
        );
        camera.lookAt(targetX, 0.8, targetZ);
      }
      // CHAPTER 4: KINETIC BUMP IMPACT & SPARK DISCHARGE (0.68 -> 0.86)
      else if (p > 0.68 && p <= 0.86) {
        const sub = (p - 0.68) / (0.86 - 0.68);
        const impactCenter = { x: 0, z: 16.0 };

        const shakeAmp = (1 - sub) * 0.25;
        const shakeX = (Math.random() - 0.5) * shakeAmp;
        const shakeY = (Math.random() - 0.5) * shakeAmp;

        if (sub < 0.3) {
          // Moment of impact compression
          const comp = sub / 0.3;
          car1.position.set(
            -0.8 + 0.15 * Math.sin(comp * Math.PI),
            0,
            16.0
          );
          car2.position.set(
            0.8 - 0.15 * Math.sin(comp * Math.PI),
            0,
            16.0
          );

          if (sparksRef.current) {
            sparksRef.current.points.material.opacity = 1.0;
          }
        } else {
          // Elastic Rebound recoil
          const recoil = (sub - 0.3) / 0.7;
          car1.position.set(
            -0.8 - recoil * 2.8,
            0,
            16.0 - recoil * 1.2
          );
          car1.rotation.set(0, 0.35 - recoil * 0.6, 0);

          car2.position.set(
            0.8 + recoil * 3.2,
            0,
            16.0 + recoil * 1.5
          );
          car2.rotation.set(0, -2.8 + recoil * 0.8, 0);

          if (sparksRef.current) {
            sparksRef.current.points.material.opacity = Math.max(0, 1 - recoil * 2);
          }
        }

        camera.position.set(
          -3.5 + shakeX + sub * 1.0,
          2.6 + shakeY + sub * 0.8,
          20.0 + sub * 3.0
        );
        camera.lookAt(impactCenter.x, 0.7, impactCenter.z);
      }
      // CHAPTER 5: FULL ILLUMINATED ARENA OVERVIEW (0.86 -> 1.0)
      else {
        const sub = (p - 0.86) / (1.0 - 0.86);

        car1.position.set(-3.6 + Math.sin(sub * 2) * 0.5, 0, 14.8);
        car1.rotation.set(0, -0.25, 0);

        car2.position.set(4.0, 0, 17.5);
        car2.rotation.set(0, -2.0, 0);

        camera.position.set(
          0,
          6.5 + sub * 3.5,
          28.0 + sub * 6.0
        );
        camera.lookAt(0, 0.5, 16.0);
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, isAudioActive]);

  // Audio Toggle Function
  const toggleAudio = () => {
    if (isAudioActive) {
      if (oscRef.current) {
        try { oscRef.current.stop(); oscRef.current.disconnect(); } catch(e) {}
      }
      setIsAudioActive(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        gainNodeRef.current = gain;
        setIsAudioActive(true);
      } catch (err) {
        console.warn('Audio not supported:', err);
      }
    }
  };

  const scrollToChapter = (fraction) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: containerRef.current.offsetTop + totalHeight * fraction,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      className="scrolly-root" 
      ref={containerRef}
      style={{
        '--active-accent': activeTheme.accent,
        '--active-glow': activeTheme.glow,
      }}
    >
      {/* Floating Minimal Navigation Bar */}
      <header className="scrolly-nav-bar">
        <Link to="/" className="scrolly-back-link">
          <ArrowLeft size={14} />
          <span>BACK TO ARENA</span>
        </Link>

        <div className="scrolly-nav-center">
          <span className="scrolly-brand-badge">HYPERDRIVE 3D SHOWCASE</span>
          <span className="scrolly-edition-chip">BATTLESHIP MK-IV</span>
        </div>

        <div className="scrolly-nav-actions">
          <button 
            type="button" 
            className={`scrolly-sound-btn ${isAudioActive ? 'active' : ''}`}
            onClick={toggleAudio}
            title={isAudioActive ? "Mute Engine Drone" : "Enable Spatial Audio"}
          >
            {isAudioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <Link to="/booking?game=bumper-cars" className="scrolly-reserve-btn">
            RESERVE PASS
          </Link>
        </div>
      </header>

      {/* Right Side Chapter Navigation Pip Indicators */}
      <nav className="scrolly-chapter-tracker" aria-label="Story Chapters">
        {[
          { num: 1, label: "01 // PRE-GRID STANCE", frac: 0.05 },
          { num: 2, label: "02 // INSTANT TORQUE & DRIFT", frac: 0.30 },
          { num: 3, label: "03 // MULTI-CAR APPROACH", frac: 0.55 },
          { num: 4, label: "04 // KINETIC BUMP IMPACT", frac: 0.77 },
          { num: 5, label: "05 // ARENA LAUNCH GRID", frac: 0.95 },
        ].map((c) => (
          <button
            key={c.num}
            type="button"
            className={`chapter-dot-item ${currentChapter === c.num ? 'active' : ''}`}
            onClick={() => scrollToChapter(c.frac)}
          >
            <span className="chapter-indicator-pip" />
            <span className="chapter-label-pill">{c.label}</span>
          </button>
        ))}
      </nav>

      {/* Left Color Swatch Customizer */}
      <div className="scrolly-color-picker">
        <span className="picker-title">CHASSIS LIVERY</span>
        <div className="picker-swatches">
          {COLOR_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={`swatch-btn ${activeTheme.id === theme.id ? 'active' : ''}`}
              style={{ backgroundColor: theme.accent, color: theme.accent }}
              onClick={() => setActiveTheme(theme)}
              title={theme.name}
            />
          ))}
        </div>
      </div>

      {/* Main 480vh Scroll Canvas Track */}
      <div className="scrolly-stage-track">
        {/* Sticky 100vh Viewport Stage */}
        <div className="scrolly-sticky-stage">
          {/* Real Fullscreen Three.js WebGL Canvas */}
          <canvas 
            ref={canvasRef} 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              width: '100%', 
              height: '100%', 
              zIndex: 5,
              display: 'block'
            }} 
          />

          {/* ================================================================= */}
          {/* STORY CARDS (SYNCHRONIZED WITH 3D VEHICLE CHOREOGRAPHY) */}
          {/* ================================================================= */}

          {/* Chapter 1 Story Card */}
          <motion.div
            className="scrolly-story-card pos-left"
            style={{
              opacity: useTransform(smoothProgress, [0, 0.05, 0.16, 0.20], [1, 1, 1, 0]),
              x: useTransform(smoothProgress, [0, 0.05, 0.16, 0.20], [0, 0, 0, -40]),
            }}
          >
            <span className="story-eyebrow">CHAPTER 01 // PRE-GRID STANCE</span>
            <h2 className="story-title">REAL PHYSICAL VELOCITY.</h2>
            <p className="story-desc">
              Experience authentic 360° dodgem pod engineering. Metallic clearcoat fiberglass, nitrogen bumper collar, and independent electric induction motors.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val">360°</span>
                <span className="metric-lbl">Omni-Drift Axis</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val">48V</span>
                <span className="metric-lbl">Brushless Drive</span>
              </div>
            </div>
          </motion.div>

          {/* Chapter 2 Story Card */}
          <motion.div
            className="scrolly-story-card pos-right"
            style={{
              opacity: useTransform(smoothProgress, [0.22, 0.26, 0.40, 0.44], [0, 1, 1, 0]),
              x: useTransform(smoothProgress, [0.22, 0.26, 0.40, 0.44], [40, 0, 0, 40]),
            }}
          >
            <span className="story-eyebrow">CHAPTER 02 // DUAL-MOTOR TORQUE</span>
            <h2 className="story-title">BANKED TURNS & ZERO-INPUT DRIFT.</h2>
            <p className="story-desc">
              Instant torque curve allows rapid counter-steering and high-speed pendulum drifts across the ultra-slick conductive arena grid.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val">0.02s</span>
                <span className="metric-lbl">Throttle Response</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val">1.4G</span>
                <span className="metric-lbl">Lateral Acceleration</span>
              </div>
            </div>
          </motion.div>

          {/* Chapter 3 Story Card */}
          <motion.div
            className="scrolly-story-card pos-left"
            style={{
              opacity: useTransform(smoothProgress, [0.46, 0.50, 0.64, 0.68], [0, 1, 1, 0]),
              x: useTransform(smoothProgress, [0.46, 0.50, 0.64, 0.68], [-40, 0, 0, -40]),
            }}
          >
            <span className="story-eyebrow">CHAPTER 03 // MULTI-CAR BATTLEGRID</span>
            <h2 className="story-title">TACTICAL INTERCEPTION COURSE.</h2>
            <p className="story-desc">
              Up to 12 active pods operate simultaneously on the live track with real-time marshalled electronic telemetry monitoring.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val">12 Pods</span>
                <span className="metric-lbl">Simultaneous Grid</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val">100%</span>
                <span className="metric-lbl">Electronic Marshalling</span>
              </div>
            </div>
          </motion.div>

          {/* Chapter 4 Story Card */}
          <motion.div
            className="scrolly-story-card pos-right"
            style={{
              opacity: useTransform(smoothProgress, [0.70, 0.74, 0.82, 0.86], [0, 1, 1, 0]),
              x: useTransform(smoothProgress, [0.70, 0.74, 0.82, 0.86], [40, 0, 0, 40]),
            }}
          >
            <span className="story-eyebrow">CHAPTER 04 // KINETIC IMPACT</span>
            <h2 className="story-title">ELASTIC REBOUND COLLISION.</h2>
            <p className="story-desc">
              High-density nitrogen bumper ring absorbs 94% of impact energy, producing high-energy elastic bounces without chassis deformation.
            </p>
            <div className="story-metrics-grid">
              <div className="metric-cell">
                <span className="metric-val">94%</span>
                <span className="metric-lbl">Shock Absorption</span>
              </div>
              <div className="metric-cell">
                <span className="metric-val">5-Point</span>
                <span className="metric-lbl">Safety Harness</span>
              </div>
            </div>
          </motion.div>

          {/* Chapter 5 Final Call to Action */}
          <motion.div
            className="scrolly-story-card pos-bottom"
            style={{
              opacity: useTransform(smoothProgress, [0.88, 0.92, 1], [0, 1, 1]),
              y: useTransform(smoothProgress, [0.88, 0.92, 1], [30, 0, 0]),
            }}
          >
            <BorderTrail size={50} duration={3} />
            <div style={{ textAlign: 'center' }}>
              <span className="story-eyebrow">CHAPTER 05 // TAKE THE PILOT SEAT</span>
              <h2 className="story-title">EXPERIENCE IT LIVE IN HYDERABAD.</h2>
              <p className="story-desc" style={{ maxWidth: '520px', margin: '0 auto 1.5rem' }}>
                Book your physical bumper drift session at Inorbit Mall Hitech City or Sarath City Kondapur. Lock your time slot online with just ₹100 advance.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/booking?game=bumper-cars" className="btn btn-cyber btn-cyber-primary btn-lg">
                  <Calendar size={18} />
                  <span>RESERVE ATTRACTION PASS (FROM ₹100)</span>
                </Link>
                <Link to="/games" className="btn btn-cyber btn-cyber-outline btn-lg">
                  <span>ALL 6 ARENA ATTRACTIONS</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Live Telemetry HUD Bottom Bar */}
          <div className="scrolly-hud-dock">
            <div className="hud-pill-item">
              <span className="hud-pulse-dot" />
              <span>3D WEBGL: <strong>60 FPS</strong></span>
            </div>
            <div className="hud-pill-item">
              <Gauge size={13} style={{ color: activeTheme.accent }} />
              <span>DRIFT SPEED: <strong>{telemetry.speed} KM/H</strong></span>
            </div>
            <div className="hud-pill-item">
              <Battery size={13} style={{ color: '#10b981' }} />
              <span>BATTERY: <strong>{telemetry.power}%</strong></span>
            </div>
            <div className="hud-pill-item">
              <Compass size={13} style={{ color: activeTheme.accent }} />
              <span>G-FORCE: <strong>{telemetry.gforce}</strong></span>
            </div>
          </div>

          {/* Scroll Prompt Indicator */}
          <motion.div 
            className="scrolly-scroll-indicator"
            style={{
              opacity: useTransform(smoothProgress, [0, 0.12], [1, 0])
            }}
          >
            <div className="mouse-scroll-icon" />
            <span>SCROLL TO DRIVE & DRIFT</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
