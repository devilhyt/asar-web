<script setup>
    import { getFileData, updateFile} from '../assets/utils/backend.js'
    import { addBackendMessage } from '../assets/utils/message.js'
    import { reactive } from 'vue'
    import { useRoute } from 'vue-router'

    const route =  useRoute()
    const params = route.params

    let synonymObj = await getFileData(params, "synonyms")
    let state = reactive({
        synonymData: synonymObj["examples"]
    })

    function addSynonym(){
        state.synonymData.push("")
    }

    function deleteSynonym(index){
        state.synonymData.splice(index, 1)
    }

    async function onSave(){
        let body = {
            "content": {
                "examples": state.synonymData.filter(x => x != "")
            }
        }
        let response = await updateFile(params, "synonyms", body)
        addBackendMessage("/api.file.update.", response, {file: params.fileName})
    }
</script>

<template>
    <EditorLayout>
        <Button class='saveBtn' @click="onSave">{{ $t('save') }}</Button>
        <div class='editor'>
            <div class='middle'>
                <div>
                    <h1 class='title'>{{ $t('synonym') }}</h1>
                </div>
                <ScrollPanel class='scroll-panel'>
                    <div class='synonym' v-for="(value, index) in state.synonymData" :key="(value, index)">
                        <InputText type="text" v-model="state.synonymData[index]" />
                        <Button v-if="state.synonymData.length > 1" class="deleteBtn" icon="pi pi-trash" @click="deleteSynonym(index)"/>
                    </div>
                    <Button class='plusBtn' icon="pi pi-plus" @click="addSynonym" />
                </ScrollPanel>
            </div>
        </div> 
    </EditorLayout>
</template>

<script>
    export default {
        name: ["SynonymEditor"],
    }
</script>

<style lang='scss' scoped>
    .editor{
        text-align: center;
        display: flex;
        align-items: center;
        background-color: #1e1e1e;
    }
    .middle {
        margin-left: calc(100% / 4);
        margin-right: calc(100% / 4);
        width: calc(100% / 2);
        background-color: #1b1b1b
    }
    .scroll-panel {
        height: calc(100vh - 72px);
    }
    .plusBtn {
        margin-top: 40px;
    }
    .title{
        display: inline-block;
    }
    .saveBtn {
        position: absolute;
        top: 18px;
        right: 24px;
    }
    .deleteBtn{
        margin-left: 20px;
    }
    .synonym{
        margin-top: 20px;
    }
</style>
