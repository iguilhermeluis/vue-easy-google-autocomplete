import { ref, onMounted } from 'vue';
import { debounce } from '../utils/debounce';

interface Prediction {
  description: string;
  place_id: string;
}

/**
 * Loads the Google Maps API script dynamically.
 *
 * @param apiKey - The API key for Google Maps.
 * @param libraries - Array of libraries to load (e.g., ['places', 'geometry']).
 * @param language - The language for the API (e.g., 'pt-BR', 'en').
 * @returns A promise that resolves when the script is loaded.
 */
function loadGoogleMapsApi(
  apiKey: string,
  libraries: string[],
  language: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (googleMapsApiLoaded) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&language=${language}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      googleMapsApiLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));

    document.head.appendChild(script);
  });
}

// Global state to track if the Google Maps API has been loaded.
let googleMapsApiLoaded = false;

/**
 * Options to configure the Google Places autocomplete hook.
 */
interface AutocompleteOptions {
  /** Time in milliseconds to debounce the input. */
  debounceTime?: number;
  /** Additional options for the Google Places autocomplete request. */
  predictionOptions?: Partial<google.maps.places.AutocompletionRequest>;
  /** Libraries to load with the Google Maps API. Default is ['places']. */
  libraries?: string[];
  /** Language for Google Places API. Default is 'en'. */
  language?: string;
}

/**
 * A Vue composition hook to use Google Places Autocomplete.
 *
 * @param apiKey - The API key for Google Maps.
 * @param options - Configuration options for debounce time, prediction options, and libraries.
 * @returns An object containing predictions, search methods, and loading state.
 */
export function useGooglePlacesAutocomplete(
  apiKey: string,
  options: AutocompleteOptions = {}
) {
  const predictions = ref<Prediction[]>([]);
  const loading = ref(false);
  const isGoogleMapsApiLoaded = ref(false);
  const addressInfo = ref<google.maps.GeocoderResult | null>(null);

  const debounceTime = options.debounceTime || 300;
  const predictionOptions = options.predictionOptions || {};
  const libraries = options.libraries || ['places'];
  const language = options.language || 'en';

  /**
   * Fetches predictions for the given input using Google Places Autocomplete.
   *
   * @param input - The text input to search for place predictions.
   */
  const fetchPredictions = debounce(async (input: string) => {
    if (!isGoogleMapsApiLoaded.value || !input) return;

    loading.value = true;
    const autocompleteService = new google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      { input, ...predictionOptions },
      (results: Prediction[] | null) => {
        predictions.value = results ?? [];
        loading.value = false;
      }
    );
  }, debounceTime);

  /**
   * Fetches detailed information about a place based on its place ID.
   *
   * @param placeId - The unique ID of the place.
   * @returns A promise that resolves with the place details or null.
   */
  const fetchPlaceDetails = async (placeId: string) => {
    if (!isGoogleMapsApiLoaded.value) return;

    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    return new Promise<google.maps.places.PlaceResult | null>(
      (resolve, reject) => {
        placesService.getDetails({ placeId }, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve(place);
          } else {
            reject(new Error('Place details not found'));
          }
        });
      }
    );
  };

  /**
   * Clears the current predictions list.
   */
  const resetPredictions = () => {
    predictions.value = [];
  };

  /**
   * Loads the Google Maps API script on component mount.
   */
  onMounted(async () => {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      isGoogleMapsApiLoaded.value = true;
    } else {
      try {
        await loadGoogleMapsApi(apiKey, libraries, language);
        isGoogleMapsApiLoaded.value = true;
      } catch (error) {
        console.error('Error loading Google Maps API:', error);
      }
    }
  });

  return {
    predictions,
    addressInfo,
    fetchPredictions,
    fetchPlaceDetails,
    loading,
    resetPredictions,
  };
}
