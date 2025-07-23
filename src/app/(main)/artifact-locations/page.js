'use client';

import ArtifactLocationsPage from '@/components/layout/artifactlocations/ArtifactLocationPage';
import { message } from 'antd';
import { Suspense } from 'react';

export default function ArtifactLocationPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArtifactLocationsPage />
    </Suspense>
  );
}
