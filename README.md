# Google Places Autocomplete for Vue 3

A comprehensive Vue 3 library for integrating Google Places Autocomplete with options for both component-based and composition API (hook) usage. This tool allows users to efficiently search and select addresses, offering features like debouncing, language support, and customizable predictions.

## Features

- **Component and Hook Options**: Use via a Vue component or a composition API hook for flexible integration.
- **Easy Integration**: Quickly integrate Google Places API for address autocomplete functionality.
- **Debounced Search**: Optimizes API calls, resulting in more efficient and responsive queries.
- **Multi-language Support**: Configure the API to support various languages.
- **Customizable Predictions**: Tailor the predictions based on types or country restrictions.
- **Event Emission**: Capable of emitting detailed information about selected places, which aids in form processing or data workflows.

## Installation

Install the package with npm:

```bash
npm install vue-easy-google-autocomplete
```

Or using yarn:

```bash
yarn add vue-easy-google-autocomplete
```

## Setup

To use the Google Places API, you need an API key from Google Cloud. Refer to [this guide](https://developers.google.com/maps/documentation/javascript/get-api-key) for obtaining your API key.

## Usage

### Component Usage

Here’s a basic example showcasing how to implement the `GooglePlacesAutocomplete` component in a Vue 3 project:

```vue
<template>
  <div>
    <GooglePlacesAutocomplete
      :apiKey="apiKey"
      placeholder="Enter an address..."
      language="en"
      @place-selected="handlePlaceSelected"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { GooglePlacesAutocomplete } from 'vue-easy-google-autocomplete';

  export default defineComponent({
    components: {
      GooglePlacesAutocomplete,
    },
    data() {
      return {
        apiKey: 'YOUR_GOOGLE_API_KEY',
      };
    },
    methods: {
      handlePlaceSelected(placeDetails) {
        console.log('Selected place details:', placeDetails);
      },
    },
  });
</script>
```

### Hook Usage

Alternatively, use the hook `useGooglePlacesAutocomplete` for more granular control:

```vue
<template>
  <div class="autocomplete-box">
    <input
      type="text"
      v-model="query"
      @input="fetchPredictions(query)"
      :placeholder="placeholder"
    />
    <ul v-if="predictions.length" class="suggestions-list">
      <li
        v-for="prediction in predictions"
        :key="prediction.place_id"
        @click="selectPlace(prediction)"
        class="suggestion-item"
      >
        {{ prediction.description }}
      </li>
    </ul>
  </div>
</template>

<script>
  import { ref, defineComponent } from 'vue';
  import { useGooglePlacesAutocomplete } from 'vue-easy-google-autocomplete';

  export default defineComponent({
    setup() {
      const apiKey = 'YOUR_GOOGLE_API_KEY';
      const {
        predictions,
        fetchPredictions,
        fetchPlaceDetails,
        resetPredictions,
      } = useGooglePlacesAutocomplete(apiKey, {
        debounceTime: 500,
        predictionOptions: {
          types: ['address'],
          componentRestrictions: { country: 'br' },
        },
        language: 'en',
      });

      const query = ref('');

      const selectPlace = async (prediction) => {
        query.value = prediction.description;
        const placeDetails = await fetchPlaceDetails(prediction.place_id);
        console.log('Selected place details:', placeDetails);
        resetPredictions();
      };

      return { query, predictions, fetchPredictions, selectPlace };
    },
  });
</script>
```

### Props

- `apiKey` (required): Your Google Places API key.
- `placeholder` (optional, default: `"Enter an address..."`): Placeholder text for the input field.
- `language` (optional, default: `"en"`): Language code for Google Places API localization (e.g., `"pt-BR"` for Brazilian Portuguese).
- `predictionOptions` (optional): Additional options to refine predictions, such as types or country restrictions.

### Hook Options

- `debounceTime`: Milliseconds to debounce input queries.
- `predictionOptions`: Options for the Google Places autocomplete query.
- `libraries`: Libraries to load alongside the Google Maps API, default is `['places']`.
- `language`: Language for the API, default is `'en'`.

### Events

- `place-selected`: Triggered upon selecting an address, providing detailed place information.

### Example with Options

Customizing the autocomplete service:

```vue
<template>
  <GooglePlacesAutocomplete
    :apiKey="apiKey"
    language="pt-BR"
    :predictionOptions="{
      types: ['address'],
      componentRestrictions: { country: 'br' },
    }"
    @place-selected="handlePlaceSelected"
  />
</template>
```

### Debounce Support

Input is debounced by default at 300ms, adjustable with `debounceTime`:

```vue
<template>
  <GooglePlacesAutocomplete
    :apiKey="apiKey"
    :debounceTime="500" // Custom debounce time
    @place-selected="handlePlaceSelected"
  />
</template>
```

## API Key Restrictions

To enhance security, restrict your API key usage to specific referrer URLs within the Google Cloud Console settings.

### Contributing ✨

Contributions to the JSnapCam are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<table>
  <tr>
   <td align="center">
        <a href="https://github.com/iguilhermeluis">
        <img src="https://avatars.githubusercontent.com/u/26286830?v=3?s=100" width="100px;" alt=""/><br />
        <sub><b>Guilherme L. Faustino</b></sub></a><br />
        <a href="https://github.com/iguilhermeluis/jsnapcam/commits?author=iguilhermeluis" title="Code">💻</a>
        <a href="https://github.com/iguilhermeluis/jsnapcam/commits?author=iguilhermeluis" title="Documentation">📖</a>  
        <a href="https://github.com/iguilhermeluis/jsnapcam/commits?author=iguilhermeluis" title="Tests">⚠️</a>  
   </td> 
  </tr>
</table>

## Development

To contribute or modify the library, follow these steps for local setup:

1. Clone the repository:

   ```bash
   git clone https://github.com/iguilhermeluis/vue-easy-google-autocomplete.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License, promoting open-source use and contribution.
