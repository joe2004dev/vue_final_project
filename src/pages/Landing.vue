<template>
<div>
<h1>Welcome to the Boat Radar demo</h1>
<p>This landing page introduces the app and links to the topics page where each concept is illustrated.</p>


<div class="row">
<div class="col-md-8">
<BoatRadar />
</div>
<div class="col-md-4">
<h5>Quick Demos</h5>
<ul>
<li><router-link to="/topics#crud">Local CRUD (LocalStorage)</router-link></li>
<li><router-link to="/topics#fetch">Fetching API</router-link></li>
<li><router-link to="/topics#form">Form Handling</router-link></li>
</ul>
</div>
</div>
</div>
</template>


<script setup>
import BoatRadar from '../components/BoatRadar.vue'
</script>