export type TSideItems = {
  name: string;
  path: string | null;
  icon: React.ReactNode;
  children?: TSideItems[];
};

export type DiscoverItem = {
  key: string;
  label: string;
  sub: string;
  img: string;
};
