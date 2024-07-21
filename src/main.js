import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'; // pinia
//import store from './store'; // vuex

const app = createApp(App);
//app.use(store); // vuex
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
