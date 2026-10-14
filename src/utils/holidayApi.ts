export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export async function fetchPublicHolidays(year: number = 2026, countryCode: string = 'US'): Promise<PublicHoliday[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
    return getFallbackHolidays(year);
  } catch {
    // Graceful fallback if offline or CORS blocked
    return getFallbackHolidays(year);
  }
}

export function getFallbackHolidays(year: number): PublicHoliday[] {
  return [
    { date: `${year}-01-01`, name: "New Year's Day", localName: "New Year's Day", countryCode: 'US', fixed: true, global: true, counties: null, launchYear: null, types: ['Public'] },
    { date: `${year}-05-25`, name: 'Memorial Day', localName: 'Memorial Day', countryCode: 'US', fixed: false, global: true, counties: null, launchYear: null, types: ['Public'] },
    { date: `${year}-07-04`, name: 'Independence Day', localName: 'Independence Day', countryCode: 'US', fixed: true, global: true, counties: null, launchYear: null, types: ['Public'] },
    { date: `${year}-09-07`, name: 'Labor Day', localName: 'Labor Day', countryCode: 'US', fixed: false, global: true, counties: null, launchYear: null, types: ['Public'] },
    { date: `${year}-11-26`, name: 'Thanksgiving Day', localName: 'Thanksgiving Day', countryCode: 'US', fixed: false, global: true, counties: null, launchYear: null, types: ['Public'] },
    { date: `${year}-12-25`, name: 'Christmas Day', localName: 'Christmas Day', countryCode: 'US', fixed: true, global: true, counties: null, launchYear: null, types: ['Public'] },
  ];
}
