'use client';

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

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

const itemIcon = {
  KEY: <IoKeyOutline className="text-primary size-4" />,
  SWAP: <MdOutlineCameraswitch className="text-primary size-4 rotate-90" />,
  BOOST: <AiOutlineThunderbolt className="text-primary size-4" />,
};

const itemLabel = {
  KEY: 'Key',
  SWAP: 'Trade',
  BOOST: 'Charge',
};

const ResourceValue = ({ loading, value }: { loading: boolean; value: number }) => {
  if (loading) {
    return <Skeleton className="h-3 w-6" />;
  }

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
        className="h-24 w-full rounded-md object-cover"
      />
    );
  }

  return (
    <div className="border-primary/20 bg-background/30 flex h-24 items-center justify-center rounded-md border">
      <span className="text-primary text-3xl font-bold">C</span>
    </div>
  );
};

const BundleItems = ({ items }: { items: StoreProductItem[] }) => {
  if (!items.length) {
    return <p className="text-muted-foreground text-center text-xs">No items listed</p>;
  }

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div
          key={item.type}
          className="bg-background/40 flex items-center justify-between rounded-md px-2 py-1.5 text-xs"
        >
          <span className="flex items-center gap-1.5">
            {itemIcon[item.type]}
            {itemLabel[item.type]}
          </span>
          <span className="font-semibold">x{item.quantity}</span>
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

const StoreModal = () => {
  const { open, setOpen } = useStoreModal();
  const {
    data: storeStats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetStoreStatsQuery(undefined, {
    skip: !open,
  });
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetStoreProductsQuery(
    { page: 1, limit: 10 },
    {
      skip: !open,
    },
  );
  const [purchaseProduct, { isLoading: isPurchasing }] = usePurchaseStoreProductMutation();

  const stats = storeStats?.data;
  const productsLoading = isProductsLoading || isProductsFetching;
  const { coinOffers, bundleOffers } = useMemo(() => {
    const products = productsResponse?.data ?? [];

    return {
      coinOffers: products.filter((product) => product.category === 'COINS'),
      bundleOffers: products.filter((product) => product.category === 'BUNDLES'),
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
                  <ResourceValue loading={isStatsLoading} value={stats?.key ?? 0} />
                </div>
                <div className="my-2 w-px bg-white/10" />
                <div className="flex items-center gap-2 px-3 text-sm text-white/80">
                  <MdOutlineCameraswitch className="text-primary size-4 rotate-90" />
                  <ResourceValue loading={isStatsLoading} value={stats?.swap ?? 0} />
                </div>
                <div className="my-2 w-px bg-white/10" />
                <div className="flex items-center gap-2 px-3 text-sm text-white/80">
                  <AiOutlineThunderbolt className="text-primary size-4" />
                  <ResourceValue loading={isStatsLoading} value={stats?.boost ?? 0} />
                </div>
                <div className="my-2 w-px bg-white/10" />
                <div className="flex items-center gap-2 px-3 text-sm text-white/80">
                  <span className="text-primary text-sm font-bold leading-none">C</span>
                  <ResourceValue loading={isStatsLoading} value={stats?.coins ?? 0} />
                </div>
              </div>
            </div>

            <div />
          </div>
        </DialogHeader>

        <div className="grid scrollbar-thin gap-6 overflow-y-auto p-4 sm:p-6">
          {isStatsError && (
            <div className="border-destructive/30 bg-destructive/10 rounded-md border px-3 py-2 text-center text-sm">
              Could not load your current store balance.
            </div>
          )}

          <section className="space-y-4">
            <div>
              <h3 className="text-center text-2xl font-bold">Coins</h3>
              <p className="text-muted-foreground text-center text-sm">
                Buy coins to participate in flash challenges
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {productsLoading ? (
                <ProductSkeleton count={3} className="h-56 rounded-xl" />
              ) : (
                coinOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border-black-2-600 bg-black-2-800 relative overflow-hidden rounded-xl border p-4"
                  >
                    <div className="flex h-full flex-col justify-between gap-4">
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-medium text-white/70">{offer.title}</p>
                        <h4 className="text-2xl font-semibold">{offer.quantity ?? 0}</h4>
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {offer.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-center py-3">
                        <ProductImage product={offer} />
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePurchase(offer)}
                        disabled={isPurchasing}
                        className="bg-primary/90 text-background hover:bg-primary disabled:bg-primary/60 rounded-md py-2 text-center text-sm font-semibold transition"
                      >
                        {formatMoney(offer.amount, offer.currency)}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!productsLoading && !coinOffers.length && !isProductsError && (
              <p className="text-muted-foreground text-center text-sm">No coin packs available.</p>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="text-center text-2xl font-bold">Bundles</h3>
              <p className="text-muted-foreground text-center text-sm">
                Enjoy packs full with all the items you love
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {productsLoading ? (
                <ProductSkeleton count={6} className="h-52 rounded-xl" />
              ) : (
                bundleOffers.map((bundle) => (
                  <div
                    key={bundle.id}
                    className="border-black-2-600 bg-black-2-800 rounded-xl border p-3"
                  >
                    <div className="text-center">
                      <p className="text-sm font-medium">{bundle.title}</p>
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {bundle.description}
                      </p>
                    </div>

                    <div className="border-primary/20 bg-background/30 mt-3 rounded-lg border p-3">
                      <BundleItems items={bundle.items} />
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePurchase(bundle)}
                      disabled={isPurchasing}
                      className="bg-primary/90 text-background hover:bg-primary disabled:bg-primary/60 mt-3 w-full rounded-md py-2 text-center text-sm font-semibold transition"
                    >
                      {bundle.amount} coin
                    </button>
                  </div>
                ))
              )}
            </div>

            {!productsLoading && !bundleOffers.length && !isProductsError && (
              <p className="text-muted-foreground text-center text-sm">No bundles available.</p>
            )}

            {isProductsError && (
              <div className="space-y-3 text-center">
                <p className="text-destructive text-sm">Could not load store products.</p>
                <button
                  type="button"
                  onClick={() => refetchProducts()}
                  className="border-primary text-primary hover:bg-primary/10 rounded-md border px-4 py-2 text-sm transition"
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
