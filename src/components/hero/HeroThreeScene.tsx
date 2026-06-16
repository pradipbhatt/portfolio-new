"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
   Public type — imported by Hero.tsx for the tooltip
───────────────────────────────────────────────────────────────────────── */
export type NodeHoverData = {
  label: string;
  icon: string;
  cssColor: string;
  detail: string[];
  screenX: number; // viewport px (clientX equivalent)
  screenY: number; // viewport px (clientY equivalent)
};

/* ─────────────────────────────────────────────────────────────────────────
   Node definitions — pure data, no Three.js objects
───────────────────────────────────────────────────────────────────────── */
type NodeDef = {
  label: string;
  icon: string;
  cssColor: string;
  threeColor: number;
  detail: string[];
  rawPos: [number, number, number];
  isHub?: boolean;
};

const NODE_DEFS: NodeDef[] = [
  {
    label: "Skills", icon: "⚡", cssColor: "#00ff9d", threeColor: 0x00ff9d, isHub: true,
    rawPos: [-5.0, 1.5, -2],
    detail: ["Penetration Testing", "Vulnerability Assessment", "OSINT & Recon", "Threat Intelligence", "Red Teaming"],
  },
  {
    label: "Experience", icon: "💼", cssColor: "#c15928", threeColor: 0xc15928, isHub: true,
    rawPos: [5.5, 1.0, -1.5],
    detail: ["SecurityPal AI — Security Researcher", "3+ Years Industry Experience", "Full Stack Development", "SDLC Automation"],
  },
  {
    label: "Tools", icon: "⚙", cssColor: "#00ccff", threeColor: 0x00ccff,
    rawPos: [-4.0, -2.0, -1.5],
    detail: ["Burp Suite Pro", "Nmap / Masscan", "Metasploit Framework", "Wireshark / tcpdump", "SIEM — Splunk, ELK"],
  },
  {
    label: "Certs", icon: "★", cssColor: "#f5a623", threeColor: 0xf5a623,
    rawPos: [3.5, -1.5, -2],
    detail: ["CompTIA Security+", "Google Cybersecurity", "CEH — in progress", "OSCP — pursuing"],
  },
  {
    label: "Education", icon: "◈", cssColor: "#8b5cf6", threeColor: 0x8b5cf6,
    rawPos: [0.5, 3.2, -3],
    detail: ["B.E. Computer Engineering", "Tribhuvan University", "Nepal — 2020–2024", "Distinction"],
  },
  {
    label: "Projects", icon: "◎", cssColor: "#ff6b6b", threeColor: 0xff6b6b,
    rawPos: [-6.5, 0.0, -1],
    detail: ["20+ Projects Shipped", "Bug Bounty — HackerOne", "Open Source Contributions", "CTF Competitions"],
  },
  {
    label: "Languages", icon: "</>", cssColor: "#64ffda", threeColor: 0x64ffda,
    rawPos: [2.0, -3.2, -2],
    detail: ["JavaScript / TypeScript", "Python", "Bash / Shell", "Go", "SQL / NoSQL"],
  },
  {
    label: "Connect", icon: "◇", cssColor: "#ffd700", threeColor: 0xffd700,
    rawPos: [7.0, 2.5, -2],
    detail: ["LinkedIn: pradipbhatt2126", "GitHub: pradipbhatt", "Email: pradip.bhatt@securitypalhq.com", "Discord: pradipbhatt"],
  },
];

/* Edges: [fromIndex, toIndex] */
const EDGE_PAIRS: [number, number][] = [
  [0, 1], // Skills ↔ Experience
  [0, 2], // Skills ↔ Tools
  [0, 3], // Skills ↔ Certs
  [0, 4], // Skills ↔ Education
  [1, 5], // Experience ↔ Projects
  [1, 3], // Experience ↔ Certs
  [1, 7], // Experience ↔ Connect
  [2, 6], // Tools ↔ Languages
  [4, 6], // Education ↔ Languages
  [5, 6], // Projects ↔ Languages
];

/* ─────────────────────────────────────────────────────────────────────────
   Star shader
───────────────────────────────────────────────────────────────────────── */
const STAR_VERT = /* glsl */`
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    float twinkle = 0.6 + 0.4 * sin(uTime * aSpeed + aPhase);
    vAlpha = twinkle;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * twinkle * (350.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;
const STAR_FRAG = /* glsl */`
  varying float vAlpha;
  uniform vec3 uColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5; float d = length(c);
    if (d > 0.5) discard;
    float core = smoothstep(0.18, 0.0, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.55;
    gl_FragColor = vec4(uColor, (core + halo) * vAlpha);
  }
`;

/* ─────────────────────────────────────────────────────────────────────────
   Nebula shader
───────────────────────────────────────────────────────────────────────── */
const NEBULA_VERT = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const NEBULA_FRAG = /* glsl */`
  uniform float uTime; uniform vec3 uColor; uniform float uOpacity;
  varying vec2 vUv;
  float hash21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
    return mix(mix(hash21(i),hash21(i+vec2(1,0)),u.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),u.x),u.y);
  }
  float fbm(vec2 p){ float v=0.,a=0.5; for(int i=0;i<4;i++){v+=a*noise(p);p*=2.1;a*=0.5;} return v; }
  void main() {
    vec2 uv=vUv-0.5; float dist=length(uv*vec2(1.6,1.0));
    float n=fbm(uv*2.8+uTime*0.012);
    gl_FragColor=vec4(uColor,smoothstep(0.62,0.0,dist)*n*uOpacity);
  }
`;

/* ─────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────── */
function buildStarLayer(
  count: number,
  spread: [number, number, number],
  sizeRange: [number, number],
  speedRange: [number, number],
  color: THREE.Color,
) {
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random()-0.5)*spread[0];
    pos[i*3+1] = (Math.random()-0.5)*spread[1];
    pos[i*3+2] = (Math.random()-0.5)*spread[2];
    sizes[i]   = sizeRange[0]  + Math.random()*(sizeRange[1]-sizeRange[0]);
    phases[i]  = Math.random()*Math.PI*2;
    speeds[i]  = speedRange[0] + Math.random()*(speedRange[1]-speedRange[0]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos,    3));
  geo.setAttribute("aSize",    new THREE.BufferAttribute(sizes,  1));
  geo.setAttribute("aPhase",   new THREE.BufferAttribute(phases, 1));
  geo.setAttribute("aSpeed",   new THREE.BufferAttribute(speeds, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: color.clone() } },
    vertexShader: STAR_VERT, fragmentShader: STAR_FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  return { pts: new THREE.Points(geo, mat), mat, geo };
}

/* ─────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────── */
export default function HeroThreeScene({
  reduceMotion,
  onHover,
}: {
  reduceMotion: boolean;
  onHover?: (data: NodeHoverData | null) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  /* stable ref so the effect doesn't re-run when parent re-renders */
  const onHoverRef = useRef(onHover);
  useEffect(() => { onHoverRef.current = onHover; }, [onHover]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.clientWidth;
    let H = mount.clientHeight;

    /* ── renderer ──────────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "default" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, W/H, 0.1, 160);
    camera.position.set(0, 0, 11);

    /* ══════════════════════════════════════════════════════════════════
       STARS — 3 layers
    ══════════════════════════════════════════════════════════════════ */
    const starFar  = buildStarLayer(1400, [100,60,40], [0.35,0.9],  [0.3,0.8],  new THREE.Color(0xc8ddf5));
    const starMid  = buildStarLayer( 400, [ 55,30,20], [0.65,1.6],  [0.5,1.2],  new THREE.Color(0xe0eeff));
    const starNear = buildStarLayer(  60, [ 30,18,10], [1.1, 2.4],  [0.7,1.8],  new THREE.Color(0xffffff));
    [starFar.pts, starMid.pts, starNear.pts].forEach(p => scene.add(p));

    /* ══════════════════════════════════════════════════════════════════
       NEBULAE — 3 quads
    ══════════════════════════════════════════════════════════════════ */
    type NebulaObj = { mat: THREE.ShaderMaterial; geo: THREE.PlaneGeometry };
    const nebulae: NebulaObj[] = [
      { color: new THREE.Color(0x060e28), pos: new THREE.Vector3(-4, 2,-22), sz:32, rot: 0.3,  op:0.55 },
      { color: new THREE.Color(0x050e1e), pos: new THREE.Vector3( 5,-1,-28), sz:38, rot:-0.5,  op:0.50 },
      { color: new THREE.Color(0x04100c), pos: new THREE.Vector3( 0, 3,-34), sz:46, rot: 0.8,  op:0.40 },
    ].map(cfg => {
      const geo = new THREE.PlaneGeometry(cfg.sz, cfg.sz*0.58);
      const mat = new THREE.ShaderMaterial({
        uniforms: { uTime:{value:0}, uColor:{value:(cfg as {color:THREE.Color}).color.clone()}, uOpacity:{value:cfg.op} },
        vertexShader: NEBULA_VERT, fragmentShader: NEBULA_FRAG,
        transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(cfg.pos);
      mesh.rotation.z = cfg.rot;
      scene.add(mesh);
      return { mat, geo };
    });

    /* ══════════════════════════════════════════════════════════════════
       NODES — InstancedMesh (one draw call)
    ══════════════════════════════════════════════════════════════════ */
    const nodePositions = NODE_DEFS.map(d => new THREE.Vector3(...d.rawPos));
    const nodeCount = NODE_DEFS.length;
    const dummy = new THREE.Object3D();

    const iGeo = new THREE.SphereGeometry(0.11, 10, 10);
    const iMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const instMesh = new THREE.InstancedMesh(iGeo, iMat, nodeCount);

    NODE_DEFS.forEach((def, i) => {
      dummy.position.copy(nodePositions[i]);
      dummy.scale.setScalar(def.isHub ? 1.8 : 1.0);
      dummy.updateMatrix();
      instMesh.setMatrixAt(i, dummy.matrix);
      instMesh.setColorAt(i, new THREE.Color(def.threeColor));
    });
    instMesh.instanceMatrix.needsUpdate = true;
    if (instMesh.instanceColor) instMesh.instanceColor.needsUpdate = true;
    scene.add(instMesh);

    /* ══════════════════════════════════════════════════════════════════
       EDGES — single LineSegments draw call
    ══════════════════════════════════════════════════════════════════ */
    const edgePts: THREE.Vector3[] = [];
    EDGE_PAIRS.forEach(([a, b]) => edgePts.push(nodePositions[a].clone(), nodePositions[b].clone()));
    const edgeGeo = new THREE.BufferGeometry().setFromPoints(edgePts);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0 });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edgeLines);

    /* Hover-glow ring — single Mesh, repositioned each frame */
    const ringGeo = new THREE.RingGeometry(0.19, 0.24, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ringMesh);

    /* ══════════════════════════════════════════════════════════════════
       GSAP ENTRANCE
    ══════════════════════════════════════════════════════════════════ */
    if (!reduceMotion) {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(camera.position, { z: 20, duration: 2.6, ease: "expo.out" }, 0);
      tl.to(iMat,    { opacity: 0.92, duration: 1.0 }, 0.8);
      tl.to(edgeMat, { opacity: 0.15, duration: 1.2 }, 1.0);
    } else {
      iMat.opacity    = 0.92;
      edgeMat.opacity = 0.15;
    }

    /* ── hover state ──────────────────────────────────────────────── */
    let prevHoveredId = -1;
    const hoveredId = { current: -1 };
    const nodePhases = NODE_DEFS.map(() => Math.random() * Math.PI * 2);

    /* ── mouse ────────────────────────────────────────────────────── */
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;

      /* hover detection — project each node to screen, find closest */
      const rect = mount.getBoundingClientRect();
      const msx = e.clientX - rect.left;
      const msy = e.clientY - rect.top;

      let closestIdx = -1;
      let closestDist = 58; // px threshold

      nodePositions.forEach((pos, i) => {
        const v = pos.clone().project(camera);
        const sx = (v.x * 0.5 + 0.5) * W;
        const sy = (-v.y * 0.5 + 0.5) * H;
        const d = Math.hypot(msx - sx, msy - sy);
        if (d < closestDist) { closestDist = d; closestIdx = i; }
      });

      if (closestIdx !== prevHoveredId) {
        prevHoveredId = closestIdx;
        hoveredId.current = closestIdx;
        if (closestIdx >= 0) {
          const def = NODE_DEFS[closestIdx];
          const v = nodePositions[closestIdx].clone().project(camera);
          const sx = (v.x * 0.5 + 0.5) * W + rect.left;
          const sy = (-v.y * 0.5 + 0.5) * H + rect.top;
          onHoverRef.current?.({ label: def.label, icon: def.icon, cssColor: def.cssColor, detail: def.detail, screenX: sx, screenY: sy });
        } else {
          onHoverRef.current?.(null);
        }
      }
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    /* ── scroll ───────────────────────────────────────────────────── */
    let scrollP = 0;
    const st = !reduceMotion ? ScrollTrigger.create({
      trigger: mount, start: "top top", end: "bottom top",
      onUpdate: s => { scrollP = s.progress; },
    }) : null;

    /* ── resize ───────────────────────────────────────────────────── */
    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        W = mount.clientWidth; H = mount.clientHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      });
    };
    window.addEventListener("resize", onResize, { passive: true });

    /* ══════════════════════════════════════════════════════════════════
       RENDER LOOP
    ══════════════════════════════════════════════════════════════════ */
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = performance.now() * 0.001;

      starFar.mat.uniforms.uTime.value  = t;
      starMid.mat.uniforms.uTime.value  = t;
      starNear.mat.uniforms.uTime.value = t;
      nebulae.forEach(n => { n.mat.uniforms.uTime.value = t * 0.5; });

      starFar.pts.rotation.y  = t * 0.0008;
      starMid.pts.rotation.y  = t * 0.0016;
      starNear.pts.rotation.y = t * 0.0028;

      /* node pulse + hover scale */
      NODE_DEFS.forEach((def, i) => {
        const isHovered = hoveredId.current === i;
        const baseScale = def.isHub ? 1.8 : 1.0;
        const pulse = isHovered
          ? baseScale * 2.6
          : baseScale * (1 + 0.18 * Math.sin(t * 1.6 + nodePhases[i]));
        dummy.position.copy(nodePositions[i]);
        dummy.scale.setScalar(pulse);
        dummy.updateMatrix();
        instMesh.setMatrixAt(i, dummy.matrix);
      });
      instMesh.instanceMatrix.needsUpdate = true;

      /* hover ring */
      if (hoveredId.current >= 0) {
        ringMesh.position.copy(nodePositions[hoveredId.current]);
        ringMesh.lookAt(camera.position);
        ringMesh.rotation.z = t * 0.9;
        ringMat.opacity = Math.min(0.75, ringMat.opacity + 0.06);
        /* tint ring to node color */
        ringMat.color.set(NODE_DEFS[hoveredId.current].threeColor);
      } else {
        ringMat.opacity = Math.max(0, ringMat.opacity - 0.06);
      }

      /* camera follow */
      if (!reduceMotion) {
        camera.position.x += (mx * 0.6  - camera.position.x) * 0.015;
        camera.position.y += (-my * 0.3 - camera.position.y) * 0.015;
        camera.position.z  = 11 + scrollP * 7;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    tick();

    /* ── cleanup ──────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      gsap.killTweensOf([camera.position, iMat, edgeMat]);
      st?.kill();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize",    onResize);
      [starFar, starMid, starNear].forEach(s => { s.geo.dispose(); s.mat.dispose(); });
      nebulae.forEach(n => { n.geo.dispose(); n.mat.dispose(); });
      iGeo.dispose(); iMat.dispose();
      edgeGeo.dispose(); edgeMat.dispose();
      ringGeo.dispose(); ringMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [reduceMotion]);

  return <div ref={mountRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />;
}
