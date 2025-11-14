<template>
  <div>
    <button class="btn btn-sm btn-secondary" @click="clearBoats">Clear</button>
  </div>


<svg :width="svgSize" :height="svgSize" class="border">
<circle :cx="center" :cy="center" :r="center" stroke="#ccc" fill="none" />
<!-- radar range -->
<circle :cx="center" :cy="center" :r="(radius/scale)" stroke="green" fill="rgba(0,255,0,0.05)" />


<!-- boats -->
<g v-for="b in boats" :key="b.id">
<circle :cx="b.x" :cy="b.y" r="4" :fill="inRange(b) ? 'red' : 'black'" />
<text :x="b.x + 6" :y="b.y">{{ b.name }}</text>
</g>
</svg>


<div class="mt-2">
<h6>Boats list (loop & conditionals)</h6>
<ul>
<li v-for="b in boats" :key="b.id">
{{ b.name }} — {{ distanceToCenter(b) }}m
<button class="btn btn-sm btn-link" @click="removeBoat(b.id)">remove</button>
</li>
</ul>
</div>
</template>


<script setup>
import { reactive, ref, computed } from 'vue'


const svgSize = 300
const center = svgSize / 2
const scale = ref(1) // pixels per meter — simplistic
const radius = ref(150)


const boats = reactive([])
let nextId = 1


function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }


function addRandomBoat() {
const angle = Math.random() * Math.PI * 2
const dist = Math.random() * (center - 20)
const x = center + Math.cos(angle) * dist
const y = center + Math.sin(angle) * dist
boats.push({ id: nextId++, name: 'Boat-' + Date.now().toString(36).slice(-4), x, y })
}


function removeBoat(id) {
const idx = boats.findIndex(b => b.id === id)
if (idx >= 0) boats.splice(idx, 1)
}


function clearBoats() { boats.splice(0, boats.length) }


function distanceToCenter(b) {
const d = Math.round(Math.hypot(b.x - center, b.y - center) * scale.value)
return d
}


function inRange(b) {
return distanceToCenter(b) <= radius.value
}
</script>