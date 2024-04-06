<template>
   <main>
    <l-map ref="map" v-model:zoom="zoom" v-model:center="center" :useGlobalLeaflet="false">
      <l-tile-layer 
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="Stadia Maps Basemap">
      </l-tile-layer>
      <l-marker :lat-lng="[38, 139.69]">
        <l-marker class="w-max" v-for="nation in populatedNations" :key="nation.name" :lat-lng="[nation.position.lat, nation.position.lng]">
          <l-popup>
            <section>
              <div class="flex items-center gap-2 mb-4">
                <p>{{ nation.flag }}</p>
                <h1 class="text-lg font-semibold">{{ nation.name }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Status:</p>
                <h1 
                  :class="nation.status === 'War' ? 'text-red-500' : nation.status === 'Peace' ? 'text-green-500' : 'text-yellow-500'"
                  class="font-semibold"
                >
                  {{ nation.status }}
                </h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Alliances:</p>
                <h1 class="font-semibold">{{ nation.alliances ? nation.alliances.join(', ') : 'Neutral' }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Population:</p>
                <h1 class="font-semibold">{{ nation.population ? formatNumber(nation.population) : 0 }}</h1>
              </div>
            </section>
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

import { enrichNationsWithConflicts, formatNumber } from '@/utils/utils.js';
import { nations } from '@/data/nations.js';
import { conflicts } from '@/data/conflicts.js';

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
