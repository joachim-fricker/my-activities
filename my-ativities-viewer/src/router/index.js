import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import GridPage from '../views/GridPage.vue'
import AllTracks from '@/views/AllTracks.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/allTracks', component: AllTracks },
  { path: '/grid', component: GridPage } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
