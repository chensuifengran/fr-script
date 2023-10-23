import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import './assets/scss/style.scss'
import './assets/scss/highlight-vs.scss'
import 'element-plus/theme-chalk/src/dark/css-vars.scss'
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.mount("#app");
