/**
 * Simulated POSIX tree under /home/pradip, persisted in localStorage.
 * Users can mkdir / touch / rm / echo > file; cat / vim / ls / cd use this tree.
 */

export const VFS_HOME = "/home/pradip";
const STORAGE_KEY = "portfolio-vfs-v2";
const LEGACY_PREFIX = "portfolio-vim-research:";

export type VfsState = {
  v: 2;
  pwd: string;
  files: Record<string, string>;
  dirs: string[];
};

function sortUnique(paths: string[]): string[] {
  return [...new Set(paths)].sort((a, b) => a.localeCompare(b));
}

function parentDir(abs: string): string {
  const n = abs.replace(/\/+$/, "");
  const i = n.lastIndexOf("/");
  if (i <= 0) return "/";
  return n.slice(0, i) || "/";
}

function baseName(abs: string): string {
  const n = abs.replace(/\/+$/, "");
  const i = n.lastIndexOf("/");
  return i < 0 ? n : n.slice(i + 1);
}

/** Resolve user path; allow /etc/* for read-only sim. cd/vim/mkdir only use HOME subtree. */
export function resolveUserPath(pwd: string, raw: string): string | null {
  let t = raw.trim().replace(/\/+/g, "/");
  if (!t) return pwd;
  if (t === "~") t = VFS_HOME;
  else if (t.startsWith("~/")) t = `${VFS_HOME}/${t.slice(2)}`;
  else if (!t.startsWith("/")) {
    const base = pwd.endsWith("/") ? pwd.slice(0, -1) : pwd;
    t = `${base}/${t}`;
  }
  const parts = t.split("/").filter((s) => s.length > 0);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === "..") {
      if (stack.length) stack.pop();
      continue;
    }
    if (part === ".") continue;
    stack.push(part);
  }
  const out = `/${stack.join("/")}`;
  if (out.startsWith(`${VFS_HOME}/`) || out === VFS_HOME) return out;
  if (out.startsWith("/etc")) return out;
  return null;
}

export function pathToPromptLabel(abs: string): string {
  if (abs === VFS_HOME) return "~";
  if (abs.startsWith(`${VFS_HOME}/`))
    return `~/${abs.slice(VFS_HOME.length + 1)}`;
  return abs;
}

function ensureDirList(dirs: string[], abs: string): string[] {
  const d = abs.replace(/\/+$/, "") || "/";
  if (!dirs.includes(d)) return sortUnique([...dirs, d]);
  return dirs;
}

function ensureParentDirs(dirs: string[], fileAbs: string): string[] {
  let cur = sortUnique([...dirs]);
  let p = parentDir(fileAbs);
  while (p.length >= VFS_HOME.length) {
    cur = ensureDirList(cur, p);
    if (p === VFS_HOME) break;
    p = parentDir(p);
  }
  return cur;
}

export function vfsIsDir(v: VfsState, abs: string): boolean {
  const n = abs.replace(/\/+$/, "") || "/";
  if (v.dirs.some((d) => d.replace(/\/+$/, "") === n)) return true;
  const prefix = n.endsWith("/") ? n : `${n}/`;
  return Object.keys(v.files).some((f) => f.startsWith(prefix) && f !== n);
}

export function vfsIsFile(v: VfsState, abs: string): boolean {
  return Object.prototype.hasOwnProperty.call(v.files, abs);
}

export function vfsReadFileLines(v: VfsState, abs: string): string[] | null {
  if (!vfsIsFile(v, abs)) return null;
  return v.files[abs]!.split("\n");
}

export function vfsReadFileString(v: VfsState, abs: string): string | null {
  if (!vfsIsFile(v, abs)) return null;
  return v.files[abs]!;
}

export function vfsListNames(v: VfsState, dirAbs: string): string[] {
  const d = dirAbs.replace(/\/+$/, "") || "/";
  const prefix = `${d}/`;
  const names = new Set<string>();
  for (const p of v.dirs) {
    if (p === d || !p.startsWith(prefix)) continue;
    const rest = p.slice(prefix.length);
    const seg = rest.split("/")[0];
    if (seg) names.add(`${seg}/`);
  }
  for (const f of Object.keys(v.files)) {
    if (!f.startsWith(prefix)) continue;
    const rest = f.slice(prefix.length);
    const seg = rest.split("/")[0];
    if (seg) names.add(seg);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

export function vfsMkdir(
  v: VfsState,
  abs: string,
  parents: boolean
): { next: VfsState; err?: string } {
  const n = abs.replace(/\/+$/, "") || "/";
  if (!n.startsWith(VFS_HOME)) return { next: v, err: "mkdir: permission denied" };
  if (vfsIsFile(v, n)) return { next: v, err: `mkdir: cannot create directory ‘${baseName(n)}’: File exists` };
  if (vfsIsDir(v, n)) return { next: v, err: `mkdir: cannot create directory ‘${baseName(n)}’: File exists` };

  if (!parents) {
    const par = parentDir(n);
    if (!vfsIsDir(v, par)) {
      return {
        next: v,
        err: `mkdir: cannot create directory ‘${baseName(n)}’: No such file or directory`,
      };
    }
  }

  const chain: string[] = [];
  let p = n;
  while (true) {
    chain.push(p);
    if (p === VFS_HOME) break;
    const nx = parentDir(p);
    if (nx === p) break;
    p = nx;
  }
  const toMake = parents ? chain.reverse() : [n];

  let next = { ...v, dirs: [...v.dirs] };
  for (const path of toMake) {
    if (vfsIsFile(next, path))
      return { next: v, err: `mkdir: cannot create directory ‘${baseName(path)}’: File exists` };
    if (!vfsIsDir(next, path)) {
      next = { ...next, dirs: ensureDirList(next.dirs, path) };
    }
  }
  return { next };
}

export function vfsTouch(v: VfsState, abs: string): { next: VfsState; err?: string } {
  const n = abs.replace(/\/+$/, "") || "/";
  if (!n.startsWith(VFS_HOME)) return { next: v, err: "touch: permission denied" };
  if (vfsIsDir(v, n)) return { next: v, err: `touch: ${baseName(n)}: Is a directory` };
  if (vfsIsFile(v, n)) return { next: v };
  const dirs = ensureParentDirs(v.dirs, n);
  const files = { ...v.files, [n]: v.files[n] ?? "" };
  return { next: { ...v, dirs, files } };
}

export function vfsWriteFile(v: VfsState, abs: string, content: string): VfsState {
  const dirs = ensureParentDirs(v.dirs, abs);
  return { ...v, dirs, files: { ...v.files, [abs]: content } };
}

export function vfsRm(
  v: VfsState,
  abs: string,
  recursive: boolean
): { next: VfsState; err?: string } {
  const n = abs.replace(/\/+$/, "") || "/";
  if (!n.startsWith(VFS_HOME) || n === VFS_HOME)
    return { next: v, err: "rm: refusing to remove home or outside ~" };
  if (vfsIsFile(v, n)) {
    const files = { ...v.files };
    delete files[n];
    return { next: { ...v, files } };
  }
  if (vfsIsDir(v, n)) {
    const hasChildren =
      Object.keys(v.files).some((f) => f.startsWith(`${n}/`)) ||
      v.dirs.some((d) => d.startsWith(`${n}/`) && d !== n);
    if (hasChildren && !recursive)
      return { next: v, err: `rm: cannot remove '${baseName(n)}': Is a directory` };
    const files = { ...v.files };
    for (const k of Object.keys(files)) {
      if (k === n || k.startsWith(`${n}/`)) delete files[k];
    }
    const dirs = v.dirs.filter((d) => d !== n && !d.startsWith(`${n}/`));
    return { next: { ...v, files, dirs } };
  }
  return { next: v, err: `rm: cannot remove '${baseName(n)}': No such file or directory` };
}

export function vfsEnsureFileForEdit(v: VfsState, abs: string): VfsState {
  if (vfsIsFile(v, abs)) return v;
  const dirs = ensureParentDirs(v.dirs, abs);
  return { ...v, dirs, files: { ...v.files, [abs]: "" } };
}

function migrateLegacyResearch(v: VfsState): VfsState {
  if (typeof localStorage === "undefined") return v;
  const files = { ...v.files };
  let changed = false;
  for (const name of [
    "vuln-detection.md",
    "devsecops-pipeline.md",
    "ai-augmented-scanning.md",
  ]) {
    try {
      const raw = localStorage.getItem(LEGACY_PREFIX + name);
      if (!raw) continue;
      const p = JSON.parse(raw) as unknown;
      if (!Array.isArray(p) || !p.every((x) => typeof x === "string")) continue;
      const abs = `${VFS_HOME}/research/${name}`;
      files[abs] = p.join("\n");
      localStorage.removeItem(LEGACY_PREFIX + name);
      changed = true;
    } catch {
      /* ignore */
    }
  }
  return changed ? { ...v, files } : v;
}

export function defaultVfsSeed(): VfsState {
  const dirs = sortUnique([
    VFS_HOME,
    `${VFS_HOME}/skills`,
    `${VFS_HOME}/skills/security`,
    `${VFS_HOME}/skills/frontend`,
    `${VFS_HOME}/skills/devops`,
    `${VFS_HOME}/research`,
  ]);
  const files: Record<string, string> = {
    [`${VFS_HOME}/about.txt`]: [
      "Name: Pradip Bhatt",
      "Role: Full Stack Developer & AI Researcher",
      "Location: Nepal",
      "Education: Computer Engineering, Far Western University",
      "Focus: AI research & software engineering",
      "",
      "Interests: AI-powered applications, intelligent automation, and full-stack development.",
    ].join("\n"),
    [`${VFS_HOME}/contact.json`]: [
      "{",
      '  "email": "pradipbhatt2126@gmail.com",',
      '  "github": "https://github.com/pradipbhatt",',
      '  "linkedin": "https://www.linkedin.com/in/pradipbhatt2126/",',
      '  "location": "Nepal"',
      "}",
    ].join("\n"),
    [`${VFS_HOME}/skills/security.txt`]: [
      "VAPT",
      "Threat Intelligence",
      "CVE Research",
      "CompTIA Security+",
      "OSINT",
    ].join("\n"),
    [`${VFS_HOME}/skills/frontend.txt`]: [
      "React",
      "Next.js",
      "TypeScript",
      "GraphQL",
      "Tailwind CSS",
      "Node.js",
    ].join("\n"),
    [`${VFS_HOME}/skills/devops.txt`]: [
      "Docker · Kubernetes basics",
      "GitHub Actions / CI gates",
      "Terraform (IaC) exposure",
      "Logging, metrics, incident runbooks",
      "Secure SDLC automation",
    ].join("\n"),
    [`${VFS_HOME}/research/vuln-detection.md`]: [
      "# AI-Augmented Vulnerability Detection in DevSecOps Pipelines",
      "",
      "Abstract (thesis proposal):",
      "This work explores augmenting traditional SAST/DAST and dependency checks with",
      "ML-assisted signal fusion to reduce false positives and surface exploitable issues",
      "earlier in CI/CD — without slowing developer velocity.",
    ].join("\n"),
    [`${VFS_HOME}/research/devsecops-pipeline.md`]: [
      "# DevSecOps pipeline hardening notes",
      "",
      "Abstract:",
      "Policy-as-code gates, artifact signing, SBOM ingestion, and break-glass workflows",
      "for high-velocity teams — balancing auditability with developer experience.",
    ].join("\n"),
    [`${VFS_HOME}/research/ai-augmented-scanning.md`]: [
      "# AI-augmented scanning (lab notes)",
      "",
      "Summary:",
      "Experiments coupling static findings with contextual embeddings to cluster duplicates",
      "and prioritize reachable attack paths before human triage.",
    ].join("\n"),
  };
  return { v: 2, pwd: VFS_HOME, files, dirs };
}

export function loadVfsState(): VfsState {
  if (typeof localStorage === "undefined") return defaultVfsSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = defaultVfsSeed();
      return migrateLegacyResearch(seeded);
    }
    const p = JSON.parse(raw) as Partial<VfsState>;
    if (
      p.v === 2 &&
      typeof p.pwd === "string" &&
      p.files &&
      typeof p.files === "object" &&
      Array.isArray(p.dirs)
    ) {
      const files: Record<string, string> = {};
      for (const [k, val] of Object.entries(p.files)) {
        if (typeof val === "string") files[k] = val;
      }
      const dirs = p.dirs.filter((d): d is string => typeof d === "string");
      let pwd = p.pwd.startsWith(VFS_HOME) ? p.pwd : VFS_HOME;
      if (!vfsIsDir({ v: 2, pwd, files, dirs }, pwd)) pwd = VFS_HOME;
      return migrateLegacyResearch({ v: 2, pwd, files, dirs });
    }
  } catch {
    /* ignore */
  }
  return migrateLegacyResearch(defaultVfsSeed());
}

export function saveVfsState(v: VfsState): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    /* quota */
  }
}
