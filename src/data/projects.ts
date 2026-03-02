export type ProjectCategory = "Hackathons" | "Products" | "Social Impact";

export type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoLink?: string;
  repoLink?: string;
  category: ProjectCategory;
};

export const projects: Project[] = [
  {
    title: "Klearn - Korean Learning Platform",
    description:
      "Interactive platform for learning the Korean language (Hanguru). Features comprehensive lessons, practice exercises, and cultural insights to help users master Korean language skills effectively.",
    image: "/assets/hanguru-learn.png",
    tags: ["Korean", "Language Learning", "Education"],
    demoLink: "https://klearn.pradipbhatt.com.np/dashboard",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "Dynamic Quiz App",
    description:
      "Interactive quiz application with dynamic question generation and real-time assessment. Features multiple question types, instant feedback, and comprehensive analytics for educational testing.",
    image: "/assets/dynamic quiz app.png",
    tags: ["Quiz", "Assessment", "Education"],
    demoLink: "https://test.pradipbhatt.com.np/",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "Personalized Notion",
    description:
      "Custom Notion-like workspace where user data is saved directly to their Google Drive instead of external servers. Ensures data privacy and gives users complete control over their information.",
    image: "/assets/personalized notion.png",
    tags: ["Notion", "Google Drive", "Privacy"],
    demoLink: "https://kitab.pradipbhatt.com.np/",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "Visionary AI - Image Analysis",
    description:
      "Advanced AI-powered image analysis platform. Features intelligent image recognition, pattern detection, and comprehensive visual analysis using cutting-edge machine learning algorithms.",
    image: "/assets/visionary AI.png",
    tags: ["AI", "Image Analysis", "Machine Learning"],
    demoLink: "https://image.pradipbhatt.com.np/",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "LearnGit - Git Tutorial Platform",
    description:
      "Interactive Git learning platform with hands-on tutorials and practical exercises. Designed to help developers master Git version control through guided lessons and real-world examples.",
    image: "/assets/learngit.png",
    tags: ["Git", "Tutorial", "Version Control"],
    demoLink: "https://nepaligit.vercel.app/",
    repoLink: "#",
    category: "Products",
  },
  {
    title: "Sikaiverse - Edu-Tech Platform",
    description:
      "Fully customizable edu-tech platform with complete backend system. Selected as Top 10 from 50 teams at 100XNepal Hackathon. Designed to be flexible and scalable for academic use with every feature managed through backend.",
    image: "/assets/sikaiverse project hakathon.png",
    tags: ["Full Stack", "Backend", "Edu-Tech"],
    demoLink: "https://sikaiverse.vercel.app/",
    repoLink: "#",
    category: "Hackathons",
  },
  {
    title: "AstroYatra - NASA Space Apps 2025",
    description:
      "VR-powered web application taking users on a journey from the Big Bang to Earth's oceans. Combines NASA Earth observation data with immersive storytelling to illustrate ocean pollution and its impact. Built with team members Jelina Bhatt and Manoj.",
    image: "/assets/nasa spacce apps challenge 2025.png",
    tags: ["VR", "NASA", "WebGL"],
    demoLink: "https://yatra.earth",
    repoLink: "#",
    category: "Hackathons",
  },
  {
    title: "Orrery Web App - NASA Space Apps 2024",
    description:
      "3D visualization of Near-Earth Objects, planets, satellites, and asteroids using Three.js. Won 3rd place in Dhangadhi region at NASA International Space Apps Challenge 2024 with Team CELESTIALS.",
    image: "/assets/nasa space apps 2024.jpg",
    tags: ["Three.js", "3D", "NASA"],
    demoLink: "https://team-celestials.vercel.app/",
    repoLink: "#",
    category: "Hackathons",
  },
  {
    title: "कृषि Connect - Codefest 2024",
    description:
      "Farm-to-city platform connecting farmers from remote areas directly to city consumers. Bridges the gap between farmers and consumers with fresh produce delivery. Team Code With Her representing Sudurpaschim Province at National Level.",
    image: "/assets/codefest 2023 hakathon.jpg",
    tags: ["Agriculture", "E-commerce", "Social Impact"],
    demoLink: "#",
    repoLink: "#",
    category: "Social Impact",
  },
  {
    title: "soeNotes",
    description:
      "A comprehensive web application for Far Western University School of Engineering students. Provides entrance exam preparation materials, notes, tutorials, syllabus, and practicals all in one platform.",
    image: "/assets/project1.png",
    tags: ["React.js", "Cloudinary", "MongoDB"],
    demoLink: "https://soenotes.vercel.app/",
    repoLink: "#",
    category: "Products",
  },
];

