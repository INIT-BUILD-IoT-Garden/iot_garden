import { useCursor, useTexture, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
  CanvasTexture,
  LinearFilter,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";

import { pageAtom } from "./UI";
import pageBackground from "/textures/bio-background.jpg"
import defaultCover from "/textures/cover.jpg"

const easingFactor = 0.5; // Controls the speed of the easing
const easingFactorFold = 0.3; // Controls the speed of the easing
const insideCurveStrength = 0.18; // Controls the strength of the curve
const outsideCurveStrength = 0.05; // Controls the strength of the curve
const turningCurveStrength = 0.09; // Controls the strength of the curve

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2,
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  // ALL VERTICES
  vertex.fromBufferAttribute(position, i); // get the vertex
  const x = vertex.x; // get the x position of the vertex

  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH)); // calculate the skin index
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH; // calculate the skin weight

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0); // set the skin indexes
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0); // set the skin weights
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4),
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4),
);

const whiteColor = new Color("antiquewhite");
const emissiveColor = new Color("yellow");

const pageMaterials = [
  new MeshStandardMaterial({
    color: whiteColor,
    transparent: true,
    opacity: 0,
    alphaTest: 0.5,
    side: 1,
  }),
  new MeshStandardMaterial({
    color: "#111",
    transparent: true,
    opacity: 0,
    alphaTest: 0.5,
    side: 1,
  }),
  new MeshStandardMaterial({
    color: whiteColor,
    transparent: true,
    opacity: 0,
    alphaTest: 0.5,
    side: 1,
  }),
  new MeshStandardMaterial({
    color: whiteColor,
    transparent: true,
    opacity: 0,
    alphaTest: 0.5,
    side: 1,
  }),
];


function createTextTexture(content: { name: string; role: string; bio: string }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Set background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Configure text styles
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  
  // Name
  ctx.font = 'bold 74px Arial';
  ctx.fillText(content.name, canvas.width / 2, 100);
  
  // Role
  ctx.font = '55px Arial';
  ctx.fillStyle = '#111';
  ctx.fillText(content.role, canvas.width / 2, 190);
  
  // Bio (with word wrap)
  ctx.font = '48px Arial';
  ctx.fillStyle = '#222';
  const maxWidth = 750;
  const lineHeight = 60;
  const words = content.bio.split(' ');
  let line = '';
  let y = 300;

  words.forEach(word => {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      ctx.fillText(line, canvas.width / 2, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, canvas.width / 2, y);

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  return texture;
}

const Page = ({
  number,
  front,
  back,
  page,
  opened,
  bookClosed,
  totalPages,
  ...props
}) => {
  console.log("Page rendering:", {
    number,
    front,
    back,
    page,
    opened,
    bookClosed,
  });

  const group = useRef();
  const skinnedMeshRef = useRef();
  const [highlighted, setHighlighted] = useState(false);

  const frontTexture = useTexture(
    front.type !== "bio" 
      ? (front.content as string) || defaultCover 
      : pageBackground
  );

  const backTexture = useTexture(
    back.type !== "bio" 
      ? (back.content as string) || defaultCover
      : pageBackground
  );

  const lastOpened = useRef(false);
  const turnedAt = useRef(0);

  useEffect(() => {
    lastOpened.current = false;
    turnedAt.current = 0;
    console.log(`Page mounted: ${number}`);
    return () => console.log(`Page unmounted: ${number}`);
  }, [number]);

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }
    const skeleton = new Skeleton(bones);

    const bioTexture = front.type === "bio" 
      ? createTextTexture(front.content as { name: string; role: string; bio: string })
      : null;

    const materials = [
      ...pageMaterials,
      // Front material
      new MeshStandardMaterial({
        color: whiteColor,
        map: front.type === "bio" ? bioTexture : frontTexture,
        roughness: 0.9,
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
      // Back material
      new MeshStandardMaterial({
        color: whiteColor,
        map: backTexture,
        roughness: 0.5,
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
    ];

    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, [frontTexture, backTexture, front.type, front.content] );

  // useHelper(skinnedMeshRef, SkeletonHelper, "red");

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) {
      return;
    }

    const emissiveIntensity = highlighted ? 0.1 : 0;
    skinnedMeshRef.current.material[4].emissiveIntensity =
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1,
      );

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }
    let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8);
    }

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;
      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);
      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }
      easing.dampAngle(
        target.rotation,
        "y",
        rotationAngle,
        easingFactor,
        delta,
      );

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;
      easing.dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta,
      );
    }
  });

  const [_, setPage] = useAtom(pageAtom);
  useCursor(highlighted, 'zoom-in', 'auto');

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (front.type === "bio" && (front.content as any).link) {
          window.open((front.content as any).link, '_blank');
        }
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
      {highlighted && front.type === "bio" && (front.content as any).link && (
        <Html position={[PAGE_WIDTH / 2, PAGE_HEIGHT / 2, 0.1]} center>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">
            Go To: {(front.content as any).link}
          </div>
        </Html>
      )}
    </group>
  );
};

interface BookProps {
  pages?: {
    front: {
      content: string | {
        name?: string;
        role?: string;
        bio?: string;
        link?: string;
      };
      type: "cover" | "bio" | "image";
    };
    back: {
      content: string | {
        name?: string;
        role?: string;
        bio?: string;
        link?: string;
      };
      type: "cover" | "bio" | "image";
    };
  }[];
}

export const Book = ({ pages: bookPages = [], ...props }: BookProps) => {
  console.log("Book component rendering");
  console.log("Received bookPages:", bookPages);
  console.log("bookPages type:", typeof bookPages);
  console.log("bookPages isArray:", Array.isArray(bookPages));
  console.log("bookPages length:", bookPages?.length);

  const [page] = useAtom(pageAtom);
  console.log("Current page from atom:", page);

  const [delayedPage, setDelayedPage] = useState(page);

  // useEffect to update delayedPage when page changes
  useEffect(() => {
    setDelayedPage(page);
  }, [page]);

  // Preload textures
  useEffect(() => {
    console.log("Book mounted");
    return () => console.log("Book unmounted");
  }, []);

  useEffect(() => {
    console.log("Loading textures for pages:", bookPages);
    if (!bookPages || bookPages.length === 0) {
      console.warn("No pages provided to Book component");
      return;
    }

    try {
      bookPages.forEach((page, index) => {
        console.log(`Loading texture ${index}:`, page.front.front, page.back.back);
        useTexture.preload(page.front.front);
        useTexture.preload(page.back.back);
      });
    } catch (error) {
      console.error("Error loading textures:", error);
    }
  }, [bookPages]);

  if (!bookPages || bookPages.length === 0) {
    return null;
  }

  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {bookPages.map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage >= bookPages.length - 1}
          totalPages={bookPages.length}
          front={pageData.front}
          back={pageData.back}
        />
      ))}
    </group>
  );
};
