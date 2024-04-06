<template>
   <main>
    <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :useGlobalLeaflet="false">
      <l-tile-layer 
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="Stadia Maps Basemap">
      </l-tile-layer>
      <l-marker :lat-lng="[38, 139.69]">
        <l-marker v-for="nation in populatedNations" :key="nation.name" :lat-lng="[nation.position.lat, nation.position.lng]">
          <l-popup>
            {{ nation.name }}
          </l-popup>
        </l-marker>
      </l-marker>
    </l-map>
  </main>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"
import 'leaflet/dist/leaflet.css';
import { ref } from 'vue'

import { enrichNationsWithConflicts } from '@/utils/utils.js';
import { nations } from '@/constants/nations.js';
import { conflicts } from '@/constants/conflicts.js';

let zoom = ref(6)
let center = ref([38, 139.69])

let populatedNations = ref(enrichNationsWithConflicts(nations, conflicts));
console.log(populatedNations.value);

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
