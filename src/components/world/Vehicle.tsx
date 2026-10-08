"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import type { DynamicRayCastVehicleController } from "@dimforge/rapier3d-compat";
import { Group, MathUtils, Quaternion, Vector3 } from "three";
import { destinations, projectExhibits } from "@/lib/portfolio";
import type { CameraInput, InputState, Telemetry, WorldCommand } from "./types";

const WHEELS = [
  [-0.92, -0.18, -1.15],
  [0.92, -0.18, -1.15],
  [-0.92, -0.18, 1.08],
  [0.92, -0.18, 1.08],
] as const;

export default function Vehicle({
  input,
  cameraInput,
  command,
  paused,
  reduced,
  onTelemetry,
}: {
  input: MutableRefObject<InputState>;
  cameraInput: MutableRefObject<CameraInput>;
  command: WorldCommand;
  paused: boolean;
  reduced: boolean;
  onTelemetry: (data: Telemetry) => void;
}) {
  const chassis = useRef<RapierRigidBody>(null);
  const controller = useRef<DynamicRayCastVehicleController | null>(null);
  const wheelGroups = useRef<Array<Group | null>>([]);
  const runtime = useRef({
    command: -1,
    steering: 0,
    jumpHeld: false,
    report: 0,
    lastCameraActivity: 0,
    cameraYaw: 0,
  });
  const { world, rapier } = useRapier();
  const { camera, size } = useThree();
  const desiredCamera = useRef(new Vector3());
  const cameraTarget = useRef(new Vector3());
  const targetLook = useRef(new Vector3());
  const chassisQuaternion = useRef(new Quaternion());

  useEffect(() => {
    if (!chassis.current) return;
    const vehicle = world.createVehicleController(chassis.current);
    vehicle.indexUpAxis = 1;
    vehicle.setIndexForwardAxis = 2;
    WHEELS.forEach(([x, y, z]) => {
      vehicle.addWheel(
        { x, y, z },
        { x: 0, y: -1, z: 0 },
        { x: -1, y: 0, z: 0 },
        0.34,
        0.39,
      );
      const index = vehicle.numWheels() - 1;
      vehicle.setWheelSuspensionStiffness(index, 36);
      vehicle.setWheelSuspensionCompression(index, 5.2);
      vehicle.setWheelSuspensionRelaxation(index, 6.4);
      vehicle.setWheelMaxSuspensionTravel(index, 0.35);
      vehicle.setWheelMaxSuspensionForce(index, 9000);
      vehicle.setWheelFrictionSlip(index, 4.4);
      vehicle.setWheelSideFrictionStiffness(index, 1.35);
    });
    controller.current = vehicle;
    return () => {
      controller.current = null;
      world.removeVehicleController(vehicle);
    };
  }, [world]);

  useBeforePhysicsStep(() => {
    const body = chassis.current;
    const vehicle = controller.current;
    if (!body || !vehicle || paused) return;

    const state = runtime.current;
    const controls = input.current;
    const orientation = body.rotation();
    const forward = new Vector3(0, 0, -1).applyQuaternion(
      new Quaternion(orientation.x, orientation.y, orientation.z, orientation.w),
    );
    const velocity = body.linvel();
    const speed = forward.dot(new Vector3(velocity.x, velocity.y, velocity.z));
    const engineForce = -controls.forward * 2100 * (controls.boost ? 1.65 : 1);
    const opposite =
      (speed > 2 && controls.forward < 0) ||
      (speed < -2 && controls.forward > 0);
    const braking = opposite ? 32 : controls.forward === 0 ? 1.2 : 0;
    const steeringLimit = MathUtils.lerp(
      0.52,
      0.2,
      Math.min(Math.abs(speed) / 28, 1),
    );
    state.steering = MathUtils.damp(
      state.steering,
      controls.steer * steeringLimit,
      7,
      1 / 60,
    );

    for (let wheel = 0; wheel < 4; wheel += 1) {
      vehicle.setWheelEngineForce(wheel, opposite ? 0 : engineForce);
      vehicle.setWheelBrake(wheel, braking);
      vehicle.setWheelSteering(wheel, wheel < 2 ? state.steering : 0);
    }
    vehicle.updateVehicle(1 / 60, undefined, undefined, (collider) => {
      return collider.parent()?.handle !== body.handle;
    });

  });

  useFrame((_, delta) => {
    const body = chassis.current;
    const vehicle = controller.current;
    if (!body || !vehicle) return;
    const state = runtime.current;
    const dt = Math.min(delta, 0.1);

    const jumpRequested = input.current.jump;
    const grounded =
      body.translation().y < 1.12 ||
      [0, 1, 2, 3].filter((wheel) => vehicle.wheelIsInContact(wheel)).length >= 2;
    if (!paused && jumpRequested && !state.jumpHeld && grounded) {
      const velocity = body.linvel();
      body.setLinvel({ x: velocity.x, y: 6.2, z: velocity.z }, true);
      state.jumpHeld = true;
    }
    if (!jumpRequested) state.jumpHeld = false;

    if (state.command !== command.id || body.translation().y < -12) {
      const destination = destinations.find(
        (item) => item.id === command.destination,
      )!;
      body.setTranslation(
        { x: destination.x, y: 2.2, z: destination.z + 8 },
        true,
      );
      body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      state.command = command.id;
    }

    const position = body.translation();
    const rotation = body.rotation();
    chassisQuaternion.current.set(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w,
    );
    WHEELS.forEach(([x, y, z], index) => {
      const wheel = wheelGroups.current[index];
      if (!wheel) return;
      wheel.position.set(
        x,
        y - (vehicle.wheelSuspensionLength(index) ?? 0.34),
        z,
      );
      wheel.rotation.set(
        vehicle.wheelRotation(index) ?? 0,
        index < 2 ? state.steering : 0,
        Math.PI / 2,
      );
    });

    if (cameraInput.current.active) {
      state.lastCameraActivity = performance.now();
      state.cameraYaw = cameraInput.current.yaw;
    } else if (performance.now() - state.lastCameraActivity > 1800) {
      state.cameraYaw = MathUtils.damp(state.cameraYaw, 0, 1.1, dt);
    } else {
      state.cameraYaw = cameraInput.current.yaw;
    }

    const distance =
      cameraInput.current.distance + (size.width < 768 ? 1.5 : 0);
    const orbit = new Vector3(
      Math.sin(state.cameraYaw) * distance,
      3.5 + Math.sin(cameraInput.current.pitch + 0.28) * distance,
      Math.cos(state.cameraYaw) * distance,
    ).applyQuaternion(chassisQuaternion.current);
    const bodyPosition = new Vector3(position.x, position.y, position.z);
    targetLook.current
      .set(0, 0.55, -1.7)
      .applyQuaternion(chassisQuaternion.current)
      .add(bodyPosition);
    desiredCamera.current.copy(orbit).add(bodyPosition);

    const cameraDirection = desiredCamera.current
      .clone()
      .sub(targetLook.current);
    const cameraDistance = cameraDirection.length();
    cameraDirection.normalize();
    const hit = world.castRay(
      new rapier.Ray(targetLook.current, cameraDirection),
      cameraDistance,
      true,
      undefined,
      undefined,
      undefined,
      body,
    );
    if (hit && hit.timeOfImpact < cameraDistance) {
      desiredCamera.current
        .copy(targetLook.current)
        .addScaledVector(
          cameraDirection,
          Math.max(2.5, hit.timeOfImpact - 0.35),
        );
    }
    camera.position.lerp(
      desiredCamera.current,
      reduced ? 1 : 1 - Math.exp(-dt * 6.5),
    );
    cameraTarget.current.lerp(
      targetLook.current,
      reduced ? 1 : 1 - Math.exp(-dt * 9),
    );
    camera.lookAt(cameraTarget.current);

    state.report += dt;
    if (state.report > 0.1) {
      state.report = 0;
      const near = destinations.find(
        (destination) =>
          Math.hypot(destination.x - position.x, destination.z - position.z) <
          10,
      );
      const nearestProject = projectExhibits.find(
        (exhibit) =>
          Math.hypot(exhibit.x - position.x, exhibit.z - position.z) < 6.5,
      );
      onTelemetry({
        x: position.x,
        y: position.y,
        z: position.z,
        speed: Math.round(Math.abs(vehicle.currentVehicleSpeed()) * 3.6),
        near: near?.id ?? null,
        nearProject: nearestProject?.index ?? null,
        grounded: [0, 1, 2, 3].some((wheel) => vehicle.wheelIsInContact(wheel)),
      });
    }
  });

  return (
    <RigidBody
      ref={chassis}
      colliders={false}
      position={[0, 2.2, 26]}
      linearDamping={0.08}
      angularDamping={1.25}
      canSleep={false}
      ccd
    >
      <CuboidCollider
        args={[0.9, 0.32, 1.45]}
        position={[0, -0.08, 0]}
        mass={150}
        friction={0.8}
        restitution={0.05}
      />
      <group position={[0, 0.1, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.72, 0.48, 2.82]} />
          <meshStandardMaterial
            color="#f0a51a"
            roughness={0.28}
            metalness={0.15}
          />
        </mesh>
        <mesh position={[0, 0.54, 0.25]} castShadow>
          <boxGeometry args={[1.48, 0.7, 1.42]} />
          <meshStandardMaterial color="#f4b83c" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.6, -0.49]}>
          <boxGeometry args={[1.34, 0.48, 0.04]} />
          <meshStandardMaterial
            color="#182f3a"
            roughness={0.12}
            metalness={0.4}
          />
        </mesh>
        <mesh position={[0, 1, 0.25]} castShadow>
          <boxGeometry args={[1.55, 0.12, 1.55]} />
          <meshStandardMaterial color="#f7efe2" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.1, -1.45]}>
          <boxGeometry args={[1.82, 0.16, 0.14]} />
          <meshStandardMaterial
            color="#1d292e"
            metalness={0.55}
            roughness={0.3}
          />
        </mesh>
        {[-0.54, 0.54].map((x) => (
          <mesh key={x} position={[x, 0.05, -1.53]}>
            <boxGeometry args={[0.32, 0.19, 0.05]} />
            <meshStandardMaterial
              color="#fff4c7"
              emissive="#ffd36d"
              emissiveIntensity={2}
            />
          </mesh>
        ))}
      </group>
      {WHEELS.map((connection, index) => (
        <group
          key={connection.join("-")}
          ref={(node) => {
            wheelGroups.current[index] = node;
          }}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.39, 0.39, 0.34, 16]} />
            <meshStandardMaterial color="#161a1d" roughness={0.92} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.18, 0.18, 0.36, 10]} />
            <meshStandardMaterial
              color="#b9b8ad"
              metalness={0.65}
              roughness={0.28}
            />
          </mesh>
        </group>
      ))}
    </RigidBody>
  );
}
