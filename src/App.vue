<script setup lang="ts">
  import AutocompleteGoogle from './components/AutocompleteGoogle.vue';
</script>

<template>
  <div class="container">
    <AutocompleteGoogle apiKey="YOUR_API_KEY" />
  </div>
</template>

<style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
</style>
