import {
    countTotalScans,
    countScansPerDay,
    countPopularArtifacts,
    countScansByLanguage,
    getScansByDate,
    getMostScannedArtifacts,
    getLanguageUsageStats,
    getHourlyScanDistribution
} from '@/models/analytics.model.js';

export async function getAnalyticsOverview() {
    const total = await countTotalScans();
    const daily = await countScansPerDay();
    const popular = await countPopularArtifacts();
    const byLang = await countScansByLanguage();
    return { total, daily, popular, byLang };
}

export async function fetchScansByDate() {
    return await getScansByDate();
}

export async function fetchPopularArtifacts() {
    return await getMostScannedArtifacts();
}

export async function fetchLanguageStats() {
    return await getLanguageUsageStats();
}

export async function fetchHourlyScans() {
    return await getHourlyScanDistribution();
}