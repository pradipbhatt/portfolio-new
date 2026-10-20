export type CommunityEvent = {
  title: string;
  role: string;
  description: string;
  /** Short label shown on the chip, e.g. "Sep 2024" or "2025" */
  dateLabel: string;
  /** Numeric year used for grouping in the timeline */
  year: number;
  image: string;
};

export const communityEvents: CommunityEvent[] = [
  // 2025
  {
    title: "Sikaiverse Project Hackathon",
    role: "Hackathon Project Showcase",
    description: "Presented Sikaiverse at the 100XNepal hackathon showcase — Top 10 from 50 teams, demonstrating a fully customizable edu-tech platform to investors and mentors.",
    dateLabel: "2025",
    year: 2025,
    image: "/assets/sikaiverse project hakathon.png",
  },

  // 2024
  {
    title: "Software Freedom Day Speaker",
    role: "Linux & Hacktoberfest Talk · Far West",
    description: "Delivered talks on Linux fundamentals and Hacktoberfest open-source contribution at Software Freedom Day 2024 in Sudurpaschim Province — reaching students from multiple colleges.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/speaker in software freedom day 2024 far west.jpg",
  },
  {
    title: "Software Freedom Day 2024",
    role: "Open Source Celebration",
    description: "Organized and participated in Software Freedom Day 2024 — promoting free and open-source software adoption among engineering students in Far Western Nepal.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/software freedom day 2024.jpg",
  },
  {
    title: "Software Freedom Day Promotion",
    role: "Open Source Event Campaign",
    description: "Led digital promotion for Software Freedom Day 2024 — designing outreach materials and coordinating attendance across Sudurpaschim engineering colleges.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/software freedom day cover image.jpg",
  },
  {
    title: "GitHub Field Day Guide",
    role: "Application Guidance Session",
    description: "Guided students on applying for GitHub Field Day after being selected myself in 2023 — sharing application strategy, open-source profile tips, and what GitHub looks for.",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/information sharing session after github field visit.jpg",
  },
  {
    title: "MERN Bootcamp Instructor",
    role: "Minor Project Training · 6th Semester FWU",
    description: "Led a hands-on MERN stack bootcamp for 6th semester Computer Engineering students at FWU — covering REST APIs, MongoDB schemas, React state management, and deployment.",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/mern workshop.jpg",
  },
  {
    title: "UI/UX Workshop Mentor",
    role: "3-Day Design Workshop · SNSC IT Club",
    description: "Mentored a 3-day UI/UX design workshop at SNSC — teaching Figma, design systems, prototyping, and user-centered design principles to a cohort of 30+ students.",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/design workshop at snsc mentor.jpeg",
  },
  {
    title: "Git & GitHub Workshop",
    role: "Open Source Training · ICEC FWU",
    description: "Organized and led a Git & GitHub workshop under ICEC FWU — onboarding engineering students to version control, branching strategies, and contributing to open-source repositories.",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/git and github workshop.jpg",
  },
  {
    title: "President — ICEC FWU",
    role: "Innovative Computer Engineering Club",
    description: "Served as President of the Innovative Computer Engineering Club at Far Western University — organizing workshops, hackathons, and industry talks for 200+ engineering students.",
    dateLabel: "Feb 2024 – Feb 2025",
    year: 2024,
    image: "/assets/president last day.jpg",
  },

  // 2023
  {
    title: "Province Level Ideathon Winner",
    role: "Provincial Innovation Competition",
    description: "Won a province-level ideathon in Sudurpaschim — competing against teams across the region with an innovative tech-for-society concept.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/provence level ideathon winner.jpg",
  },
  {
    title: "GitHub Field Visit Promotion",
    role: "Information Session · SNSC",
    description: "Promoted the GitHub Field Visit information session at SNSC — helping students understand the opportunity and encouraging open-source participation.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/poster for imformation session in snsc for github field visit 2023.jpg",
  },
  {
    title: "GitHub Fielder 2023",
    role: "GitHub Field Day Participant",
    description: "Selected as a GitHub Field Day 2023 participant — one of few Nepali developers chosen for the event, recognizing active open-source contributions and community engagement.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/github fielder 2023.jpg",
  },
  {
    title: "GitHub Field Day Experience Share",
    role: "Post-Event Knowledge Transfer",
    description: "Shared learnings from GitHub Field Day 2023 with peers — demystifying open-source culture, GitHub's developer programs, and how to build a public coding profile.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/imformation session after github field visit 2023.jpg",
  },
  {
    title: "Designing Event 2023",
    role: "Design Community Event",
    description: "Participated in and contributed to a design community event — networking with designers across Nepal and exploring intersection of design and engineering.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/designing event 2023.jpg",
  },
  {
    title: "Design Workshop SNSC",
    role: "UI/UX Design Training",
    description: "Co-facilitated a UI/UX design training at SNSC — covering design thinking, wireframing, and Figma workflows for engineering students with no prior design experience.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/snsc design workshop.jpg",
  },
  {
    title: "CodeFest 2023 Hackathon",
    role: "Hackathon Participant",
    description: "Competed at CodeFest 2023 — building a social impact project under time pressure, gaining experience in rapid prototyping and pitching to a technical jury.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/codefest 2023 hakathon.jpg",
  },
];
