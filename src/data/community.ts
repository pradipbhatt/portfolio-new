export type CommunityEvent = {
  title: string;
  role: string;
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
    dateLabel: "2025",
    year: 2025,
    image: "/assets/sikaiverse project hakathon.png",
  },

  // 2024
  {
    title: "Software Freedom Day Speaker",
    role: "Linux & Hacktoberfest Talk | Far West",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/speaker in software freedom day 2024 far west.jpg",
  },
  {
    title: "Software Freedom Day 2024",
    role: "Open Source Celebration",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/software freedom day 2024.jpg",
  },
  {
    title: "Software Freedom Day Cover",
    role: "Open Source Event Promotion",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/software freedom day cover image.jpg",
  },
  {
    title: "GitHub Field Day Guide",
    role: "Application Guidance Session",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/information sharing session after github field visit.jpg",
  },
  {
    title: "MERN Bootcamp Instructor",
    role: "Minor Project Training for 6th Semester",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/mern workshop.jpg",
  },
  {
    title: "UI/UX Workshop Mentor",
    role: "3-Day Design Workshop | SNSC IT Club",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/design workshop at snsc mentor.jpeg",
  },
  {
    title: "Git & GitHub Workshop",
    role: "Open Source Training | ICEC",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/git and github workshop.jpg",
  },
  {
    title: "President - ICEC FWU",
    role: "Innovative Computer Engineering Club",
    dateLabel: "Feb 2024",
    year: 2024,
    image: "/assets/president last day.jpg",
  },

  // 2023
  {
    title: "Province Level Ideathon Winner",
    role: "Provincial Innovation Competition",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/provence level ideathon winner.jpg",
  },
  {
    title: "GitHub Field Visit Poster",
    role: "Information Session Promotion | SNSC",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/poster for imformation session in snsc for github field visit 2023.jpg",
  },
  {
    title: "Information Session",
    role: "GitHub Field Visit Experience Sharing",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/imformation session after github field visit 2023.jpg",
  },
  {
    title: "GitHub Fielder 2023",
    role: "GitHub Field Day Participant",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/github fielder 2023.jpg",
  },
  {
    title: "Designing Event 2023",
    role: "Design Community Event",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/designing event 2023.jpg",
  },
  {
    title: "Design Workshop SNSC",
    role: "UI/UX Design Training",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/snsc design workshop.jpg",
  },
  {
    title: "CodeFest 2023 Hackathon",
    role: "Hackathon Participant",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/codefest 2023 hakathon.jpg",
  },
];

