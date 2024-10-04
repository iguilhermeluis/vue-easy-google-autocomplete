<template>
  <div class="autocomplete-box">
    <input
      type="text"
      v-model="query"
      @input="handleInput"
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

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useGooglePlacesAutocomplete } from '../hooks/AutocompleteGoogle';

  type Prediction = {
    description: string;
    place_id: string;
  };

  export default defineComponent({
    name: 'GooglePlacesAutocomplete',
    props: {
      apiKey: {
        type: String,
        required: true,
      },
      predictionOptions: {
        type: Object,
        default: () => ({
          types: ['address'],
          componentRestrictions: { country: 'br' },
        }),
      },
      placeholder: {
        type: String,
        default: 'Enter an address...',
      },
      language: {
        type: String,
        default: 'en',
      },
    },
    emits: ['input', 'place-selected'],
    setup(props, { emit }) {
      const {
        predictions,
        fetchPredictions,
        fetchPlaceDetails,
        resetPredictions,
      } = useGooglePlacesAutocomplete(props.apiKey, {
        debounceTime: 500,
        predictionOptions: props.predictionOptions,
        language: props.language,
      });

      const query = ref<string>('');

      const handleInput = () => {
        fetchPredictions(query.value);
        emit('input', query.value);
      };

      const selectPlace = async (prediction: Prediction) => {
        const { place_id, description } = prediction;
        query.value = description;
        const dataAddress = await fetchPlaceDetails(place_id);
        emit('place-selected', dataAddress);
        resetPredictions();
      };

      return { query, predictions, handleInput, selectPlace };
    },
  });
</script>

<style scoped>
  .autocomplete-box {
    position: relative;
    width: 100%;
    max-width: 320px;
  }

  .autocomplete-box input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .suggestions-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #ccc;
    border-top: none;
    z-index: 1000;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 0;
  }

  .suggestion-item {
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background-color 0.2s ease-in-out;
    font-size: 14px;
  }

  .suggestion-item:hover {
    background-color: #f1f1f1;
  }

  .suggestion-item + .suggestion-item {
    border-top: 1px solid #eee;
  }

  .suggestion-item:active {
    background-color: #e9e9e9;
  }
</style>
