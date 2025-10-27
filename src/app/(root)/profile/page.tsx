import PortfolioSection from '@/components/profile/PortfolioSection';
import ProfileHeader from '@/components/profile/ProfileHeader';

const ProfilePage = async () => {
  return (
    <main className="pb-20">
      <ProfileHeader />
      <PortfolioSection />
    </main>
  );
};

export default ProfilePage;
