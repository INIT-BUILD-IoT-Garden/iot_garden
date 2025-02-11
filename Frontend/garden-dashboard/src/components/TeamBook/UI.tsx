import { TeamMember } from "@/data/teamMembers";
import { atom } from "jotai";

export const pageAtom = atom(0);

export interface Page {
  front: {
    content: string | {
      name?: string;
      role?: string;
      bio?: string;
      link?: string;
    };
    type: "cover" | "bio" | "image";
  };
  back: {
    content: string | {
      name?: string;
      role?: string;
      bio?: string;
      link?: string;
    };
    type: "cover" | "bio" | "image";
  };
}

export const createPages = (members: TeamMember[]): Page[] => {
  if (!members || members.length === 0) {
    console.warn("No members provided to createPages");
    return [];
  }

  // Start with cover page
  const pages: Page[] = [
    {
      front: {
        content: "../../assets/textures/cover.jpg",
        type: "cover",
      },
      back: {
        content: members[0].imageUrl,
        type: "image",
      },
    },
  ];

  // Create pages for remaining members
  for (let i = 0; i < members.length - 1; i++) {
    pages.push({
      front: {
        content: {
          name: members[i].name,
          role: members[i].role,
          bio: members[i].bio,
          link: members[i].link
        },
        type: "bio"
      },
      back: {
        content: members[i + 1].imageUrl,
        type: "image"
      }
    });
  }

  // Add last member's bio page
  pages.push({
    front: {
      content: {
        name: members[members.length - 1].name,
        role: members[members.length - 1].role,
        bio: members[members.length - 1].bio
      },
      type: "bio"
    },
    back: {
      content: "../../assets/textures/cover.jpg",
      type: "cover"
    }
  });

  return pages;
};
