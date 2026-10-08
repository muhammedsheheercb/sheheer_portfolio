import type { Destination } from "@/lib/portfolio";
export type InputState = {
  forward: number;
  steer: number;
  boost: boolean;
  jump: boolean;
};
export type WorldCommand = { id: number; destination: Destination };
export type CameraInput = {
  yaw: number;
  pitch: number;
  distance: number;
  active: boolean;
};
export type Telemetry = {
  y: number;
  x: number;
  z: number;
  speed: number;
  near: Destination | null;
  nearProject: number | null;
  grounded: boolean;
};
export type Quality = "low" | "medium" | "high";
