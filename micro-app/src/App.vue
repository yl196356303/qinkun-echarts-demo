<template>
  <div class="map-container">
    <map-chart />
  </div>
</template>

<script>
import MapChart from '@/components/MapChart'
export default {
  name: 'App',
  components: { MapChart }
}
</script>

<style>
  #micro-app {
    height: 100vh;
  }
  .map-container {
    height: 100%;
  }
</style>