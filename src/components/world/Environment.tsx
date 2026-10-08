"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky, useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import {
  CanvasTexture,
  Group,
  InstancedMesh,
  Object3D,
  SRGBColorSpace,
  type Texture,
} from "three";
import {
  PROJECTS_DATA,
  SKILLS_DATA,
  TIMELINE_DATA,
  projectExhibits,
  type Destination,
} from "@/lib/portfolio";
import type { Quality } from "./types";

function Box({
  position,
  size,
  color,
  rotation = [0, 0, 0],
  castShadow = true,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: [number, number, number];
  castShadow?: boolean;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  );
}

function Label({
  text,
  subtitle = "",
  position,
  rotation = [0, 0, 0],
  width = 7,
  color = "#f0a51a",
  dark = "#162b2b",
  onClick,
}: {
  text: string;
  subtitle?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  color?: string;
  dark?: string;
  onClick?: () => void;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 320;
    const context = canvas.getContext("2d")!;
    context.fillStyle = dark;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    context.fillRect(0, 0, 18, canvas.height);
    context.textAlign = "center";
    context.fillStyle = "#fff8e9";
    let size = 68;
    context.font = `800 ${size}px sans-serif`;
    while (context.measureText(text).width > 900 && size > 26) {
      size -= 2;
      context.font = `800 ${size}px sans-serif`;
    }
    context.fillText(text.toUpperCase(), 520, 142);
    context.fillStyle = color;
    context.font = "600 25px sans-serif";
    context.fillText(subtitle.toUpperCase(), 520, 220);
    const output = new CanvasTexture(canvas);
    output.colorSpace = SRGBColorSpace;
    output.anisotropy = 4;
    return output;
  }, [color, dark, subtitle, text]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      castShadow
    >
      <boxGeometry args={[width, width * 0.3125, 0.16]} />
      <meshStandardMaterial map={texture} roughness={0.65} />
    </mesh>
  );
}

function Road({
  position,
  size,
  rotation = 0,
}: {
  position: [number, number, number];
  size: [number, number];
  rotation?: number;
}) {
  const markerCount = Math.floor(size[1] / 6);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box
        position={[0, 0, 0]}
        size={[size[0], 0.08, size[1]]}
        color="#526063"
      />
      {Array.from({ length: markerCount }, (_, index) => (
        <Box
          key={index}
          position={[0, 0.06, -size[1] / 2 + 3 + index * 6]}
          size={[0.14, 0.025, 2.6]}
          color="#ddd6a9"
          castShadow={false}
        />
      ))}
    </group>
  );
}

function Forest() {
  const trunks = useRef<InstancedMesh>(null);
  const crowns = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const object = new Object3D();
    for (let index = 0; index < 80; index += 1) {
      const angle = index * 2.39996;
      const radius = 54 + (index % 5) * 4;
      const height = 2.8 + (index % 4) * 0.5;
      object.position.set(
        Math.cos(angle) * radius,
        height / 2,
        Math.sin(angle) * radius,
      );
      object.scale.set(0.36, height, 0.36);
      object.updateMatrix();
      trunks.current!.setMatrixAt(index, object.matrix);
      object.position.y = height + 0.7;
      object.scale.setScalar(1.5 + (index % 3) * 0.22);
      object.updateMatrix();
      crowns.current!.setMatrixAt(index, object.matrix);
    }
    [trunks, crowns].forEach((reference) => {
      reference.current!.instanceMatrix.needsUpdate = true;
      reference.current!.computeBoundingSphere();
    });
  }, []);
  return (
    <>
      <instancedMesh ref={trunks} args={[undefined, undefined, 80]} castShadow>
        <cylinderGeometry args={[0.5, 0.7, 1, 6]} />
        <meshStandardMaterial color="#70503a" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, 80]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#355f46" roughness={0.95} />
      </instancedMesh>
    </>
  );
}

function ProjectBillboard({
  index,
  position,
  onOpen,
}: {
  index: number;
  position: [number, number, number];
  onOpen: (index: number) => void;
}) {
  const project = PROJECTS_DATA[index];
  const texture = useTexture(project.image);
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[4.25, 2.4, 0.24]} position={[0, 3.2, 0]} />
        <Box position={[0, 3.2, 0]} size={[8.5, 4.8, 0.48]} color="#111d20" />
        <Box
          position={[-3.65, 0.9, 0]}
          size={[0.38, 1.8, 0.38]}
          color="#6b523f"
        />
        <Box
          position={[3.65, 0.9, 0]}
          size={[0.38, 1.8, 0.38]}
          color="#6b523f"
        />
      </RigidBody>
      <mesh
        position={[0, 3.4, 0.26]}
        onClick={(event) => {
          event.stopPropagation();
          onOpen(index);
        }}
      >
        <planeGeometry args={[7.9, 3.65]} />
        <meshStandardMaterial
          map={texture as Texture}
          emissive="#ffffff"
          emissiveMap={texture as Texture}
          emissiveIntensity={0.12}
          roughness={0.4}
        />
      </mesh>
      <Label
        text={`${String(index + 1).padStart(2, "0")} · ${project.title}`}
        subtitle="ENTER TO INSPECT"
        position={[0, 0.72, 0.28]}
        width={7.8}
        onClick={() => onOpen(index)}
      />
      <pointLight
        position={[0, 4.2, 1.8]}
        color="#ffd07a"
        intensity={9}
        distance={9}
      />
    </group>
  );
}

function Arrival({ onOpen }: { onOpen: (id: Destination) => void }) {
  return (
    <group position={[0, 0, 18]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.8, 3.8, 0.8]} position={[-5.4, 3.8, 0]} />
        <CuboidCollider args={[0.8, 3.8, 0.8]} position={[5.4, 3.8, 0]} />
        <CuboidCollider args={[6.2, 0.65, 0.8]} position={[0, 7.15, 0]} />
        <Box
          position={[-5.4, 3.8, 0]}
          size={[1.35, 7.6, 1.35]}
          color="#193e39"
        />
        <Box
          position={[5.4, 3.8, 0]}
          size={[1.35, 7.6, 1.35]}
          color="#193e39"
        />
        <Box position={[0, 7.15, 0]} size={[12.1, 1.2, 1.3]} color="#193e39" />
      </RigidBody>
      <Label
        text="SHEHEER'S WORLD"
        subtitle="DRIVE IN · FOLLOW THE ROAD"
        position={[0, 7.15, 0.7]}
        width={10.5}
        onClick={() => onOpen("home")}
      />
      {[-2.2, 0, 2.2].map((x) => (
        <mesh
          key={x}
          position={[x, 0.16, -1.8]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.55, 0.72, 24]} />
          <meshBasicMaterial color="#f0a51a" />
        </mesh>
      ))}
    </group>
  );
}

function Studio({ onOpen }: { onOpen: (id: Destination) => void }) {
  return (
    <group position={[-34, 0, 16]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[6.5, 2.6, 4.4]} position={[0, 2.6, 0]} />
        <Box position={[0, 2.6, 0]} size={[13, 5.2, 8.8]} color="#cf745f" />
        <mesh position={[0, 6.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[8.3, 3, 4]} />
          <meshStandardMaterial color="#243d36" roughness={0.9} />
        </mesh>
      </RigidBody>
      {[-4.2, 0, 4.2].map((x) => (
        <Box
          key={x}
          position={[x, 3, 4.42]}
          size={[2.1, 2.1, 0.12]}
          color="#8fd1d8"
        />
      ))}
      <Box position={[0, 1.5, 4.48]} size={[2.1, 3, 0.16]} color="#17362f" />
      <Label
        text="THE STUDIO"
        subtitle="ABOUT MOHAMMED SHEHEER CB"
        position={[0, 5.25, 4.52]}
        width={10.8}
        color="#ffae8b"
        onClick={() => onOpen("about")}
      />
      <Box position={[8, 0.45, 1]} size={[3.6, 0.35, 1.1]} color="#886340" />
      {[-1.35, 1.35].map((x) => (
        <Box
          key={x}
          position={[8 + x, 0.2, 1]}
          size={[0.22, 0.5, 0.9]}
          color="#243d36"
        />
      ))}
    </group>
  );
}

function ExperienceRail({ onOpen }: { onOpen: (id: Destination) => void }) {
  return (
    <group position={[42, 0, -17]} rotation={[0, -Math.PI / 2, 0]}>
      <Box position={[0, 0.08, 0]} size={[1.7, 0.1, 31]} color="#6f5a48" />
      <Box
        position={[-0.65, 0.21, 0]}
        size={[0.14, 0.18, 31]}
        color="#b1b2a7"
      />
      <Box position={[0.65, 0.21, 0]} size={[0.14, 0.18, 31]} color="#b1b2a7" />
      {Array.from({ length: 17 }, (_, index) => (
        <Box
          key={index}
          position={[0, 0.12, -15 + index * 1.85]}
          size={[2.1, 0.12, 0.24]}
          color="#3f332b"
        />
      ))}
      {TIMELINE_DATA.map((item, index) => (
        <group
          key={item.title}
          position={[5.2, 0, -10 + index * 10]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <RigidBody type="fixed" colliders="cuboid">
            <Box
              position={[0, 1.7, 0]}
              size={[6.2, 3.4, 3.8]}
              color={index === 0 ? "#315d62" : "#60735a"}
            />
          </RigidBody>
          <Label
            text={item.title}
            subtitle={`${item.subtitle} · ${item.date}`}
            position={[0, 3, 1.94]}
            width={5.7}
            color="#ff9a72"
            onClick={() => onOpen("experience")}
          />
          <Box
            position={[0, 0.65, 1.96]}
            size={[1.2, 1.3, 0.1]}
            color="#ffc970"
          />
        </group>
      ))}
    </group>
  );
}

function SkillsFactory({ onOpen }: { onOpen: (id: Destination) => void }) {
  const fan = useRef<Group>(null);
  useFrame((_, delta) => {
    if (fan.current) fan.current.rotation.z += Math.min(delta, 0.1) * 1.2;
  });
  return (
    <group position={[40, 0, 29]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[8, 3.1, 6]} position={[0, 3.1, 0]} />
        <Box position={[0, 3.1, 0]} size={[16, 6.2, 12]} color="#416b58" />
        <Box position={[-5, 7.6, 0]} size={[2.1, 9, 2.1]} color="#2a413a" />
        <Box
          position={[4.8, 6.5, -2]}
          size={[1.65, 6.8, 1.65]}
          color="#2a413a"
        />
      </RigidBody>
      <Label
        text="SKILLS FACTORY"
        subtitle="26 TOOLS · ONE WORKSHOP"
        position={[0, 5.3, 6.08]}
        width={13}
        color="#8ee0ae"
        onClick={() => onOpen("skills")}
      />
      <group ref={fan} position={[0, 2.4, 6.18]}>
        <Box position={[0, 0, 0]} size={[0.3, 4, 0.16]} color="#e6e0c8" />
        <Box position={[0, 0, 0]} size={[4, 0.3, 0.16]} color="#e6e0c8" />
      </group>
      {SKILLS_DATA.map((skill, index) => {
        const column = index % 7;
        const row = Math.floor(index / 7);
        return (
          <Label
            key={skill.name}
            text={skill.name}
            subtitle={`${skill.level}% · ${skill.category}`}
            position={[-13 + column * 4.25, 1.4, 8 + row * 3.4]}
            width={3.7}
            color={
              skill.category === "frontend"
                ? "#8ee0ae"
                : skill.category === "backend"
                  ? "#ffb171"
                  : "#9db5ff"
            }
            onClick={() => onOpen("skills")}
          />
        );
      })}
    </group>
  );
}

function SignalTower({ onOpen }: { onOpen: (id: Destination) => void }) {
  const beacon = useRef<Group>(null);
  useFrame((_, delta) => {
    if (beacon.current) beacon.current.rotation.y += Math.min(delta, 0.1) * 0.8;
  });
  return (
    <group position={[-28, 0, 46]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[5, 2.3, 4]} position={[0, 2.3, 0]} />
        <Box position={[0, 2.3, 0]} size={[10, 4.6, 8]} color="#475a78" />
        <Box position={[0, 7.3, 0]} size={[0.6, 5.4, 0.6]} color="#272f39" />
      </RigidBody>
      <Label
        text="SIGNAL TOWER"
        subtitle="EMAIL · PHONE · WHATSAPP"
        position={[0, 3.6, 4.08]}
        width={8.8}
        color="#b2c8ff"
        onClick={() => onOpen("contact")}
      />
      <group ref={beacon} position={[0, 10.1, 0]}>
        <pointLight color="#ff694f" intensity={35} distance={18} />
        <mesh>
          <sphereGeometry args={[0.45, 12, 8]} />
          <meshStandardMaterial
            color="#ff5d49"
            emissive="#ff3d2e"
            emissiveIntensity={5}
          />
        </mesh>
        <Box position={[2.2, 0, 0]} size={[4.4, 0.08, 0.08]} color="#ff7c65" />
      </group>
    </group>
  );
}

function PreviewTunnel({ onOpen }: { onOpen: (index: number) => void }) {
  return (
    <group position={[9, 0, -43]}>
      {[-7, 0, 7].map((x, index) => (
        <group key={x} position={[x, 0, 0]}>
          <RigidBody type="fixed" colliders="cuboid">
            <Box
              position={[-2.8, 2.8, 0]}
              size={[0.55, 5.6, 8]}
              color="#283641"
            />
            <Box
              position={[2.8, 2.8, 0]}
              size={[0.55, 5.6, 8]}
              color="#283641"
            />
            <Box
              position={[0, 5.35, 0]}
              size={[6.1, 0.55, 8]}
              color="#283641"
            />
          </RigidBody>
          <ProjectBillboard
            index={index + 4}
            position={[0, 0, -3.6]}
            onOpen={onOpen}
          />
        </group>
      ))}
      <Label
        text="PREVIEW TUNNEL"
        subtitle="DRIVE THROUGH THE WORK"
        position={[0, 7, 4.2]}
        width={13}
        color="#aebcff"
      />
    </group>
  );
}

export default function Environment({
  onOpen,
  onProject,
  reduced,
  quality,
}: {
  onOpen: (id: Destination) => void;
  onProject: (index: number) => void;
  reduced: boolean;
  quality: Quality;
}) {
  return (
    <>
      <color attach="background" args={["#8cb8c3"]} />
      <fog attach="fog" args={["#8cb8c3", 78, 190]} />
      <Sky
        distance={450000}
        sunPosition={[35, 24, -18]}
        inclination={0.54}
        azimuth={0.22}
      />
      <hemisphereLight args={["#fff2d2", "#34574f", 1.15]} />
      <directionalLight
        position={[-38, 52, 24]}
        intensity={2.8}
        color="#fff1d0"
        castShadow={quality !== "low"}
        shadow-mapSize={quality === "high" ? [2048, 2048] : [1024, 1024]}
        shadow-camera-left={-82}
        shadow-camera-right={82}
        shadow-camera-top={82}
        shadow-camera-bottom={-82}
        shadow-camera-far={160}
        shadow-normalBias={0.025}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.72, 0]}
        receiveShadow
      >
        <planeGeometry args={[310, 310]} />
        <meshStandardMaterial color="#6e9d94" roughness={0.55} />
      </mesh>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[66, 0.6, 66]}
          position={[0, -0.52, 0]}
          friction={1.3}
        />
        <Box position={[0, -0.52, 0]} size={[132, 1.2, 132]} color="#9fae78" />
        {[
          [0, 1.5, -66, 66, 2, 0.5],
          [0, 1.5, 66, 66, 2, 0.5],
          [-66, 1.5, 0, 0.5, 2, 66],
          [66, 1.5, 0, 0.5, 2, 66],
        ].map(([x, y, z, sx, sy, sz], index) => (
          <CuboidCollider
            key={index}
            position={[x, y, z]}
            args={[sx, sy, sz]}
          />
        ))}
      </RigidBody>

      <Road position={[0, 0.08, 12]} size={[8, 102]} />
      <Road position={[-24, 0.09, -9]} size={[8, 74]} rotation={Math.PI / 2} />
      <Road position={[25, 0.1, -18]} size={[8, 70]} rotation={Math.PI / 2} />
      <Road position={[28, 0.11, 28]} size={[8, 63]} rotation={Math.PI / 2} />
      <Road position={[-28, 0.12, 40]} size={[8, 42]} rotation={Math.PI / 2} />
      <Road position={[-38, 0.13, -21]} size={[8, 45]} />

      <Arrival onOpen={onOpen} />
      <Studio onOpen={onOpen} />
      <ExperienceRail onOpen={onOpen} />
      <SkillsFactory onOpen={onOpen} />
      <SignalTower onOpen={onOpen} />
      <PreviewTunnel onOpen={onProject} />

      <group position={[-37, 0, -31]}>
        <Label
          text="PROJECT DRIVE-IN"
          subtitle="SEVEN BUILDS · PARK NEAR A SCREEN"
          position={[0, 7.3, 10]}
          width={14}
          color="#ffc15e"
          onClick={() => onOpen("projects")}
        />
        {projectExhibits.map((exhibit) => (
          <ProjectBillboard
            key={exhibit.project.title}
            index={exhibit.index}
            position={[exhibit.x + 37, 0, exhibit.z + 31]}
            onOpen={onProject}
          />
        ))}
      </group>

      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={[8, 1.05, 7]}
        rotation={[-0.24, 0, 0]}
      >
        <Box position={[0, 0, 0]} size={[5, 0.45, 8]} color="#c07c37" />
      </RigidBody>
      <Label
        text="AIR TIME"
        subtitle="SPACE TO JUMP"
        position={[12, 2.2, 9]}
        width={4.8}
      />
      {Array.from({ length: 14 }, (_, index) => (
        <RigidBody
          key={index}
          position={[
            -4 + (index % 5) * 1.45,
            1 + Math.floor(index / 5) * 1.35,
            -9,
          ]}
          colliders="cuboid"
          mass={0.45}
          restitution={0.15}
          friction={0.8}
        >
          <Box
            position={[0, 0, 0]}
            size={[1.15, 1.15, 1.15]}
            color={
              index % 3 === 0
                ? "#f0a51a"
                : index % 3 === 1
                  ? "#d78962"
                  : "#6f8f70"
            }
          />
        </RigidBody>
      ))}

      {[
        [-12, 8],
        [12, -5],
        [-49, 31],
        [19, 45],
        [50, 7],
        [-15, -50],
      ].map(([x, z], index) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <Box position={[0, 0.55, 0]} size={[3.6, 0.3, 1.1]} color="#71533d" />
          <Box
            position={[-1.35, 0.25, 0]}
            size={[0.25, 0.55, 0.9]}
            color="#213b35"
          />
          <Box
            position={[1.35, 0.25, 0]}
            size={[0.25, 0.55, 0.9]}
            color="#213b35"
          />
          <mesh position={[0, 1.3, -2.4]} castShadow>
            <icosahedronGeometry args={[1.7 + (index % 2) * 0.35, 1]} />
            <meshStandardMaterial
              color={index % 2 ? "#456f50" : "#547c53"}
              roughness={1}
            />
          </mesh>
          <Box
            position={[0, 0.72, -2.4]}
            size={[0.36, 1.45, 0.36]}
            color="#6f4d36"
          />
        </group>
      ))}
      <Forest />

      {Array.from({ length: 11 }, (_, index) => {
        const angle = (index / 11) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * 92,
              9 + (index % 3) * 3,
              Math.sin(angle) * 92,
            ]}
            castShadow
          >
            <coneGeometry
              args={[13 + (index % 3) * 3, 25 + (index % 2) * 7, 7]}
            />
            <meshStandardMaterial
              color={index % 2 ? "#5c7770" : "#647e70"}
              roughness={1}
            />
          </mesh>
        );
      })}

      {!reduced && (
        <mesh position={[0, 2.6, -58]}>
          <torusGeometry args={[3, 0.14, 10, 48]} />
          <meshStandardMaterial
            color="#f7b843"
            emissive="#f7a81f"
            emissiveIntensity={2.4}
          />
        </mesh>
      )}
    </>
  );
}
