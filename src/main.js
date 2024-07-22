import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'; // pinia
import piniaPluginPersist from 'pinia-plugin-persist';
//import store from './store'; // vuex
import router from "./router";

const app = createApp(App);
//app.use(store); // vuex
const pinia = createPinia();
pinia.use(piniaPluginPersist);

app.use(pinia);
app.use(router);
app.mount('#app');
