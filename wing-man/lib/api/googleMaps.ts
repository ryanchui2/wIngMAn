export interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export async function searchPlaces(
  query: string,
  location: { lat: number; lng: number }
): Promise<PlaceResult[]> {
  // This will be called client-side with the Google Maps JavaScript API
  // Server-side implementation would require the Places API
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  // Note: This is a placeholder. Actual implementation should use
  // the Google Maps JavaScript API on the client side or
  // the Places API (Text Search) on the server side
  return [];
}

export function getMapUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}
