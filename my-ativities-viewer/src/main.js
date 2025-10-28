import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import "./assets/main.css";
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule])


const app = createApp(App)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'light'
});
app.mount('#app')
