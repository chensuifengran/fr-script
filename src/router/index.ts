import {createRouter, createWebHashHistory} from 'vue-router'
import routes from './routers'

const router = createRouter({
    history:createWebHashHistory(),//hash模式
    routes
})
export default router