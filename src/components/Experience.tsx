"use client";

import { HoverLetters } from "@/components/ui/HoverLetters";
import { useReveal } from "@/lib/useReveal";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const experience = [
  {
    role: "Security Research Analyst",
    company: "SecurityPal AI",
    companyUrl: "https://www.linkedin.com/company/72337539/",
    logo: "/assets/experience/securitypal.jpg",
    type: "Full-time",
    dates: "Apr – Oct 2026",
    location: "Kathmandu, Nepal · On-site",
    description:
      "Supported enterprise customer assurance through AI-assisted security, privacy, and GRC reviews in SecurityPal AI’s Security Assurance Command Center.",
    tags: ["Customer assurance", "GRC", "Security reviews"],
  },
  {
    role: "Software Engineer",
    company: "Hyperce",
    companyUrl: "https://www.linkedin.com/company/91201013/",
    logo: "/assets/experience/hyperce.jpg",
    type: "Full-time",
    dates: "Sep 2025 – Jul 2026",
    location: "Kathmandu, Nepal · Remote",
    description:
      "Built headless ecommerce solutions with Vendure, working across GraphQL APIs, Next.js, NestJS, and TypeScript.",
    tags: ["Vendure", "GraphQL", "Next.js", "NestJS"],
  },
  {
    role: "Security Research Analyst",
    company: "Code Rush",
    companyUrl: "https://www.linkedin.com/company/40663235/",
    logo: "/assets/experience/code-rush.jpg",
    type: "Apprenticeship",
    dates: "Dec 2025 – Mar 2026",
    location: "Kathmandu, Nepal · On-site",
    description:
      "Selected among 26 trainees for an intensive GRC program. Conducted gap analysis, internal audits, control testing, and audit-readiness work across ISO 27001, NIST, GDPR, HIPAA, COBIT, and HITRUST. Earned CompTIA Security+ during the program.",
    tags: ["GRC", "ISO 27001", "Auditing", "Security+"],
  },
  {
    role: "Associate Software Engineer",
    company: "CloudTech Nepal",
    companyUrl: "https://www.linkedin.com/company/26582013/",
    logo: "/assets/experience/cloudtech.jpg",
    type: "Full-time",
    dates: "Jun – Aug 2025",
    location: "Kathmandu, Nepal · Remote",
    description:
      "Built and debugged software with senior engineers and QA, contributing to code reviews and continuous improvements.",
    tags: ["Software engineering", "Debugging", "Code review"],
  },
  {
    role: "Software Engineer Intern",
    company: "CloudTech Nepal",
    companyUrl: "https://www.linkedin.com/company/26582013/",
    logo: "/assets/experience/cloudtech.jpg",
    type: "Internship",
    dates: "Feb – Jun 2025",
    location: "Dhangadi, Nepal · Hybrid",
    description:
      "Worked on software development with Laravel and MySQL before moving into the associate engineer role.",
    tags: ["Laravel", "MySQL"],
  },
  {
    role: "President",
    company: "ICEC-FWU",
    companyUrl: "https://www.linkedin.com/company/99158913/",
    logo: "/assets/experience/icec-fwu.jpg",
    type: "Full-time",
    dates: "Feb 2024 – Feb 2025",
    location: "Far Western University, Nepal",
    description:
      "Led the Innovative Computer Engineering Club at Far Western University and helped organize developer workshops and community events.",
    tags: ["Community", "Leadership", "Workshops"],
  },
] as const;

export default function Experience() {
  const headingRef = useRef<HTMLDivElement>(null);
  useReveal(headingRef);

  return (
    <section id="experience" className="scroll-mt-20 bg-background py-16">
      <div className="container mx-auto px-6">
        <div ref={headingRef} className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            <HoverLetters text="Work" activeColor="hover:text-primary/80" />{" "}
            <span className="text-primary">
              <HoverLetters text="Experience" activeColor="hover:text-foreground" />
            </span>
          </h2>
        </div>

        <ol className="mx-auto max-w-4xl space-y-4 border-l border-primary/25 pl-5 md:pl-8">
          {experience.map((item) => (
            <li key={`${item.company}-${item.role}`} className="relative">
              <span className="absolute -left-[26px] top-6 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary md:-left-[38px]" aria-hidden="true" />
              <article className="rounded-xl border border-border bg-card/80 p-5 transition-colors hover:border-primary/40 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white" aria-hidden="true">
                      <Image src={item.logo} alt="" width={44} height={44} unoptimized className="h-full w-full object-contain" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold leading-tight md:text-xl">{item.role}</h3>
                      <a
                        href={item.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex min-h-11 items-center gap-1 font-medium text-[var(--primary-on-surface)] hover:underline"
                        aria-label={`${item.company} on LinkedIn`}
                      >
                        {item.company}
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {item.type}
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {item.dates} <span aria-hidden="true">·</span> {item.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{item.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills and focus areas">
                  {item.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-muted-foreground">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
