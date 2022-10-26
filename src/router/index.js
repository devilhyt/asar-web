import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: import('../views/Home.vue'),
    },
    {
        path: '/config',
        name: 'config',
        component: () => import('../views/ConfigEditor.vue'),
    },
    {
        path: '/project/:projectName/:fileType',
        name: 'project',
        component: () => import('../views/Project.vue'),
    },
    {
        path: '/project/:projectName/stories/:fileName',
        name: 'storyEditor',
        meta: {
            fileType: "stories"
        },
        component: () => import('../views/StoryEditor.vue'),
    },
    {
        path: '/project/:projectName/intents/:fileName',
        name: 'intentEditor',
        meta: {
            fileType: "intents"
        },
        component: () => import('../views/IntentEditor.vue'),
    },
    {
        path: '/project/:projectName/entities/:fileName',
        name: 'entityEditor',
        meta: {
            fileType: "entities"
        },
        component: () => import('../views/EntityEditor.vue'),
    },
    {
        path: '/project/:projectName/actions/:fileName',
        name: 'actionEditor',
        meta: {
            fileType: "actions"
        },
        component: () => import('../views/ActionEditor.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
