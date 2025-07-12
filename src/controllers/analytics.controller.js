import { NextResponse } from 'next/server';
import { fetchPopularArtifacts, fetchScansByDate, getAnalyticsOverview, fetchLanguageStats, fetchHourlyScans } from '@/services/analytics.service.js';

export async function handleAnalyticsOverview() {
    const data = await getAnalyticsOverview();
    return NextResponse.json(data);
}

export async function handleScansByDate() {
  const data = await fetchScansByDate();
  return NextResponse.json(data);
}

export async function handlePopularArtifacts() {
  const data = await fetchPopularArtifacts();
  return NextResponse.json(data);
}

export async function handleLanguageStats() {
  const data = await fetchLanguageStats();
  return NextResponse.json(data);
}

export async function handleHourlyScans() {
  const data = await fetchHourlyScans();
  return NextResponse.json(data);
}