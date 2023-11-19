import {createRouter, createWebHashHistory} from 'vue-router'
import routes from './routers'

const router = createRouter({
    //Electron 只在 路由模式 为 hash 时，才可以正常运行。否则，就会无法找到匹配的路径！；
    history:createWebHashHistory(),//hash模式
    routes
})
export default router