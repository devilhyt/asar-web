<script setup>
    import { logout, getProjectList, trainModel, loadModel, createProject, deleteProject, loadModalAction, getRasaStatus } from '../assets/utils/backend.js'
    import { addBackendMessage } from '../assets/utils/message.js'
    import { reactive, computed, onMounted, onBeforeUnmount } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'

    let chat = document.createElement('script')
    chat.src = 'https://unpkg.com/@rasahq/rasa-chat'
    chat.type = 'application/javascript'
    onMounted(()=>{
        document.head.appendChild(chat)
    })
    onBeforeUnmount(()=>{
        chat.parentNode.removeChild(chat)
        document.getElementById('rasa-chat-widget-container').remove()
    })

    let url = window.location.origin

    const router = useRouter()
    const { t } = useI18n()

    let state = reactive({
        project_list: await getProjectList(),
        onCreatingProject: false,
        onDeletingProject: false,
        onConfirmDelete: false,
        createProjectName: "",
        deleteProjectName: "",
        status: "requesting",
    })

    function setRasaStatus(){
        getRasaStatus().then(response => {
            if(response["training_status"]){
                state.status = "training"
            }else if(response["loaded_status"]){
                state.status = "loading"
            }else{
                state.status = "idle"
            }
        })
    }

    
    setRasaStatus()
    setInterval(function() {
        setRasaStatus()
    },3000)


    let request_gate = false

    const train_list = computed({
        get() {
            return state.project_list.map(project => ({
                label: project,
                command:() => {
                    if(!request_gate){
                        request_gate = true
                        train(project).then(response => request_gate = false)
                    }
                }
            }))
        }
    })

    const load_list = computed({
        get() {
            return state.project_list.map(project => ({
                label: project,
                command:() => {
                    if(!request_gate){
                        request_gate = true
                        load(project).then(response => request_gate = false)
                    }
                }
            }))
        }
    })

    const load_action_list = computed({
        get() {
            return state.project_list.map(project => ({
                label: project,
                command:() => {
                    if(!request_gate){
                        request_gate = true
                        loadAction(project).then(response => request_gate = false)
                    }
                }
            }))
        }
    })

    const home_menu = computed(() => ([
        reactive({
            label: t('project'),
            icon:'pi pi-fw pi-file',
            items: [
                {
                    label: t('create'),
                    icon:'pi pi-fw pi-plus',
                    command:() => {
                        state.onCreatingProject = true
                    }
                },
                {
                    label: t('delete'),
                    icon:'pi pi-fw pi-trash',
                    command:() => {
                        state.onDeletingProject = true
                    }
                },
                {
                    label: t('export'),
                    icon:'pi pi-fw pi-external-link'
                }
            ]
        }),
        reactive({
            label: t('train'),
            icon:'pi pi-fw pi-cog',
            items: train_list
        }),
        reactive({
            label: t('load'),
            icon:'pi pi-fw pi-cog',
            items: load_list
        }),
        reactive({
            label: t('loadAction'),
            icon:'pi pi-fw pi-cog',
            items: load_action_list
        }),
        reactive({
            label: t('config'),
            icon:'pi pi-cog',
            command:() => {
                router.push("/config")
            }
        })
    ]))

    async function onCreatingProject(){
        let response = await createProject(state.createProjectName)
        addBackendMessage("/api.project.create.", response, {project: state.createProjectName})
        state.project_list = reactive(await getProjectList())
        state.createProjectName = ""
    }

    async function onDeletingProject(){
        let response = await deleteProject(state.deleteProjectName)
        addBackendMessage("/api.project.delete.", response, {project: state.deleteProjectName})
        state.project_list = reactive(await getProjectList())
        state.deleteProjectName = ""
    }

    function onShowConfirmModal(project){
        state.deleteProjectName = project
        state.onConfirmDelete = true
    }

    async function train(project){
        let response = await trainModel(project)
        addBackendMessage("/api.model.train.", response, {project: project})
    }

    async function load(project){
        let response = await loadModel(project)
        addBackendMessage("/api.model.load.", response, {project: project})
    }

    async function loadAction(project){
        let response = await loadModalAction(project)
        addBackendMessage("/api.model.load.", response, {project: project})
    }
    async function onLogout(){
        let response = await logout()
        router.push("/");
        addBackendMessage("/api.auth.logout.", response)
    }

    async function onEdit(project){
        router.push({name: "Project", params: {projectName: project, fileType: "stories"}});
    }
</script>


<template>
    <LocaleSwitch class="locale-switch" />
    <div class="topBar">
        <label>Asar</label>
        <Button class="logoutBtn" @click="onLogout">{{ $t('logout') }}</Button>
    </div>
    <div class="bottom">
        <div class='sidePanel'>
            <PanelMenu :model="home_menu" />
            <div class="status">
                <label>{{ $t('serverStatus') }}</label><br>
                <label>{{ $t(state.status) }}</label>
            </div>
        </div>
        <div class='home-content'>
            <ScrollPanel class='scroll-panel'>
                <div class='panel-content'>
                    <div class='project-row' :key="state.project_list">
                        <div class='project-card' v-for="project in state.project_list" :key="project">
                            <h2 class="card-title">{{ project }}</h2>
                            <div class="editBtn">
                                <Button class="editBtn" icon="pi pi-pencil" :label="$t('edit')" @click="onEdit(project)" />
                            </div>
                            <div class="deleteBtn">
                                <Button class="deleteBtn p-button-secondary" icon="pi pi-times" @click="onShowConfirmModal(project)" />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollPanel>
        </div>
    </div>
    <div class="createProjectModal" >
        <Modal v-if="state.onCreatingProject" @close="state.onCreatingProject = false">
            <div class="header">
                <label>{{ $t("createProject") }}</label>
            </div>
            <div class="content">
                <span class="p-float-label">
                    <InputText type="text" v-model="state.createProjectName" />
                    <label>{{$t('name')}}</label>
                </span>
            </div>
            <div class="footer">
                <Button class='createProjectBtn p-button-text' :label="$t('create')" @click="state.onCreatingProject = false; onCreatingProject()" />
            </div>
        </Modal>
    </div>
    <div class="deleteProjectModal" >
        <Modal v-if="state.onDeletingProject" @close="state.onDeletingProject = false">
            <div class="header">
                <label>{{ $t("deleteProject") }}</label>
            </div>
            <div class="content">
                <span class="p-float-label">
                    <CustomAutoComplete v-model="state.deleteProjectName" :data_list='state.project_list' />
                    <label>{{$t('name')}}</label>
                </span>
            </div>
            <div class="footer">
                <Button class='deleteProjectBtn p-button-text' :label="$t('delete')" @click="state.onDeletingProject = false; onDeletingProject()" />
            </div>
        </Modal>
    </div>
    <div class="onConfirmDelete" >
        <Modal v-if="state.onConfirmDelete" @close="state.onConfirmDelete = false; state.deleteProjectName = ''">
            <div class="content">
                <label>{{ $t("deleteProjectConfirmation", {project:state.deleteProjectName}) }}</label> 
            </div>
            <div class="footer">
                <Button class='deleteProjectBtn p-button-text' :label="$t('delete')" @click="state.onConfirmDelete = false; onDeletingProject()" />
            </div>
        </Modal>
    </div>
    <div id="rasa-chat-widget" :data-websocket-url="url + '/socket.io'"></div>
</template>

<script>
    export default {
        name: ["Home"],
        created() {
            document.body.style.backgroundColor = "#6577C4";
        }
    };

</script>

<style lang='scss' scoped>
    .locale-switch {
        position: absolute;
        top: 18px;
        left: 24px;
        z-index: 30;
    }
    .topBar {
        width: 100%;
        font-size: 50px;
        color: #E0E0E0;
        background-color: #222222;
        text-align: center;
        .logoutBtn {
            position: absolute;
            top: 18px;
            right: 24px;
        }
    }
    .bottom {
        display: flex;
        flex-direction: column;
    }
    .sidePanel {
        position: absolute;
        width: 200px;
        height: calc(100vh - 72px);
        background-color:#2C2F33;
    }
    .home-content {
        margin-left: 200px;
    }
    .scroll-panel {
        width: 100%;
        height: calc(100vh - 72px);
    }
    .project-card {
        position: relative;
        background-color: #FFFFFF;
        margin-top: 100px;
        width: 200px;
        height: 160px;
        display: inline-block;
        margin-left: calc((100vw - 200*3px)/5);
    }
    .card-title {
        text-align: center;
    }
    .deleteBtn {
        position: absolute;
        top: 0px;
        right: 0px;
        transform: scale(0.7);
    }
    .editBtn {
        position: absolute;
        bottom: 6px;
        left: 26px;
        width: 100px;
    }
    .p-panelmenu:deep() {
        .p-panelmenu-header-link {
            border: 0px;
            background:#2C2F33;
            color: #E0E0E0;
        }
        .p-menuitem {
            background:#33363a;
        }
        .p-panelmenu-content {
            border: 0px;
            .p-menuitem .p-menuitem-link {
                .p-menuitem-text {
                    color: #E0E0E0;
                }
                .p-menuitem-icon {
                    color: #E0E0E0;
                }
            }
        }
    }
    .createProjectModal:deep() {
        color: #E0E0E0;
        .modal-container {
            width: 300px;
            height: 180px;
            background: #222222;
        }
        .header {
            font-size: 28px;
            text-align: center;
        }
        .content {
            margin-top: 20px;
            margin-left: 20px;
        }
        .footer {
            position: absolute;
            bottom: 5px;
            right: 5px;
            .createProjectBtn {
                width: 80px;
            }
        }
    }
    .deleteProjectModal:deep() {
        color: #E0E0E0;
        .modal-container {
            width: 300px;
            height: 180px;
            background: #222222;
        }
        .header {
            font-size: 28px;
            text-align: center;
        }
        .content {
            margin-top: 20px;
            margin-left: 20px;
        }
        .footer {
            position: absolute;
            bottom: 5px;
            right: 5px;
            .deleteProjectBtn {
                width: 80px;
            }
        }
    }
    .onConfirmDelete:deep() {
        color: #E0E0E0;
        .modal-container {
            width: 300px;
            height: 180px;
            background: #222222;
        }
        .content {
            font-size: 24px;
            margin-top: 10px;
            margin-left: 24px;
        }
        .footer {
            position: absolute;
            bottom: 5px;
            right: 5px;
            .deleteProjectBtn {
                width: 80px;
            }
        }
    }
    .status {
        text-align: center;
        font-size: 24px;
        color: #E0E0E0;
        background: #33363a;
    }
</style>