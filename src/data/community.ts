export type CommunityEvent = {
  title: string;
  role: string;
  description: string;
  /** Short label shown on the chip, e.g. "Sep 2024" or "2025" */
  dateLabel: string;
  /** Numeric year used for grouping in the timeline */
  year: number;
  image: string;
  /** Event sequence within a month when more precise timing is known. */
  sortOrder?: number;
  /** Public post documenting this event, when verified. */
  postUrl?: string;
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
  {
    title: "MERN Bootcamp Instructor",
    role: "Minor Project Training · 6th Semester FWU",
    description: "Led ICEC's MERN Bootcamp for sixth-semester students preparing their minor projects.",
    dateLabel: "Apr 2025",
    year: 2025,
    image: "/assets/mern workshop.jpg",
    postUrl: "https://www.facebook.com/icecfwu/posts/pfbid0P7SJAHNCArQWi4YYrBYepTPsKqKaDduFPw3o2KcCrX6BigKkX7WnjuahGMQZ2HAVl",
  },

  // 2024
  {
    title: "CodeFest Provincial Qualifier",
    role: "Team Code With Her · Sudurpaschim",
    description: "Qualified with Team Code With Her from Sudurpaschim Province for CodeFest's national hackathon.",
    dateLabel: "Dec 2024",
    year: 2024,
    image: "/assets/provence level ideathon winner.jpg",
    sortOrder: 1,
  },
  {
    title: "CodeFest 2024 Hackathon",
    role: "Team Code With Her · National Event",
    description: "Presented our project with Team Code With Her at CodeFest 2024, learning from the hackathon and sharing our work with other teams.",
    dateLabel: "Dec 2024",
    year: 2024,
    image: "/assets/codefest 2023 hakathon.jpg",
    sortOrder: 2,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid032pNLnig3BLcWUc18mCEipJzSX2ziWRux9TevnpYYn1sE9rodpFpLPH1kHPXgNb7nl",
  },
  {
    title: "Software Freedom Day Speaker",
    role: "Linux Talk · Far West",
    description: "Featured as a Linux Talk speaker at Software Freedom Day 2024 in Sudurpaschim Province, sharing open-source knowledge with engineering students.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/speaker in software freedom day 2024 far west.jpg",
    sortOrder: 4,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0vNS9Y1MssbHrZmDRosRDEYvdTReTS1HFCXUsxPLuNV9Xx4XuSg2VsYDh84BJFwp3l",
  },
  {
    title: "Software Freedom Day 2024",
    role: "Open Source Celebration",
    description: "Joined the Far Western Nepal open-source community at Software Freedom Day 2024, with talks and conversations around free software.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/software freedom day 2024.jpg",
    sortOrder: 4,
    postUrl: "https://www.facebook.com/jsurya860/posts/pfbid0BtsYnzQjsRdeSh5qpeT3puMUAhqU3CQ6xYpV5nrMmgxh9drsaYAZXGMfFsWhMLFRl",
  },
  {
    title: "Software Freedom Day Promotion",
    role: "Open Source Event Campaign",
    description: "Shared registration details and event updates for Software Freedom Day 2024 with the local developer community.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/software freedom day cover image.jpg",
    sortOrder: 3,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0vqX132ttGQFLG6KnPSn5FLa3swpwLXs7cQDrAaEEWE7j7DzC4ZS5Xk87SSvcMqMrl",
  },
  {
    title: "GitHub Field Day Guide",
    role: "Application Guidance Session",
    description: "Guided students on applying for GitHub Field Day after being selected myself in 2023 — sharing application strategy, open-source profile tips, and what GitHub looks for.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/information sharing session after github field visit.jpg",
    sortOrder: 6,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0JeVxxzXeqytu1nJ9XLCQgzYtTZ3gjg6Zd63AjeAxzRhbSBj7LkvfS7qDXuPJFhykl",
  },
  {
    title: "GitHub Field Day Speaker Announcement",
    role: "Application Guidance · SNSC",
    description: "Invited to speak at SNSC's GitHub Field Day Nepal 2024 application guidance session, sharing my experience as a 2023 Fielder.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/poster for imformation session in snsc for github field visit 2023.jpg",
    sortOrder: 5,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid02G5ePJJHaCmyJFTGiMTfTkVfcRbrGYR1gBMfdUPBrpoxo7xoR56bUKp4ANy8ioX13l",
  },
  {
    title: "UI/UX Workshop Mentor",
    role: "3-Day Design Workshop · SNSC IT Club",
    description: "Mentored a three-day UI/UX design workshop with SNSC IT Club.",
    dateLabel: "2024",
    year: 2024,
    image: "/assets/snsc design workshop.jpg",
  },
  {
    title: "Git & GitHub Workshop",
    role: "Open Source Training · ICEC FWU",
    description: "Organized and led a Git & GitHub workshop under ICEC FWU — onboarding engineering students to version control, branching strategies, and contributing to open-source repositories.",
    dateLabel: "Dec 2024",
    year: 2024,
    image: "/assets/git and github workshop.jpg",
    sortOrder: 3,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0TPnG6PGo81niQEB9CzEVCTYUpS9tnCQNDEqc9byLoEHmPLE3ueAcDKFDLRdTq2Uul",
  },
  {
    title: "UI/UX Bootcamp Mentor",
    role: "3-Day Workshop · ICEC FWU",
    description: "Mentored a three-day UI/UX bootcamp organized by ICEC FWU at Far Western University.",
    dateLabel: "Sep 2024",
    year: 2024,
    image: "/assets/designing event 2023.jpg",
    sortOrder: 2,
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0ZcB3uxFxu9fycmisCV9GFdQshWpEXQqHeN5a6CV6naztCaigoSFQhxjUKPTa4VHFl",
  },
  {
    title: "President — ICEC FWU",
    role: "Innovative Computer Engineering Club",
    description: "Served as President of the Innovative Computer Engineering Club at Far Western University, helping organize developer workshops and community events.",
    dateLabel: "Feb 2024 – Feb 2025",
    year: 2024,
    image: "/assets/president last day.jpg",
  },

  // 2023
  {
    title: "GitHub Fielder 2023",
    role: "GitHub Field Day Participant",
    description: "Selected to participate in GitHub Field Day Nepal 2023 and connect with developers from across the country.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/github fielder 2023.jpg",
    postUrl: "https://www.facebook.com/pradipbhatt21/posts/pfbid0a7fJhugDQ5izmmHmb8SLWEQcGtbLA3gR5rysJGFCXLxgML9drPeE6K9PSudC8MSGl",
  },
  {
    title: "GitHub Field Day Experience Share",
    role: "Post-Event Knowledge Transfer",
    description: "Shared my GitHub Field Day 2023 experience with students at SNSC IT Club.",
    dateLabel: "2023",
    year: 2023,
    image: "/assets/imformation session after github field visit 2023.jpg",
    postUrl: "https://www.facebook.com/snscitclub/posts/pfbid02GSHa5qa5WGhhuvHoDtSnN4keLPhn69NBHm1JtQ7AHXX4bjuMs7KPPnfXVh8V1rHnl",
  },
];
