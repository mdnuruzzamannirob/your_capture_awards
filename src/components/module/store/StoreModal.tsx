'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useStoreModal } from '@/providers/StoreModalProvider';
import {
  useGetStoreProductsQuery,
  useGetStoreStatsQuery,
  usePurchaseStoreProductMutation,
} from '@/store/apis/storeApi';
import { StoreProduct, StoreProductItem } from '@/store/types/storeTypes';
import Image from 'next/image';
import { useMemo } from 'react';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { IoKeyOutline } from 'react-icons/io5';
import { MdOutlineCameraswitch } from 'react-icons/md';
import { toast } from 'sonner';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error && 'data' in error) {
    const data = (error as { data?: { message?: string } }).data;
    return data?.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

const itemIcon = {
  KEY: <IoKeyOutline className="text-primary size-3" />,
  SWAP: <MdOutlineCameraswitch className="text-primary size-3 rotate-90" />,
  BOOST: <AiOutlineThunderbolt className="text-primary size-3" />,
};

const itemLabel = {
  KEY: 'Key',
  SWAP: 'Trade',
  BOOST: 'Charge',
};

const itemGradient = {
  KEY: 'from-yellow-500/20 to-amber-500/5',
  SWAP: 'from-blue-500/20 to-cyan-500/5',
  BOOST: 'from-purple-500/20 to-violet-500/5',
};

const itemBadge = {
  KEY: 'bg-yellow-500/20 text-yellow-300',
  SWAP: 'bg-blue-500/20 text-blue-300',
  BOOST: 'bg-purple-500/20 text-purple-300',
};

const ResourceValue = ({ loading, value }: { loading: boolean; value: number }) => {
  if (loading) return <Skeleton className="h-3 w-6" />;
  return <span>{value}</span>;
};

/* ─── Bundle Items ────────────────────────────────────────────────── */
const BundleItems = ({ items }: { items: StoreProductItem[] }) => {
  if (!items.length) {
    return <p className="text-muted-foreground text-center text-xs">No items listed</p>;
  }
  // Always show exactly 3 rows (pad with empty if fewer)
  const rows = [...items.slice(0, 3)];
  while (rows.length < 3) rows.push(null as unknown as StoreProductItem);
  return (
    <div className="grid h-full grid-rows-3 gap-1">
      {rows.map((item, idx) =>
        item ? (
          <div
            key={item.type}
            className={`bg-linear-to-r ${itemGradient[item.type]} flex items-center justify-between rounded-md px-2 py-1 ring-1 ring-white/5`}
          >
            <span className="flex items-center gap-1 text-[11px] font-medium text-white/75">
              {itemIcon[item.type]}
              {itemLabel[item.type]}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${itemBadge[item.type]}`}
            >
              ×{item.quantity}
            </span>
          </div>
        ) : (
          <div key={`empty-${idx}`} className="rounded-md" />
        ),
      )}
    </div>
  );
};

/* ─── Skeleton Components ─────────────────────────────────────────── */
const CoinCardSkeleton = () => (
  <div className="flex h-55 w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-1">
    <div className="flex flex-1 flex-col rounded-xl bg-white/3 p-3">
      {/* Icon area */}
      <Skeleton className="mx-auto mb-3 h-16 w-16 rounded-full" />
      {/* Title & amount */}
      <div className="flex-1 space-y-1.5 text-center">
        <Skeleton className="mx-auto h-2.5 w-16" />
        <Skeleton className="mx-auto h-6 w-20" />
      </div>
      {/* Button */}
      <Skeleton className="mt-3 h-8 w-full rounded-lg" />
    </div>
  </div>
);

const BundleCardSkeleton = () => (
  <div className="flex h-55 w-45 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-1">
    <div className="flex flex-1 flex-col rounded-xl bg-white/3 p-3">
      <Skeleton className="mx-auto mb-2.5 h-3.5 w-24" />
      <div className="flex-1 space-y-1 rounded-lg border border-white/6 bg-black/20 p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
      <Skeleton className="mt-2.5 h-7 w-full rounded-lg" />
    </div>
  </div>
);

/* ─── Coin Card ───────────────────────────────────────────────────── */
const CoinCard = ({
  offer,
  onPurchase,
  isPurchasing,
}: {
  offer: StoreProduct;
  onPurchase: (offer: StoreProduct) => void;
  isPurchasing: boolean;
}) => (
  <div className="group relative flex h-52.5 w-38.75 shrink-0 flex-col overflow-hidden rounded-xl border border-white/8 bg-white/4">
    <div className="relative flex flex-1 flex-col p-3">
      {/* Dollar icon area */}
      <div className="relative mx-auto mb-2.5 flex h-18 w-full items-center justify-center overflow-hidden rounded-lg bg-black/20">
        <div className="from-primary/25 absolute inset-0 bg-linear-to-br to-amber-500/5" />
        <Image
          src="/icons/dollar.png"
          alt="Dollar Icon"
          width={44}
          height={44}
          className="relative object-contain"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="mb-0.5 text-[10px] font-medium tracking-widest text-white/35 uppercase">
          {offer.title}
        </p>
        <div className="flex items-center gap-1">
          <Image src="/icons/dollar.png" alt="" width={18} height={18} className="object-contain" />
          <span className="text-lg font-semibold text-white">{offer.quantity ?? 0}</span>
        </div>
      </div>

      {/* Buy button */}
      <button
        type="button"
        onClick={() => onPurchase(offer)}
        disabled={isPurchasing}
        className="bg-primary/90 text-foreground hover:bg-primary mt-2 w-full rounded-sm py-1.5 text-xs font-bold transition-colors duration-150 disabled:opacity-50"
      >
        {formatMoney(offer.amount, offer.currency)}
      </button>
    </div>
  </div>
);

/* ─── Bundle Card ─────────────────────────────────────────────────── */
const BundleCard = ({
  bundle,
  onPurchase,
  isPurchasing,
}: {
  bundle: StoreProduct;
  onPurchase: (bundle: StoreProduct) => void;
  isPurchasing: boolean;
}) => (
  <div className="group relative flex h-52.5 w-43.75 shrink-0 flex-col overflow-hidden rounded-xl border border-white/8 bg-white/4">
    <div className="relative flex flex-1 flex-col p-3">
      {/* Title */}
      <p className="mb-2 text-center text-[12px] font-semibold tracking-wide text-white">
        {bundle.title}
      </p>

      {/* Items — fixed 3-row container */}
      <div className="flex-1 overflow-hidden rounded-lg bg-black/20 p-1.5">
        <BundleItems items={bundle.items} />
      </div>

      {/* Buy button with dollar icon */}
      <button
        type="button"
        onClick={() => onPurchase(bundle)}
        disabled={isPurchasing}
        className="bg-primary/90 text-foreground hover:bg-primary mt-2 flex w-full items-center justify-center gap-1 rounded-sm py-1.5 text-xs font-bold transition-colors duration-150 disabled:opacity-50"
      >
        <Image src="/icons/dollar.png" alt="" width={12} height={12} className="object-contain" />
        {bundle.amount} coin
      </button>
    </div>
  </div>
);

/* ─── Section Header ──────────────────────────────────────────────── */
const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-4">
    <h3 className="text-center text-xl font-bold tracking-tight text-white">{title}</h3>
    <p className="text-muted-foreground text-center text-xs">{subtitle}</p>
  </div>
);

/* ─── Main Modal ──────────────────────────────────────────────────── */
const StoreModal = () => {
  const { open, setOpen } = useStoreModal();

  const {
    data: storeStats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetStoreStatsQuery(undefined, { skip: !open });

  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetStoreProductsQuery({ page: 1, limit: 10 }, { skip: !open });

  const [purchaseProduct, { isLoading: isPurchasing }] = usePurchaseStoreProductMutation();

  const stats = storeStats?.data;
  const productsLoading = isProductsLoading || isProductsFetching;

  const { coinOffers, bundleOffers } = useMemo(() => {
    const products = productsResponse?.data ?? [];
    return {
      coinOffers: products.filter((p) => p.category === 'COINS'),
      bundleOffers: products.filter((p) => p.category === 'BUNDLES'),
    };
  }, [productsResponse?.data]);

  const handlePurchase = async (product: StoreProduct) => {
    try {
      const response = await purchaseProduct(product.id).unwrap();
      if (response.data?.url) {
        toast.loading('Redirecting to Stripe checkout...');
        window.location.assign(response.data.url);
        return;
      }
      toast.success(response.data?.message || response.message || 'Product purchased successfully');
      refetchStats();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Purchase failed. Please try again.'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton
        className="border-black-2-600 bg-background flex max-h-[95vh] max-w-[95vw] flex-col gap-0 overflow-hidden border-2 p-0 sm:max-w-4xl"
      >
        {/* ── Header ── */}
        <DialogHeader className="relative shrink-0 border-b border-white/5 px-5 py-3.5 sm:px-6">
          {/* Title — left */}
          <DialogTitle className="absolute top-1/2 left-5 -translate-y-1/2 font-semibold tracking-wide sm:left-6">
            Store
          </DialogTitle>

          {/* Stats pill — centered */}
          <div className="flex justify-center">
            <div className="flex h-9 items-stretch overflow-hidden rounded-xl border border-white/8 bg-white/5 backdrop-blur-sm">
              {[
                {
                  icon: <IoKeyOutline className="text-primary size-3.5" />,
                  value: stats?.key ?? 0,
                  label: 'Keys',
                },
                {
                  icon: <MdOutlineCameraswitch className="text-primary size-3.5 rotate-90" />,
                  value: stats?.swap ?? 0,
                  label: 'Trades',
                },
                {
                  icon: <AiOutlineThunderbolt className="text-primary size-3.5" />,
                  value: stats?.boost ?? 0,
                  label: 'Charges',
                },
                {
                  icon: (
                    <Image
                      src="/icons/dollar.png"
                      alt="Coins"
                      width={14}
                      height={14}
                      className="object-contain"
                    />
                  ),
                  value: stats?.coins ?? 0,
                  label: 'Coins',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center" title={item.label}>
                  {i > 0 && <div className="my-2 w-px bg-white/8" />}
                  <div className="flex items-center gap-1 px-2.5 text-xs font-medium text-white/80 sm:px-3">
                    {item.icon}
                    <ResourceValue loading={isStatsLoading} value={item.value} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* ── Body — scrollable ── */}
        <div className="flex-1 scrollbar-thin overflow-x-hidden overflow-y-auto p-4 sm:p-5">
          {isStatsError && (
            <div className="border-destructive/30 bg-destructive/10 mb-4 rounded-xl border px-3 py-2 text-center text-xs">
              Could not load your current store balance.
            </div>
          )}

          {/* ── Coins Section ── */}
          <section className="mb-6">
            <SectionHeader title="Coins" subtitle="Buy coins to participate in flash challenges" />

            {productsLoading ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CoinCardSkeleton key={i} />
                ))}
              </div>
            ) : coinOffers.length ? (
              <Carousel opts={{ align: 'start', loop: false }} className="w-full">
                <CarouselContent className="-ml-3 pb-1">
                  {coinOffers.map((offer) => (
                    <CarouselItem key={offer.id} className="basis-auto pl-3 select-none">
                      <CoinCard
                        offer={offer}
                        onPurchase={handlePurchase}
                        isPurchasing={isPurchasing}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {coinOffers.length > 3 && (
                  <>
                    <CarouselPrevious className="-left-3 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
                    <CarouselNext className="-right-3 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
                  </>
                )}
              </Carousel>
            ) : !isProductsError ? (
              <p className="text-muted-foreground text-center text-sm">No coin packs available.</p>
            ) : null}
          </section>

          {/* ── Divider ── */}
          <div className="my-4 h-px bg-white/5" />

          {/* ── Bundles Section ── */}
          <section>
            <SectionHeader
              title="Bundles"
              subtitle="Enjoy packs full with all the items you love"
            />

            {productsLoading ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <BundleCardSkeleton key={i} />
                ))}
              </div>
            ) : bundleOffers.length ? (
              <Carousel opts={{ align: 'start', loop: false }} className="w-full">
                <CarouselContent className="-ml-3 pb-1">
                  {bundleOffers.map((bundle) => (
                    <CarouselItem key={bundle.id} className="basis-auto pl-3 select-none">
                      <BundleCard
                        bundle={bundle}
                        onPurchase={handlePurchase}
                        isPurchasing={isPurchasing}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {bundleOffers.length > 4 && (
                  <>
                    <CarouselPrevious className="-left-3 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
                    <CarouselNext className="-right-3 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
                  </>
                )}
              </Carousel>
            ) : !isProductsError ? (
              <p className="text-muted-foreground text-center text-sm">No bundles available.</p>
            ) : null}

            {isProductsError && (
              <div className="space-y-3 text-center">
                <p className="text-destructive text-sm">Could not load store products.</p>
                <button
                  type="button"
                  onClick={() => refetchProducts()}
                  className="border-primary text-primary hover:bg-primary/10 rounded-xl border px-4 py-2 text-sm transition"
                >
                  Try again
                </button>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreModal;
