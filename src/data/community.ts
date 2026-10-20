export type CommunityEvent = {
  slug: string;
  title: string;
  role: string;
  description: string;
  /** Short label shown on the chip, e.g. "Sep 2024" or "2025" */
  dateLabel: string;
  /** Numeric year used for grouping in the timeline */
  year: number;
  image: string;
  gallery?: { src: string; alt: string; caption: string }[];
  highlights: string[];
  /** Event sequence within a month when more precise timing is known. */
  sortOrder?: number;
  /** Public post documenting this event, when verified. */
  postUrl?: string;
  /** Other posts about the same event, kept when duplicate cards are consolidated. */
  relatedPosts?: { label: string; url: string }[];
};

export const communityEvents: CommunityEvent[] = [
  // 2025
  {
    slug: "sikaiverse-hackathon-2025",
    title: "Sikaiverse Project Hackathon",
    role: "Hackathon Project Showcase",
    description: "Presented Sikaiverse at the 100XNepal hackathon showcase — Top 10 from 50 teams, demonstrating a fully customizable edu-tech platform to investors and mentors.",
    dateLabel: "2025",
    year: 2025,
    image: "/assets/sikaiverse project hakathon.png",
    gallery: [{ src: "/assets/100x hakathon award for top 10.png", alt: "100XNepal top-ten recognition", caption: "Top-ten recognition at the 100XNepal hackathon." }],
    highlights: ["Presented the Sikaiverse education platform.", "Selected in the top 10 from 50 teams.", "Showcased the project to investors and mentors."],
  },
  {
    slug: "mern-bootcamp-2025",
    title: "MERN Bootcamp Instructor",
    role: "Minor Project Training · 6th Semester FWU",
    description: "Led ICEC's MERN Bootcamp for sixth-semester students preparing their minor projects.",
    dateLabel: "Apr 2025",
    year: 2025,
    image: "/assets/mern workshop.jpg",
    highlights: ["Led a MERN Bootcamp through ICEC FWU.", "Designed for sixth-semester students preparing minor projects."],
    postUrl: "https://www.facebook.com/icecfwu/posts/pfbid0P7SJAHNCArQWi4YYrBYepTPsKqKaDduFPw3o2KcCrX6BigKkX7WnjuahGMQZ2HAVl",
  },

  // 2024
  {
    slug: "codefest-provincial-qualifier-2024",
    title: "CodeFest Provincial Qualifier",
    role: "Team Code With Her · Sudurpaschim",
    description: "Qualified with Team Code With Her from Sudurpaschim Province for CodeFest's national hackathon.",
    dateLabel: "Dec 2024",
    year: 2024,
    image: "/assets/provence level ideathon winner.jpg",
    highlights: ["Represented Team Code With Her.", "Qualified from Sudurpaschim Province for the national CodeFest event."],
    sortOrder: 1,
  },
  {
    slug: "codefest-hackathon-2024",
    title: "CodeFest 2024 Hackathon",
    role: "Team Code With Her · National Event",
    description: "Presented our project with Team Code With Her at CodeFest 2024, learning from the hackathon and sharing our work with other teams.",
    dateLabel: "Dec 2024",
    year: 2024,
    image: "/assets/codefest 2023 hakathon.jpg",
    highlights: ["Presented a team project at the national hackathon.", "Worked with Team Code With Her during the three-day event."],
    sortOrder: 2,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid032pNLnig3BLcWUc18mCEipJzSX2ziWRux9TevnpYYn1sE9rodpFpLPH1kHPXgNb7nl",
  },
  {
    slug: "software-freedom-day-linux-talk-2024",
    title: "Software Freedom Day Speaker",
    role: "Linux Talk · Far West",
    description: "Featured as a Linux Talk speaker at Software Freedom Day 2024 in Sudurpaschim Province, sharing open-source knowledge with engineering students.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/speaker in software freedom day 2024 far west.jpg",
    gallery: [
      { src: "/assets/software freedom day 2024.jpg", alt: "Software Freedom Day gathering", caption: "The Software Freedom Day 2024 gathering." },
      { src: "/assets/software freedom day cover image.jpg", alt: "Software Freedom Day community group photo", caption: "Community members at Software Freedom Day 2024." },
    ],
    highlights: ["Featured as a Linux Talk speaker.", "Joined Software Freedom Day 2024 in Sudurpaschim Province.", "Shared registration details with the local developer community."],
    sortOrder: 4,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0vNS9Y1MssbHrZmDRosRDEYvdTReTS1HFCXUsxPLuNV9Xx4XuSg2VsYDh84BJFwp3l",
    relatedPosts: [
      { label: "Community event post", url: "https://www.facebook.com/jsurya860/posts/pfbid0BtsYnzQjsRdeSh5qpeT3puMUAhqU3CQ6xYpV5nrMmgxh9drsaYAZXGMfFsWhMLFRl" },
      { label: "Registration announcement", url: "https://www.facebook.com/pradipbhatt21/posts/pfbid0vqX132ttGQFLG6KnPSn5FLa3swpwLXs7cQDrAaEEWE7j7DzC4ZS5Xk87SSvcMqMrl" },
    ],
  },
  {
    slug: "github-field-day-guide-2024",
    title: "GitHub Field Day Guide",
    role: "Application Guidance Session",
    description: "Guided students on applying for GitHub Field Day after being selected myself in 2023 — sharing application strategy, open-source profile tips, and what GitHub looks for.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/information sharing session after github field visit.jpg",
    gallery: [{ src: "/assets/poster for imformation session in snsc for github field visit 2023.jpg", alt: "SNSC GitHub Field Day 2024 guidance poster", caption: "SNSC's application guidance session announcement." }],
    highlights: ["Guided students through GitHub Field Day applications.", "Shared a participant's perspective from GitHub Field Day 2023."],
    sortOrder: 6,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0JeVxxzXeqytu1nJ9XLCQgzYtTZ3gjg6Zd63AjeAxzRhbSBj7LkvfS7qDXuPJFhykl",
    relatedPosts: [
      { label: "Speaker announcement", url: "https://www.facebook.com/pradipbhatt21/posts/pfbid02G5ePJJHaCmyJFTGiMTfTkVfcRbrGYR1gBMfdUPBrpoxo7xoR56bUKp4ANy8ioX13l" },
    ],
  },
  {
    slug: "snsc-uiux-workshop-2024",
    title: "UI/UX Workshop Mentor",
    role: "3-Day Design Workshop · SNSC IT Club",
    description: "Mentored a three-day UI/UX design workshop with SNSC IT Club.",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/snsc design workshop.jpg",
    gallery: [{ src: "/assets/design workshop at snsc mentor.jpeg", alt: "Pradip receiving a certificate at the SNSC workshop", caption: "A moment from the SNSC design workshop." }],
    highlights: ["Mentored a three-day UI/UX design workshop.", "Worked with SNSC IT Club in 2024."],
  },
  {
    slug: "git-github-workshop-2024",
    title: "Git & GitHub Workshop",
    role: "Open Source Training · ICEC FWU",
    description: "Organized and led a Git & GitHub workshop under ICEC FWU — onboarding engineering students to version control, branching strategies, and contributing to open-source repositories.",
    dateLabel: "Dec 2024",
    year: 2024,
    image: "/assets/git and github workshop.jpg",
    highlights: ["Organized and led a Git and GitHub session under ICEC FWU.", "Introduced students to version control and open-source contribution."],
    sortOrder: 3,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0TPnG6PGo81niQEB9CzEVCTYUpS9tnCQNDEqc9byLoEHmPLE3ueAcDKFDLRdTq2Uul",
  },
  {
    slug: "icec-uiux-bootcamp-2024",
    title: "UI/UX Bootcamp Mentor",
    role: "3-Day Workshop · ICEC FWU",
    description: "Mentored a three-day UI/UX bootcamp organized by ICEC FWU at Far Western University.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/designing event 2023.jpg",
    highlights: ["Mentored ICEC FWU's three-day UI/UX bootcamp.", "The bootcamp ran in September 2024 at Far Western University."],
    sortOrder: 2,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0ZcB3uxFxu9fycmisCV9GFdQshWpEXQqHeN5a6CV6naztCaigoSFQhxjUKPTa4VHFl",
  },
  {
    slug: "icec-president-2024-2025",
    title: "President — ICEC FWU",
    role: "Innovative Computer Engineering Club",
    description: "Served as President of the Innovative Computer Engineering Club at Far Western University, helping organize developer workshops and community events.",
    dateLabel: "Feb 2024 – Feb 2025",
    year: 2024,
    image: "/assets/president last day.jpg",
    highlights: ["Served as ICEC FWU President from February 2024 to February 2025.", "Helped organize developer workshops and community events."],
  },

  // 2023
  {
    slug: "github-field-day-2023",
    title: "GitHub Fielder 2023",
    role: "GitHub Field Day Participant",
    description: "Selected to participate in GitHub Field Day Nepal 2023 and connect with developers from across the country.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/github fielder 2023.jpg",
    highlights: ["Selected as a GitHub Field Day Nepal 2023 participant.", "Met developers and open-source contributors from across Nepal."],
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0a7fJhugDQ5izmmHmb8SLWEQcGtbLA3gR5rysJGFCXLxgML9drPeE6K9PSudC8MSGl",
  },
  {
    slug: "github-field-day-experience-share-2023",
    title: "GitHub Field Day Experience Share",
    role: "Post-Event Knowledge Transfer",
    description: "Shared my GitHub Field Day 2023 experience with students at SNSC IT Club.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/imformation session after github field visit 2023.jpg",
    highlights: ["Shared the GitHub Field Day experience with SNSC students.", "Continued the conversation about developer communities after the event."],
    postUrl: "https://www.facebook.com/snscitclub/posts/pfbid02GSHa5qa5WGhhuvHoDtSnN4keLPhn69NBHm1JtQ7AHXX4bjuMs7KPPnfXVh8V1rHnl",
  },
];

/** Keep existing story URLs useful after related cards are combined. */
export const communityStoryRedirects: Record<string, string> = {
  "software-freedom-day-2024": "software-freedom-day-linux-talk-2024",
  "software-freedom-day-promotion-2024": "software-freedom-day-linux-talk-2024",
  "github-field-day-speaker-2024": "github-field-day-guide-2024",
};
