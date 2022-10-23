<script setup>
    import { reactive, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { getFileList, createFile, deleteFile } from '../assets/utils/backend.js'
import { addBackendMessage } from '@/assets/utils/message.js'

    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()

    const data_type = ["stories", "rules", "intents", "actions", "responses", "entities", "slots", "synonyms"]

    let state = reactive({
        fileType: computed(()=> (t(route.params.fileType))),
        fileList: computed(()=> (state.dataTuple[route.params.fileType] ?? [])),
        dataTuple: {},
        onCreatingFile: false,
        onDeletingFile: false,
        onConfirmDelete: false,
        createFileName: "",
        deleteFileName: "",
    })

    const projectMenu = computed(() => ([]))

    for (let i = 0; i < data_type.length; i++) {
        getFileList(route.params, data_type[i]).then(response => {
            state.dataTuple[data_type[i]] = response
            
        })
        projectMenu.value.push(
            reactive({
                label: computed(() => t(data_type[i])),
                icon:'pi pi-pencil',
                command:() => {
                    router.push('./' + data_type[i])
                }
            })
        )
    }

    async function onCreatingFile(){
        let response = await createFile(route.params, state.createFileName)
        if(response.msgCode == "success"){
            state.dataTuple[route.params.fileType].push(state.createFileName)
        }
        addBackendMessage("/api.file.create.", response, {file: state.createFileName})
        state.createFileName = ""
    }

    async function onDeletingFile(){
        let response = await deleteFile(route.params, state.deleteFileName)
        if(response.msgCode == "success"){
            state.dataTuple[route.params.fileType] = state.dataTuple[route.params.fileType].filter(file => file != state.deleteFileName)
        }
        addBackendMessage("/api.file.delete.", response, {file: state.deleteFileName})
        state.deleteFileName = ""
    }

    function onShowConfirmModal(file){
        state.deleteFileName = file
        state.onConfirmDelete = true
    }

    function onEdit(file){
        router.push("/project/" + route.params.projectName + "/" + route.params.fileType + "/" + file)
    }

</script>

<template>
    <div class="topBar">
        <label>{{ $route.params.projectName }}</label>
        <Button class="backBtn" @click="onLeave">{{ $t('leave') }}</Button>
    </div>
    <div class="bottom">
        <div class='sidePanel'>
            <PanelMenu :model="projectMenu" />
        </div>
        <div class='file-manager'>
            <div class="controls">
                <Button class="p-button-text" @click="state.onCreatingFile = true">{{ $t('create') }}</Button>
                <Button class="p-button-text" @click="state.onDeletingFile = true">{{ $t('delete') }}</Button>
            </div>
            <ScrollPanel class='scroll-panel'>
                <div class="title">{{ state.fileType }}</div>
                <div class="file" v-for="file in state.fileList" :key="file">
                    <div class='file-name'>
                        {{ file }}
                    </div>
                    <Button class='p-button-secondary' icon='pi pi-book' @click="onEdit(file)"/>
                    <Button class='deleteBtn' icon='pi pi-trash' @click="onShowConfirmModal(file)" />
                </div>
            </ScrollPanel>
        </div>
    </div>
    <div class="createFileModal" >
        <Modal v-if="state.onCreatingFile" @close="state.onCreatingFile = false">
            <div class="header">
                <label>{{ $t("createFile") }}</label>
            </div>
            <div class="content">
                <span class="p-float-label">
                    <InputText type="text" v-model="state.createFileName" />
                    <label>{{ $t('name') }}</label>
                </span>
            </div>
            <div class="footer">
                <Button class='createFileBtn p-button-text' :label="$t('create')" @click="state.onCreatingFile = false; onCreatingFile()" />
            </div>
        </Modal>
    </div>
    <div class="deleteFileModal" >
        <Modal v-if="state.onDeletingFile" @close="state.onDeletingFile = false">
            <div class="header">
                <label>{{ $t("deleteFile") }}</label>
            </div>
            <div class="content">
                <span class="p-float-label">
                    <CustomAutoComplete v-model="state.deleteFileName" :data_list='state.dataTuple[$route.params.fileType]' />
                    <label>{{$t('name')}}</label>
                </span>
            </div>
            <div class="footer">
                <Button class='deleteFileBtn p-button-text' :label="$t('delete')" @click="state.onDeletingFile = false; onDeletingFile()" />
            </div>
        </Modal>
    </div>
    <div class="onConfirmDelete" >
        <Modal v-if="state.onConfirmDelete" @close="state.onConfirmDelete = false; state.deleteFileName = ''">
            <div class="content">
                <label>{{ $t("deleteFileConfirmation", {file:state.deleteFileName}) }}</label> 
            </div>
            <div class="footer">
                <Button class='deleteFileBtn p-button-text' :label="$t('delete')" @click="state.onConfirmDelete = false; onDeletingFile()" />
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: ["FileManager"],
        created() {
            document.body.style.backgroundColor = "#333333";
        },
        methods: {
            onLeave(){
                this.$router.push({name: "home"})
            }
        }
        
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
            position: absolute;
            top: 18px;
            left: 18px;
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
    .file-manager {
        margin-left: 200px;
        .title {
            font-size: 50px;
            text-align: center;
        }
        .file {
            margin-top: 20px;
            margin-left: calc((100vw - 200px)/3.3);
            display: flex;
            align-items: center;
            .file-name {
                font-size: 36px;
                padding: 0;
                width: calc(100% / 2);
                display: inline-block;
            }
            .deleteBtn {
                margin-left: 20px;
            }
        }
    }
    .controls {
        text-align: right;
    }
    .scroll-panel {
        color: #E0E0E0;
        width: 100%;
        height: 800px;
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
    .createFileModal:deep() {
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
            .createFileBtn {
                width: 80px;
            }
        }
    }
    .deleteFileModal:deep() {
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
            .deleteFileBtn {
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
            .deleteFileBtn {
                width: 80px;
            }
        }
    }
</style>