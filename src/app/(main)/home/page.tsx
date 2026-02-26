import { HomePage } from '@/modules/auth/components';
import React, { Suspense } from 'react';
import PageLoader from '@/shared/common/LoadingComponent';

export default function Home() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  );
}