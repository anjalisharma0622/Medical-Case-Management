<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HolidayService
{
    /**
     * Retrieve upcoming or current public holidays from Nager.Date API.
     * Uses environment configuration, strict timeout, and graceful degradation.
     *
     * @param string $countryCode ISO 2-letter country code (default 'US')
     * @param int|null $year
     * @return array
     */
    public function getHolidays(string $countryCode = 'US', ?int $year = null): array
    {
        $year = $year ?? (int) date('Y');
        $baseUrl = config('services.nager_date.url', env('NAGER_DATE_API_URL', 'https://date.nager.at/api/v3'));
        $timeout = (int) config('services.nager_date.timeout', env('NAGER_DATE_API_TIMEOUT', 3));

        try {
            $response = Http::timeout($timeout)
                ->acceptJson()
                ->get("{$baseUrl}/PublicHolidays/{$year}/{$countryCode}");

            if ($response->successful()) {
                return $response->json();
            }

            Log::warning("Nager.Date API returned non-200 status: {$response->status()}");
            return [];
        } catch (\Throwable $e) {
            // Graceful failure fallback: Log exception but do not break page rendering
            Log::info("Could not fetch holidays from Nager.Date API: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Check if a given date string is a public holiday.
     */
    public function isHoliday(?string $dateString, string $countryCode = 'US'): ?array
    {
        if (!$dateString) {
            return null;
        }

        $year = (int) date('Y', strtotime($dateString));
        $holidays = $this->getHolidays($countryCode, $year);

        foreach ($holidays as $holiday) {
            if (isset($holiday['date']) && $holiday['date'] === $dateString) {
                return $holiday;
            }
        }

        return null;
    }
}
