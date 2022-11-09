<script setup>
    import { getFileData, getAllFileData, updateFile } from '../assets/utils/backend.js'
    import { addMessage, addBackendMessage } from '../assets/utils/message.js'
    import { useRoute } from 'vue-router'
    import { computed, onMounted, onBeforeUnmount, reactive, watch } from 'vue'
    import { useI18n } from 'vue-i18n'

    document.body.style.backgroundColor = "#333333";
    
    const params = useRoute().params
    const { t } = useI18n()

    let state = reactive({
        intentData: await getFileData(params, "intents"),
        selectedEntityOption: "default",
        selectedEntities: [],
        entityData: await getAllFileData(params, "entities"),
        entityList: [],
        temp: reactive({
            entity: null,
            role: null,
            group: null
        }),
        mark: reactive({
            markIndex: 0,
            startIndex: 0,
            endIndex: 0,
            text: "",
            entity: null,
            role: null,
            group: null
        }),
        showRole: false,
        showGroup: false
    })
    state.entityList = computed(()=> Object.keys(state.entityData))
    if(Object.keys(state.intentData).includes("use_entities")){
        state.selectedEntityOption = "use_entities"
        state.selectedEntities = state.intentData["use_entities"]
    }else if(Object.keys(state.intentData).includes("ignore_entities")){
        state.selectedEntityOption = "ignore_entities"
        state.selectedEntities = state.intentData["ignore_entities"]
    }

    watch(() => (state.mark.entity), ()=>{
        if(!Boolean(state.mark.entity)){
            state.showRole = false
            state.showGroup = false
            return
        }
        let data = state.entityData[state.mark.entity]
        state.showRole = Boolean(data.roles.length)
        state.showGroup = Boolean(data.groups.length)
        state.temp.role = null
        state.temp.group = null
        state.mark.role = null
        state.mark.group = null
    })

    function onEntityChange(){
        if(!state.entityList.includes(state.temp.entity))
            state.temp.entity = state.entityList[0]
        state.mark.entity = state.temp.entity
    }

    function onRoleChange(){
        let dataList = state.entityData[state.mark.entity].roles
        if(!dataList.includes(state.temp.role))
            state.temp.role = dataList[0]
        state.mark.role = state.temp.role
    }

    function onGroupChange(){
        let dataList = state.entityData[state.mark.entity].groups
        if(!dataList.includes(state.temp.role))
            state.temp.group = dataList[0]
        state.mark.group = state.temp.group
    }

    function showMarkArea(event){
        let markArea = document.getElementById("markArea")
        if(event.target.className.includes("mark-label")){
            let selection = window.getSelection()
            if(selection.toString()){
                let left  = event.clientX  + "px";
                let top  = event.clientY  + "px";

                let mark = state.mark

                mark.markIndex = parseInt(event.target.id)

                if(selection.anchorOffset > selection.focusOffset){
                    mark.startIndex = selection.focusOffset
                    mark.endIndex = selection.anchorOffset
                }else{
                    mark.startIndex = selection.anchorOffset
                    mark.endIndex = selection.focusOffset
                }

                mark.text = state.intentData.examples[mark.markIndex].text.substring(mark.startIndex, mark.endIndex)

                markArea.style.left = left
                markArea.style.top = top
                markArea.style.visibility = "visible"
            }
        }
    }

    function hideMarkArea(event){
        if(event.target.className.includes("p-autocomplete-item")){
            return
        }
        if(markArea.style.visibility != "hidden"){
            let markAreaRect = markArea.getBoundingClientRect()
            if((event.clientX - markAreaRect.x >= 0 && event.clientX - markAreaRect.x <= markAreaRect.width)){
                if((event.clientY - markAreaRect.y >= 0 && event.clientY - markAreaRect.y <= markAreaRect.height)){
                    return
                }
            }
            markArea.style.visibility = "hidden"
        }
    }

    onMounted(() => {
        document.addEventListener('mouseup', showMarkArea)
        document.addEventListener('mousedown', hideMarkArea)
    })
    
    onBeforeUnmount(() => {
        document.removeEventListener('mouseup', showMarkArea)
        document.removeEventListener('mousedown', hideMarkArea)
    })

    function onSelectedEntityChange(){
        if(state.selectedEntityOption != "default"){
            state.intentData[state.selectedEntityOption] = state.selectedEntities
        }
    }

    function onEntityOptionChange(){
        switch(state.selectedEntityOption){
            case 'default':
                delete state.intentData["use_entities"]
                delete state.intentData["ignore_entities"]
                break
            case 'use_entities':
                state.intentData["use_entities"] = []
                delete state.intentData["ignore_entities"]
                break
            case 'ignore_entities':
                state.intentData["ignore_entities"] = []
                delete state.intentData["use_entities"]
                break
        }
        state.selectedEntities = []
    }

    function onAddMark(){
        let mark = state.mark

        if(!Boolean(mark.entity)){
            addMessage({severity: "warn", content: t('entityCanNotBeNull')})
            return
        }
        
        let label = {
            token: mark.text,
            start: mark.startIndex,
            end: mark.endIndex,
            entity: mark.entity
        }
        if(Boolean(mark.role)){
            label.role = mark.role
        }
        if(Boolean(mark.group)){
            label.group = mark.group
        }

        state.intentData.examples[mark.markIndex].labels.push(label)
    }

    function onRemoveMark(index, label_index){
        state.intentData.examples[index].labels.splice(label_index, 1)
    }

    function onAddExample(){
        state.intentData.examples.push({
            "text":"",
            "labels": []
        })
    }

    function onRemoveExample(index){
        state.intentData.examples.splice(index, 1)
    }

    async function onSave(){
        let body = {
            "content": state.intentData
        }
        let response = await updateFile(params, "intents", body)
        addBackendMessage("/api.file.update.", response, {file: params.fileName})
    }

</script>

<template>
    <EditorLayout>
        <div class='editor'>
            <div class='middle'>
                <Button class="saveBtn" @click="onSave">{{ $t('save') }}</Button>
                <ScrollPanel class='scroll-panel'>
                    <div class='content'>
                        <div class='title'>
                            <label>{{ $t("config") }}</label>
                        </div>
                        <div class="inner">
                            <select class="switch" v-model="state.selectedEntityOption" @change="onEntityOptionChange">
                                <option value="default">{{ $t('default') }}</option>
                                <option value="use_entities">{{ $t('useEntities') }}</option>
                                <option value="ignore_entities">{{ $t('ignoreEntities') }}</option>
                            </select>
                            <MultiSelect class='entity-select' v-if="state.selectedEntityOption != 'default'" v-model="state.selectedEntities" :options="state.entityList" :placeholder="$t('selectEntities')" @change="onSelectedEntityChange"/>
                        </div>
                        <div class='title'>
                            <label>{{ $t("examples") }}</label>
                            <Button class="addExampleBtn" @click="onAddExample">{{ $t('add') }}</Button>
                        </div>
                        <div class="inner">
                            <Accordion class='examples-accordion' :multiple="true">
                                <AccordionTab v-for="(example, index) in state.intentData['examples']" :key="example">
                                    <template #header>
                                        <InputText class="example-input" type="text" v-model="example.text" @click="$event.stopPropagation()"/>
                                        <Button class="removeExampleBtn p-button-secondary" icon="pi pi-trash" @click="onRemoveExample(index)"/>
                                    </template>
                                    <label class="mark unselectable"> {{ $t('mark') }} : </label>
                                    <label class="mark-label" :id="index">{{ example.text }}</label>
                                    <div class="mark-data inner" v-for="(label, label_index) in example.labels" :key="label">
                                        <Button class="removeMarkBtn p-button-secondary" icon="pi pi-trash" @click="onRemoveMark(index, label_index)"/>
                                        <label>{{ $t("text") }} : {{label.token}}</label><br>
                                        <label>{{ $t("entity") }} : {{label.entity}}</label>
                                        <div class="inner" v-if="Boolean(label.role)">
                                            <label>{{ $t("role") }} : {{label.role}}</label>
                                        </div>
                                        <div class="inner" v-if="Boolean(label.group)">
                                            <label>{{ $t("group") }} : {{label.group}}</label>
                                        </div>
                                    </div>
                                </AccordionTab>
                            </Accordion>
                        </div>
                    </div>
                </ScrollPanel>
            </div>
        </div>
    </EditorLayout>
    <div id="markArea" class="markArea">
        <div class="inner mark-content">
            <label>{{ $t("selectedText") }}</label><br>
            <label>- {{ state.mark.startIndex }} ~ {{ state.mark.endIndex }}</label><br>
            <label>- {{ state.mark.text }}</label><br>
            <div class="autoCompleteGap">
                <label>{{ $t("entity") }} :</label>
                <CustomAutoComplete class=" mark-autocomplete" v-model="state.temp.entity" :data_list='state.entityList' @onChange="onEntityChange"/><br>
            </div>
            <div class="autoCompleteGap" v-if="state.showRole">
                <label>{{ $t("role") }} :</label>
                <CustomAutoComplete class="mark-autocomplete" v-model="state.temp.role" :data_list='state.entityData[state.mark.entity].roles' @onChange="onRoleChange"/><br>
            </div>
            <div class="autoCompleteGap" v-if="state.showGroup">
                <label>{{ $t("group") }} :</label>
                <CustomAutoComplete class="mark-autocomplete" v-model="state.temp.group" :data_list='state.entityData[state.mark.entity].groups' @onChange="onGroupChange"/><br>
            </div>
            <Button class="addMarkBtn" @click="onAddMark">{{ $t('add') }}</Button>
        </div>
    </div>
</template>

<script>
    export default {
        name: ["IntentEditor"]
    }
</script>

<style lang="scss" scoped>
    .unselectable {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
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
    .switch {
        width: 200px;
        height: 37px;
        font-size: 20px;
        text-align: center;
        background-color: #333333;
        color: #E0E0E0;
    }
    .saveBtn {
        z-index: 2;
        position: absolute;
        top: 18px;
        right: 24px;
    }
    .entity-select {
        width: 260px;
        margin-left: 20px;
        color: #1b1b1b;
    }
    .inner {
        margin-top: 2px;
        margin-left: 30px;
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
    .example-input {
        color: #E0E0E0;
        font-size: 24px;
        background-color: #1e1e1e;
        height: 38px;
        width: 422px;
    }
    .inner {
        margin-left: 20px;
    }
    .mark-data {
        position: relative;
        font-size: 18px;
        margin-top: 10px;
    }
    .mark-label {
        font-size: 24px;
        background-color: #555555;
    }
    .mark-label:hover {
        cursor: text;
    }
    .mark {
        font-size: 24px;
    }
    .markArea {
        z-index: 4;
        font-size: 24px;
        color: #E0E0E0;
        position: absolute;
        width: 350px;
        height: auto;
        background-color: #222222;
        border: 2px;
        border-style:solid;
        border-color: #ffffff;
        visibility: hidden;
    }
    .mark-autocomplete {
        position: absolute;
        right: 10px;
    }
    .mark-content {
        margin-top: 10px;
    }
    .addMarkBtn {
        float: right;
        margin-top: 15px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .removeMarkBtn {
        position: absolute;
        margin-top: -7px;
        left: -30px;
        transform: scale(0.45);
    }
    .addExampleBtn {
        position: absolute;
        margin-top: 7px;
        margin-left: 20px;
    }
    .removeExampleBtn {
        position: absolute;
        right: -1px;
        height: 38px;
    }
    .autoCompleteGap {
        margin-top: 10px;
    }
</style>