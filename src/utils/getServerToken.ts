export const getServerToken = async () => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value;
  } catch (error) {
    return null;
  }
};
