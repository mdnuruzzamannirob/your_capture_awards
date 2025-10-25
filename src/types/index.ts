export type TSideItems = {
  name: string;
  path: string | null;
  icon: React.ReactNode;
  children?: TSideItems[];
};
