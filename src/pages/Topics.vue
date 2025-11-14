<template>
<div>
<h2>Covered Topics</h2>


<section id="loops">
<h4>2. Looping over arrays</h4>
<ul>
<li v-for="(item, i) in sampleList" :key="i">{{ i+1 }}. {{ item }}</li>
</ul>
</section>


<section id="conditionals">
<h4>3. Conditionals</h4>
<p v-if="sampleList.length">There are {{ sampleList.length }} items.</p>
<p v-else>No items found.</p>
</section>


<section id="crud">
<h4>8. CRUD App (LocalStorage)</h4>
<CRUDLocalStorage />
</section>


<section id="fetch">
<h4>9. Fetching data from API</h4>
<FetchData />
</section>


<section id="form">
<h4>10. Form Handling</h4>
<FormDemo />
</section>


<section id="reactivity">
<h4>12-14. v-model, Reactive objects, computed, onMounted</h4>
<div>
<label>Search: <input v-model="search" class="form-control"/></label>
<p>Reactive object example: {{ user.name }} (age {{ user.age }})</p>
<p>Computed greeting: {{ greeting }}</p>
</div>
</section>
</div>
</template>


<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import CRUDLocalStorage from '../components/CRUDLocalStorage.vue'
import FetchData from '../components/FetchData.vue'
import FormDemo from '../components/FormDemo.vue'


const sampleList = ref(['Anchor', 'Radar', 'Sonar'])
const search = ref('')


const user = reactive({ name: 'Marina', age: 6 })


const greeting = computed(() => `Ahoy, ${user.name}! ${search.value ? 'Searching for: ' + search.value : ''}`)


onMounted(() => {
// example of onMounted usage
console.log('Topics page mounted')
})
</script>