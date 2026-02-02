import ContestHeader from '@/components/layout/ContestHeader';

const ContestLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ContestHeader />
      {children}
    </>
  );
};

export default ContestLayout;
