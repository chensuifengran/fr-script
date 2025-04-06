import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/scss/theme.scss";
import "./assets/scss/style.scss";
import router from "./router/index";
import "virtual:uno.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
logUtil.setProductionErrorReport();
