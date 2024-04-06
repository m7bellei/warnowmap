<template>
   <main>
    <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :useGlobalLeaflet="false">
      <l-tile-layer 
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="Stadia Maps Basemap">
      </l-tile-layer>
      <l-marker :lat-lng="[38, 139.69]">
        <l-popup>Um marcador interessante!</l-popup>
      </l-marker>
    </l-map>
  </main>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"
import 'leaflet/dist/leaflet.css';
import { ref } from 'vue'

let zoom = ref(6)
let center = ref([38, 139.69])

</script>

<style scoped>
  html, body {
    margin: 0;
    padding: 0;
  }

  main {
    height: 100vh;
    width: 100vw;
  }
</style>
