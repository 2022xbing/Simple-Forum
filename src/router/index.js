import { createRouter, createWebHistory, createWebHashHistory} from 'vue-router'

const routerHistory = createWebHistory()
const routerHashHistory = createWebHashHistory()

import login from '@/components/login'
import register from '@/components/register'
import home from '@/components/home'
import submit from '@/components/submit'
import postdetail from '@/components/postdetail'

export const router = createRouter({
    history:  process.env.NODE_ENV === "production" ?  routerHashHistory : routerHistory,
    routes: [
        {
            path: '/',
            name: 'login',
            component: login,
            hidden: true
        },
        {
            path: '/register',
            name: 'register',
            component: register,
            hidden: true
        },
        {
            path: '/home',
            name: 'home',
            component: home,
            hidden: true
        },
        {
            path: '/submit',
            name: 'submit',
            component: submit,
            hidden: true
        },
        {
            path: '/postdetail',
            name: 'postdetail',
            component: postdetail,
            hidden: true
        },
    ]
})
export default router
