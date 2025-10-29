import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import GridPage from '../views/GridPage.vue'
import AllTracks from '@/views/AllTracks.vue'
import WorldMap from '@/views/WorldMap.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/allTracks', component: AllTracks },
  { path: '/grid', component: GridPage } ,
  { path: '/world', component: WorldMap } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
