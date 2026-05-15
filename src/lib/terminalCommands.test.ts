import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getTabCompletion,
  runCommand,
  type TerminalCtx,
} from "./terminalCommands";
import { defaultVfsSeed, VFS_HOME, type VfsState } from "./terminalVfs";

type CwdPreset = "home" | "research";

/** Mutable VFS in ctx so `setVfs` updates what subsequent `ctx.vfs` reads see. */
function terminalCtx(
  preset: CwdPreset,
  options: {
    history?: string[];
    vimInstalled?: boolean;
    setVimInstalled?: (v: boolean) => void;
    onSetVfs?: (next: VfsState) => void;
    initialVfs?: VfsState;
  } = {}
): TerminalCtx {
  const holder: { v: VfsState } = {
    v: options.initialVfs ?? {
      ...defaultVfsSeed(),
      pwd: preset === "research" ? `${VFS_HOME}/research` : VFS_HOME,
    },
  };
  return {
    get vfs() {
      return holder.v;
    },
    setVfs(next: VfsState) {
      holder.v = next;
      options.onSetVfs?.(next);
    },
    history: options.history ?? [],
    vimInstalled: options.vimInstalled ?? false,
    setVimInstalled: options.setVimInstalled ?? (() => {}),
  } as unknown as TerminalCtx;
}

describe("getTabCompletion", () => {
  it("returns null for empty prefix", () => {
    assert.equal(getTabCompletion(""), null);
    assert.equal(getTabCompletion("   "), null);
  });

  it("returns the only matching command", () => {
    assert.equal(getTabCompletion("who"), "whoami");
    assert.equal(getTabCompletion("WHO"), "whoami");
  });

  it("returns null when multiple commands match", () => {
    assert.equal(getTabCompletion("c"), null);
  });
});

describe("runCommand", () => {
  it("returns whoami output", () => {
    const res = runCommand("whoami", terminalCtx("home"));
    assert.deepEqual(res, { kind: "lines", lines: ["pradip"] });
  });

  it("returns pwd for home and research cwd", () => {
    assert.deepEqual(runCommand("pwd", terminalCtx("home")), {
      kind: "lines",
      lines: ["/home/pradip"],
    });
    assert.deepEqual(runCommand("pwd", terminalCtx("research")), {
      kind: "lines",
      lines: ["/home/pradip/research"],
    });
  });

  it("returns hostname", () => {
    const res = runCommand("hostname", terminalCtx("home"));
    assert.deepEqual(res, { kind: "lines", lines: ["kali"] });
  });

  it("returns resize for resize W H", () => {
    assert.deepEqual(runCommand("resize 640 400", terminalCtx("home")), {
      kind: "resize",
      width: 640,
      height: 400,
    });
  });

  it("clamps resize to geometry limits", () => {
    assert.deepEqual(runCommand("resize 200 200", terminalCtx("home")), {
      kind: "resize",
      width: 420,
      height: 300,
    });
  });

  it("returns resize for size large preset", () => {
    assert.deepEqual(runCommand("size large", terminalCtx("home")), {
      kind: "resize",
      width: 680,
      height: 460,
    });
  });

  it("handles clear", () => {
    assert.deepEqual(runCommand("clear", terminalCtx("home")), {
      kind: "clear",
    });
  });

  it("returns command not found for unknown input", () => {
    const res = runCommand("not-a-real-command", terminalCtx("home"));
    assert.deepEqual(res, {
      kind: "lines",
      lines: ["bash: not-a-real-command: command not found"],
    });
  });

  it("runs sudo su easter egg", () => {
    const res = runCommand("sudo su", terminalCtx("home"));
    assert.equal(res.kind, "lines");
    if (res.kind === "lines") {
      assert.ok(res.lines[0]?.includes("Nice try"));
    }
  });

  it("starts ping for ping host", () => {
    const res = runCommand("ping example.com", terminalCtx("home"));
    assert.deepEqual(res, { kind: "ping", host: "example.com" });
  });

  it("updates pwd on cd research", () => {
    const pwds: string[] = [];
    const res = runCommand(
      "cd research/",
      terminalCtx("home", {
        onSetVfs: (n) => pwds.push(n.pwd),
      })
    );
    assert.deepEqual(pwds, [`${VFS_HOME}/research`]);
    assert.deepEqual(res, { kind: "lines", lines: [] });
  });

  it("lists research files when cwd is research and ls", () => {
    const res = runCommand("ls", terminalCtx("research"));
    assert.equal(res.kind, "lines");
    if (res.kind === "lines") {
      assert.ok(res.lines.includes("vuln-detection.md"));
    }
  });

  it("returns devops skills file", () => {
    const res = runCommand("cat skills/devops.txt", terminalCtx("home"));
    assert.equal(res.kind, "lines");
    if (res.kind === "lines") {
      assert.ok(res.lines.some((l) => l.includes("Docker")));
    }
  });

  it("returns research pipeline abstract", () => {
    const res = runCommand(
      "cat research/devsecops-pipeline.md",
      terminalCtx("home")
    );
    assert.equal(res.kind, "lines");
    if (res.kind === "lines") {
      assert.ok(res.lines.some((l) => l.includes("DevSecOps")));
    }
  });

  it("vim is not available until apt install", () => {
    const res = runCommand(
      "vim vuln-detection.md",
      terminalCtx("research", { vimInstalled: false })
    );
    assert.equal(res.kind, "lines");
    if (res.kind === "lines") {
      assert.ok(res.lines.some((l) => l.includes("command not found")));
    }
  });

  it("opens vim session after install in research cwd", () => {
    const res = runCommand(
      "vim vuln-detection.md",
      terminalCtx("research", { vimInstalled: true })
    );
    assert.deepEqual(res, {
      kind: "vim_session",
      displayPath: "~/research/vuln-detection.md",
      absolutePath: `${VFS_HOME}/research/vuln-detection.md`,
      lines: [
        "# AI-Augmented Vulnerability Detection in DevSecOps Pipelines",
        "",
        "Abstract (thesis proposal):",
        "This work explores augmenting traditional SAST/DAST and dependency checks with",
        "ML-assisted signal fusion to reduce false positives and surface exploitable issues",
        "earlier in CI/CD — without slowing developer velocity.",
      ],
    });
  });

  it("apt install vim toggles install flag", () => {
    const installed: boolean[] = [];
    const res = runCommand(
      "sudo apt install vim",
      terminalCtx("home", {
        setVimInstalled: (v) => installed.push(v),
      })
    );
    assert.equal(res.kind, "lines");
    assert.deepEqual(installed, [true]);
    assert.ok(
      res.kind === "lines" && res.lines.some((l) => l.includes("Setting up vim"))
    );
  });
});
