import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
    // history: createWebHistory('/'),
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        name: 'index',
        meta: {
            title: '流程设计器'
        },
        component: () => import('@/views/design/index.vue')
    }, {
        path: '/check',
        name: 'check',
        meta: {
            title: '流程审批'
        },
        component: () => import('@/views/check/pcCheck/index.vue')
        // components: {
        //     default: () => import('@/views/flowCheck/index.vue'),
        //     test: () => import('@/components/main/index.vue')
        // }
    }, {
        path: '/view',
        name: 'view',
        meta: {
            title: '流程预览'
        },
        component: () => import('@/views/viewForm/index.vue')
    }, {
        path: '/sign',
        name: 'sign',
        component: () => import('@/components/signPage/index.vue')
    }]
})
router.beforeEach((to, form, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
declare module 'vue-router' {
    interface RouteMeta {
        title?: string
    }
}
export default router