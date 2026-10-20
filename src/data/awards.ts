export type AwardType = "Hackathon" | "Career" | "Community" | "Recognition";

export type Award = {
  title: string;
  subtitle: string;
  image: string;
  year: number;
  type: AwardType;
  description: string;
};

export const awards: Award[] = [
  {
    title: "Top 10 — 100XNepal Hackathon",
    subtitle: "SOEIntel Platform · Selected from 50 Teams",
    image: "/assets/100x hakathon award for top 10.png",
    year: 2024,
    type: "Hackathon",
    description: "Built Sikaiverse, a fully customizable edu-tech platform — selected in the top 10 of 50 competing teams at Nepal's premier startup hackathon.",
  },
  {
    title: "3rd Place — NASA Space Apps",
    subtitle: "Dhangadhi Region 2024 · Team CELESTIALS",
    image: "/assets/acheivement nasa space apps challene local winner.png",
    year: 2024,
    type: "Hackathon",
    description: "Built a 3D Near-Earth Object visualization using Three.js and NASA JPL data. Placed 3rd at the Dhangadhi regional event of the NASA International Space Apps Challenge.",
  },
  {
    title: "Software Engineer",
    subtitle: "Hyperce · Sep 2025 – Jul 2026",
    image: "/assets/hyperce_acheivement.png",
    year: 2025,
    type: "Career",
    description: "Joined Hyperce as Software Engineer — contributing to full-stack product development and open-source tooling.",
  },
  {
    title: "Associate Software Engineer",
    subtitle: "CloudTech Nepal · Jun – Aug 2025",
    image: "/assets/associate software developer at cloud tech services.jpeg",
    year: 2025,
    type: "Career",
    description: "Recognized as Associate Software Engineer at CloudTech Nepal Pvt. Ltd., contributing to backend systems and cloud infrastructure.",
  },
  {
    title: "GitHub Field Day 2023",
    subtitle: "Selected Participant · Open Source Community",
    image: "/assets/github fielder 2023.jpg",
    year: 2023,
    type: "Community",
    description: "Selected as one of Nepal's GitHub Field Day participants — recognized for open-source contributions and community leadership. Later shared the experience across colleges in Sudurpaschim.",
  },
];
