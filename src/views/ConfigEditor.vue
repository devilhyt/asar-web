<script setup>
    import { getProjectList, getLocalConfig, updateLocalConfig} from '../assets/utils/backend.js'
    import { addBackendMessage } from '../assets/utils/message.js'
    import { reactive, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'

    document.body.style.backgroundColor = "#333333";

    const router = useRouter()
    const { t } = useI18n()

    let request_gate = false

    let state = reactive({
        project: "Asar",
        project_list: await getProjectList(),
        project_menu: computed(()=> state.project_list.map(project =>({
            label: project,
            icon:'pi pi-fw pi-file',
            command:() => {
                if(!request_gate){
                    state.project = project
                    state.config = ""
                    getLocalConfig(project).then(response => {
                        state.config = response
                        request_gate = false
                    })
                }
            }
        }))),
        config: ""
    })

    if(state.project_list.length > 0){
        state.project = state.project_list[0]
        state.config = await getLocalConfig(state.project_list[0])
    }

    function onLeave(){
        router.push({name: "Home"})
    }

    async function onSave(){
        let response = await updateLocalConfig(state.project, state.config)
        addBackendMessage("/api.file.update.", response, {file: state.project})
    }

</script>

<template>
    <div class="topBar">
        <label>{{state.project}}</label>
        <Button class="backBtn" @click="onLeave">{{ $t('leave') }}</Button>
    </div>
    <div class="bottom">
        <div class='sidePanel'>
            <PanelMenu :model="state.project_menu" />
        </div>
        <div class='content'>
            <Textarea class="editor" v-model="state.config" />
            <Button class="saveBtn" label="Save" @click="onSave">{{ $t('save') }}</Button>
        </div>
    </div>
</template>

<script>
    export default {
        name: ["ConfigEditor"],
    }
</script>

<style lang="scss" scoped>
    .topBar {
        width: 100%;
        font-size: 50px;
        color: #E0E0E0;
        background-color: #222222;
        text-align: center;
        .backBtn {
            position: flex;
            float: left;
            left: 18px;
            Top: 18px;
        }
    }
    .bottom {
        display: flex;
        flex-direction: column;
    }

    .sidePanel {
        position: absolute;
        height: calc(100vh - 72px);
        width: 200px;
        background-color:#2C2F33;
    }

    .content {
        margin-left: 200px;
        height: calc(100vh - 72px);
    }

    :deep(.p-panelmenu) {
        .p-panelmenu-header-link {
            border: 0px;
            background:#2C2F33;
            color: #E0E0E0;
        }
        .p-menuitem{
            background:#33363a;
        }
        .p-panelmenu-content{
            border: 0px;
            .p-menuitem .p-menuitem-link{
                .p-menuitem-text{
                    color: #E0E0E0;
                }
                .p-menuitem-icon{
                    color: #E0E0E0;
                }
            }
        }
    }
    .editor {
        position: absolute;
        width: 89.5%;
        height: 92%;
    }
    #app > div.bottom > div.content > textarea {
        color: #E0E0E0;
        background: #333333;
    }
    .saveBtn {
        position: absolute;
        top: 18px;
        left: calc(100% - 90px);
        z-index: 10;
    }
</style>