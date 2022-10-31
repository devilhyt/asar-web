<script setup>
    import { getFileData, updateFile, getFileList } from '../assets/utils/backend.js'
    import { addBackendMessage } from '../assets/utils/message.js'
    import { useRoute } from 'vue-router'
    import { reactive } from 'vue'

    const params = useRoute().params

    let state = reactive({
        formData: await getFileData(params, "forms"),
        intentList: await getFileList(params, "intents"),
        slotList: await getFileList(params, "slots")
    })

    function onSelectedSlotChange(){
        if(state.formData["required_slots"].length == 0){
            delete state.formData["required_slots"]
        }
    }

    function onSelectedFormChange(){
        if(state.formData["ignored_intents"].length == 0){
            delete state.formData["ignored_intents"]
        }
    }

    async function onSave(){
        let body = {
            content: state.formData
        }
        let response = await updateFile(params, "forms", body)
        addBackendMessage("/api.file.update.", response, {file: params.fileName})
    }
</script>

<template>
    <EditorLayout>
        <Button class="saveBtn" @click="onSave">{{ $t('save') }}</Button>
        <div class='editor'>
            <div class='middle'>
                <div class="inner gap">
                    <div class='title'>
                        <label>{{ $t("requiredSlots") }}</label>
                    </div>
                    <MultiSelect class='multi-select' v-model="state.formData['required_slots']" :options="state.slotList" @change="onSelectedSlotChange"/>
                    <div class='title'>
                        <label>{{ $t("ignoredIntents") }}</label>
                    </div>
                    <MultiSelect class='multi-select' v-model="state.formData['ignored_intents']" :options="state.intentList" @change="onSelectedFormChange"/>
                </div>
            </div>
        </div> 
    </EditorLayout>
</template>

<script>
    export default {
        name: ["FormEditor"],
        created() {
            document.body.style.backgroundColor = "#333333";
        }
    }
</script>

<style lang="scss" scoped>
    .editor {
        background-color: #1e1e1e;
    }
    .middle {
        width: calc(100% / 2);
        height: calc(100vh - 72px);
        background-color: #1b1b1b;
        margin-left: calc(100%/4);
        margin-right: calc(100%/4);
        .title {
            font-size: 36px;
        }
    }
    .saveBtn {
        z-index: 2;
        position: absolute;
        top: 18px;
        right: 24px;
    }
    .inner {
        margin-left: 30px;
    }
    .gap {
        margin-top: 10px;
    }
    .title {
        font-size: 36px;
    }
    .multi-select {
        margin-top: 10px;
        width: 260px;
        margin-left: 20px;
        color: #1b1b1b;
    }
</style>