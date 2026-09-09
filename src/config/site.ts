export const site = {
  title: "Caby",
  tagline: "Your Self-Hosted File Manager",
  github: "https://github.com/caby-io/caby",
  discord: "https://discord.gg/Z2JkSs2Hzy",
};

// base for the "Edit this page" link — this docs repo, not the app repo above
export const githubEditBase =
  "https://github.com/caby-io/docs/edit/main/src/content/docs";

export interface NavLink {
  label: string;
  link: string;
  badge?: string;
}

export interface NavGroup {
  label: string;
  collapsed?: boolean;
  items: Array<NavLink | NavGroup>;
}

export type NavItem = NavLink | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup =>
  (item as NavGroup).items !== undefined;

// top-level entries mix freely: a bare link renders flat (uncategorised), a group
// renders as a static bold section header, a nested group renders collapsible.
export const sidebar: NavItem[] = [
  {
    label: "Welcome",
    items: [
      { label: "Getting Started", link: "/getting-started" },
      { label: "What is Caby?", link: "/what-is-caby" },
    ],
  },
  {
    label: "Installation",
    items: [
      { label: "Docker", link: "/installation/docker" },
      { label: "Kubernetes", link: "/installation/kubernetes" },
    ],
  },
  {
    label: "Configuration",
    items: [{ label: "Main Config", link: "/configuration/main-config" }],
  },
];
