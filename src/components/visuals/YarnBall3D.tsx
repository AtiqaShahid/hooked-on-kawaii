import { lazy, Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const YarnBallMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.y * 0.15,
      0.05
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -pointer.x * 0.1,
      0.05
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.6}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#FFD6E0"
          roughness={0.8}
          metalness={0.05}
          distort={0.15}
          speed={1.5}
        />
      </mesh>
      {/* Yarn wrapping lines */}
      <YarnThreads />
    </Float>
  );
};

const YarnThreads = () => {
  const groupRef = useRef<THREE.Group>(null);

  const curves = useMemo(() => {
    const result: THREE.CatmullRomCurve3[] = [];
    for (let i = 0; i < 8; i++) {
      const points: THREE.Vector3[] = [];
      const offset = (i / 8) * Math.PI * 2;
      for (let j = 0; j <= 32; j++) {
        const t = (j / 32) * Math.PI * 2;
        const r = 1.05 + Math.sin(t * 3 + offset) * 0.08;
        points.push(
          new THREE.Vector3(
            r * Math.cos(t) * Math.cos(offset + t * 0.3),
            r * Math.sin(t) * 0.9,
            r * Math.cos(t) * Math.sin(offset + t * 0.3)
          )
        );
      }
      result.push(new THREE.CatmullRomCurve3(points, true));
    }
    return result;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={1.6}>
      {curves.map((curve, i) => {
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.018, 6, true);
        return (
          <mesh key={i} geometry={tubeGeo}>
            <meshStandardMaterial
              color={i % 2 === 0 ? "#F8BBD0" : "#E1BEE7"}
              roughness={0.9}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const YarnBall3D = () => (
  <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 pointer-events-auto z-10 hidden md:block">
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#fff5f5" />
      <pointLight position={[-3, 2, 4]} intensity={0.3} color="#E8B4F8" />
      <YarnBallMesh />
    </Canvas>
  </div>
);

export default YarnBall3D;
