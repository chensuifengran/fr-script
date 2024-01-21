import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/scss/style.scss";
import "./assets/scss/highlight-vs.scss";
import './assets/scss/loading-animate.scss'
import router from "./router/index";
import 'animate.css'
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount("#app");
