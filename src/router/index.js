import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../pages/Landing.vue'
import Topics from '../pages/Topics.vue'

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { path: '/topics', name: 'Topics', component: Topics }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router   // <-- THIS MUST EXIST
