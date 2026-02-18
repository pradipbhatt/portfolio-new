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

