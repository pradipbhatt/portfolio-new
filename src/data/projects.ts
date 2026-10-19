export type ProjectCategory = "Hackathons" | "Products" | "Social Impact" | "Security";

export type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoLink?: string;
  repoLink?: string;
  category: ProjectCategory;
  outcome?: string;
};

export const projects: Project[] = [
  {
    title: "GRC Automation",
    description:
      "AI-driven security assurance platform for Fortune-scale enterprise customers. Automated GRC reviews, SOC2/ISO 27001 gap assessments, and questionnaire workflows — reducing analyst review time and improving accuracy across hundreds of security questionnaires.",
    image: "/assets/hyperce_acheivement.png",
    tags: ["GRC", "SOC2", "ISO 27001", "AI"],
    demoLink: "#",
    repoLink: "#",
    category: "Security",
    outcome: "Fortune-scale customer assurance",
  },
  {
    title: "Sikaiverse - Edu-Tech Platform",
    description:
      "Fully customizable edu-tech platform with complete backend system. Selected as Top 10 from 50 teams at 100XNepal Hackathon. Every feature managed via backend — content, users, assessments — designed for academic scalability.",
    image: "/assets/sikaiverse project hakathon.png",
    tags: ["Full Stack", "Backend", "Edu-Tech"],
    demoLink: "https://sikaiverse.vercel.app/",
    repoLink: "#",
    category: "Hackathons",
    outcome: "Top 10 / 50 teams — 100XNepal",
  },
  {
    title: "Orrery Web App — NASA Space Apps 2024",
    description:
      "3D visualization of Near-Earth Objects, planets, satellites, and asteroids using Three.js. Approach: NASA JPL data → WebGL rendering → real-time orbit simulation. Won 3rd place in Dhangadhi region with Team CELESTIALS.",
    image: "/assets/nasa space apps 2024.jpg",
    tags: ["Three.js", "3D", "NASA"],
    demoLink: "https://team-celestials.vercel.app/",
    repoLink: "#",
    category: "Hackathons",
    outcome: "3rd Place — NASA Space Apps 2024 Dhangadhi",
  },
  {
    title: "AstroYatra — NASA Space Apps 2025",
    description:
      "VR-powered web app taking users on a journey from the Big Bang to Earth's oceans. Combines NASA Earth observation data with immersive WebGL storytelling to visualize ocean pollution impact. Team: Pradip, Jelina Bhatt, Manoj.",
    image: "/assets/nasa spacce apps challenge 2025.png",
    tags: ["VR", "NASA", "WebGL"],
    demoLink: "https://yatra.earth",
    repoLink: "#",
    category: "Hackathons",
  },
  {
    title: "कृषि Connect — Codefest 2024",
    description:
      "Farm-to-city marketplace connecting remote Sudurpaschim farmers directly to urban consumers — eliminating middlemen and improving farmer income. Represented Sudurpaschim Province at National Level with Team Code With Her.",
    image: "/assets/codefest 2023 hakathon.jpg",
    tags: ["Agriculture", "E-commerce", "Social Impact"],
    demoLink: "#",
    repoLink: "#",
    category: "Social Impact",
    outcome: "National Level — Codefest 2024",
  },
  {
    title: "Klearn — Korean Learning Platform",
    description:
      "Interactive Korean language platform with structured lessons, Hangul practice, and cultural context. Built to serve Nepali learners with limited access to Korean resources — deployed at klearn.pradipbhatt.com.np.",
    image: "/assets/hanguru-learn.png",
    tags: ["Korean", "Language Learning", "Education"],
    demoLink: "https://klearn.pradipbhatt.com.np/dashboard",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "Personalized Notion — Privacy-First Workspace",
    description:
      "Custom Notion-like workspace where user data is saved to their own Google Drive — zero external server storage. Addresses data sovereignty concerns for privacy-conscious users without sacrificing collaboration features.",
    image: "/assets/personalized notion.png",
    tags: ["Notion", "Google Drive", "Privacy"],
    demoLink: "https://kitab.pradipbhatt.com.np/",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "Visionary AI — Image Analysis",
    description:
      "AI-powered image analysis platform using ML algorithms for intelligent recognition, pattern detection, and visual analysis. Built to explore applied ML beyond tutorials — real inference pipeline from upload to insight.",
    image: "/assets/visionary AI.png",
    tags: ["AI", "Image Analysis", "Machine Learning"],
    demoLink: "https://image.pradipbhatt.com.np/",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "soeNotes — FWU Engineering Hub",
    description:
      "All-in-one academic platform for Far Western University School of Engineering students: entrance prep, notes, syllabus, practicals, and tutorials. Solves the scattered-resources problem for 500+ engineering students.",
    image: "/assets/project1.png",
    tags: ["React.js", "Cloudinary", "MongoDB"],
    demoLink: "https://soenotes.vercel.app/",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "LearnGit — Git Tutorial Platform",
    description:
      "Interactive Git learning platform with hands-on tutorials in Nepali-English context. Designed to onboard developers who struggle with English-only Git docs — deployed and used across FWU engineering workshops.",
    image: "/assets/learngit.png",
    tags: ["Git", "Tutorial", "Version Control"],
    demoLink: "https://nepaligit.vercel.app/",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "Dynamic Quiz App",
    description:
      "Real-time assessment platform with dynamic question generation, multiple question types, instant feedback, and analytics. Used for educational testing with configurable difficulty and topic scoping.",
    image: "/assets/dynamic quiz app.png",
    tags: ["Quiz", "Assessment", "Education"],
    demoLink: "https://test.pradipbhatt.com.np/",
    repoLink: "#",
    category: "Products",
  },
];
