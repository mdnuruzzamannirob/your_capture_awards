import CornerCount from '@/components/CornerCount';
import { PotyPrizeRibbon } from './poty';

// Corner strap on contest cards and the contest page. Photographer of the Year
// shows its prize pool (the winners' share of all entry fees) instead of the
// photo upload limit.
const ContestCorner = ({ contest, className }: { contest: any; className?: string }) => {
  if (contest?.isPhotographyOfYear) {
    return <PotyPrizeRibbon contest={contest} className={className} />;
  }

  return <CornerCount count={contest?.maxUpload ?? contest?.maxUploads ?? 0} className={className} />;
};

export default ContestCorner;
