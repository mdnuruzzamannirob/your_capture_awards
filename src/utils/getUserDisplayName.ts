type UserNameFields = {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email?: string | null;
};

export const getUserDisplayName = (user?: UserNameFields | null, fallback = 'Unknown') => {
  if (!user) return fallback;

  const firstLastName = [user.firstName, user.lastName]
    .map((name) => name?.trim())
    .filter(Boolean)
    .join(' ');

  return firstLastName || user.fullName || user.username || user.email || fallback;
};
