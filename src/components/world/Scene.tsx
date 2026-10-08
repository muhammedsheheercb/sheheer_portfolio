"use client";
import { Suspense, useEffect, memo, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Environment from "./Environment";
import Vehicle from "./Vehicle";
import CameraInputController from "./CameraInputController";
import type { Destination } from "@/lib/portfolio";
import type {
  CameraInput,
  InputState,
  Quality,
  Telemetry,
  WorldCommand,
} from "./types";
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}
export function LoadingProgress({
  onProgress,
}: {
  onProgress: (n: number) => void;
}) {
  const { progress } = useProgress();
  useEffect(() => onProgress(progress), [progress, onProgress]);
  return null;
}
function Scene({
  input,
  cameraInput,
  command,
  paused,
  reduced,
  quality,
  onTelemetry,
  onOpen,
  onProject,
  onReady,
  onProgress,
  onError,
}: {
  input: MutableRefObject<InputState>;
  cameraInput: MutableRefObject<CameraInput>;
  command: WorldCommand;
  paused: boolean;
  reduced: boolean;
  quality: Quality;
  onTelemetry: (data: Telemetry) => void;
  onOpen: (id: Destination) => void;
  onProject: (index: number) => void;
  onReady: () => void;
  onProgress: (n: number) => void;
  onError: () => void;
}) {
  return (
    <>
      <LoadingProgress onProgress={onProgress} />
      <Canvas
        frameloop={paused ? "demand" : "always"}
        shadows={quality !== "low"}
        dpr={quality === "low" ? 1 : quality === "medium" ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 7, 36], fov: 52, near: 0.1, far: 280 }}
        gl={{
          antialias: quality !== "low",
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", onError, {
            once: true,
          });
        }}
        fallback={
          <div>3D is unavailable. Use the reading view to explore.</div>
        }
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -18, 0]} paused={paused} timeStep={1 / 60}>
            <CameraInputController controls={cameraInput} />
            <Environment
              onOpen={onOpen}
              onProject={onProject}
              reduced={reduced}
              quality={quality}
            />
            <Vehicle
              input={input}
              cameraInput={cameraInput}
              command={command}
              paused={paused}
              reduced={reduced}
              onTelemetry={onTelemetry}
            />
            <Ready onReady={onReady} />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}

export default memo(Scene);
