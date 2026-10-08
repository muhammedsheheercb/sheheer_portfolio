"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Map,
  MoveUp,
  RotateCcw,
  Settings2,
  X,
  Zap,
} from "lucide-react";
import {
  PROJECTS_DATA,
  destinations,
  profile,
  type Destination,
} from "@/lib/portfolio";
import SectionContent from "./SectionContent";
import { InteractionContext } from "./InteractionContext";
import { useDrivingControls } from "./useDrivingControls";
import type { CameraInput, Quality, Telemetry, WorldCommand } from "./types";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Dialog({
  children,
  onClose,
  label,
  wide = false,
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
  wide?: boolean;
}) {
  const reference = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const dialog = reference.current!;
    dialog.querySelector<HTMLButtonElement>("button")?.focus();
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,textarea,select,[tabindex="0"]',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", keyDown);
    return () => {
      window.removeEventListener("keydown", keyDown);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="game-overlay"
      onPointerDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <div
        ref={reference}
        className={`discovery-panel ${wide ? "is-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <div className="panel-topline">
          <span>DISCOVERY LOG</span>
          <button onClick={onClose} aria-label="Close panel">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TouchButton({
  label,
  onPress,
  onRelease,
  children,
  className,
}: {
  label: string;
  onPress: () => void;
  onRelease: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      className={className}
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        onPress();
      }}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onLostPointerCapture={onRelease}
    >
      {children}
    </button>
  );
}

export default function WorldExperience({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reading, setReading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [section, setSection] = useState<Destination | null>(null);
  const [project, setProject] = useState<number | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quality, setQuality] = useState<Quality>(() =>
    typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches
      ? "low"
      : "high",
  );
  const [command, setCommand] = useState<WorldCommand>({
    id: 0,
    destination: "home",
  });
  const [telemetry, setTelemetry] = useState<Telemetry>({
    x: 0,
    y: 2.2,
    z: 26,
    speed: 0,
    near: "home",
    nearProject: null,
    grounded: false,
  });
  const [discovered, setDiscovered] = useState<Destination[]>(["home"]);
  const cameraInput = useRef<CameraInput>({
    yaw: 0,
    pitch: 0.12,
    distance: 10.5,
    active: false,
  });

  const paused =
    !started ||
    reading ||
    section !== null ||
    project !== null ||
    mapOpen ||
    settingsOpen ||
    failed;
  const nearbyDestination = destinations.find(
    (item) => item.id === telemetry.near,
  );

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => {
    setFailed(true);
    setReading(true);
  }, []);
  const onTelemetry = useCallback((next: Telemetry) => {
    setTelemetry(next);
    if (next.near) {
      setDiscovered((current) =>
        current.includes(next.near!) ? current : [...current, next.near!],
      );
    }
  }, []);
  const close = useCallback(() => {
    setSection(null);
    setProject(null);
    setMapOpen(false);
    setSettingsOpen(false);
  }, []);
  const openSection = useCallback((destination: Destination) => {
    setSection(destination);
    setProject(null);
  }, []);
  const openProject = useCallback((index: number) => {
    setProject(index);
    setSection(null);
  }, []);
  const interact = useCallback(() => {
    if (telemetry.nearProject !== null) openProject(telemetry.nearProject);
    else if (telemetry.near) openSection(telemetry.near);
  }, [openProject, openSection, telemetry.near, telemetry.nearProject]);
  const travel = useCallback((destination: Destination) => {
    setCommand((current) => ({ id: current.id + 1, destination }));
    setMapOpen(false);
    setStarted(true);
  }, []);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  const { input, steering, setTouch } = useDrivingControls({
    paused,
    reading,
    canOpenMap: started && !paused,
    canInteract: telemetry.near !== null || telemetry.nearProject !== null,
    onMap: () => setMapOpen((current) => !current),
    onReset: () => travel("home"),
    onInteract: interact,
  });

  return (
    <InteractionContext.Provider value={openProject}>
      <div
        className="portfolio-experience"
        data-world-x={telemetry.x.toFixed(3)}
        data-world-y={telemetry.y.toFixed(3)}
        data-world-z={telemetry.z.toFixed(3)}
        data-world-speed={telemetry.speed}
        data-world-grounded={telemetry.grounded}
        data-world-project={telemetry.nearProject ?? ""}
        data-world-area={telemetry.near ?? ""}
      >
        <div
          className="world-stage"
          hidden={reading}
          aria-label="Interactive driving world"
        >
          <SceneBoundary onError={onError}>
            <Scene
              input={input}
              cameraInput={cameraInput}
              command={command}
              paused={paused}
              reduced={reduced}
              quality={quality}
              onTelemetry={onTelemetry}
              onOpen={openSection}
              onProject={openProject}
              onReady={onReady}
              onProgress={setProgress}
              onError={onError}
            />
          </SceneBoundary>
        </div>

        <div className={`reading-shell ${reading ? "is-reading" : ""}`}>
          {failed && (
            <p className="fallback-note" role="status">
              The 3D world could not load on this device. All portfolio content
              is available below.
            </p>
          )}
          <button
            className="return-world"
            onClick={() => setReading(false)}
            disabled={failed}
          >
            Return to 3D world
          </button>
          {children}
        </div>

        {!reading && (
          <>
            <div className="game-brand" aria-label="Sheheer's World">
              <span>S</span>
              <div>
                <strong>SHEHEER&apos;S WORLD</strong>
                <small>INTERACTIVE PORTFOLIO</small>
              </div>
            </div>

            {started && (
              <>
                <div className="hud-actions">
                  <button
                    onClick={() => setMapOpen(true)}
                    aria-label="Open world map"
                  >
                    <Map size={18} />
                  </button>
                  <button
                    onClick={() => travel("home")}
                    aria-label="Reset vehicle"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    aria-label="Graphics and controls"
                  >
                    <Settings2 size={18} />
                  </button>
                  <button
                    onClick={() => setReading(true)}
                    aria-label="Open reading view"
                  >
                    <BookOpen size={18} />
                  </button>
                </div>

                <div
                  className="speedometer"
                  aria-label={`${telemetry.speed} kilometers per hour`}
                >
                  <Gauge size={18} />
                  <strong>{String(telemetry.speed).padStart(2, "0")}</strong>
                  <span>KM/H</span>
                </div>

                <div className="discovery-counter">
                  <span>{discovered.length}/7</span>
                  <small>PLACES FOUND</small>
                </div>

                <div className="area-label">
                  <small>NOW EXPLORING</small>
                  <strong>{nearbyDestination?.label ?? "Open road"}</strong>
                </div>

                {(telemetry.near || telemetry.nearProject !== null) &&
                  !paused && (
                    <button className="interaction-prompt" onClick={interact}>
                      <kbd>ENTER</kbd>
                      <span>
                        {telemetry.nearProject !== null
                          ? `Inspect ${PROJECTS_DATA[telemetry.nearProject].title}`
                          : `Explore ${nearbyDestination?.label}`}
                      </span>
                    </button>
                  )}

                <div className="desktop-controls">
                  <span>WASD</span> DRIVE
                  <i />
                  <span>SPACE</span> JUMP
                  <i />
                  <span>DRAG</span> CAMERA
                  <i />
                  <span>M</span> MAP
                </div>

                <div className="touch-controls" hidden={paused}>
                  <div
                    className="joystick"
                    role="slider"
                    aria-label="Steering joystick"
                    aria-valuemin={-1}
                    aria-valuemax={1}
                    aria-valuenow={steering}
                    tabIndex={0}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      const bounds =
                        event.currentTarget.getBoundingClientRect();
                      setTouch(
                        "steer",
                        Math.max(
                          -1,
                          Math.min(
                            1,
                            (bounds.left + bounds.width / 2 - event.clientX) /
                              38,
                          ),
                        ),
                      );
                    }}
                    onPointerMove={(event) => {
                      if (
                        !event.currentTarget.hasPointerCapture(event.pointerId)
                      )
                        return;
                      const bounds =
                        event.currentTarget.getBoundingClientRect();
                      setTouch(
                        "steer",
                        Math.max(
                          -1,
                          Math.min(
                            1,
                            (bounds.left + bounds.width / 2 - event.clientX) /
                              38,
                          ),
                        ),
                      );
                    }}
                    onPointerUp={() => setTouch("steer", 0)}
                    onPointerCancel={() => setTouch("steer", 0)}
                    onLostPointerCapture={() => setTouch("steer", 0)}
                  >
                    <span>‹</span>
                    <i />
                    <span>›</span>
                  </div>
                  <div className="pedals">
                    <TouchButton
                      label="Jump"
                      onPress={() => setTouch("jump", true)}
                      onRelease={() => setTouch("jump", false)}
                    >
                      <MoveUp size={19} />
                    </TouchButton>
                    <TouchButton
                      label="Boost"
                      onPress={() => setTouch("boost", true)}
                      onRelease={() => setTouch("boost", false)}
                    >
                      <Zap size={19} />
                    </TouchButton>
                    <TouchButton
                      label="Brake and reverse"
                      onPress={() => setTouch("forward", -1)}
                      onRelease={() => setTouch("forward", 0)}
                    >
                      <ArrowDown size={22} />
                    </TouchButton>
                    <TouchButton
                      className="accelerator"
                      label="Accelerate"
                      onPress={() => setTouch("forward", 1)}
                      onRelease={() => setTouch("forward", 0)}
                    >
                      <ArrowUp size={24} />
                    </TouchButton>
                  </div>
                </div>
              </>
            )}

            {!started && (
              <div className="launch-screen">
                <div className="launch-card">
                  <span className="launch-kicker">
                    AN EXPLORABLE 3D PORTFOLIO
                  </span>
                  <h1>
                    SHEHEER&apos;S
                    <br />
                    WORLD
                  </h1>
                  <p>
                    Get behind the wheel. The portfolio is somewhere out there.
                  </p>
                  <button disabled={!ready} onClick={() => setStarted(true)}>
                    {ready ? "ENTER THE WORLD" : "BUILDING THE WORLD"}
                    <ArrowUpRight size={19} />
                  </button>
                  <progress max={100} value={progress} />
                  <div className="launch-controls">
                    <span>WASD / ARROWS — DRIVE</span>
                    <span>SPACE — JUMP</span>
                    <span>DRAG / TWO FINGERS — CAMERA</span>
                  </div>
                  <button
                    className="accessible-link"
                    onClick={() => setReading(true)}
                  >
                    Accessible reading view
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {section && (
          <Dialog
            label={destinations.find((item) => item.id === section)!.label}
            onClose={close}
            wide
          >
            {section === "projects" || section === "gallery" ? (
              <div className="district-message">
                <span className="eyebrow">PHYSICAL EXHIBITION</span>
                <h2>
                  {section === "projects"
                    ? "The project drive-in"
                    : "The preview tunnel"}
                </h2>
                <p>
                  Keep driving and park beside a lit screen. Each display
                  contains one of my real projects. Press Enter when its title
                  appears in the HUD.
                </p>
                <button className="primary-button" onClick={close}>
                  Back behind the wheel
                </button>
              </div>
            ) : (
              <SectionContent section={section} onProject={openProject} />
            )}
          </Dialog>
        )}

        {project !== null && (
          <Dialog label={PROJECTS_DATA[project].title} onClose={close} wide>
            <span className="eyebrow">
              PROJECT {String(project + 1).padStart(2, "0")} /{" "}
              {String(PROJECTS_DATA.length).padStart(2, "0")}
            </span>
            <h2>{PROJECTS_DATA[project].title}</h2>
            <Image
              className="fullscreen-preview"
              src={PROJECTS_DATA[project].image}
              alt={`${PROJECTS_DATA[project].title} website preview`}
              width={1200}
              height={750}
              sizes="90vw"
            />
            <p>{PROJECTS_DATA[project].description}</p>
            <div className="tags">
              {PROJECTS_DATA[project].tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="project-actions">
              <button
                onClick={() =>
                  setProject(
                    (project + PROJECTS_DATA.length - 1) % PROJECTS_DATA.length,
                  )
                }
                aria-label="Previous project"
              >
                <ChevronLeft size={18} />
              </button>
              <a
                className="primary-button"
                href={PROJECTS_DATA[project].liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Launch project <ArrowUpRight size={18} />
              </a>
              <button
                onClick={() => setProject((project + 1) % PROJECTS_DATA.length)}
                aria-label="Next project"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </Dialog>
        )}

        {mapOpen && (
          <Dialog label="World map" onClose={close}>
            <span className="eyebrow">FAST TRAVEL</span>
            <h2>World map</h2>
            <div className="world-map-graphic">
              <svg
                viewBox="0 0 100 100"
                role="img"
                aria-label="Map of portfolio destinations"
              >
                <path d="M50 6V94M6 51H94M21 13L80 88M16 85L89 18" />
                {destinations.map((destination) => (
                  <g key={destination.id}>
                    <circle
                      cx={50 + destination.x * 0.62}
                      cy={50 + destination.z * 0.62}
                      r="4"
                      fill={destination.color}
                    />
                  </g>
                ))}
                <circle
                  cx={50 + telemetry.x * 0.62}
                  cy={50 + telemetry.z * 0.62}
                  r="3"
                  className="map-player"
                />
              </svg>
            </div>
            <div className="map-destinations">
              {destinations.map((destination, index) => (
                <button
                  key={destination.id}
                  onClick={() => travel(destination.id)}
                >
                  <span style={{ background: destination.color }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong>{destination.label}</strong>
                    <small>{destination.subtitle}</small>
                  </div>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
          </Dialog>
        )}

        {settingsOpen && (
          <Dialog label="Settings and controls" onClose={close}>
            <span className="eyebrow">GARAGE MENU</span>
            <h2>Controls & graphics</h2>
            <label className="quality-select">
              Graphics quality
              <select
                value={quality}
                onChange={(event) => setQuality(event.target.value as Quality)}
              >
                <option value="low">Low · mobile / battery saver</option>
                <option value="medium">Medium · balanced</option>
                <option value="high">High · full shadows</option>
              </select>
            </label>
            <label className="motion-toggle">
              <input
                type="checkbox"
                checked={reduced}
                onChange={(event) => setReduced(event.target.checked)}
              />
              Reduce camera motion
            </label>
            <dl className="controls-list">
              {[
                ["W / ↑", "Accelerate"],
                ["S / ↓", "Brake and reverse"],
                ["A D / ← →", "Steer"],
                ["Space", "Jump"],
                ["Shift", "Boost"],
                ["Enter", "Interact"],
                ["Mouse drag", "Orbit camera"],
                ["Wheel / pinch", "Camera distance"],
                ["R", "Respawn"],
                ["M", "Map"],
              ].map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <button
              className="reading-menu-link"
              onClick={() => {
                setSettingsOpen(false);
                setReading(true);
              }}
            >
              <BookOpen size={16} /> Open accessible reading view
            </button>
            <a className="reading-menu-link" href={`mailto:${profile.email}`}>
              Contact Sheheer directly <ArrowUpRight size={16} />
            </a>
          </Dialog>
        )}
      </div>
    </InteractionContext.Provider>
  );
}
