type CategorySource = {
  categories?: unknown;
  category?: unknown;
};

// Contests can have several categories. Older contests only carry the single
// legacy `category` string, so fall back to it when `categories` is empty.
export const getContestCategories = (contest?: CategorySource | null): string[] => {
  if (!contest) return [];
  const categories = Array.isArray(contest.categories)
    ? contest.categories
        .filter((category): category is string => typeof category === 'string')
        .map((category) => category.trim())
        .filter(Boolean)
    : [];
  if (categories.length) return categories;

  return typeof contest.category === 'string' && contest.category.trim()
    ? [contest.category.trim()]
    : [];
};
