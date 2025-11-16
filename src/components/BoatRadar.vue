<template>
  <div class="boat-radar">
    <div class="mb-2 d-flex gap-2 align-items-center">

      <button class="btn btn-sm btn-primary" @click="addRandomBoat">Add Boat</button>
      <button class="btn btn-sm btn-secondary" @click="clearBoats">Clear</button>

      <!-- Tide controls -->
      <div class="ms-4">
        <label class="fw-bold me-1">Tide Level:</label>
        <select v-model="tide" class="form-select form-select-sm w-auto d-inline-block" @change="applyTidePreset">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <!-- <div class="ms-3 d-flex align-items-center">
        <label class="fw-bold me-2">Tide Height:</label>
        <input type="range" class="form-range" min="0" max="4" step="0.1"
               v-model="tideMeters" style="width: 120px" />
        <span class="ms-2">{{ tideMeters.toFixed(1) }} m</span>
      </div> -->

      <!-- 🌍 MAP SELECTOR -->
      <div class="ms-4 d-flex align-items-center">
        <label class="fw-bold me-1">Map:</label>
        <select v-model="mapStyle" class="form-select form-select-sm w-auto">
          <option value="marine">Marine Chart</option>
          <option value="satellite">Satellite</option>
          <option value="terrain">Terrain</option>
          <option value="dark">Dark Ocean</option>
        </select>
      </div>
    </div>

    <!-- Radar -->
    <svg :width="svgSize" :height="svgSize" class="border rounded radar-svg">

      <!-- MAP CLIP SHAPE -->
      <defs>
        <clipPath id="radarClip">
          <circle :cx="center" :cy="center" :r="center" />
        </clipPath>
      </defs>

      <!-- 🌍 BACKGROUND MAP -->
      <image
        :href="currentMap"
        :width="svgSize"
        :height="svgSize"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#radarClip)"
        class="map-image"
      />

      <!-- Radar border -->
      <circle :cx="center" :cy="center" :r="center"
              fill="none" stroke="#0b3d1a" stroke-width="3" />

      <!-- Grid rings -->
      <circle v-for="r in [60, 90, 120, 150]" :key="r"
              :cx="center" :cy="center" :r="r"
              stroke="rgba(0,255,0,0.15)" fill="none" stroke-width="1" />

      <!-- Dynamic shallow tide zone -->
      <circle
        :cx="center"
        :cy="center"
        :r="shallowZoneRadius"
        fill="rgba(255,165,0,0.15)"
        stroke="rgba(255,165,0,0.5)"
        stroke-width="2"
      />

      <!-- Cross ticks -->
      <line :x1="center" :y1="0" :x2="center" :y2="20" stroke="rgba(0,255,0,0.2)" />
      <line :x1="center" :y1="svgSize" :x2="center" :y2="svgSize-20" stroke="rgba(0,255,0,0.2)" />
      <line :x1="0" :y1="center" :x2="20" :y2="center" stroke="rgba(0,255,0,0.2)" />
      <line :x1="svgSize" :y1="center" :x2="svgSize-20" :y2="center" stroke="rgba(0,255,0,0.2)" />

      <!-- User location marker -->
      <circle :cx="center" :cy="center" r="8" fill="#00bfff" stroke="white" stroke-width="2"/>

      <circle :cx="center" :cy="center" class="pulse" :r="center" />

      <!-- Sweeping beam -->
      <g :style="{ transform: `rotate(${sweepAngle}deg)`, transformOrigin: `${center}px ${center}px` }">
        <path :d="sweepPath" fill="rgba(0,255,0,0.12)" />
        <line :x1="center" :y1="center" :x2="center" :y2="10"
              stroke="rgba(0,255,0,0.3)" stroke-width="2" />
      </g>

      <!-- Boats -->
      <g v-for="b in boats" :key="b.id">
        <circle
          :cx="b.x" :cy="b.y" r="6"
          :class="[
            'boat-dot',
            distanceMap[b.id].inRange ? 'in-range' : '',
            illegalMap[b.id].illegal ? 'illegal-boat' : ''
          ]"
        />
        <text :x="b.x + 8" :y="b.y - 8" class="boat-label">
          {{ b.name }}
          <tspan v-if="illegalMap[b.id].illegal" class="illegal-label">ILLEGAL</tspan>
        </text>
      </g>

    </svg>

    <!-- List -->
    <div class="mt-3">
      <h6>Boats</h6>
      <ul class="list-unstyled">
        <li v-for="b in boats" :key="b.id" class="mb-1">
          <strong>{{ b.name }}</strong>
          — {{ distanceMap[b.id].distance }}m

          <span v-if="illegalMap[b.id].illegal" class="badge bg-danger ms-2">
            ILLEGAL
          </span>

          <button class="btn btn-sm btn-link text-danger" @click="removeBoat(b.id)">remove</button>
        </li>
      </ul>

      <h6 class="mt-3">Illegal Boats</h6>
      <ul>
        <li v-for="b in boats.filter(x => illegalMap[x.id].illegal)" :key="b.id">
          🚨 {{ b.name }} — Tide {{ tideMeters.toFixed(1) }} m violation
        </li>
      </ul>
    </div>
  </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue'

/* RADAR SETTINGS */
const svgSize = 600
const center = svgSize / 2
const radius = ref(150)
const scale = ref(1)

/* MAP SYSTEM */
const mapStyle = ref("satellite")

// different backgrounds
const mapSources = {
  satellite: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0",
  marine:    "https://tiles.openseamap.org/seamark/0/0/0.png",
  terrain:   "https://tile.opentopomap.org/0/0/0.png",
  dark:      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/0/0/0.png"
}

const currentMap = computed(() => mapSources[mapStyle.value])

/* TIDE SYSTEM */
const tide = ref("High")
const tideMeters = ref(3.0)

function applyTidePreset() {
  if (tide.value === "High") tideMeters.value = 3.5
  if (tide.value === "Medium") tideMeters.value = 2.0
  if (tide.value === "Low") tideMeters.value = 0.5
}

/* SHALLOW ZONE (TIDE-DEPENDENT) */
const shallowZoneRadius = computed(() => {
  const minR = 20
  const maxR = 110
  const normalized = Math.max(0, Math.min(4, tideMeters.value)) / 4
  return maxR - normalized * (maxR - minR)
})

/* ILLEGAL ZONE SETTINGS */
const restrictedRadius = 90
const loiterTime = 10000

/* BOAT STATE */
const boats = ref([])
let nextId = 1
const timeInRange = {}

/* DEVICE LOCATION */
const userLocation = ref({ lat: null, lon: null })
const geoError = ref(null)

function updateUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        userLocation.value.lat = pos.coords.latitude
        userLocation.value.lon = pos.coords.longitude
      },
      err => {
        geoError.value = err.message
      },
      { enableHighAccuracy: true }
    )
  } else {
    geoError.value = "Geolocation not supported"
  }
}

/* CALCULATE DISTANCE */
function calcDistance(b) {
  return Math.round(Math.hypot(b.x - center, b.y - center) * scale.value)
}

const distanceMap = computed(() => {
  const m = {}
  for (const b of boats.value) {
    const dist = calcDistance(b)
    const inRange = dist <= radius.value

    if (dist < restrictedRadius) {
      if (!timeInRange[b.id]) timeInRange[b.id] = Date.now()
    } else {
      delete timeInRange[b.id]
    }

    m[b.id] = { distance: dist, inRange }
  }
  return m
})

function isIllegal(b) {
  const dist = distanceMap.value[b.id].distance
  if (dist <= restrictedRadius) return true
  if (dist <= shallowZoneRadius.value) return true

  const t = timeInRange[b.id]
  if (t && Date.now() - t > loiterTime) return true

  if (!b.name.match(/^Boat-[a-z0-9]+$/)) return true
  return false
}

const illegalMap = computed(() => {
  const m = {}
  for (const b of boats.value) m[b.id] = { illegal: isIllegal(b) }
  return m
})

/* ADD BOATS */
function addRandomBoat() {
  if (userLocation.value.lat === null) return

  // random offset from user location (for demo, in pixels)
  const dx = (Math.random() - 0.5) * 200
  const dy = (Math.random() - 0.5) * 200

  boats.value.push({
    id: nextId++,
    name: "Boat-" + Date.now().toString(36).slice(-4),
    x: center + dx,
    y: center + dy,
    lat: userLocation.value.lat + dy * 0.00001,
    lon: userLocation.value.lon + dx * 0.00001
  })
}

function removeBoat(id) {
  boats.value = boats.value.filter(b => b.id !== id)
  delete timeInRange[id]
}

function clearBoats() {
  boats.value = []
  Object.keys(timeInRange).forEach(k => delete timeInRange[k])
}

/* SWEEP ANIMATION */
const sweepAngle = ref(0)

const sweepPath = computed(() => {
  const r = center
  return `
    M ${center} ${center}
    L ${center} 0
    A ${r} ${r} 0 0 1 ${center + r} ${center}
    Z
  `
})

onMounted(() => {
  updateUserLocation()  // get device location
  setInterval(() => {
    sweepAngle.value = (sweepAngle.value + 1.5) % 360
  }, 16)
})
</script>

<style scoped>
.radar-svg {
  background: #020e07;
}

/* MAP FILTER — NIGHT VISION STYLE */
.map-image {
  filter: brightness(0.7) contrast(1.2) saturate(1.2) hue-rotate(90deg);
}

.pulse {
  stroke: rgba(0,255,0,0.08);
  fill: none;
  animation: pulseRing 3s infinite ease-out;
}
@keyframes pulseRing {
  0% { r: 10; opacity: 0.3; }
  100% { r: 150px; opacity: 0; }
}

.boat-dot {
  fill: #00ff44;
  opacity: 0.7;
}
.boat-dot.in-range {
  fill: #ffe600;
}

/* Illegal → blinking red */
.illegal-boat {
  fill: #ff0000 !important;
  animation: blink 0.6s infinite;
}
@keyframes blink {
  0% { opacity: 1 }
  50% { opacity: 0.2 }
  100% { opacity: 1 }
}

.boat-label {
  fill: #8cff8c;
  font-size: 0.75rem;
  text-shadow: 0 0 3px black;
}
.illegal-label {
  fill: #ff4444;
  font-weight: bold;
}
</style>
