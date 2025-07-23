'use client';

import TicketPage from '@/components/layout/tickets/TicketPage';
import { message } from 'antd';
import { Suspense } from 'react';

export default function ArtifactPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketPage />
    </Suspense>
  );
}
