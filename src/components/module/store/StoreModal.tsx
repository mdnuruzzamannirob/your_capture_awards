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
  KEY: <IoKeyOutline className="text-primary size-3.5" />,
  SWAP: <MdOutlineCameraswitch className="text-primary size-3.5 rotate-90" />,
  BOOST: <AiOutlineThunderbolt className="text-primary size-3.5" />,
};

const itemLabel = {
  KEY: 'Key',
  SWAP: 'Trade',
  BOOST: 'Charge',
};

const itemGradient = {
  KEY: 'from-yellow-500/15 to-amber-500/5',
  SWAP: 'from-blue-500/15 to-cyan-500/5',
  BOOST: 'from-purple-500/15 to-violet-500/5',
};

const ResourceValue = ({ loading, value }: { loading: boolean; value: number }) => {
  if (loading) return <Skeleton className="h-3 w-6" />;
  return <span>{value}</span>;
};

const ProductImage = ({ product }: { product: StoreProduct }) => {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.title}
        width={160}
        height={120}
        className="h-28 w-full rounded-xl object-cover"
      />
    );
  }
  return (
    <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl">
      <div className="from-primary/20 via-primary/5 absolute inset-0 bg-linear-to-br to-transparent" />
      <div className="bg-primary/10 ring-primary/30 relative flex h-14 w-14 items-center justify-center rounded-full ring-1 ring-offset-1 ring-offset-transparent">
        <span className="text-primary text-3xl leading-none font-semibold">C</span>
      </div>
    </div>
  );
};

const BundleItems = ({ items }: { items: StoreProductItem[] }) => {
  if (!items.length) {
    return <p className="text-muted-foreground text-center text-xs">No items listed</p>;
  }
  return (
    <div className="grid gap-1.5">
      {items.map((item) => (
        <div
          key={item.type}
          className={`bg-linear-to-r ${itemGradient[item.type]} flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs ring-1 ring-white/5`}
        >
          <span className="flex items-center gap-1.5 font-medium text-white/80">
            {itemIcon[item.type]}
            {itemLabel[item.type]}
          </span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white">
            ×{item.quantity}
          </span>
        </div>
      ))}
    </div>
  );
};

const ProductSkeleton = ({ count, className }: { count: number; className: string }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} className={className} />
    ))}
  </>
);

/* ─── Coin Card ──────────────────────────────────────────────────── */
const CoinCard = ({
  offer,
  onPurchase,
  isPurchasing,
}: {
  offer: StoreProduct;
  onPurchase: (offer: StoreProduct) => void;
  isPurchasing: boolean;
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-b from-white/[0.07] to-white/2 p-1 transition-transform duration-300">
    {/* Glowing top border */}
    <div className="via-primary/60 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    <div className="relative rounded-xl bg-linear-to-b from-white/4 to-transparent p-4">
      <div className="flex flex-col gap-4">
        {/* Image */}
        <div className="relative overflow-hidden rounded-xl">
          <ProductImage product={offer} />
          {/* Shine sweep on hover */}
          <div className="absolute inset-0 -translate-x-full rounded-xl bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </div>

        {/* Info */}
        <div className="space-y-1 text-center">
          <p className="text-xs font-medium tracking-widest text-white/40 uppercase">
            {offer.title}
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-primary text-sm leading-none font-semibold">C</span>
            <span className="text-3xl font-semibold text-white">{offer.quantity ?? 0}</span>
          </div>
          {offer.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {offer.description}
            </p>
          )}
        </div>

        {/* Buy button */}
        <button
          type="button"
          onClick={() => onPurchase(offer)}
          disabled={isPurchasing}
          className="bg-primary/90 text-background hover:bg-primary relative overflow-hidden rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] disabled:opacity-50"
        >
          {formatMoney(offer.amount, offer.currency)}
        </button>
      </div>
    </div>
  </div>
);

/* ─── Bundle Card ────────────────────────────────────────────────── */
const BundleCard = ({
  bundle,
  onPurchase,
  isPurchasing,
}: {
  bundle: StoreProduct;
  onPurchase: (bundle: StoreProduct) => void;
  isPurchasing: boolean;
}) => (
  <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-linear-to-b from-white/[0.07] to-white/2 p-1 transition-transform duration-300">
    <div className="via-primary/50 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    <div className="relative flex flex-1 flex-col rounded-xl bg-linear-to-b from-white/4 to-transparent p-3.5">
      {/* Title */}
      <div className="mb-3 text-center">
        <p className="text-sm font-semibold tracking-wide text-white">{bundle.title}</p>
        {bundle.description && (
          <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-snug">
            {bundle.description}
          </p>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 rounded-xl border border-white/6 bg-black/20 p-2.5">
        <BundleItems items={bundle.items} />
      </div>

      {/* Buy button */}
      <button
        type="button"
        onClick={() => onPurchase(bundle)}
        disabled={isPurchasing}
        className="bg-primary/90 text-background hover:bg-primary mt-3 w-full overflow-hidden rounded-xl py-2 text-center text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_18px_rgba(var(--primary-rgb),0.35)] disabled:opacity-50"
      >
        <span className="flex items-center justify-center gap-1">
          <span className="text-background/70 text-xs leading-none font-semibold">C</span>
          {bundle.amount} coin
        </span>
      </button>
    </div>
  </div>
);

/* ─── Main Modal ─────────────────────────────────────────────────── */
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
        className="border-black-2-600 bg-background gap-0 flex max-h-[95vh] max-w-[95vw] flex-col overflow-hidden border-2 p-0 sm:max-w-4xl"
      >
        {/* Header */}
        <DialogHeader className="border-b border-white/5 px-5 py-4 sm:px-6">
          <div className="grid grid-cols-3 items-center gap-3">
            <div className="text-left">
              <DialogTitle className="text-lg font-semibold tracking-wide">Store</DialogTitle>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex h-10 items-stretch overflow-hidden rounded-xl border border-white/8 bg-white/5 backdrop-blur-sm">
                {[
                  {
                    icon: <IoKeyOutline className="text-primary size-4" />,
                    value: stats?.key ?? 0,
                  },
                  {
                    icon: <MdOutlineCameraswitch className="text-primary size-4 rotate-90" />,
                    value: stats?.swap ?? 0,
                  },
                  {
                    icon: <AiOutlineThunderbolt className="text-primary size-4" />,
                    value: stats?.boost ?? 0,
                  },
                  {
                    icon: <span className="text-primary text-sm leading-none font-semibold">C</span>,
                    value: stats?.coins ?? 0,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    {i > 0 && <div className="my-2 w-px bg-white/8" />}
                    <div className="flex items-center gap-1.5 px-3 text-sm text-white/80">
                      {item.icon}
                      <ResourceValue loading={isStatsLoading} value={item.value} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div />
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="grid scrollbar-thin gap-8 overflow-y-auto p-4 sm:p-6">
          {isStatsError && (
            <div className="border-destructive/30 bg-destructive/10 rounded-xl border px-3 py-2 text-center text-sm">
              Could not load your current store balance.
            </div>
          )}

          {/* ── Coins Section ── */}
          <section className="space-y-4">
            <div>
              <h3 className="text-center text-2xl font-semibold tracking-tight">Coins</h3>
              <p className="text-muted-foreground text-center text-sm">
                Buy coins to participate in flash challenges
              </p>
            </div>

            {productsLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                <ProductSkeleton count={3} className="h-64 rounded-2xl" />
              </div>
            ) : coinOffers.length ? (
              <Carousel opts={{ align: 'start', loop: false }} className="w-full">
                <CarouselContent className="-ml-3">
                  {coinOffers.map((offer) => (
                    <CarouselItem key={offer.id} className="pl-3 sm:basis-1/2 md:basis-1/3 select-none">
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
                    <CarouselPrevious className="left-0 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
                    <CarouselNext className="right-0 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
                  </>
                )}
              </Carousel>
            ) : !isProductsError ? (
              <p className="text-muted-foreground text-center text-sm">No coin packs available.</p>
            ) : null}
          </section>

          {/* ── Bundles Section ── */}
          <section className="space-y-4">
            <div>
              <h3 className="text-center text-2xl font-semibold tracking-tight">Bundles</h3>
              <p className="text-muted-foreground text-center text-sm">
                Enjoy packs full with all the items you love
              </p>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                <ProductSkeleton count={6} className="h-52 rounded-2xl" />
              </div>
            ) : bundleOffers.length ? (
              <Carousel opts={{ align: 'start', loop: false }} className="w-full">
                <CarouselContent className="-ml-3">
                  {bundleOffers.map((bundle) => (
                    <CarouselItem
                      key={bundle.id}
                      className="pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 select-none"
                    >
                      <BundleCard
                        bundle={bundle}
                        onPurchase={handlePurchase}
                        isPurchasing={isPurchasing}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {bundleOffers.length > 6 && (
                  <>
                    <CarouselPrevious className="left-0 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
                    <CarouselNext className="right-0 border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" />
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
