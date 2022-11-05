<script setup>
    import { getFileData, updateFile, getFileList } from '../assets/utils/backend.js'
    import { addBackendMessage } from '../assets/utils/message.js'
    import { useRoute } from 'vue-router'
    import { reactive } from 'vue'

    const params = useRoute().params
    let responseRequest = await getFileData(params, "responses")

    let state = reactive({
        responseData: responseRequest.data,
        useCheckBoxState: reactive({
            "text": responseRequest.data.map(data => { return Boolean(data.text) }),
            "image": responseRequest.data.map(data => { return Boolean(data.image) })
        }),
        slotList: await getFileList(params, "slots"),
        selectedSlotArray: []
    })

    function onAddResponse(){
        state.responseData.push({})
    }

    function onRemoveResponse(index){
        state.responseData.splice(index, 1)
        state.useCheckBoxState['text'].splice(index, 1)
        state.useCheckBoxState['image'].splice(index, 1)
    }

    function onCheckBoxChange(index, type){
        if(state.useCheckBoxState[type][index]){
            state.responseData[index][type] = ""
        }else{
            delete state.responseData[index][type]
        }
    }

    function onInsertSlot(index){
        if(state.responseData[index]["text"] != undefined){
            state.responseData[index]["text"] = state.responseData[index]["text"].concat("{", state.selectedSlotArray[index] ,"}")
        }
    }

    async function onSave(){
        let body = {
            "content": {
                "data": state.responseData.filter(x => Object.keys(x).length != 0)
            }
        }
        let response = await updateFile(params, "responses", body)
        addBackendMessage("/api.file.update.", response, {file: params.fileName})
    }
</script>

<template>
    <EditorLayout>
        <Button class="saveBtn" @click="onSave">{{ $t('save') }}</Button>
        <div class='editor'>
            <div class='middle'>
                <ScrollPanel class='scroll-panel'>
                    <div class="inner gap">
                        <div class='title'>
                            <label>{{ $t("response") }}</label>
                            <Button class="addResponseBtn" @click="onAddResponse">{{ $t('add') }}</Button>
                        </div>
                        <Accordion class='examples-accordion inner gap' :multiple="true">
                            <AccordionTab v-for="(response, index) in state.responseData" :key="response">
                                <template #header>
                                    {{$t("response") + " " +(index + 1)}}
                                    <Button v-if="state.responseData.length > 1" class="removeResponseBtn p-button-secondary" icon="pi pi-trash" @click="onRemoveResponse(index)"/>
                                </template>
                                <div class="item">
                                    <Checkbox class="item-checkbox" v-model="state.useCheckBoxState['text'][index]" :binary="true" @change="onCheckBoxChange(index, 'text')" />
                                    <label class="item-title">{{ $t('text') }}</label>
                                    <div class="inner"  v-if="state.useCheckBoxState['text'][index]">
                                        <Textarea class="text-input gap" v-model="state.responseData[index]['text']" :autoResize="true" />
                                        <CustomAutoComplete class="slotAutoComplete" v-model="state.selectedSlotArray[index]" :data_list="state.slotList" :placeholder="$t('slot')"/>
                                        <Button class='slotBtn' @click="onInsertSlot(index)" >{{ $t('add') }}</Button>
                                    </div>
                                </div>
                                <div class="item">
                                    <Checkbox class="item-checkbox" v-model="state.useCheckBoxState['image'][index]" :binary="true" @change="onCheckBoxChange(index, 'image')" />
                                    <label class="item-title">{{ $t('image') }}</label>
                                    <div class="inner"  v-if="state.useCheckBoxState['image'][index]">
                                        <InputText class="text-input" v-model="state.responseData[index]['image']" :placeholder="$t('url')" />  
                                    </div>
                                </div>
                            </AccordionTab>
                        </Accordion>
                    </div>
                </ScrollPanel>
            </div>
        </div> 
    </EditorLayout>
</template>

<script>
    export default {
        name: ["ResponseEditor"],
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
    .scroll-panel {
        font-size: 24px;
        color: #E0E0E0;
        width: 100%;
        height: calc(100vh - 72px);
        .content {
            margin-top: 20px;
            margin-left: 30px;
            .title {
                font-size: 36px;
            }
        }
    }
    .inner {
        margin-left: 30px;
    }
    .gap {
        margin-top: 10px;
    }
    .examples-accordion {
        width: 500px;
        color: #E0E0E0;
        background-color: #1e1e1e;
        :deep(.p-accordion-header-link) {
            height: 38px;
        }
        :deep(.p-accordion-content) {
            color: #E0E0E0;
            background-color: #1e1e1e;
        }
    }
    .item {
        font-size: 24px;
    }
    .item-title{
        margin-left: 10px;
        font-size: 32px;
    }
    .item-checkbox {
        top: -10px;
        transform: scale(1.4);
    }
    .addResponseBtn {
        position: absolute;
        margin-top: 7px;
        margin-left: 20px;
    }
    .removeResponseBtn {
        position: absolute;
        right: -1px;
        height: 38px;
    }
    .text-input {
        width: calc(100% - 40px);
        height: 42px;
    }
    .slotAutoComplete {
        margin-top: 10px;
    }
    .slotBtn {
        margin-left: 20px;
    }
</style>