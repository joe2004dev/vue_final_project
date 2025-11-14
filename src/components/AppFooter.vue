<template>
<footer class="bg-light text-center py-3 mt-4">
<div>{{ text }}</div>
</footer>
</template>


<script setup>
const props = defineProps({ text: String })
</script>