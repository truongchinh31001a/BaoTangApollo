'use client';

import StoriesPage from '@/components/layout/stories/StoryPage';
import { message } from 'antd';
import { Suspense } from 'react';

export default function StoriesPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoriesPage />
    </Suspense>
  );
}
