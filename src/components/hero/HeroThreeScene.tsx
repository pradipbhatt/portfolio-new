"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Briefcase, Wrench, Award, GraduationCap, FolderOpen, Code2, AtSign } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export type NodeHoverData = {
  label: string;
  icon: ReactNode;
  cssColor: string;
  detail: string[];
  screenX: number;
  screenY: number;
};

type NodeDef = {
  label: string;
  icon: ReactNode;
  cssColor: string;
  threeColor: number;
  detail: string[];
  rawPos: [number, number, number];
  isHub?: boolean;
};

const NODE_DEFS: NodeDef[] = [
  {
    label: "Skills", icon: <Zap size={13} />, cssColor: "#00ff9d", threeColor: 0x00ff9d, isHub: true,
    rawPos: [-5.0, 1.5, -2],
    detail: ["Penetration Testing", "Vulnerability Assessment", "OSINT & Recon", "Threat Intelligence", "Red Teaming"],
  },
  {
    label: "Experience", icon: <Briefcase size={13} />, cssColor: "#c15928", threeColor: 0xc15928, isHub: true,
    rawPos: [5.5, 1.0, -1.5],
    detail: ["SecurityPal AI — Security Researcher", "3+ Years Industry Experience", "Full Stack Development", "SDLC Automation"],
  },
  {
    label: "Tools", icon: <Wrench size={13} />, cssColor: "#00ccff", threeColor: 0x00ccff,
    rawPos: [-4.0, -2.0, -1.5],
    detail: ["Burp Suite Pro", "Nmap / Masscan", "Metasploit Framework", "Wireshark / tcpdump", "SIEM — Splunk, ELK"],
  },
  {
    label: "Certs", icon: <Award size={13} />, cssColor: "#f5a623", threeColor: 0xf5a623,
    rawPos: [3.5, -1.5, -2],
    detail: ["CompTIA Security+", "Google Cybersecurity", "CEH — in progress", "OSCP — pursuing"],
  },
  {
    label: "Education", icon: <GraduationCap size={13} />, cssColor: "#8b5cf6", threeColor: 0x8b5cf6,
    rawPos: [0.5, 3.2, -3],
    detail: ["B.E. Computer Engineering", "Far Western University", "Mahendranagar, Bhimdattnagar", "Sudurpaschim — 2020-2024"],
  },
  {
    label: "Projects", icon: <FolderOpen size={13} />, cssColor: "#ff6b6b", threeColor: 0xff6b6b,
    rawPos: [-6.5, 0.0, -1],
    detail: ["20+ Projects Shipped", "Bug Bounty — HackerOne", "Open Source Contributions", "CTF Competitions"],
  },
  {
    label: "Languages", icon: <Code2 size={13} />, cssColor: "#64ffda", threeColor: 0x64ffda,
    rawPos: [2.0, -3.2, -2],
    detail: ["JavaScript / TypeScript", "Python", "Bash / Shell", "Go", "SQL / NoSQL"],
  },
  {
    label: "Connect", icon: <AtSign size={13} />, cssColor: "#ffd700", threeColor: 0xffd700,
    rawPos: [7.0, 2.5, -2],
    detail: ["LinkedIn: pradipbhatt2126", "GitHub: pradipbhatt", "Email: pradip.bhatt@securitypalhq.com", "Discord: pradipbhatt"],
  },
];

const EDGE_PAIRS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 5], [1, 3], [1, 7],
  [2, 6], [4, 6], [5, 6],
];

export default function HeroThreeScene({
  reduceMotion,
  onHover,
}: {
  reduceMotion: boolean;
  onHover?: (data: NodeHoverData | null) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onHoverRef = useRef(onHover);
  useEffect(() => { onHoverRef.current = onHover; }, [onHover]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.clientWidth;
    let H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "default" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 160);
    camera.position.set(0, 0, 11);

    /* ── Node group — everything rotates together for 4D effect ── */
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

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
    nodeGroup.add(instMesh);

    const edgePts: THREE.Vector3[] = [];
    EDGE_PAIRS.forEach(([a, b]) => edgePts.push(nodePositions[a].clone(), nodePositions[b].clone()));
    const edgeGeo = new THREE.BufferGeometry().setFromPoints(edgePts);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0 });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    nodeGroup.add(edgeLines);

    /* Halo lives in scene-space so it doesn't inherit group rotation */
    const haloGeo = new THREE.SphereGeometry(0.28, 12, 12);
    const haloMat = new THREE.MeshBasicMaterial({
      transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    /* Reduced visibility targets */
    const edgeOpacityTarget = { base: 0.08, active: 0.32, dim: 0.03 };
    const nodeOpacityTarget  = { base: 0.38, hovered: 0.38 };

    if (!reduceMotion) {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(iMat,    { opacity: 0 }, { opacity: nodeOpacityTarget.base, duration: 2.0 }, 0.6);
      tl.fromTo(edgeMat, { opacity: 0 }, { opacity: edgeOpacityTarget.base, duration: 2.2 }, 0.9);
    } else {
      iMat.opacity    = nodeOpacityTarget.base;
      edgeMat.opacity = edgeOpacityTarget.base;
    }

    let prevHoveredId = -1;
    const hoveredId = { current: -1 };
    const nodeBaseScales = NODE_DEFS.map(d => d.isHub ? 1.8 : 1.0);

    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;

      const rect = mount.getBoundingClientRect();
      const msx = e.clientX - rect.left;
      const msy = e.clientY - rect.top;

      let closestIdx = -1;
      let closestDist = 58;

      nodePositions.forEach((localPos, i) => {
        /* project world-space position (after group rotation) */
        const worldPos = localPos.clone();
        nodeGroup.localToWorld(worldPos);
        const v = worldPos.clone().project(camera);
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
          const worldPos = nodePositions[closestIdx].clone();
          nodeGroup.localToWorld(worldPos);
          const v = worldPos.clone().project(camera);
          const sx = (v.x * 0.5 + 0.5) * W + rect.left;
          const sy = (-v.y * 0.5 + 0.5) * H + rect.top;
          onHoverRef.current?.({ label: def.label, icon: def.icon, cssColor: def.cssColor, detail: def.detail, screenX: sx, screenY: sy });

          haloMat.color.set(def.threeColor);
          gsap.to(haloMat, { opacity: 0.14, duration: 0.35, ease: "power2.out" });
          gsap.to(edgeMat, { opacity: edgeOpacityTarget.active, duration: 0.3, ease: "power2.out" });
        } else {
          onHoverRef.current?.(null);
          gsap.to(haloMat, { opacity: 0, duration: 0.4, ease: "power2.out" });
          gsap.to(edgeMat, { opacity: edgeOpacityTarget.base, duration: 0.5, ease: "power2.out" });
        }
      }
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    let scrollP = 0;
    const st = !reduceMotion ? ScrollTrigger.create({
      trigger: mount, start: "top top", end: "bottom top",
      onUpdate: s => { scrollP = s.progress; },
    }) : null;

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

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = performance.now() * 0.001;

      /* 4D-like rotation — three axes at different incommensurable rates */
      if (!reduceMotion) {
        nodeGroup.rotation.y = t * 0.055;                        // primary slow spin
        nodeGroup.rotation.x = Math.sin(t * 0.031) * 0.28;      // gentle X oscillation
        nodeGroup.rotation.z = Math.sin(t * 0.019) * 0.12;      // very slow Z roll
      }

      /* breathing */
      const breath = reduceMotion ? 1 : 1 + 0.08 * Math.sin(t * 0.9);

      NODE_DEFS.forEach((_def, i) => {
        const isHovered = hoveredId.current === i;
        const base = nodeBaseScales[i];
        const scale = isHovered ? base * 1.6 : base * breath;
        dummy.position.copy(nodePositions[i]);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        instMesh.setMatrixAt(i, dummy.matrix);
      });
      instMesh.instanceMatrix.needsUpdate = true;

      /* halo tracks hovered node in world space */
      if (hoveredId.current >= 0) {
        const worldPos = nodePositions[hoveredId.current].clone();
        nodeGroup.localToWorld(worldPos);
        haloMesh.position.copy(worldPos);
      }

      /* camera follow */
      if (!reduceMotion) {
        camera.position.x += (mx * 0.5  - camera.position.x) * 0.012;
        camera.position.y += (-my * 0.25 - camera.position.y) * 0.012;
        camera.position.z  = 11 + scrollP * 7;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      gsap.killTweensOf([iMat, edgeMat, haloMat]);
      st?.kill();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize",    onResize);
      iGeo.dispose(); iMat.dispose();
      edgeGeo.dispose(); edgeMat.dispose();
      haloGeo.dispose(); haloMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [reduceMotion]);

  return <div ref={mountRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />;
}
