'use client';

import ArtifactsPage from '@/components/layout/artifacts/ArtifactPage';
import { message } from 'antd';
import { Suspense } from 'react';

export default function ArtifactPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArtifactsPage />
    </Suspense>
  );
}
