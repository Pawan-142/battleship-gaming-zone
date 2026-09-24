import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowDown, ChevronRight, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import './Battleship.css';

export const BumperCarCinematic = ({ onBookClick, onExploreClick }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  
  // Three.js scene references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Car and scene objects
  const car1Ref = useRef(null); // Main crimson car (#07)
  const car2Ref = useRef(null); // Slate car (#04)
  const car3Ref = useRef(null); // Light Gray car (#09)
  const car4Ref = useRef(null); // Charcoal car (#12)
  const sparksRef = useRef([]);

  // Stages configuration according to user request
  const STAGES = [
    { id: 1, range: [0.00, 0.12], title: "1. Stationary", label: "Pre-Grid Position" },
    { id: 2, range: [0.12, 0.25], title: "2. Accelerating", label: "Instant Torque" },
    { id: 3, range: [0.25, 0.40], title: "3. Camera Tracking", label: "Dynamic Tracking" },
    { id: 4, range: [0.40, 0.55], title: "4. Cars Enter", label: "Multi-Car Grid" },
    { id: 5, range: [0.55, 0.70], title: "5. Approaching", label: "Collision Path" },
    { id: 6, range: [0.70, 0.80], title: "6. The Bump", label: "Kinetic Impact" },
    { id: 7, range: [0.80, 0.90], title: "7. Camera Pullback", label: "Rebound Recoil" },
    { id: 8, range: [0.90, 1.00], title: "8. Full Arena", label: "Battleship Arena" }
  ];

  // Helper to build a high-quality, authentic 3D Bumper Car in Three.js matching the reference vehicle
  const createBumperCar = (bodyColorHex = 0x6e1022, accentColorHex = 0xCB2957, numberText = "07") => {
    const carGroup = new THREE.Group();

    // =========================================================================
    // 1. REALISTIC RUBBER BUMPER COLLAR (Flat oval bullnose bumper from blueprint)
    // =========================================================================
    // Create an authentic extruded rounded oval bumper ring
    const bumperShape = new THREE.Shape();
    const bW = 1.15; // half width
    const bL = 1.45; // half length
    const bR = 0.55; // corner radius

    bumperShape.moveTo(-bW + bR, -bL);
    bumperShape.lineTo(bW - bR, -bL);
    bumperShape.quadraticCurveTo(bW, -bL, bW, -bL + bR);
    bumperShape.lineTo(bW, bL - bR);
    bumperShape.quadraticCurveTo(bW, bL, bW - bR, bL);
    bumperShape.lineTo(-bW + bR, bL);
    bumperShape.quadraticCurveTo(-bW, bL, -bW, bL - bR);
    bumperShape.lineTo(-bW, -bL + bR);
    bumperShape.quadraticCurveTo(-bW, -bL, -bW + bR, -bL);

    // Thick wrap-around outer torus bumper
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

    // =========================================================================
    // 2. SCULPTED METALLIC WINE CLEARCOAT FIBERGLASS BODY
    // =========================================================================
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: bodyColorHex,
      roughness: 0.14,
      metalness: 0.62,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.98,
      ior: 1.52,
    });

    // Lower Main Hull Tub
    const hullGeom = new THREE.CylinderGeometry(1.42, 1.62, 0.65, 48);
    hullGeom.scale(0.95, 1.0, 1.25);
    const hullMesh = new THREE.Mesh(hullGeom, bodyMat);
    hullMesh.position.y = 0.58;
    hullMesh.castShadow = true;
    carGroup.add(hullMesh);

    // Sloping Front Hood with Aerodynamic Contours
    const hoodGeom = new THREE.SphereGeometry(1.24, 36, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    hoodGeom.scale(0.98, 0.54, 1.22);
    const hoodMesh = new THREE.Mesh(hoodGeom, bodyMat);
    hoodMesh.position.set(0, 0.68, 0.48);
    hoodMesh.castShadow = true;
    carGroup.add(hoodMesh);

    // Dual Raised Center Hood Strakes (Signature Blueprint Feature)
    const strakeMat = new THREE.MeshPhysicalMaterial({
      color: bodyColorHex,
      roughness: 0.12,
      metalness: 0.65,
      clearcoat: 1.0,
    });
    const strakeGeom = new THREE.CylinderGeometry(0.042, 0.042, 1.15, 16);
    strakeGeom.rotateX(Math.PI / 2.7);

    const leftStrake = new THREE.Mesh(strakeGeom, strakeMat);
    leftStrake.position.set(-0.26, 0.94, 0.58);
    leftStrake.castShadow = true;
    carGroup.add(leftStrake);

    const rightStrake = new THREE.Mesh(strakeGeom, strakeMat);
    rightStrake.position.set(0.26, 0.94, 0.58);
    rightStrake.castShadow = true;
    carGroup.add(rightStrake);

    // Rear High Cowl Deck (Encapsulating the dual seats)
    const rearDeckGeom = new THREE.CylinderGeometry(1.15, 1.35, 0.72, 32, 1, false, Math.PI * 0.75, Math.PI * 1.5);
    rearDeckGeom.scale(0.96, 1.0, 0.95);
    const rearDeck = new THREE.Mesh(rearDeckGeom, bodyMat);
    rearDeck.position.set(0, 0.92, -0.72);
    rearDeck.castShadow = true;
    carGroup.add(rearDeck);

    // Side Door Scallops / Lower Entry Flanks
    const flankGeom = new THREE.BoxGeometry(0.18, 0.38, 1.2);
    const leftFlank = new THREE.Mesh(flankGeom, bodyMat);
    leftFlank.position.set(-1.24, 0.72, -0.1);
    carGroup.add(leftFlank);

    const rightFlank = new THREE.Mesh(flankGeom, bodyMat);
    rightFlank.position.set(1.24, 0.72, -0.1);
    carGroup.add(rightFlank);

    // Sleek Front Recessed LED Headlight Slots
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

    // Lower Front Air Intake Grille
    const intakeGeom = new THREE.BoxGeometry(0.78, 0.07, 0.08);
    const intake = new THREE.Mesh(intakeGeom, darkHousingMat);
    intake.position.set(0, 0.52, 1.52);
    carGroup.add(intake);

    // =========================================================================
    // 3. DUAL LEATHER SEATS WITH TWIN HEADRESTS (Two Operator Positions)
    // =========================================================================
    const cockpitGeom = new THREE.CylinderGeometry(0.98, 0.98, 0.54, 32);
    cockpitGeom.scale(0.92, 1.0, 1.15);
    const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x121216, roughness: 0.85 });
    const cockpitMesh = new THREE.Mesh(cockpitGeom, cockpitMat);
    cockpitMesh.position.set(0, 0.78, -0.05);
    carGroup.add(cockpitMesh);

    // Fluted Black Leather Seat Upholstery Material
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x1c1e24,
      roughness: 0.65,
      metalness: 0.08,
    });

    // Seat Cushions (Driver & Passenger Left/Right)
    const cushionGeom = new THREE.BoxGeometry(0.48, 0.16, 0.62);
    const leftCushion = new THREE.Mesh(cushionGeom, leatherMat);
    leftCushion.position.set(-0.28, 0.74, -0.32);
    carGroup.add(leftCushion);

    const rightCushion = new THREE.Mesh(cushionGeom, leatherMat);
    rightCushion.position.set(0.28, 0.74, -0.32);
    carGroup.add(rightCushion);

    // Contoured Fluted Backrests
    const backrestGeom = new THREE.BoxGeometry(0.48, 0.78, 0.18);
    
    const leftBack = new THREE.Mesh(backrestGeom, leatherMat);
    leftBack.position.set(-0.28, 1.22, -0.65);
    leftBack.rotation.x = 0.12;
    leftBack.castShadow = true;
    carGroup.add(leftBack);

    const rightBack = new THREE.Mesh(backrestGeom, leatherMat);
    rightBack.position.set(0.28, 1.22, -0.65);
    rightBack.rotation.x = 0.12;
    rightBack.castShadow = true;
    carGroup.add(rightBack);

    // Twin Rounded Headrests (Signature Dodgem Feature)
    const headrestGeom = new THREE.SphereGeometry(0.22, 24, 20);
    headrestGeom.scale(1.0, 1.2, 0.75);

    const leftHead = new THREE.Mesh(headrestGeom, leatherMat);
    leftHead.position.set(-0.28, 1.76, -0.72);
    leftHead.castShadow = true;
    carGroup.add(leftHead);

    const rightHead = new THREE.Mesh(headrestGeom, leatherMat);
    rightHead.position.set(0.28, 1.76, -0.72);
    rightHead.castShadow = true;
    carGroup.add(rightHead);

    // =========================================================================
    // 4. ANGLED 45° STEERING ASSEMBLY & WHEEL
    // =========================================================================
    const columnGeom = new THREE.CylinderGeometry(0.045, 0.05, 0.68, 16);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x18181c, metalness: 0.8, roughness: 0.3 });
    const colMesh = new THREE.Mesh(columnGeom, metalMat);
    colMesh.position.set(0, 0.98, 0.28);
    colMesh.rotation.x = -0.52;
    carGroup.add(colMesh);

    // 3-Spoke Sport Steering Wheel
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

    // =========================================================================
    // 5. TELESCOPING STEEL POWER MAST & SPARK PICK-UP
    // =========================================================================
    const poleGroup = new THREE.Group();

    // Heavy Conical Base Boot on rear body
    const bootGeom = new THREE.CylinderGeometry(0.06, 0.13, 0.42, 16);
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.9 });
    const poleBoot = new THREE.Mesh(bootGeom, bootMat);
    poleBoot.position.set(0, 1.24, -1.14);
    poleGroup.add(poleBoot);

    // Middle Steel Power Mast
    const mastGeom = new THREE.CylinderGeometry(0.028, 0.028, 3.2, 16);
    const chromeMastMat = new THREE.MeshStandardMaterial({
      color: 0x222228,
      metalness: 0.95,
      roughness: 0.15,
    });
    const mast = new THREE.Mesh(mastGeom, chromeMastMat);
    mast.position.set(0, 2.94, -1.14);
    poleGroup.add(mast);

    // Top Electrical Contact Collector
    const topTipGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.35, 16);
    const topTipMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: accentColorHex,
      emissiveIntensity: 3.2,
    });
    const topTip = new THREE.Mesh(topTipGeom, topTipMat);
    topTip.position.set(0, 4.64, -1.14);
    poleGroup.add(topTip);

    carGroup.add(poleGroup);

    // =========================================================================
    // 6. REALISTIC UNDERGLOW & SPOTLIGHTS
    // =========================================================================
    // Forward Spot Light beam casting on floor
    const spot = new THREE.SpotLight(0xfffae0, 5.0, 24, Math.PI / 4, 0.4, 1.2);
    spot.position.set(0, 0.72, 1.45);
    spot.target.position.set(0, 0, 12);
    carGroup.add(spot);
    carGroup.add(spot.target);

    // Rear Red Tail Lamps
    const tailLightGeom = new THREE.BoxGeometry(0.24, 0.08, 0.04);
    const tailLightMat = new THREE.MeshStandardMaterial({
      color: 0xff1133,
      emissive: 0xff1133,
      emissiveIntensity: 3.2,
    });
    const leftTail = new THREE.Mesh(tailLightGeom, tailLightMat);
    leftTail.position.set(-0.52, 0.76, -1.44);
    carGroup.add(leftTail);

    const rightTail = new THREE.Mesh(tailLightGeom, tailLightMat);
    rightTail.position.set(0.52, 0.76, -1.44);
    carGroup.add(rightTail);

    // Underbody Ground Glow
    const underGlow = new THREE.PointLight(accentColorHex, 4.0, 5.0);
    underGlow.position.set(0, 0.22, 0);
    carGroup.add(underGlow);

    return carGroup;
  };

  // Spark particle generator for collision
  const createSparks = (scene) => {
    const particleCount = 80;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0.5;
      positions[i * 3 + 2] = 0;
      velocities.push({
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 6 + 2.0,
        z: (Math.random() - 0.5) * 8,
        life: Math.random()
      });
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xCB2957,
      size: 0.18,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geom, mat);
    scene.add(points);
    return { points, velocities, count: particleCount };
  };

  // Setup Three.js scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0b0e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.2, 2.2, 5.4);
    camera.lookAt(0, 1.1, 0);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    rendererRef.current = renderer;

    // 3. Bright Studio Arena Lighting (High Visibility)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainKeyLight.position.set(6, 12, 8);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 2048;
    mainKeyLight.shadow.mapSize.height = 2048;
    scene.add(mainKeyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 2.2);
    fillLight.position.set(-8, 10, 6);
    scene.add(fillLight);

    const crimsonUnderGlow = new THREE.PointLight(0xCB2957, 6.0, 20);
    crimsonUnderGlow.position.set(0, 0.2, 0);
    scene.add(crimsonUnderGlow);

    const overheadSpot = new THREE.SpotLight(0xffffff, 4.0, 45, Math.PI / 3.2, 0.4, 1.2);
    overheadSpot.position.set(0, 16, 0);
    scene.add(overheadSpot);

    // 4. Polished Reflective Arena Floor
    const floorGeom = new THREE.PlaneGeometry(90, 90);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x121318,
      roughness: 0.15,
      metalness: 0.5,
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Floor Grid lines
    const grid = new THREE.GridHelper(70, 35, 0xCB2957, 0x33333e);
    grid.position.y = 0.01;
    scene.add(grid);

    // Track Perimeter Barrier Wall
    const barrierGeom = new THREE.BoxGeometry(50, 1.2, 0.5);
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x22242a, roughness: 0.6 });
    
    const bNorth = new THREE.Mesh(barrierGeom, barrierMat);
    bNorth.position.set(0, 0.6, -25);
    scene.add(bNorth);

    const bSouth = new THREE.Mesh(barrierGeom, barrierMat);
    bSouth.position.set(0, 0.6, 25);
    scene.add(bSouth);

    const bWest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 50), barrierMat);
    bWest.position.set(-25, 0.6, 0);
    scene.add(bWest);

    const bEast = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 50), barrierMat);
    bEast.position.set(25, 0.6, 0);
    scene.add(bEast);

    // Overhead Industrial Trusses
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x2e3038, metalness: 0.85, roughness: 0.3 });
    for (let z = -20; z <= 20; z += 10) {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(50, 0.5, 0.5), trussMat);
      truss.position.set(0, 14, z);
      scene.add(truss);
    }

    // 5. Spawn Bumper Cars
    // Car 1: Main Hero Crimson Car (#07)
    const car1 = createBumperCar(0xCB2957, 0xCB2957, "07");
    car1.position.set(0, 0, 0);
    car1.rotation.y = 0.3; // Angle towards camera
    scene.add(car1);
    car1Ref.current = car1;

    // Car 2: Opponent Slate Car (#04)
    const car2 = createBumperCar(0x353a45, 0xCB2957, "04");
    car2.position.set(12, 0, 14);
    scene.add(car2);
    car2Ref.current = car2;

    // Car 3: Background Light Gray Car (#09)
    const car3 = createBumperCar(0xdddddd, 0xCB2957, "09");
    car3.position.set(-14, 0, -8);
    car3.rotation.y = 0.8;
    scene.add(car3);
    car3Ref.current = car3;

    // Car 4: Background Charcoal Car (#12)
    const car4 = createBumperCar(0x484950, 0xeeeeee, "12");
    car4.position.set(15, 0, -12);
    car4.rotation.y = -1.2;
    scene.add(car4);
    car4Ref.current = car4;

    // Spark system
    sparksRef.current = createSparks(scene);

    // Mouse Parallax tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let time = 0;
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      time += 0.016;

      // Smooth mouse parallax interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      if (cameraRef.current) {
        cameraRef.current.position.x += mouse.x * 0.02;
        cameraRef.current.position.y += -mouse.y * 0.015;
      }

      // Spark particles logic
      if (sparksRef.current && sparksRef.current.points) {
        const { points, velocities, count } = sparksRef.current;
        const p = scrollProgress;
        if (p >= 0.70 && p <= 0.82) {
          points.material.opacity = (1 - (p - 0.70) / 0.12) * 0.95;
          const posAttr = points.geometry.attributes.position;
          for (let i = 0; i < count; i++) {
            posAttr.setXYZ(
              i,
              posAttr.getX(i) + velocities[i].x * 0.02,
              Math.max(0.05, posAttr.getY(i) + velocities[i].y * 0.02 - 0.05),
              posAttr.getZ(i) + velocities[i].z * 0.02
            );
          }
          posAttr.needsUpdate = true;
        } else {
          points.material.opacity = 0;
        }
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

  // Update 3D Choreography based on scroll progress (0.00 to 1.00)
  const updateChoreography = (p) => {
    if (!car1Ref.current || !car2Ref.current || !cameraRef.current) return;

    const car1 = car1Ref.current;
    const car2 = car2Ref.current;
    const car3 = car3Ref.current;
    const car4 = car4Ref.current;
    const camera = cameraRef.current;

    if (car1.userData.bumperMesh) car1.userData.bumperMesh.scale.set(1, 1, 1);
    if (car2.userData.bumperMesh) car2.userData.bumperMesh.scale.set(1, 1, 1);

    const current = STAGES.find(s => p >= s.range[0] && p <= s.range[1]) || STAGES[0];
    setActiveStage(current.id);

    // STAGE 1: Stationary Car (0.00 - 0.12)
    if (p <= 0.12) {
      const sub = p / 0.12;
      car1.position.set(0, 0, 0);
      car1.rotation.set(0, 0.45 * (1 - sub), 0);

      camera.position.set(
        3.2 + Math.sin(sub * 0.4) * 0.8,
        2.2 - sub * 0.2,
        5.4 - sub * 0.6
      );
      camera.lookAt(0, 1.1, 0);

      car2.position.set(12, 0, 10);
      car3.position.set(-10, 0, -6);
      car4.position.set(10, 0, -8);
    }
    // STAGE 2: Accelerating Forward (0.12 - 0.25)
    else if (p > 0.12 && p <= 0.25) {
      const sub = (p - 0.12) / (0.25 - 0.12);
      const dist = sub * 7.0;
      
      car1.position.set(0, 0, dist);
      car1.rotation.set(-0.02 * (1 - sub), 0, 0);
      if (car1.userData.steerWheel) car1.userData.steerWheel.rotation.z = Math.sin(sub * Math.PI) * 0.25;

      camera.position.set(2.4, 1.5, dist + 3.4);
      camera.lookAt(car1.position.x, 0.7, car1.position.z + 1.5);

      car2.position.set(12 - sub * 2, 0, 10);
    }
    // STAGE 3: Camera Tracking in Banked Turn (0.25 - 0.40)
    else if (p > 0.25 && p <= 0.40) {
      const sub = (p - 0.25) / (0.40 - 0.25);
      const angle = sub * 1.2;
      const radius = 6.5;
      
      const posX = -Math.sin(angle) * radius;
      const posZ = 7.0 + (1 - Math.cos(angle)) * radius + sub * 2.0;

      car1.position.set(posX, 0, posZ);
      car1.rotation.set(0, -angle, -0.04);
      if (car1.userData.steerWheel) car1.userData.steerWheel.rotation.z = -0.6;

      camera.position.set(
        posX + Math.sin(angle + 0.5) * 3.8,
        1.4 + sub * 0.3,
        posZ - Math.cos(angle + 0.5) * 3.8
      );
      camera.lookAt(car1.position.x, 0.7, car1.position.z);

      car2.position.set(10 - sub * 4, 0, 10 + sub * 2);
    }
    // STAGE 4: Other Cars Enter Grid (0.40 - 0.55)
    else if (p > 0.40 && p <= 0.55) {
      const sub = (p - 0.40) / (0.55 - 0.40);
      
      const posX = -5.0 + sub * 3.0;
      const posZ = 13.0 + sub * 2.0;
      car1.position.set(posX, 0, posZ);
      car1.rotation.set(0, -0.4, 0);

      const c2X = 6.5 - sub * 4.0;
      const c2Z = 17.0 - sub * 2.0;
      car2.position.set(c2X, 0, c2Z);
      car2.rotation.set(0, 2.7, 0);

      car3.position.set(-10 + sub * 3, 0, -4 + sub * 2);
      car4.position.set(8 - sub * 2, 0, -6 - sub * 2);

      camera.position.set(0, 3.4 + sub * 0.8, 11.0 - sub * 1.0);
      camera.lookAt((car1.position.x + car2.position.x) / 2, 0.7, (car1.position.z + car2.position.z) / 2);
    }
    // STAGE 5: Approaching Trajectory (0.55 - 0.70)
    else if (p > 0.55 && p <= 0.70) {
      const sub = (p - 0.55) / (0.70 - 0.55);
      
      const targetX = 0;
      const targetZ = 15.0;

      const c1StartX = -2.0;
      const c1StartZ = 14.5;
      const c2StartX = 2.5;
      const c2StartZ = 15.0;

      car1.position.set(
        c1StartX + (targetX - 0.75 - c1StartX) * sub,
        0,
        c1StartZ + (targetZ - c1StartZ) * sub
      );
      car1.rotation.set(0, 0.4, 0);

      car2.position.set(
        c2StartX + (targetX + 0.75 - c2StartX) * sub,
        0,
        c2StartZ + (targetZ - c2StartZ) * sub
      );
      car2.rotation.set(0, -2.7, 0);

      camera.position.set(
        -3.8 + sub * 1.0,
        1.9 + sub * 0.4,
        15.0 + Math.sin(sub * Math.PI) * 1.5
      );
      camera.lookAt(targetX, 0.7, targetZ);
    }
    // STAGE 6: Realistic Bump & Collision Physics (0.70 - 0.80)
    else if (p > 0.70 && p <= 0.80) {
      const sub = (p - 0.70) / (0.80 - 0.70);
      const impactCenter = { x: 0, z: 15.0 };

      const shakeAmp = (1 - sub) * 0.2;
      const shakeX = (Math.random() - 0.5) * shakeAmp;
      const shakeY = (Math.random() - 0.5) * shakeAmp;

      if (sub < 0.25) {
        const comp = sub / 0.25;
        car1.position.set(-0.65 + comp * 0.1, 0, 15.0);
        car2.position.set(0.65 - comp * 0.1, 0, 15.0);
        
        if (car1.userData.bumperMesh) car1.userData.bumperMesh.scale.set(0.85, 1.0, 1.0);
        if (car2.userData.bumperMesh) car2.userData.bumperMesh.scale.set(0.85, 1.0, 1.0);
      } else {
        const rebound = (sub - 0.25) / 0.75;
        car1.position.set(-0.55 - rebound * 2.4, 0, 15.0 - rebound * 1.3);
        car1.rotation.set(0, 0.4 - rebound * 1.9, rebound * 0.05);

        car2.position.set(0.55 + rebound * 2.5, 0, 15.0 + rebound * 1.1);
        car2.rotation.set(0, -2.7 + rebound * 1.7, -rebound * 0.05);
      }

      if (sparksRef.current && sparksRef.current.points) {
        sparksRef.current.points.position.set(impactCenter.x, 0.5, impactCenter.z);
      }

      camera.position.set(
        -2.6 + shakeX,
        2.3 + shakeY,
        18.0 - sub * 1.5
      );
      camera.lookAt(impactCenter.x, 0.7, impactCenter.z);
    }
    // STAGE 7: Camera Pullback (0.80 - 0.90)
    else if (p > 0.80 && p <= 0.90) {
      const sub = (p - 0.80) / (0.90 - 0.80);

      car1.position.set(-2.95 - sub * 1.6, 0, 13.7 - sub * 2.0);
      car1.rotation.set(0, -1.5, 0);

      car2.position.set(3.05 + sub * 1.6, 0, 16.1 + sub * 1.6);
      car2.rotation.set(0, -1.0, 0);

      camera.position.set(
        -2.5 + sub * 2.5,
        2.3 + sub * 9.0,
        16.5 - sub * 8.5
      );
      camera.lookAt(0, 0.5, 10.0);
    }
    // STAGE 8: Full Arena Reveal (0.90 - 1.00)
    else {
      const sub = (p - 0.90) / (1.00 - 0.90);

      car1.position.set(-4.55 - sub * 2.0, 0, 11.7 - sub * 3.0);
      car1.rotation.set(0, -1.6, 0);

      car2.position.set(4.65 + sub * 2.0, 0, 17.7 - sub * 2.0);
      car2.rotation.set(0, -0.9, 0);

      car3.position.set(-8.0 + sub * 4.0, 0, 0.0 + sub * 4.0);
      car4.position.set(6.0 - sub * 4.0, 0, -4.0 + sub * 2.0);

      camera.position.set(
        0,
        14.5 + sub * 2.5,
        -1.0 - sub * 2.5
      );
      camera.lookAt(0, 0, 10.0);
    }
  };

  // Scroll listener mapped to 0 -> 1 progress
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const totalScrollable = rect.height - window.innerHeight;
            if (totalScrollable > 0) {
              const currentScroll = -rect.top;
              const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
              setScrollProgress(progress);
              updateChoreography(progress);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to specific milestone stage
  const jumpToStage = (stageId) => {
    if (!containerRef.current) return;
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return;

    const targetProgress = stage.range[0] + (stage.range[1] - stage.range[0]) * 0.4;
    const containerTop = window.scrollY + containerRef.current.getBoundingClientRect().top;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = containerTop + (totalScrollable * targetProgress);

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  // Auto-play preview driver
  useEffect(() => {
    if (!isAutoPlaying) return;
    let curr = scrollProgress;
    const interval = setInterval(() => {
      curr += 0.004;
      if (curr > 1) curr = 0;
      setScrollProgress(curr);
      updateChoreography(curr);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoPlaying, scrollProgress]);

  return (
    <section id="cinematic-hero" ref={containerRef} className="bs-hero-section">
      {/* Sticky Fullscreen Cinematic Viewport */}
      <div className="bs-hero-sticky">
        {/* 3D WebGL Canvas */}
        <canvas ref={canvasRef} className="bs-canvas" />

        {/* TOP HUD */}
        <div className="bs-hero-hud">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="bs-live-dot"></span>
            <span style={{ color: '#EEEEEE', letterSpacing: '0.22em' }}>BATTLESHIP ARENA &bull; HYDERABAD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="bs-hud-pill">
              STAGE {activeStage}/8 &bull; {STAGES.find(s => s.id === activeStage)?.label}
            </span>
            <span style={{ opacity: 0.7 }}>{Math.round(scrollProgress * 100)}% SCROLL DEPTH</span>
          </div>
        </div>

        {/* CENTER CONTENT: Dynamic Minimalist Typography Overlays */}
        <div className="bs-hero-center">
          {/* Phase 1: Beginning (0.00 - 0.28) */}
          {scrollProgress <= 0.28 && (
            <div style={{ pointerEvents: 'auto' }}>
              <span className="bs-hero-tag">Battleship Electric Arena</span>
              <h1 className="bs-hero-title">Bumper Cars</h1>
              <p className="bs-hero-subtitle">Crash. Spin. Laugh. Repeat.</p>
              
              <div className="bs-scroll-cue">
                <ArrowDown size={14} color="#CB2957" />
                <span>Scroll to accelerate & collide</span>
              </div>
            </div>
          )}

          {/* Phase 2: Mid-Action Driving (0.28 - 0.68) */}
          {scrollProgress > 0.28 && scrollProgress < 0.72 && (
            <div className="bs-phase-box">
              <span className="bs-hero-tag" style={{ marginBottom: '6px' }}>
                {scrollProgress < 0.50 ? "02 / Instant Electric Torque" : "03 / Collision Inbound"}
              </span>
              <h2 className="bs-phase-box-title">
                {scrollProgress < 0.50 ? "Dual-Motor Precision Drift" : "Collision Inbound"}
              </h2>
              <p className="bs-phase-box-desc">
                {scrollProgress < 0.50
                  ? "Responsive dual joysticks with instant 360-degree rotation on high-gloss epoxy deck."
                  : "Brace for impact. Heavy pneumatic polyurethane bumper absorbs 94% kinetic energy."}
              </p>
            </div>
          )}

          {/* Phase 3: The Collision Spark Milestone (0.72 - 0.82) */}
          {scrollProgress >= 0.72 && scrollProgress < 0.85 && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid #CB2957', background: 'rgba(203, 41, 87, 0.2)', color: '#EEEEEE', padding: '6px 16px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                <Sparkles size={13} color="#CB2957" /> Direct Kinetic Impact
              </span>
              <h2 className="bs-hero-title" style={{ marginTop: '16px', fontSize: 'clamp(44px, 7vw, 92px)' }}>
                The Bump.
              </h2>
            </div>
          )}

          {/* Phase 4: Arena Reveal & Action CTAs (0.85 - 1.00) */}
          {scrollProgress >= 0.85 && (
            <div className="bs-reveal-box" style={{ pointerEvents: 'auto' }}>
              <span className="bs-hero-tag">Battleship Hyderabad &bull; 12,000 Sq.Ft Deck</span>
              <h2 className="bs-reveal-title">Built for the bump.</h2>
              <p className="bs-hero-subtitle" style={{ margin: '16px auto 0' }}>
                Grab your friends, pick your ride and let the collisions begin.
              </p>

              {/* CTAs */}
              <div className="bs-reveal-cta-group">
                <button
                  onClick={() => {
                    if (onBookClick) onBookClick();
                    else {
                      const el = document.getElementById('booking');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bs-btn-forge-crimson"
                >
                  <span>Book Your Session</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => {
                    if (onExploreClick) onExploreClick();
                    else {
                      const el = document.getElementById('experiences');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bs-btn-forge"
                >
                  Explore Experience
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS: Timeline Scrubber & Quick Stage Selector */}
        <div className="bs-hero-controls">
          <div className="bs-controls-panel">
            
            {/* Stage Pills Navigation */}
            <div className="bs-stages-list">
              {STAGES.map((s) => {
                const isActive = activeStage === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => jumpToStage(s.id)}
                    className={`bs-stage-btn ${isActive ? 'active' : ''}`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>

            {/* Scrubber playback controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="bs-stage-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EEEEEE' }}
              >
                {isAutoPlaying ? <Pause size={12} color="#CB2957" /> : <Play size={12} color="#CB2957" />}
                <span>{isAutoPlaying ? "Pause" : "Auto Drive"}</span>
              </button>
              <button
                onClick={() => jumpToStage(1)}
                title="Reset to Stage 1"
                className="bs-stage-btn"
                style={{ padding: '8px' }}
              >
                <RotateCcw size={12} />
              </button>
            </div>

          </div>

          {/* Progress Bar Indicator */}
          <div className="bs-progress-bar">
            <div
              className="bs-progress-fill"
              style={{ width: `${Math.max(1, scrollProgress * 100)}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
