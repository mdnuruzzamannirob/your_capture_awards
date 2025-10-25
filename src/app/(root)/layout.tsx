import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main>
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default RootLayout;
