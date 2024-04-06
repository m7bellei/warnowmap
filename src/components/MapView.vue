<template>
   <main>
    <l-map
      ref="mapRef"
      v-model:zoom="zoom"
      v-model:center="center"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
      :max-bounds="worldBounds"
      @moveend="onMoveEnd"
      :useGlobalLeaflet="false"
    >
      <l-tile-layer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap Basemap">
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
                <p class="text-gray-600">Area:</p>
                <h1 class="font-semibold">{{ nation.area ? formatNumber(nation.area) : 0 }} km²</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Population:</p>
                <h1 class="font-semibold">{{ nation.population ? formatNumber(nation.population) : 0 }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Soldiers:</p>
                <h1 class="font-semibold">{{ nation.soldiers ? formatNumber(nation.soldiers) : 0 }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Tanks:</p>
                <h1 class="font-semibold">{{ nation.tanks ? formatNumber(nation.tanks) : 0 }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Helicopters:</p>
                <h1 class="font-semibold">{{ nation.helicopters ? formatNumber(nation.helicopters) : 0 }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Aircrafts:</p>
                <h1 class="font-semibold">{{ nation.aircrafts ? formatNumber(nation.aircrafts) : 0 }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Ships:</p>
                <h1 class="font-semibold">{{ nation.ships ? formatNumber(nation.ships) : 0 }}</h1>
              </div>
              <div v-if="nation.current_war_countries.length > 0" class="flex items-center gap-2">
                <strong class="text-red-500">Wars:</strong>
                <ul class="font-semibold">
                  <li v-for="country in nation.current_war_countries" :key="`war-${country}`">{{ country }}</li>
                </ul>
              </div>
              <div v-if="nation.current_tension_countries.length > 0" class="flex items-center gap-2">
                <strong class="text-yellow-500">Tensions:</strong>
                <ul class="font-semibold">
                  <li v-for="country in nation.current_tension_countries" :key="`tension-${country}`">{{ country }}</li>
                </ul>
              </div>
            </section>
          </l-popup>
        </l-marker>
      </l-marker>
      <template v-for="nation in populatedNations">
        <l-marker v-for="war in nation.current_wars" :key="`war-${war.name}`"  :lat-lng="war.position" :icon="isConflictActiveToday(war) ? warIcon : pauseIcon">
          <l-popup>
            <section>
              <h1 class="font-semibold text-red-500">{{ war.type }}</h1>
              <h1 class="text-lg font-semibold">{{ war.name }}</h1>
              <div>
                <div class="flex justify-center items-center">
                  <h1 class="font-semibold">{{ war.country_team1 ? war.country_team1.join(', ') : '-' }}</h1>
                </div>
                <div class="flex justify-center items-center">
                  <img class="w-16 h-16" src="/icons/war.svg" alt="War" />
                </div>
                <div class="flex justify-center items-center">
                  <h1 class="font-semibold">{{ war.country_team2 ? war.country_team2.join(', ') : '-' }}</h1>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Status:</p>
                <h1 class="font-semibold">{{ isConflictActiveToday(war) ? 'Active' : 'Inactive' }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Date:</p>
                <h1 class="font-semibold">{{ war.date }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Deaths:</p>
                <h1 class="font-semibold">{{ war.deaths }}</h1>
              </div>
              <p class="text-gray-600 text-sm">{{ war.description }}</p>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">See more on:</p>
                <a :href="war.url" target="_blank" class="font-semibold text-blue-500 cursor-pointer hover:underline hover:text-blue-900">Reference</a>
              </div>
            </section>
          </l-popup>
        </l-marker>
        <l-marker v-for="tension in nation.current_tensions" :key="`tension-${tension.name}`" :lat-lng="tension.position" :icon="isConflictActiveToday(tension) ? tensionIcon : pauseIcon">
          <l-popup v-if="isConflictActiveToday(tension)" >
            <section>
              <h1 class="font-semibold text-yellow-500">{{ tension.type }}</h1>
              <h1 class="text-lg font-semibold">{{ tension.name }}</h1>
              <div>
                <div class="flex justify-center items-center">
                  <h1 class="font-semibold">{{ tension.country_team1 ? tension.country_team1.join(', ') : '-' }}</h1>
                </div>
                <div class="flex justify-center items-center">
                  <img class="w-16 h-16" src="/icons/tension-black.svg" alt="Tension" />
                </div>
                <div class="flex justify-center items-center">
                  <h1 class="font-semibold">{{ tension.country_team2 ? tension.country_team2.join(', ') : '-' }}</h1>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Status:</p>
                <h1 class="font-semibold">{{ isConflictActiveToday(tension) ? 'Active' : 'Inactive' }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Date:</p>
                <h1 class="font-semibold">{{ tension.date }}</h1>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">Deaths:</p>
                <h1 class="font-semibold">{{ tension.deaths }}</h1>
              </div>
              <p class="text-gray-600 text-sm">{{ tension.description }}</p>
              <div class="flex items-center gap-2">
                <p class="text-gray-600">See more on:</p>
                <a :href="tension.url" target="_blank" class="font-semibold text-blue-500 cursor-pointer hover:underline hover:text-blue-900">Reference</a>
              </div>
            </section>
          </l-popup>
        </l-marker>
      </template>
    </l-map>
  </main>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LPopup} from "@vue-leaflet/vue-leaflet"
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ref } from 'vue'

import { enrichNationsWithConflicts, formatNumber, isConflictActiveToday } from '@/utils/utils.js';
import { nations } from '@/data/nations.js';
import { conflicts } from '@/data/conflicts.js';

const warIcon = L.icon({
  iconUrl: 'icons/war.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const pauseIcon = L.icon({
  iconUrl: 'icons/stop.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const tensionIcon = L.icon({
  iconUrl: 'icons/tension.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const zoom = ref(2); // Valor inicial do zoom
const center = ref([51.505, -0.09]); // Centro inicial do mapa (por exemplo, Londres)
const minZoom = ref(2); // Zoom mínimo para evitar que o mapa fique muito pequeno
const maxZoom = ref(18); // Zoom máximo para evitar que o mapa fique muito detalhado
// Define os limites máximos para onde o usuário pode navegar
const worldBounds = ref([
  [-90, -180],
  [90, 180]
]);

function onMoveEnd() {
  const map = mapRef.value.mapObject; // Obtém o objeto do mapa Leaflet
  const bounds = worldBounds.value; // Seus limites máximos definidos anteriormente

  // Verifica se a posição atual está fora dos limites
  if (!map.getBounds().intersects(bounds)) {
    // Reajusta a visão do mapa para os limites definidos
    map.flyToBounds(bounds, { duration: 0.5 });
  }
}

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
