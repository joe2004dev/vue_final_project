<template>
<div>
<NavBar :brand="appTitle" :links="navLinks" @update-brand="updateBrand" />
<main class="container my-4">
<router-view />
</main>
<AppFooter :text="footerText" />
</div>
</template>


<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'


const appTitle = ref('Boat Radar — Vue Playground')
const footerText = ref('© ' + new Date().getFullYear() + ' Boat Radar Example')
const navLinks = ref([
{ name: 'Home', to: '/' },
{ name: 'Topics', to: '/topics' }
])


function updateBrand(newBrand) {
appTitle.value = newBrand
}
</script>