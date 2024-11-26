import { TeamMember } from "@/data/teamMembers";
import { Environment, Float, PresentationControls, Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Provider as JotaiProvider } from "jotai";
import { useAtom } from "jotai";
import { Suspense, useState } from "react";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSpring, animated } from '@react-spring/three';

import { Book } from "./Book";
import { LeafGeometry } from "./LeafGeometry";
import { createPages } from "./UI";
import { pageAtom } from "./UI";

interface TeamBookProps {
  members: TeamMember[];
}

export function TeamBook({ members }: TeamBookProps) {
  console.log("TeamBook component rendering");
  console.log("TeamBook received members:", JSON.stringify(members, null, 2));

  return (
    <JotaiProvider>
      <ErrorBoundary
        fallback={<div>Error loading book</div>}
        onError={(error) => console.error("TeamBook error:", error)}
      >
        <Suspense fallback={<div>Loading book...</div>}>
          <TeamBookContent members={members} />
        </Suspense>
      </ErrorBoundary>
    </JotaiProvider>
  );
}

function TeamBookContent({ members }: TeamBookProps) {
  if (!members) {
    throw new Error("Members prop is undefined");
  }

  console.log("TeamBookContent rendering with members:", members);

  const pages = useMemo(() => {
    try {
      console.log("useMemo running in TeamBookContent");
      if (!Array.isArray(members)) {
        throw new Error(`Members is not an array: ${typeof members}`);
      }

      if (members.length === 0) {
        throw new Error("Members array is empty");
      }

      console.log("Creating pages from members in useMemo:", members);
      const result = createPages(members);
      console.log("Created pages result in useMemo:", result);
      return result;
    } catch (error) {
      console.error("Error in useMemo:", error);
      return [];
    }
  }, [members]);

  console.log("Pages after useMemo:", pages);
  const [_, setPage] = useAtom(pageAtom);

  const handleNext = () => {
    if (_ < pages.length - 1) {
      setPage(_ + 1);
    }
  };

  const handlePrev = () => {
    if (_ > 0) {
      setPage(_ - 1);
    }
  };

  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  const isFirstPage = _ === 0;
  const isLastPage = _ >= pages.length - 1;

  const [leftClicked, setLeftClicked] = useState(false);
  const [rightClicked, setRightClicked] = useState(false);

  const leftLeafSpring = useSpring({
    rotation: leftClicked ? [5.35, 0.2, -Math.PI / 3.1] : [5.5, 0, -Math.PI / 2.6],
    scale: leftClicked ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

  const rightLeafSpring = useSpring({
    rotation: rightClicked ? [5.35, -0.2, Math.PI / 1.6] : [5.5, 0, Math.PI / 1.6],
    scale: rightClicked ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

  return (
    <div className="h-[700px] w-full" style={{ touchAction: "none" }}>
      <ErrorBoundary fallback={<div>Error loading 3D scene</div>}>
        <Suspense fallback={<div>Loading 3D scene...</div>}>
          <Canvas
            camera={{
              fov: 45,
              near: 0.1,
              far: 2000,
              position: [0, 2.5, 3],
            }}
            shadows
          >
            <PresentationControls
              global
              rotation={[0, 0.1, 0]}
              polar={[-0.05, 0.05]}
              azimuth={[-0.05, 0.05]}
              config={{ mass: 8, tension: 400 }}
              snap={{ mass: 8, tension: 400 }}
            >
              <Float
                rotation-x={-Math.PI / 5}
                floatIntensity={1}
                speed={2}
                rotationIntensity={1}
              >
                {console.log(
                  "About to render Book component with pages:",
                  pages,
                )}
                {pages && pages.length > 0 && <Book pages={pages} />}
              </Float>
            </PresentationControls>
            <Environment preset="forest" />
            <directionalLight position={[2, 5, 2]} intensity={1.5} castShadow />
            <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
              <planeGeometry args={[100, 100]} />
              <shadowMaterial transparent opacity={0.2} />
            </mesh>

            {/* Navigation buttons */}
            <group position={[0, -3.2, 0.12]}>
              {/* Left Leaf Button */}
              <animated.mesh
                position={[-0.9, 1, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isFirstPage) {
                    setLeftClicked(true);
                    setTimeout(() => {
                      setLeftClicked(false);
                      handlePrev();
                    }, 200);
                  }
                }}
                onPointerEnter={(e) => {
                  if (!isFirstPage) {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                    setLeftHovered(true);
                  }
                }}
                onPointerLeave={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'auto';
                  setLeftHovered(false);
                }}
                rotation={leftLeafSpring.rotation}
                scale={leftLeafSpring.scale}
              >
                <primitive object={new LeafGeometry()} />
                <meshStandardMaterial
                  color={isFirstPage ? "#666666" : (leftHovered ? "#3d7a37" : "#2d5a27")}
                  roughness={0.5}
                  metalness={0.1}
                  opacity={isFirstPage ? 0.1 : 1}
                  transparent
                  side={2}
                />
                {leftHovered && (
                  <Html position={[0, -0.175, 0.4]} center>
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">
                      Previous Page
                    </div>
                  </Html>
                )}
              </animated.mesh>

              {/* Right Leaf Button */}
              <animated.mesh
                position={[0.9, 0.38, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLastPage) {
                    setRightClicked(true);
                    setTimeout(() => {
                      setRightClicked(false);
                      handleNext();
                    }, 200);
                  }
                }}
                onPointerEnter={(e) => {
                  if (!isLastPage) {
                    e.stopPropagation();
                    document.body.style.cursor = 'pointer';
                    setRightHovered(true);
                  }
                }}
                onPointerLeave={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'auto';
                  setRightHovered(false);
                }}
                rotation={rightLeafSpring.rotation}
                scale={rightLeafSpring.scale}
              >
                <primitive object={new LeafGeometry()} />
                <meshStandardMaterial
                  color={isLastPage ? "#666666" : (rightHovered ? "#3d7a37" : "#2d5a27")}
                  roughness={0.5}
                  metalness={0.1}
                  opacity={isLastPage ? 0.1 : 1}
                  transparent
                  side={2}
                />
                {rightHovered && (
                  <Html position={[0.05, -0.2, 0]} center>
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">
                      Next Page
                    </div>
                  </Html>
                )}
              </animated.mesh>
            </group>
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
