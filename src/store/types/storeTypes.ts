export type StoreItemType = 'BOOST' | 'SWAP' | 'KEY';

export type StoreCategory = 'COINS' | 'BUNDLES';

export type StoreCurrency = 'USD' | 'COINS';

export type StoreStats = {
  id: string;
  key: number;
  boost: number;
  swap: number;
  coins: number;
};

export type StoreProductItem = {
  type: StoreItemType;
  quantity: number;
};

export type StoreProduct = {
  id: string;
  title: string;
  category: StoreCategory;
  quantity: number | null;
  amount: number;
  currency: StoreCurrency;
  icon: string | null;
  description: string;
  image: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  items: StoreProductItem[];
  createdAt: string;
  updatedAt: string;
};

export type StoreProductsResponse = {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: StoreProduct[];
};

export type StoreStatsResponse = {
  success: boolean;
  message: string;
  data: StoreStats;
};

export type PurchaseStoreProductResponse = {
  success: boolean;
  message: string;
  data: {
    message?: string;
    url?: string;
    [key: string]: unknown;
  };
};
