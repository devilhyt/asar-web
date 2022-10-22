import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Project from '../views/Project.vue'
import StoryEditor from '../views/StoryEditor.vue'


const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
    },
    {
        path: '/project/:projectName/:fileType',
        name: 'project',
        component: Project,
    },
    {
        path: '/project/:projectName/stories/:fileName',
        name: 'storyEditor',
        component: StoryEditor,
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
