export const getServerToken = async () => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value;
  } catch (error) {
    console.warn('Attempted to get server cookies outside of Server Component context.');
    return undefined;
  }
};
