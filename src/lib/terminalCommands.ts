import {
  pathToPromptLabel,
  resolveUserPath,
  vfsEnsureFileForEdit,
  vfsIsDir,
  vfsIsFile,
  vfsListNames,
  vfsMkdir,
  vfsReadFileLines,
  vfsReadFileString,
  vfsRm,
  vfsTouch,
  vfsWriteFile,
  VFS_HOME,
  type VfsState,
} from "./terminalVfs";

export const TERMINAL_STORAGE_POSITION = "portfolio-terminal-bounds";
export const TERMINAL_BOOT_SESSION_KEY = "portfolio-terminal-boot-done";

/** Default terminal window size (used by HeroTerminal + `termdefaults` / `size medium`). */
export const TERMINAL_DEFAULT_GEOMETRY = { width: 520, height: 380 } as const;

/** Geometry limits shared by CLI `resize` / `size` and the UI. */
export const TERMINAL_GEOMETRY_LIMITS = {
  minWidth: 420,
  maxWidth: 2000,
  minHeight: 300,
  maxHeight: 1600,
} as const;

function clampGeom(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Base commands for help + tab completion (includes common aliases). */
export const COMMAND_LIST = [
  "help",
  "clear",
  "history",
  "cd ..",
  "pwd",
  "whoami",
  "id",
  "hostname",
  "date",
  "uptime",
  "cat about.txt",
  "ls -la skills/",
  "cat skills/security.txt",
  "cat skills/frontend.txt",
  "cat skills/devops.txt",
  "cd research/",
  "ls",
  "cd research/ && ls",
  "cat research/vuln-detection.md",
  "cat research/devsecops-pipeline.md",
  "cat research/ai-augmented-scanning.md",
  "curl -s contact.json",
  "uname -a",
  "lsb_release -a",
  "cat /etc/os-release",
  "cat /etc/passwd | grep pradip",
  "head -n 5 /etc/hosts",
  "df -h",
  "free -h",
  "ss -tuln",
  "which nmap",
  "dig pradipbhatt.com.np",
  "traceroute -n -m 4 127.0.0.1",
  "journalctl -n 3 --no-pager",
  "apt list --installed",
  "env | head",
  "ping pradipbhatt.com.np",
  "nmap localhost",
  "sudo su",
  "neofetch",
  "resize 520 380",
  "size medium",
  "size large",
  "termdefaults",
  "ip a",
  "ip route",
  "ps aux | head",
  "lsusb",
  "lspci | head",
  "dmesg | tail -n 3",
  "systemctl status ssh",
  "iptables -L -n",
  "openssl version",
  "go version",
  "python3 --version",
  "rustc --version",
  "gcc --version",
  "curl -I https://example.com",
  "ffuf -h",
  "searchsploit apache",
  "masscan --version",
  "rustscan --version",
  "hash-identifier",
  "whatweb pradipbhatt.com.np",
  "nikto -Version",
  "sqlmap --version",
  "hydra -h",
  "john --list=formats",
  "airmon-ng",
  "tcpdump --version",
  "sudo apt install vim",
  "apt install vim",
  "vim vuln-detection.md",
  "vim devsecops-pipeline.md",
  "vim ai-augmented-scanning.md",
] as const;

export type RunResult =
  | { kind: "lines"; lines: string[] }
  | { kind: "clear" }
  | { kind: "ping"; host: string }
  | { kind: "resize"; width: number; height: number }
  | { kind: "vim_session"; displayPath: string; absolutePath: string; lines: string[] };

export type TerminalCtx = {
  vfs: VfsState;
  setVfs: (next: VfsState) => void;
  history: string[];
  vimInstalled: boolean;
  setVimInstalled: (v: boolean) => void;
};

function skillsListing(): string[] {
  return [
    "total 24",
    "drwxr-xr-x  2 pradip pradip 4096 Jan 12 10:22 .",
    "drwxr-xr-x  6 pradip pradip 4096 Jan 12 10:20 ..",
    "drwxr-xr-x  2 pradip pradip 4096 Jan 12 10:21 security/",
    "drwxr-xr-x  2 pradip pradip 4096 Jan 12 10:21 frontend/",
    "drwxr-xr-x  2 pradip pradip 4096 Jan 12 10:21 devops/",
    "drwxr-xr-x  2 pradip pradip 4096 Jan 12 10:21 research/",
  ];
}

/** Filenames used in help / tab hints (content lives in terminalVfs default seed). */
export const RESEARCH_MARKDOWN_FILES = [
  "vuln-detection.md",
  "devsecops-pipeline.md",
  "ai-augmented-scanning.md",
] as const;

function isAptInstallVim(input: string): boolean {
  const s = input.trim().replace(/\s+/g, " ");
  return /^(sudo\s+)?(apt|apt-get)\s+install(\s+-[a-z]+)*\s+vim\s*$/i.test(s);
}

function parseVimOpen(input: string, ctx: TerminalCtx): RunResult | null {
  const m = input.trim().match(/^(vi|vim)(?:\s+(.+))?$/i);
  if (!m) return null;
  const rest = (m[2] ?? "").trim();
  if (!rest) {
    return {
      kind: "lines",
      lines: [
        "VIM - Vi IMproved 9.1",
        "Usage: vim <path>   (files and folders under ~ only)",
        "Install: sudo apt install vim",
      ],
    };
  }
  if (!ctx.vimInstalled) {
    return {
      kind: "lines",
      lines: [
        "bash: vim: command not found",
        "Try: sudo apt install vim",
      ],
    };
  }
  const abs = resolveUserPath(ctx.vfs.pwd, rest);
  if (!abs || !abs.startsWith(VFS_HOME)) {
    return { kind: "lines", lines: [`vim: ${rest}: No such file or directory`] };
  }
  if (vfsIsDir(ctx.vfs, abs)) {
    return { kind: "lines", lines: [`vim: ${rest}: Is a directory`] };
  }
  let vfsNext = ctx.vfs;
  if (!vfsIsFile(ctx.vfs, abs)) {
    vfsNext = vfsEnsureFileForEdit(ctx.vfs, abs);
    ctx.setVfs(vfsNext);
  }
  const body = vfsReadFileLines(vfsNext, abs);
  if (!body) return { kind: "lines", lines: [`vim: ${rest}: not readable`] };
  return {
    kind: "vim_session",
    displayPath: pathToPromptLabel(abs),
    absolutePath: abs,
    lines: body,
  };
}

function helpText(): string[] {
  const w = 30;
  const row = (...cells: string[]) =>
    cells.map((c) => c.padEnd(w)).join("").replace(/\s+$/, "");

  return [
    "Available commands",
    "────────────────────────────────────────────────────────────",
    "",
    "Session & navigation",
    row("help", "clear", "history"),
    row("cd ..", "cd research/", "ls"),
    row("cd research/ && ls", "", ""),
    "",
    "Identity & files",
    row("whoami", "cat about.txt", "ls -la skills/"),
    row(
      "cat skills/security.txt",
      "cat skills/frontend.txt",
      "cat skills/devops.txt"
    ),
    "",
    "Research",
    row(
      "cat research/vuln-detection.md",
      "cat research/devsecops-pipeline.md",
      "cat research/ai-augmented-scanning.md"
    ),
    row("sudo apt install vim", "cd research/", "vim notes.md"),
    row("mkdir -p projects/a", "touch projects/readme.txt", "echo hi > x.txt"),
    row("rm file.txt", "rm -rf emptydir/", "(~ files persist in localStorage)"),
    "",
    "System info",
    row("pwd", "hostname", "date"),
    row("uptime", "id", "lsb_release -a"),
    row("cat /etc/os-release", "head -n 5 /etc/hosts", ""),
    "",
    "Disk & memory",
    row("df -h", "free -h", "ss -tuln"),
    "",
    "Network & tools",
    row("curl -s contact.json", "uname -a", "cat /etc/passwd | grep pradip"),
    row("which nmap", "dig pradipbhatt.com.np", "traceroute -n -m 4 127.0.0.1"),
    row("ping pradipbhatt.com.np", "nmap localhost", "sudo su"),
    "",
    "Logs & packages",
    row("journalctl -n 3 --no-pager", "apt list --installed", "env | head"),
    row("neofetch", "termdefaults", "resize 520 380"),
    row("size medium", "size large", "size xl"),
    "",
    "Processes & hardware",
    row("ps aux | head", "lsusb", "lspci | head"),
    row("dmesg | tail -n 3", "systemctl status ssh", ""),
    "",
    "Network stack",
    row("ip a", "ip route", "iptables -L -n"),
    "",
    "Toolchain & crypto",
    row("go version", "python3 --version", "rustc --version"),
    row("gcc --version", "openssl version", "tcpdump --version"),
    "",
    "Offensive tooling (simulated)",
    row("nmap localhost", "ffuf -h", "searchsploit apache"),
    row("masscan --version", "rustscan --version", "hash-identifier"),
    row("whatweb pradipbhatt.com.np", "nikto -Version", "sqlmap --version"),
    row("hydra -h", "john --list=formats", "airmon-ng"),
    "",
    "Tip: Tab to autocomplete · ↑/↓ for history · drag corner to resize window.",
  ];
}

function neofetchText(): string[] {
  const logo = [
    "    ███         ",
    "   █████        ",
    "  ███ ███   Kali",
    " ███   ███      ",
    "  ███████       ",
  ];
  const info = [
    "OS: Kali GNU/Linux Rolling",
    "Host: pradip-portfolio",
    "Kernel: 6.6.15-amd64",
    "Shell: zsh 5.9",
    "Role: Security Research Analyst",
    "Cert: CompTIA Security+ SY0-701",
    "Skills: VAPT, React, Next.js, OSINT, DevSecOps",
  ];
  const out: string[] = [];
  const max = Math.max(logo.length, info.length);
  for (let i = 0; i < max; i++) {
    const L = logo[i] ?? "                 ";
    const R = info[i] ?? "";
    out.push(`${L}  ${R}`);
  }
  return out;
}

export function getTabCompletion(prefix: string): string | null {
  const p = prefix.trim().toLowerCase();
  if (!p) return null;
  const matches = COMMAND_LIST.filter((c) => c.toLowerCase().startsWith(p));
  if (matches.length !== 1) return null;
  return matches[0];
}

function parseResizeCommand(input: string, lower: string): RunResult | null {
  const { minWidth, maxWidth, minHeight, maxHeight } = TERMINAL_GEOMETRY_LIMITS;
  if (lower === "termdefaults" || lower === "reset-terminal-size") {
    return {
      kind: "resize",
      width: TERMINAL_DEFAULT_GEOMETRY.width,
      height: TERMINAL_DEFAULT_GEOMETRY.height,
    };
  }
  const m = lower.match(/^resize\s+(\d+)\s+(\d+)\s*$/);
  if (m) {
    const w = clampGeom(parseInt(m[1]!, 10), minWidth, maxWidth);
    const h = clampGeom(parseInt(m[2]!, 10), minHeight, maxHeight);
    return { kind: "resize", width: w, height: h };
  }
  const presets: Record<string, readonly [number, number]> = {
    xs: [420, 300],
    s: [440, 300],
    small: [440, 300],
    m: [520, 380],
    medium: [520, 380],
    l: [680, 460],
    large: [680, 460],
    xl: [840, 560],
    xlarge: [840, 560],
    xxl: [960, 620],
  };
  const sm = lower.match(/^size\s+([a-z0-9]+)\s*$/);
  if (sm) {
    const pair = presets[sm[1]!];
    if (pair) {
      return {
        kind: "resize",
        width: clampGeom(pair[0], minWidth, maxWidth),
        height: clampGeom(pair[1], minHeight, maxHeight),
      };
    }
  }
  return null;
}

export function runCommand(raw: string, ctx: TerminalCtx): RunResult {
  const input = raw.trim();
  const lower = input.toLowerCase();

  if (!input) return { kind: "lines", lines: [] };

  const resizeCmd = parseResizeCommand(input, lower);
  if (resizeCmd) return resizeCmd;

  if (lower === "clear" || lower === "cls") return { kind: "clear" };

  if (lower === "help") return { kind: "lines", lines: helpText() };

  if (lower === "history") {
    const last = ctx.history.slice(-10);
    if (last.length === 0) return { kind: "lines", lines: ["(no history yet)"] };
    return {
      kind: "lines",
      lines: last.map((c, i) => `${String(i + 1).padStart(3)}  ${c}`),
    };
  }

  if (lower === "whoami") return { kind: "lines", lines: ["pradip"] };

  if (lower === "pwd") {
    return { kind: "lines", lines: [ctx.vfs.pwd] };
  }

  if (lower === "hostname") {
    return { kind: "lines", lines: ["kali"] };
  }

  if (lower === "id") {
    return {
      kind: "lines",
      lines: ["uid=1000(pradip) gid=1000(pradip) groups=1000(pradip),27(sudo),100(users)"],
    };
  }

  if (lower === "date") {
    return {
      kind: "lines",
      lines: [new Date().toString()],
    };
  }

  if (lower === "uptime") {
    return {
      kind: "lines",
      lines: [
        " 10:15:03 up 4 days,  2:14,  1 user,  load average: 0.42, 0.38, 0.31 (simulated)",
      ],
    };
  }

  if (lower === "lsb_release -a") {
    return {
      kind: "lines",
      lines: [
        "Distributor ID: Kali",
        "Description:    Kali GNU/Linux Rolling",
        "Release:        kali-rolling",
        "Codename:       kali-rolling",
      ],
    };
  }

  if (lower === "cat /etc/os-release") {
    return {
      kind: "lines",
      lines: [
        'PRETTY_NAME="Kali GNU/Linux Rolling"',
        'NAME="Kali GNU/Linux"',
        "ID=kali",
        'VERSION="2024.1"',
        "HOME_URL=https://www.kali.org/",
      ],
    };
  }

  if (lower === "head -n 5 /etc/hosts") {
    return {
      kind: "lines",
      lines: [
        "127.0.0.1\tlocalhost",
        "::1\t\tlocalhost ip6-localhost ip6-loopback",
        "127.0.1.1\tkali",
        "# portfolio sandbox entries",
        "127.0.0.1\tpradip-portfolio.local",
      ],
    };
  }

  if (lower === "df -h") {
    return {
      kind: "lines",
      lines: [
        "Filesystem      Size  Used Avail Use% Mounted on",
        "udev            7.8G     0  7.8G   0% /dev",
        "/dev/sda1        99G   42G   52G  45% /",
        "tmpfs           1.6G  2.1M  1.6G   1% /run",
        "(simulated — portfolio container)",
      ],
    };
  }

  if (lower === "free -h") {
    return {
      kind: "lines",
      lines: [
        "               total        used        free      shared  buff/cache   available",
        "Mem:            15Gi       6.2Gi       4.1Gi       120Mi       5.1Gi       8.7Gi",
        "Swap:          2.0Gi          0B       2.0Gi",
      ],
    };
  }

  if (lower === "ss -tuln") {
    return {
      kind: "lines",
      lines: [
        "Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port",
        "tcp   LISTEN 0      128    127.0.0.1:22        0.0.0.0:*",
        "tcp   LISTEN 0      128    127.0.0.1:631       0.0.0.0:*",
        "tcp   LISTEN 0      4096   0.0.0.0:3000        0.0.0.0:*",
        "tcp   LISTEN 0      4096   0.0.0.0:443         0.0.0.0:*",
        "(simulated)",
      ],
    };
  }

  if (lower === "which nmap") {
    return { kind: "lines", lines: ["/usr/bin/nmap"] };
  }

  if (lower === "dig pradipbhatt.com.np" || lower.startsWith("dig pradipbhatt.com.np")) {
    return {
      kind: "lines",
      lines: [
        "; <<>> DiG 9.18 <<>> pradipbhatt.com.np",
        ";; ANSWER SECTION:",
        "pradipbhatt.com.np.  300  IN  A  127.0.0.1",
        ";; Query time: 12 msec (simulated)",
      ],
    };
  }

  if (lower === "traceroute -n -m 4 127.0.0.1") {
    return {
      kind: "lines",
      lines: [
        "traceroute to 127.0.0.1 (127.0.0.1), 4 hops max, 60 byte packets",
        " 1  127.0.0.1  0.052 ms  0.018 ms  0.015 ms",
      ],
    };
  }

  if (lower === "journalctl -n 3 --no-pager") {
    return {
      kind: "lines",
      lines: [
        "May 14 10:12:01 kali systemd[1]: Started portfolio-terminal.service.",
        "May 14 10:12:02 kali kernel: audit: type=1400 audit(1715680322.000:42): apparmor=\"ALLOW\"",
        "May 14 10:12:03 kali sshd[884]: Accepted publickey for pradip from 127.0.0.1 (simulated)",
      ],
    };
  }

  if (lower === "apt list --installed") {
    const base = [
      "Listing...",
      "nmap/kali-rolling,now 7.94+dfsg-1kali1 amd64 [installed]",
      "curl/kali-rolling,now 8.5.0-1 amd64 [installed]",
      "python3/kali-rolling,now 3.11.6-1 amd64 [installed]",
    ];
    if (ctx.vimInstalled) {
      base.splice(
        2,
        0,
        "vim/kali-rolling,now 2:9.1.0000-1kali1 amd64 [installed]"
      );
    }
    base.push("...(truncated — portfolio simulation)");
    return { kind: "lines", lines: base };
  }

  if (lower === "env | head") {
    return {
      kind: "lines",
      lines: [
        "SHELL=/bin/zsh",
        "USER=pradip",
        "HOME=/home/pradip",
        "PATH=/usr/local/bin:/usr/bin:/bin",
        "LANG=en_US.UTF-8",
        "PWD=" + ctx.vfs.pwd,
        "TERM=xterm-256color",
        "...(truncated)",
      ],
    };
  }

  const echoMatch = input.match(/^\s*echo\s+([\s\S]*?)\s*(>>|>)\s*(.+)$/i);
  if (echoMatch) {
    const text = echoMatch[1].replace(/^["']|["']$/g, "");
    const mode = echoMatch[2];
    const rawTarget = echoMatch[3].trim().replace(/^["']|["']$/g, "");
    const abs = resolveUserPath(ctx.vfs.pwd, rawTarget);
    if (!abs?.startsWith(VFS_HOME)) {
      return { kind: "lines", lines: [`bash: ${rawTarget}: Permission denied`] };
    }
    if (vfsIsDir(ctx.vfs, abs)) {
      return { kind: "lines", lines: [`bash: ${rawTarget}: Is a directory`] };
    }
    let content = vfsReadFileString(ctx.vfs, abs) ?? "";
    if (mode === ">>") content += text + "\n";
    else content = text + "\n";
    ctx.setVfs(vfsWriteFile(ctx.vfs, abs, content));
    return { kind: "lines", lines: [] };
  }

  const mkdirM = input.match(/^\s*mkdir\s+(-p\s+)?([\s\S]+)$/i);
  if (mkdirM) {
    const parents = Boolean(mkdirM[1]);
    const raw = mkdirM[2].trim();
    const abs = resolveUserPath(ctx.vfs.pwd, raw);
    if (!abs?.startsWith(VFS_HOME)) {
      return {
        kind: "lines",
        lines: [`mkdir: cannot create directory ‘${raw}’: Permission denied`],
      };
    }
    const { next, err } = vfsMkdir(ctx.vfs, abs, parents);
    if (err) return { kind: "lines", lines: [err] };
    ctx.setVfs(next);
    return { kind: "lines", lines: [] };
  }

  const touchM = input.match(/^\s*touch\s+(.+)$/i);
  if (touchM) {
    const abs = resolveUserPath(ctx.vfs.pwd, touchM[1].trim());
    if (!abs?.startsWith(VFS_HOME)) {
      return { kind: "lines", lines: ["touch: permission denied"] };
    }
    const { next, err } = vfsTouch(ctx.vfs, abs);
    if (err) return { kind: "lines", lines: [err] };
    ctx.setVfs(next);
    return { kind: "lines", lines: [] };
  }

  const rmTrim = input.trim();
  if (rmTrim.startsWith("rm ") || rmTrim === "rm") {
    const parts = rmTrim.split(/\s+/).filter(Boolean);
    let recursive = false;
    let pi = 1;
    while (pi < parts.length && parts[pi]!.startsWith("-")) {
      const f = parts[pi]!;
      if (f === "-rf" || f === "-r" || f === "-R" || f === "-fr") recursive = true;
      pi++;
    }
    const target = parts.slice(pi).join(" ");
    if (!target) return { kind: "lines", lines: ["rm: missing operand"] };
    const abs = resolveUserPath(ctx.vfs.pwd, target);
    if (!abs?.startsWith(VFS_HOME)) {
      return { kind: "lines", lines: ["rm: permission denied"] };
    }
    const { next, err } = vfsRm(ctx.vfs, abs, recursive);
    if (err) return { kind: "lines", lines: [err] };
    ctx.setVfs(next);
    return { kind: "lines", lines: [] };
  }

  if (lower === "cd research/ && ls" || lower === "cd research && ls") {
    const abs = `${VFS_HOME}/research`;
    if (!vfsIsDir(ctx.vfs, abs)) {
      return { kind: "lines", lines: ["bash: cd: research: No such file or directory"] };
    }
    const next = { ...ctx.vfs, pwd: abs };
    ctx.setVfs(next);
    return { kind: "lines", lines: vfsListNames(next, abs) };
  }

  if (lower === "cd" || /^\s*cd\s*$/.test(input)) {
    ctx.setVfs({ ...ctx.vfs, pwd: VFS_HOME });
    return { kind: "lines", lines: [] };
  }

  const cdM = input.match(/^\s*cd\s+(.+)$/i);
  if (cdM) {
    const dest = cdM[1].trim();
    const abs = resolveUserPath(ctx.vfs.pwd, dest);
    if (!abs?.startsWith(VFS_HOME)) {
      return { kind: "lines", lines: [`bash: cd: ${dest}: No such file or directory`] };
    }
    if (!vfsIsDir(ctx.vfs, abs)) {
      return { kind: "lines", lines: [`bash: cd: ${dest}: Not a directory`] };
    }
    ctx.setVfs({ ...ctx.vfs, pwd: abs });
    return { kind: "lines", lines: [] };
  }

  if (lower === "ls" && input.trim() === "ls") {
    return { kind: "lines", lines: vfsListNames(ctx.vfs, ctx.vfs.pwd) };
  }

  const lsM = input.match(/^\s*ls\s+(.+)$/i);
  if (lsM) {
    const raw = lsM[1].trim();
    const abs = resolveUserPath(ctx.vfs.pwd, raw);
    if (!abs?.startsWith(VFS_HOME)) {
      return {
        kind: "lines",
        lines: [`ls: cannot access '${raw}': No such file or directory`],
      };
    }
    if (!vfsIsDir(ctx.vfs, abs)) {
      return { kind: "lines", lines: [`ls: '${raw}': Not a directory`] };
    }
    return { kind: "lines", lines: vfsListNames(ctx.vfs, abs) };
  }

  const catM = input.match(/^\s*cat\s+(.+)$/i);
  if (catM) {
    const raw = catM[1].trim().replace(/^["']|["']$/g, "");
    const abs = resolveUserPath(ctx.vfs.pwd, raw);
    if (abs && abs.startsWith(VFS_HOME)) {
      if (vfsIsDir(ctx.vfs, abs)) {
        return { kind: "lines", lines: [`cat: ${raw}: Is a directory`] };
      }
      const s = vfsReadFileString(ctx.vfs, abs);
      if (s === null) {
        return { kind: "lines", lines: [`cat: ${raw}: No such file or directory`] };
      }
      return { kind: "lines", lines: s.split("\n") };
    }
  }

  if (lower === "ls -la skills/" || lower === "ls -la skills") {
    return { kind: "lines", lines: skillsListing() };
  }

  if (isAptInstallVim(input)) {
    if (ctx.vimInstalled) {
      return {
        kind: "lines",
        lines: [
          "Reading package lists... Done",
          "vim is already the newest version (2:9.1.0000-1kali1).",
          "0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.",
        ],
      };
    }
    ctx.setVimInstalled(true);
    return {
      kind: "lines",
      lines: [
        "Reading package lists... Done",
        "Building dependency tree... Done",
        "Suggested packages: ctags vim-doc",
        "The following NEW packages will be installed:",
        "  vim vim-common vim-runtime xxd",
        "0 upgraded, 4 newly installed, 0 to remove and 0 not upgraded.",
        "After this operation, 42.5 MB of additional disk space will be used.",
        "debconf: delaying package configuration, since apt-utils is not installed",
        "Selecting previously unselected package vim.",
        "Setting up vim (2:9.1.0000-1kali1) ...",
        "update-alternatives: using /usr/bin/vim.basic to provide /usr/bin/vim",
        "Processing triggers for hicolor-icon-theme (0.18-1) ...",
        "Done.",
      ],
    };
  }

  const vimResult = parseVimOpen(input, ctx);
  if (vimResult) return vimResult;

  if (lower === "curl -s contact.json") {
    const abs = `${VFS_HOME}/contact.json`;
    const s = vfsReadFileString(ctx.vfs, abs);
    if (s === null) {
      return { kind: "lines", lines: ["curl: (7) Could not read contact.json"] };
    }
    return { kind: "lines", lines: s.split("\n") };
  }

  if (lower === "uname -a") {
    return {
      kind: "lines",
      lines: [
        "Linux kali 6.6.15-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.6.15-1kali1 (2024-01-10) x86_64 GNU/Linux",
        "Build flavor: pradip@securitypal — portfolio hardened kernel (simulated)",
      ],
    };
  }

  if (input === "cat /etc/passwd | grep pradip" || lower === "cat /etc/passwd | grep pradip") {
    return {
      kind: "lines",
      lines: [
        "pradip:x:1000:1000:Security Research Analyst:/home/pradip:/bin/zsh",
      ],
    };
  }

  if (lower.startsWith("ping ")) {
    const host = input.slice(5).trim();
    if (host) return { kind: "ping", host };
  }

  if (lower === "nmap localhost") {
    return {
      kind: "lines",
      lines: [
        "Starting Nmap 7.94 ( https://nmap.org ) at 2026-05-14 10:00 +0545",
        "Nmap scan report for localhost (127.0.0.1)",
        "Host is up (0.00012s latency).",
        "Not shown: 65531 closed tcp ports (simulated)",
        "",
        "PORT     STATE SERVICE",
        "22/tcp   open  ssh",
        "80/tcp   open  http",
        "443/tcp  open  https",
        "3000/tcp open  react-dev",
        "",
        "Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds",
      ],
    };
  }

  if (lower === "sudo su") {
    return {
      kind: "lines",
      lines: ["Nice try. You don't have permission on this machine."],
    };
  }

  if (lower === "ip a") {
    return {
      kind: "lines",
      lines: [
        "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default",
        "    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00",
        "    inet 127.0.0.1/8 scope host lo",
        "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq state UP",
        "    link/ether 08:00:27:aa:bb:cc brd ff:ff:ff:ff:ff:ff",
        "    inet 192.168.56.101/24 brd 192.168.56.255 scope global dynamic eth0",
        "(simulated)",
      ],
    };
  }

  if (lower === "ip route") {
    return {
      kind: "lines",
      lines: [
        "default via 192.168.56.1 dev eth0 proto dhcp metric 100",
        "192.168.56.0/24 dev eth0 proto kernel scope link src 192.168.56.101",
        "(simulated)",
      ],
    };
  }

  if (lower === "ps aux | head") {
    return {
      kind: "lines",
      lines: [
        "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND",
        "root         1  0.0  0.1 168936 12888 ?        Ss   May10   0:12 /sbin/init",
        "pradip     884  0.1  0.3  89212 24560 ?        Ss   May12   0:04 /usr/bin/zsh",
        "pradip    4021  2.4  1.2 1182044 98204 pts/0   Sl+  10:02   0:12 node next dev",
        "(simulated — first rows)",
      ],
    };
  }

  if (lower === "lsusb") {
    return {
      kind: "lines",
      lines: [
        "Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub",
        "Bus 001 Device 002: ID 80ee:0021 VirtualBox USB Tablet",
        "Bus 001 Device 003: ID 0e0f:0001 VMware Virtual USB Keyboard",
        "(simulated)",
      ],
    };
  }

  if (lower === "lspci | head") {
    return {
      kind: "lines",
      lines: [
        "00:00.0 Host bridge: Intel Corporation 440FX - 82441FX PMC",
        "00:01.0 ISA bridge: Intel Corporation 82371SB PIIX3 ISA",
        "00:02.0 VGA compatible controller: VMware SVGA II Adapter",
        "(simulated)",
      ],
    };
  }

  if (lower === "dmesg | tail -n 3") {
    return {
      kind: "lines",
      lines: [
        "[  124.442211] audit: type=1400 audit(1715680400.000:12): apparmor=\"STATUS\"",
        "[  124.550102] IPv6: ADDRCONF(NETDEV_CHANGE): eth0: link becomes ready",
        "[  125.001884] e1000: eth0 NIC Link is Up 1000 Mbps Full Duplex",
      ],
    };
  }

  if (lower === "systemctl status ssh") {
    return {
      kind: "lines",
      lines: [
        "● ssh.service - OpenBSD Secure Shell server",
        "     Loaded: loaded (/lib/systemd/system/ssh.service; enabled)",
        "     Active: active (running) since Mon 2026-05-12 09:00:01 +0545; 2 days ago",
        "   Main PID: 612 (sshd)",
        " (simulated)",
      ],
    };
  }

  if (lower === "iptables -l -n" || lower === "iptables -L -n") {
    return {
      kind: "lines",
      lines: [
        "Chain INPUT (policy DROP)",
        "target     prot opt source               destination",
        "ACCEPT     all  --  127.0.0.0/8          0.0.0.0/0",
        "ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:22",
        "(simulated — portfolio sandbox)",
      ],
    };
  }

  if (lower === "openssl version") {
    return {
      kind: "lines",
      lines: ["OpenSSL 3.1.4 24 Oct 2023 (Library: OpenSSL 3.1.4 24 Oct 2023)"],
    };
  }

  if (lower === "go version") {
    return { kind: "lines", lines: ["go version go1.22.2 linux/amd64"] };
  }

  if (lower === "python3 --version") {
    return { kind: "lines", lines: ["Python 3.11.6"] };
  }

  if (lower === "rustc --version") {
    return { kind: "lines", lines: ["rustc 1.77.2 (25ef9e3d8 2024-04-09)"] };
  }

  if (lower === "gcc --version") {
    return {
      kind: "lines",
      lines: [
        "gcc (Debian 13.2.0-5) 13.2.0",
        "Copyright (C) 2023 Free Software Foundation, Inc.",
      ],
    };
  }

  if (lower === "curl -i https://example.com" || lower === "curl -I https://example.com") {
    return {
      kind: "lines",
      lines: [
        "HTTP/2 200",
        "date: Wed, 14 May 2026 10:15:00 GMT",
        "content-type: text/html",
        "server: ECS (dcb/7F84)",
        "cache-control: max-age=600",
        "(simulated — headers only)",
      ],
    };
  }

  if (lower === "ffuf -h") {
    return {
      kind: "lines",
      lines: [
        "Fuzz Faster U Fool - v2.1.0-dev",
        "  -u URL                 Target URL",
        "  -w wordlist            Wordlist file",
        "  -mc MATCH             Match HTTP status codes",
        "(simulated)",
      ],
    };
  }

  if (lower.startsWith("searchsploit ")) {
    return {
      kind: "lines",
      lines: [
        "Exploits: No Results",
        "Shellcodes: No Results",
        "Papers: No Results",
        "(simulated — query sanitized)",
      ],
    };
  }

  if (lower === "masscan --version") {
    return {
      kind: "lines",
      lines: ["Masscan version 1.3.2 ( https://github.com/robertdavidgraham/masscan )"],
    };
  }

  if (lower === "rustscan --version") {
    return {
      kind: "lines",
      lines: ["rustscan 2.1.1"],
    };
  }

  if (lower === "hash-identifier" || lower === "hashid") {
    return {
      kind: "lines",
      lines: [
        "HASH: 5d41402abc4b2a76b9719d911017c592",
        "Possible Hashs:",
        "[+] MD5",
        "(simulated)",
      ],
    };
  }

  if (lower === "whatweb pradipbhatt.com.np") {
    return {
      kind: "lines",
      lines: [
        "http://pradipbhatt.com.np [200 OK] Country[NEPAL], HTML5, HTTPServer, IP[127.0.0.1]",
        "(simulated)",
      ],
    };
  }

  if (lower === "nikto -version" || lower === "nikto -Version") {
    return {
      kind: "lines",
      lines: ["Nikto 2.5.0"],
    };
  }

  if (lower === "sqlmap --version") {
    return {
      kind: "lines",
      lines: ["1.8.5#stable"],
    };
  }

  if (lower === "hydra -h") {
    return {
      kind: "lines",
      lines: [
        "Hydra v9.5 (c) 2023 by van Hauser/THC",
        "Syntax: hydra [[[-l LOGIN|-L FILE] ...] | -C FILE]] [-s PORT] TARGET SERVICE",
        "(simulated — help excerpt)",
      ],
    };
  }

  if (lower === "john --list=formats") {
    return {
      kind: "lines",
      lines: [
        "descrypt, bsdicrypt, md5crypt, bcrypt, LM, NT, sha512crypt, argon2",
        "(simulated — truncated)",
      ],
    };
  }

  if (lower === "airmon-ng") {
    return {
      kind: "lines",
      lines: [
        "",
        "PHY\tInterface\tDriver\t\tChipset",
        "",
        "phy0\twlan0\t\tiwlwifi\tIntel Corporation Wireless 8265",
        "(simulated — no monitor mode in portfolio VM)",
      ],
    };
  }

  if (lower === "tcpdump --version") {
    return {
      kind: "lines",
      lines: ["tcpdump version 4.99.3", "libpcap version 1.10.4"],
    };
  }

  if (lower === "neofetch") {
    return { kind: "lines", lines: neofetchText() };
  }

  return {
    kind: "lines",
    lines: [`bash: ${input}: command not found`],
  };
}
