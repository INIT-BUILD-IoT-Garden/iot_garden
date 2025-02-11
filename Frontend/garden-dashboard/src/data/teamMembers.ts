// Import team member images
import member1 from "@/assets/textures/team/member1.jpg";
import member2 from "@/assets/textures/team/member2.jpg";
import member3 from "@/assets/textures/team/member3.jpg";
import member4 from "@/assets/textures/team/member4.jpg";
import member5 from "@/assets/textures/team/member5.jpg";
import member6 from "@/assets/textures/team/member6.jpg";
import member7 from "@/assets/textures/team/member7.jpg";
import member8 from "@/assets/textures/team/member8.jpg";
import member9 from "@/assets/textures/team/member9.jpg";
import member10 from "@/assets/textures/team/member10.jpg";
import member11 from "@/assets/textures/team/member11.jpg";
import member12 from "@/assets/textures/team/member12.jpg";
import member13 from "@/assets/textures/team/member13.jpg";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  link?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Raidel Almeida",
    role: "Team Co-Lead",
    bio: "Majoring in Computer Science, my interest vary from Hardware/Robotics, Web Developent to IOS and MacOS development.",
    imageUrl: member1,
    link: "https://raidel.dev",
  },
  {
    id: 2,
    name: "Anncarolyne Power",
    role: "Team Co-Lead",
    bio: "Hi my name is Carol and I am a CS major interested in becoming a SWE or PM. I also really love being creative and designing mobile apps.",
    imageUrl: member2,
    link: "https://linkedin.com/in/anncarolyne-power",
  },
  {
    id: 3,
    name: "Mia Urra",
    role: "UI/UX Designer",
    bio: "Hello my name is Mia Urra and I am a Sophomore Information Systems major. I am interested in learning new things and being involved in school!",
    imageUrl: member3,
    link: "https://linkedin.com/in/mia-urra-4a74092b9",
  },
  {
    id: 4,
    name: "Tyler Coy",
    role: "DevOps Engineer",
    bio: "Hello, name is Tyler Coy and I am a junior at Fiu majoring in computer engineering. I am interested in robotics and software engineering.",
    imageUrl: member4,
    link: "",
  },
  {
    id: 5,
    name: "Ronaldo Carrazco",
    role: "Embedded Engineer",
    bio: "Hello, my name is Ronaldo Carrazco and I am a senior at FIU majoring in Computer Science with an interested in robotics and computer vision.",
    imageUrl: member5,
    link: "",
  },
  {
    id: 6,
    name: "Tyler Hebron",
    role: "Embedded Engineer",
    bio: "Hello! My name is Tyler Hebron. I am a junior at FIU studying Computer Engineering. My interests include everything from software development to embedded programming!",
    imageUrl: member6,
    link: "",
  },
  {
    id: 7,
    name: "Huu Thang Ly",
    role: "Embedded Engineer",
    bio: "Hi, my name is Huu Thang Ly (Leo) and I am currently a junior at FIU majoring in Computer Engineering. I'm interested in embedded systems, robotics, AI and software engineering.",
    imageUrl: member7,
    link: "https://linkedin.com/in/huu-thang-ly/",
  },
  {
    id: 8,
    name: "Steven Rodriguez",
    role: "Embedded Engineer",
    bio: "Studying Mechanical Engineering at FIU with an interest in embedded systems and software engineering.",
    imageUrl: member8,
    link: "https://steven-rodriguezz.carrd.co",
  },
  {
    id: 9,
    name: "Pooja Lad",
    role: "Developer",
    bio: "Hi! My name is Pooja and I'm a CS major with a bio minor. I'm super interested in the intersection between science and tech",
    imageUrl: member9,
    link: "",
  },
  {
    id: 10,
    name: "Arantza Mendoza",
    role: "Developer",
    bio: "Hi! My name is Arantza Mendoza. I am a Junior CS major. I'm interested in finding solutions to problems through code. I am a constant and fast learner. You'll always see me learning something new.",
    imageUrl: member10,
    link: "https://linkedin.com/in/arantza-mendoza",
  },
  {
    id: 11,
    name: "Bielky Ruiz",
    role: "Developer",
    bio: "Hello my name is Bielky Ruiz and I am a Senior at FIU majoring in Computer Science. I am interested in Data Analytics and Artificial Intelligence.",
    imageUrl: member11,
    link: "",
  },
  {
    id: 12,
    name: "Carlos Amasifuen",
    role: "Developer & Cybersecurity Consultant",
    bio: "Hi, I'm Carlos Amasifuen, a graduate student at FIU majoring in Cybersecurity. With a background in web development and UI/UX design, I'm now focusing on advancing my skills in the cybersecurity field.",
    imageUrl: member12,
    link: "https://linkedin.com/in/camasifuen6/",
  },
  {
    id: 13,
    name: "Jin Carballosa",
    role: "Developer",
    bio: "Interested in leveraging the web to help others.",
    imageUrl: member13,
    link: "",
  },
];
