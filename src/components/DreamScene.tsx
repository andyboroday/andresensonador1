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
    let renderer: any;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let mesh: THREE.InstancedMesh;
    let group: THREE.Group;

    // rotation state
    let isDragging = false;

    let rotX = 0;
    let rotY = 0;

    let lastX = 0;
    let lastY = 0;

    const init = async () => {
      const container = containerRef.current;
      if (!container) return;

      // CAMERA
      camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );

      camera.position.set(2.5, 1.5, 6);
      camera.lookAt(0, 0, 0);

      // SCENE
      scene = new THREE.Scene();
      scene.position.y = 0.70;
      scene.background = null

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

      const randomOffset = range(vec3(-1), vec3(1))
        .pow3()
        .mul(radiusRatio)
        .add(0.2);

      material.positionNode = position.add(randomOffset);

      const colorInside = uniform(color("#ffa575"));
      const colorOutside = uniform(color("#311599"));

      const colorFinal = mix(
        colorInside,
        colorOutside,
        radiusRatio.oneMinus().pow(2).oneMinus()
      );

      const alpha = float(0.1).div(uv().sub(0.5).length()).sub(0.2);

      material.colorNode = vec4(colorFinal, alpha);

      // MESH
      mesh = new THREE.InstancedMesh(
        new THREE.PlaneGeometry(1, 1),
        material,
        20000
      );

      group.add(mesh);

      // RENDERER
      renderer = new THREE.WebGPURenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);

      await renderer.init();

      container.appendChild(renderer.domElement);

      // POINTER DRAG CONTROL (как в three.js examples)

      container.addEventListener("pointerdown", (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      });

      window.addEventListener("pointerup", () => {
        isDragging = false;
      });

      window.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        lastX = e.clientX;
        lastY = e.clientY;

        rotY += dx * 0.005;
        rotX += dy * 0.005;
      });

      // ANIMATION
      const animate = () => {
        group.rotation.x = rotX;
        group.rotation.y = rotY;

        renderer.render(scene, camera);
      };

      renderer.setAnimationLoop(animate);

      // RESIZE
      const onResize = () => {
        const c = containerRef.current;
        if (!c) return;

        camera.aspect = c.clientWidth / c.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(c.clientWidth, c.clientHeight);
      };

      window.addEventListener("resize", onResize);
    };

    init();

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
    </section>
  );
}