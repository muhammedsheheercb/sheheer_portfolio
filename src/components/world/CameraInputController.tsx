"use client";

import { useEffect, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import type { CameraInput } from "./types";

export default function CameraInputController({
  controls,
}: {
  controls: MutableRefObject<CameraInput>;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const element = gl.domElement;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDistance = 0;

    const pointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      controls.current.active = true;
      element.setPointerCapture(event.pointerId);
      pinchDistance = 0;
    };

    const pointerMove = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.size === 1 && event.pointerType === "mouse") {
        controls.current.yaw -= (event.clientX - previous.x) * 0.005;
        controls.current.pitch = Math.max(
          -0.12,
          Math.min(
            0.55,
            controls.current.pitch + (event.clientY - previous.y) * 0.004,
          ),
        );
      } else if (pointers.size >= 2) {
        const [a, b] = [...pointers.values()];
        const nextDistance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance > 0) {
          controls.current.distance = Math.max(
            7,
            Math.min(
              18,
              controls.current.distance -
                (nextDistance - pinchDistance) * 0.025,
            ),
          );
        }
        pinchDistance = nextDistance;
        controls.current.yaw -= (event.clientX - previous.x) * 0.003;
      }
    };

    const pointerUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      controls.current.active = pointers.size > 0;
      pinchDistance = 0;
    };

    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      controls.current.distance = Math.max(
        7,
        Math.min(18, controls.current.distance + event.deltaY * 0.012),
      );
    };

    element.addEventListener("pointerdown", pointerDown);
    element.addEventListener("pointermove", pointerMove);
    element.addEventListener("pointerup", pointerUp);
    element.addEventListener("pointercancel", pointerUp);
    element.addEventListener("wheel", wheel, { passive: false });
    return () => {
      element.removeEventListener("pointerdown", pointerDown);
      element.removeEventListener("pointermove", pointerMove);
      element.removeEventListener("pointerup", pointerUp);
      element.removeEventListener("pointercancel", pointerUp);
      element.removeEventListener("wheel", wheel);
    };
  }, [controls, gl]);

  return null;
}
