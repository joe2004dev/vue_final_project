<template>
<div>
<form @submit.prevent="submitForm">
<div class="mb-2">
<label>Name</label>
<input v-model="form.name" class="form-control" required />
</div>
<div class="mb-2">
<label>Type</label>
<select v-model="form.type" class="form-select">
<option value="sail">Sail</option>
<option value="motor">Motor</option>
</select>
</div>
<div class="mb-2 form-check">
<input v-model="form.active" type="checkbox" id="active" class="form-check-input" />
<label for="active" class="form-check-label">Active</label>
</div>


<button class="btn btn-success">Submit</button>
</form>


<div class="mt-3">
<h6>Preview</h6>
<pre>{{ form }}</pre>
</div>
</div>
</template>


<script setup>
import { reactive } from 'vue'


const form = reactive({ name: '', type: 'sail', active: false })


function submitForm() {
alert('Form submitted: ' + JSON.stringify(form))
}
</script>