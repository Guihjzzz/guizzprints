'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getClientAdminAuthToken } from '@/lib/client-auth';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { locale } = useParams();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getClientAdminAuthToken();
      
      if (!token) {
        router.push(`/${locale}/login`);
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return <>{children}</>;
}
