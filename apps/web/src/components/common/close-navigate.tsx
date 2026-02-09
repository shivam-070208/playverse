'use client';

import { Button } from '@workspace/ui/components/button';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { MdClose } from 'react-icons/md';
const CloseNavigate = () => {
  const navigate = useRouter();
  const onCloseClick = useCallback(() => {
    if (typeof window !== 'undefined' && document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer, window.location.origin);
        console.log(referrerUrl);
        if (referrerUrl.origin === window.location.origin) {
          navigate.back();
          return;
        }
      } catch (e) {
        navigate.push('/');
        return;
      }
    }
    navigate.push('/');
  }, [navigate]);
  return (
    <Button variant={'link'} onClick={onCloseClick} className="cursor-pointer">
      <MdClose size={10} />
    </Button>
  );
};

export { CloseNavigate };
