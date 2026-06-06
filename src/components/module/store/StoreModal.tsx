'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStoreModal } from '@/providers/StoreModalProvider';
import Image from 'next/image';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { MdOutlineCameraswitch } from 'react-icons/md';

const mockStoreStats = {
  coin: 930,
  key: 2,
  trade: 3,
  charge: 4,
};

const coinOffers = [
  { title: 'Fistful of Coins', amount: 200, price: '$1.99', badge: '' },
  { title: 'Pouch of Coins', amount: 550, price: '$4.99', badge: '' },
  { title: 'Chalice of Coins', amount: 1300, price: '$9.99', badge: 'Most Popular' },
];

const bundleOffers = [
  { title: 'Basic Bundle', amount: 250, price: 250, badge: '' },
  { title: 'Pro Kit', amount: 550, price: 550, badge: '' },
  { title: 'Master Pack', amount: 900, price: 900, badge: 'Most Popular' },
  { title: 'Elite Bundle', amount: 1200, price: 1200, badge: '' },
  { title: 'Ultimate Kit', amount: 2500, price: 2500, badge: '' },
  { title: 'Guru Pack', amount: 5000, price: 5000, badge: 'Best Value' },
];

const StoreModal = () => {
  const { open, setOpen } = useStoreModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton
        className="border-black-2-600 bg-background flex max-h-[92vh] max-w-[95vw] flex-col overflow-hidden border-2 p-0 sm:max-w-4xl"
      >
        <DialogHeader className="border-b border-white/5 px-5 py-4 sm:px-6">
          <div className="grid grid-cols-3 items-center gap-3">
            <div className="text-left">
              <DialogTitle className="text-lg font-semibold">Store</DialogTitle>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex h-10 items-stretch overflow-hidden rounded-md bg-white/5">
                <div className="flex items-center gap-2 px-3 text-sm text-white/80">
                  <IoKeyOutline className="text-primary size-4" />
                  <span>{mockStoreStats.key}</span>
                </div>
                <div className="my-2 w-px bg-white/10" />
                <div className="flex items-center gap-2 px-3 text-sm text-white/80">
                  <MdOutlineCameraswitch className="text-primary size-4 rotate-90" />
                  <span>{mockStoreStats.trade}</span>
                </div>
                <div className="my-2 w-px bg-white/10" />
                <div className="flex items-center gap-2 px-3 text-sm text-white/80">
                  <AiOutlineThunderbolt className="text-primary size-4" />
                  <span>{mockStoreStats.charge}</span>
                </div>
                <div className="my-2 w-px bg-white/10" />
                <div className="flex items-center gap-2 px-3 text-sm text-white/80">
                  <span className="text-lg leading-none">🪙</span>
                  <span>{mockStoreStats.coin}</span>
                </div>
              </div>
            </div>

            <div />
          </div>
        </DialogHeader>

        <div className="grid scrollbar-thin gap-6 overflow-y-auto p-4 sm:p-6">
          <section className="space-y-4">
            <div className="">
              <h3 className="text-center text-2xl font-bold">Coins</h3>

              <p className="text-muted-foreground text-center text-sm">
                Buy coins to participate in flash challenges
              </p>
            </div>

       

            <div className="grid gap-4 md:grid-cols-3">
              {coinOffers.map((offer) => (
                <div
                  key={offer.title}
                  className="border-black-2-600 bg-black-2-800 relative overflow-hidden rounded-xl border p-4"
                >
                  {offer.badge && (
                    <div className="bg-primary absolute top-3 left-3 rounded px-2 py-1 text-[10px] font-semibold text-white">
                      {offer.badge}
                    </div>
                  )}
                  <div className="flex h-full flex-col justify-between gap-4">
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium text-white/70">{offer.title}</p>
                      <h4 className="text-2xl font-semibold">{offer.amount}</h4>
                    </div>
                    <div className="flex items-center justify-center py-3">
                      <Image src="/icons/coin.png" alt="coin" width={72} height={72} />
                    </div>
                    <div className="bg-primary/90 text-background rounded-md py-2 text-center text-sm font-semibold">
                      {offer.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="">
              <h3 className="text-center text-2xl font-bold">Bundles</h3>

              <p className="text-muted-foreground text-center text-sm">
                Enjoy packs full with all the items you love
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {bundleOffers.map((bundle) => (
                <div
                  key={bundle.title}
                  className="border-black-2-600 bg-black-2-800 rounded-xl border p-3"
                >
                  <div className="text-center">
                    <p className="text-sm font-medium">{bundle.title}</p>
                  </div>
                  <div className="border-primary/20 bg-background/30 mt-3 rounded-lg border p-3">
                    <div className="flex items-center justify-center">
                      <Image
                        src="/icons/key.png"
                        alt={bundle.title}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                  </div>
                  <div className="bg-primary/90 text-background mt-3 rounded-md py-2 text-center text-sm font-semibold">
                    {bundle.price} coin
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreModal;
