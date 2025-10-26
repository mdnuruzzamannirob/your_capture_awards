export type SideItems = {
  name: string;
  path: string | null;
  icon: React.ReactNode;
  children?: SideItems[];
};

export type NavLink = {
  name: string;
  href: string;
};

export type MemoriesImage = {
  image: string;
};

export type DiscoverItem = {
  key: string;
  label: string;
  sub: string;
  img: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  href: string;
  img: string;
};
