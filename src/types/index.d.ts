export type SideItems = {
  name: string;
  path: string | null;
  icon: React.ReactNode;
  children?: SideItems[];
};

export type NavLink = {
  name: string;
  href: string;
  tags?: string[];
  // Shown instead of `name` in the desktop header below the xl breakpoint,
  // where the full name would crowd the header.
  shortName?: string;
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

export type AuthData = {
  user: AuthUser | null;
  token: string | null;
};
