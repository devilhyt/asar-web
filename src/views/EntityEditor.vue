<script setup>
    import { getFileData, updateFile } from '../assets/utils/backend.js'
    import { addBackendMessage } from '../assets/utils/message.js'
    import { useRoute } from 'vue-router'
    import { reactive } from 'vue'

    const params = useRoute().params

    let state = reactive({
        entityData: await getFileData(params, "entities"),
        role: "",
        group: "",
    })

    function onAdd(type){
        if(!state.entityData[type + "s"].includes(state[type])){
            state.entityData[type + "s"].push(state[type])
            state[type] = ""
        }
    }

    function onDelete(type, index){
        state.entityData[type].splice(index, 1)
    }

    async function onSave(){
        let body = {
            "content": state.entityData
        }
        let response = await updateFile(params, "entities", body)
        addBackendMessage("/api.file.update.", response, {file: params.fileName})
    }

</script>

<template>
    <EditorLayout>
        <div class='editor'>
            <div class='middle'>
                <Button class="saveBtn" @click="onSave">{{ $t('save') }}</Button>
                <ScrollPanel class='scroll-panel'>
                    <div class="content">
                        <Checkbox class='checkBox' v-model="state.entityData['influence_conversation']" :binary="true" />
                        <label class='checkText'>{{ $t('influenceConversation') }}</label><br><br>
                        <label>{{$t('role')}} :</label><br>
                        <div class="inner">
                            <span v-for="(role, index) in state.entityData['roles']" :key="role">
                                <Button class="deleteBtn" icon="pi pi-trash" @click="onDelete('roles', index)" />
                                <label>{{ role }}</label>
                                <br>
                            </span>
                            <InputText type="text" v-model="state.role" />
                            <Button class="addBtn" @click="onAdd('role')">{{ $t('add') }}</Button>
                        </div><br>
                        <label>{{$t('group')}} :</label><br>
                        <div class="inner">
                            <span v-for="(group, index) in state.entityData['groups']" :key="group">
                                <Button class="deleteBtn" icon="pi pi-trash" @click="onDelete('groups', index)" />
                                <label>{{ group }}</label>
                                <br>
                            </span>
                            <InputText type="text" v-model="state.group" />
                            <Button class="addBtn" @click="onAdd('group')">{{ $t('add') }}</Button>
                        </div><br>
                    </div>
                </ScrollPanel>
            </div>
        </div>
    </EditorLayout>
</template>

<script>
    export default {
        name: ["IntentEditor"],
        created() {
            document.body.style.backgroundColor = "#333333";
        }
    }
</script>

<style lang="scss" scoped>
    .editor{
        background-color: #1e1e1e;
    }
    .middle {
        width: calc(100% / 2);
        height: calc(100vh - 72px);
        background-color: #1b1b1b;
        margin-left: calc(100%/4);
        margin-right: calc(100%/4);
    }
    .saveBtn {
        z-index: 2;
        position: absolute;
        top: 18px;
        right: 24px;
    }
    .deleteBtn {
        transform: scale(0.7);
    }
    .scroll-panel {
        font-size: 24px;
        color: #E0E0E0;
        width: 100%;
        height: calc(100vh - 72px);
        .content {
            margin-top: 20px;
            margin-left: 30px;
        }
    }
    .checkBox {
        height: 24px;
    }
    .checkText {
        margin-left: 10px;
    }
    .inner{
        margin-top: 2px;
        margin-left: 20px;
    }
</style>