import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useSessionTimeout() {
  const router = useRouter();

  useEffect(() => {
    const handleSessionTimeout = (event: MessageEvent) => {
      if (event.data?.type === 'SESSION_TIMEOUT') {
        toast("Session expired. Please login again.");
        router.push('/sign-in');
      }
    };

    window.addEventListener('message', handleSessionTimeout);
    return () => window.removeEventListener('message', handleSessionTimeout);
  }, [router]);
} 