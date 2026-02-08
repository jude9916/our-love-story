import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Center } from '@react-three/drei';
import * as THREE from 'three';

interface HeartMeshProps {
  dissolving: boolean;
}

const HeartMesh = ({ dissolving }: HeartMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  // 1. Create the Shape at "Native" Size (Large)
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    
    shape.moveTo(x, y);

    // Resolution: 0.01 for a very smooth curve
    for (let t = 0; t <= Math.PI * 2; t += 0.01) {
      // Standard Heart Parametric Formula
      // x = 16sin^3(t)
      // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
      const px = 16 * Math.pow(Math.sin(t), 3);
      const py = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      shape.lineTo(px, py);
    }
    return shape;
  }, []);

  // 2. Extrusion Settings
  const extrudeSettings = useMemo(() => ({
    depth: 4,             // Thicker extrusion for 3D feel
    bevelEnabled: true,
    bevelSegments: 20,    // Very smooth rounding
    steps: 2,
    bevelSize: 1.5,       // Puffy bevel
    bevelThickness: 3,    // Depth of the bevel
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Mouse interaction
    const targetX = (mouse.x * viewport.width) / 50;
    const targetY = (mouse.y * viewport.height) / 50;

    // Gentle floating rotation
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetX + state.clock.elapsedTime * 0.1,
      0.05
    );
    
    // TIlt slightly based on mouse Y
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetY,
      0.05
    );

    // Dissolve animation logic
    if (dissolving) {
      meshRef.current.scale.multiplyScalar(0.95);
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material.opacity > 0) material.opacity -= 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Center>
        <mesh 
          ref={meshRef} 
          // Scale it down because the math formula produces a large shape (~30 units)
          scale={0.1} 
          // ROTATION FIXED: [0, 0, 0] ensures it stands upright.
          rotation={[0, 0, 0]} 
        >
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <MeshDistortMaterial
            color="#D90429"      /* Deep Vivid Red */
            emissive="#590d22"   /* Subtle glow from inside */
            emissiveIntensity={0.3}
            roughness={0.2}      /* Glossy */
            metalness={0.8}      /* Metallic reflection */
            distort={0.1}        /* Subtle wobble */
            speed={2}
          />
        </mesh>
      </Center>
    </Float>
  );
};

const FloatingHeart = ({ dissolving }: { dissolving: boolean }) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} color="#ff8fab" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#fff0f3" />
        
        <HeartMesh dissolving={dissolving} />
      </Canvas>
    </div>
  );
};

export default FloatingHeart;