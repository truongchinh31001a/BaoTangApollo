'use client';

import MapZonesPage from '@/components/layout/mapzones/MapZonePage';
import { message } from 'antd';
import { Suspense } from 'react';

export default function MapZonePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MapZonesPage />
    </Suspense>
  );
}
