import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume – Pradip Bhatt",
  description:
    "Download or view the resume of Pradip Bhatt, Full Stack Developer & Cybersecurity enthusiast based in Kathmandu, Nepal.",
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
