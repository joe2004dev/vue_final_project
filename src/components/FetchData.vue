<template>
<div>
<button class="btn btn-outline-primary mb-2" @click="fetchUsers">Fetch sample users</button>
<div v-if="loading">Loading...</div>
<ul v-else>
<li v-for="u in users" :key="u.id">{{ u.name }} — {{ u.email }}</li>
</ul>
</div>
</template>


<script setup>
import { ref } from 'vue'
const users = ref([])
const loading = ref(false)


async function fetchUsers() {
loading.value = true
try {
const res = await fetch('https://jsonplaceholder.typicode.com/users')
users.value = await res.json()
} catch (e) {
console.error(e)
users.value = []
} finally {
loading.value = false
}
}
</script>