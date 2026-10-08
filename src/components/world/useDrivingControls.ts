"use client";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import type { InputState } from "./types";
export function useDrivingControls({
  paused,
  reading,
  canOpenMap,
  canInteract,
  onMap,
  onReset,
  onInteract,
}: {
  paused: boolean;
  reading: boolean;
  canOpenMap: boolean;
  canInteract: boolean;
  onMap: () => void;
  onReset: () => void;
  onInteract: () => void;
}) {
  const input = useRef<InputState>({
    forward: 0,
    steer: 0,
    boost: false,
    jump: false,
  });
  const keyboard = useRef(new Set<string>());
  const touch = useRef<InputState>({
    forward: 0,
    steer: 0,
    boost: false,
    jump: false,
  });
  const [steering, setSteering] = useState(0);
  const synchronize = useCallback(() => {
    const k = keyboard.current,
      t = touch.current;
    input.current = {
      forward:
        t.forward ||
        (k.has("KeyW") || k.has("ArrowUp") ? 1 : 0) -
          (k.has("KeyS") || k.has("ArrowDown") ? 1 : 0),
      steer:
        t.steer ||
        (k.has("KeyA") || k.has("ArrowLeft") ? 1 : 0) -
          (k.has("KeyD") || k.has("ArrowRight") ? 1 : 0),
      jump: t.jump || k.has("Space"),
      boost: t.boost || k.has("ShiftLeft") || k.has("ShiftRight"),
    };
  }, []);
  const clear = useCallback(() => {
    keyboard.current.clear();
    touch.current = { forward: 0, steer: 0, boost: false, jump: false };
    synchronize();
  }, [synchronize]);
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (
      (event.code === "Space" || event.code === "Enter") &&
      target.closest("button,a,[role=slider]")
    )
      return;
    if (
      reading ||
      target.closest('input,textarea,select,[contenteditable="true"]')
    )
      return;
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
        event.code,
      ) &&
      !target.closest("button,a,[role=slider]")
    )
      event.preventDefault();
    if (!event.repeat) {
      if (event.code === "KeyM" && canOpenMap) onMap();
      if (event.code === "KeyR" && !paused) onReset();
      if (
        event.code === "Enter" &&
        !paused &&
        canInteract &&
        !target.closest("button,a,[role=slider]")
      ) {
        event.preventDefault();
        onInteract();
      }
    }
    if (!paused) keyboard.current.add(event.code);
    synchronize();
  });
  useEffect(() => {
    const up = (event: KeyboardEvent) => {
      keyboard.current.delete(event.code);
      synchronize();
    };
    // Area discoveries update UI, but must never interrupt held driving keys.
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
      clear();
    };
  }, [clear, synchronize]);
  useEffect(() => {
    if (paused) clear();
  }, [paused, clear]);
  const setTouch = (field: keyof InputState, value: number | boolean) => {
    if (field === "forward" || field === "steer") {
      touch.current[field] = value as number;
      if (field === "steer") setSteering(value as number);
    } else touch.current[field] = value as boolean;
    synchronize();
  };
  return { input, steering, setTouch };
}
