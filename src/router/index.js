import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/config',
        name: 'Config',
        component: () => import('../views/ConfigEditor.vue'),
    },
    {
        path: '/project/:projectName/:fileType',
        name: 'Project',
        component: () => import('../views/Project.vue'),
    },
    {
        path: '/project/:projectName/stories/:fileName',
        name: 'StoryEditor',
        meta: {
            fileType: "stories"
        },
        component: () => import('../views/StoryEditor.vue'),
    },
    {
        path: '/project/:projectName/intents/:fileName',
        name: 'IntentEditor',
        meta: {
            fileType: "intents"
        },
        component: () => import('../views/IntentEditor.vue'),
    },
    {
        path: '/project/:projectName/entities/:fileName',
        name: 'EntityEditor',
        meta: {
            fileType: "entities"
        },
        component: () => import('../views/EntityEditor.vue'),
    },
    {
        path: '/project/:projectName/actions/:fileName',
        name: 'ActionEditor',
        meta: {
            fileType: "actions"
        },
        component: () => import('../views/ActionEditor.vue'),
    },
    {
        path: '/project/:projectName/synonyms/:fileName',
        name: 'SynonymEditor',
        meta: {
            fileType: "synonyms"
        },
        component: () => import('../views/SynonymEditor.vue'),
    },
    {
        path: '/project/:projectName/slots/:fileName',
        name: 'SlotEditor',
        meta: {
            fileType: "slots"
        },
        component: () => import('../views/SlotEditor.vue'),
    },
    {
        path: '/project/:projectName/responses/:fileName',
        name: 'ResponseEditor',
        meta: {
            fileType: "responses"
        },
        component: () => import('../views/ResponseEditor.vue'),
    },
    {
        path: '/project/:projectName/forms/:fileName',
        name: 'FormEditor',
        meta: {
            fileType: "forms"
        },
        component: () => import('../views/FormEditor.vue'),
    },
    {
        path: '/project/:projectName/rules/:fileName',
        name: 'RuleEditor',
        meta: {
            fileType: "rules"
        },
        component: () => import('../views/RuleEditor.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
