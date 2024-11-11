import { ROUTES_VARIABLES } from '@/config/constants/route-variables';
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect(ROUTES_VARIABLES.AUTH);
}