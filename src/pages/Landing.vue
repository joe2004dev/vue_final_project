<template>
  <div class="landing-container">
    <header class="mb-4">
      <h1 class="display-5 fw-bold">Boat Radar</h1>
      <p class="lead text-muted">
        A simple showcase app demonstrating core Vue concepts such as local storage,
        API interactions, and form handling. Explore the interactive radar or jump
        straight into the demos.
      </p>
    </header>

    <div class="row g-4">
      <!-- Main Demo Component -->
      <div class="col-md-8">
        <section aria-label="Boat Radar Interactive Demo">
          <BoatRadar />
        </section>
      </div>

      <!-- Quick Demo Links -->
      <aside class="col-md-4">
        <div class="p-3 border rounded shadow-sm bg-light">
          <h5 class="fw-semibold mb-3">Quick Demos</h5>
          <ul class="list-unstyled small">
            <li class="mb-2">
              <router-link to="/topics#crud" class="link-primary">
                ➤ Local CRUD (LocalStorage)
              </router-link>
            </li>
            <li class="mb-2">
              <router-link to="/topics#fetch" class="link-primary">
                ➤ Fetching API
              </router-link>
            </li>
            <li>
              <router-link to="/topics#form" class="link-primary">
                ➤ Form Handling
              </router-link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import BoatRadar from '../components/BoatRadar.vue'
</script>

<style scoped>
.landing-container {
  padding: 2rem 1rem;
}

.landing-container header p {
  max-width: 650px;
}

.link-primary {
  text-decoration: none;
}
.link-primary:hover {
  text-decoration: underline;
}
</style>
