import Vue from 'vue'
import Router from 'vue-router'
import imServer from '@/components/imServer/imServer'
import imClient from '@/components/imClient/imClient'
import login from '@/components/common/login'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', redirect: 'login' },
        { path: '/login', name: 'login', component: login },
        { path: '/imServer', name: 'imServer', component: imServer },
        { path: '/imClient', name: 'imClient', component: imClient },
    ]
})
