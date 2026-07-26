import { useEffect, useRef } from "react";
import * as THREE from "three/webgpu";
import {
  color,
  cos,
  float,
  mix,
  range,
  sin,
  time,
  uniform,
  uv,
  vec3,
  vec4,
  TWO_PI,
} from "three/tsl";

export function DreamScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let renderer: InstanceType<typeof THREE.WebGPURenderer> | null = null;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let mesh: THREE.InstancedMesh;
    let group: THREE.Group;
    let handleResize: (() => void) | null = null;

    // rotation state
    let isDragging = false;

    let rotX = 0;
    let rotY = 0;

    let lastX = 0;
    let lastY = 0;

    const syncContainerHeight = () => {
      const container = containerRef.current;
      if (!container) return 1;

      const { top } = container.getBoundingClientRect();
      const height = Math.max(window.innerHeight - top, 1);
      container.style.height = `${height}px`;

      return height;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      lastX = e.clientX;
      lastY = e.clientY;

      rotY += dx * 0.005;
      rotX += dy * 0.005;
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const init = async () => {
      const container = containerRef.current;
      if (!container) return;

      const containerHeight = syncContainerHeight();

      // CAMERA
      camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / containerHeight,
        0.1,
        100,
      );

      camera.position.set(2.5, 1.5, 6);
      camera.lookAt(0, 0, 0);

      // SCENE
      scene = new THREE.Scene();
      scene.position.y = 0.7;
      scene.background = null;

      // GROUP
      group = new THREE.Group();
      scene.add(group);

      // MATERIAL
      const material = new THREE.SpriteNodeMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const size = uniform(0.08);
      material.scaleNode = range(0, 1).mul(size);

      const radiusRatio = range(0, 1);
      const radius = radiusRatio.pow(1.5).mul(5).toVar();

      const branches = 3;
      const branchAngle = range(0, branches).floor().mul(TWO_PI.div(branches));
      const angle = branchAngle.add(time.mul(radiusRatio.oneMinus()));

      const position = vec3(cos(angle), 0, sin(angle)).mul(radius);

      const randomOffset = range(vec3(-1), vec3(1)).pow3().mul(radiusRatio).add(0.2);

      material.positionNode = position.add(randomOffset);

      const colorInside = uniform(color("#ffa575"));
      const colorOutside = uniform(color("#311599"));

      const colorFinal = mix(colorInside, colorOutside, radiusRatio.oneMinus().pow(2).oneMinus());

      const alpha = float(0.1).div(uv().sub(0.5).length()).sub(0.2);

      material.colorNode = vec4(colorFinal, alpha);

      // MESH
      mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), material, 20000);

      group.add(mesh);

      // RENDERER
      const nextRenderer = new THREE.WebGPURenderer({ antialias: true });
      renderer = nextRenderer;
      nextRenderer.setPixelRatio(window.devicePixelRatio);
      nextRenderer.setSize(container.clientWidth, containerHeight);

      await nextRenderer.init();

      container.appendChild(nextRenderer.domElement);

      // POINTER DRAG CONTROL (как в three.js examples)

      container.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointermove", handlePointerMove);

      // ANIMATION
      const animate = () => {
        group.rotation.x = rotX;
        group.rotation.y = rotY;

        nextRenderer.render(scene, camera);
      };

      nextRenderer.setAnimationLoop(animate);

      // RESIZE
      handleResize = () => {
        const c = containerRef.current;
        if (!c) return;

        const height = syncContainerHeight();

        camera.aspect = c.clientWidth / height;
        camera.updateProjectionMatrix();

        nextRenderer.setSize(c.clientWidth, height);
      };

      window.addEventListener("resize", handleResize);
    };

    init();

    return () => {
      const container = containerRef.current;

      container?.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
      if (handleResize) window.removeEventListener("resize", handleResize);
      renderer?.setAnimationLoop(null);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
    </section>
  );
}
