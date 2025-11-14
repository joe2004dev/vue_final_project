<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
<div class="container-fluid">
<a class="navbar-brand" href="#">{{ brand }}</a>
<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
<span class="navbar-toggler-icon"></span>
</button>


<div class="collapse navbar-collapse" id="navMenu">
<ul class="navbar-nav me-auto mb-2 mb-lg-0">
<li v-for="link in links" :key="link.name" class="nav-item">
<router-link class="nav-link" :to="link.to">{{ link.name }}</router-link>
</li>
</ul>
<form class="d-flex" @submit.prevent>
<input v-model="brandInput" class="form-control me-2" placeholder="Change brand" />
<button @click.prevent="saveBrand" class="btn btn-outline-light">Set</button>
</form>
</div>
</div>
</nav>
</template>


<script setup>
import { ref, watch } from 'vue'


// defineProps example (read-only props passed in)
const props = defineProps({
brand: { type: String, default: 'App' },
links: { type: Array, default: () => [] }
})


const emit = defineEmits(['update-brand'])


const brandInput = ref(props.brand)


function saveBrand() {
emit('update-brand', brandInput.value)
}


// If parent changes prop, sync input
watch(() => props.brand, (v) => brandInput.value = v)
</script>