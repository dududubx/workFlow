import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
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
        component: () => import('@/views/flowCheck/index.vue')
        // components: {
        //     default: () => import('@/views/flowCheck/index.vue'),
        //     test: () => import('@/components/main/index.vue')
        // }
    }, {
        path: '/sponsor',
        name: 'sponsorFlow',
        meta: {
            title: '流程发起',
        },
        component: () => import('@/views/sponsorFlow/index.vue')
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