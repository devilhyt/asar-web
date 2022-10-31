<script setup>
    import { getFileData, getFileList, updateFile, getAllFileData} from '../assets/utils/backend.js'
    import { addBackendMessage } from '../assets/utils/message.js'
    import { reactive, computed } from 'vue'
    import { useRoute } from 'vue-router'

    const route =  useRoute()
    const params = route.params

    // const slotTypeOptions = ['any', 'text', 'bool', 'categorical', 'float', 'list']
    const useInfluenceConversationArray = ["text", "bool", "categorical", "float", "list"]
    const useValuesArray = ["categorical"]
    const useMinMaxValueArray = ["float"]

    // const mappingTypeOptions = ['from_entity', 'from_text', 'from_intent', 'from_trigger_intent', 'custom']
    const useMappingIntentArray = ['from_entity', 'from_text', 'from_intent', 'from_trigger_intent']
    const useMappingEntityArray = ['from_entity']
    const useMappingValueArray = ['from_intent', 'from_trigger_intent']
    const useMappingActionArray = ['custom']


    let state = reactive({
        slotData: await getFileData(params, "slots") ?? [],
        intentList: await getFileList(params, "intents") ?? [],
        actionList: await getFileList(params, "actions") ?? [],
        entityData: await getAllFileData(params, "entities") ?? [],
        entityList: [],
        useInitialValue: false,
        useInfluenceConversation: computed(() => useInfluenceConversationArray.includes(state.slotData['type'])),
        useValues: computed(() => useValuesArray.includes(state.slotData['type'])),
        useMinMaxValue: computed(() => useMinMaxValueArray.includes(state.slotData['type'])),
        mappingIntentTypeArray: [],
        mappingEntityArray: [],
        useMappingRoleArray: [],
        useMappingGroupArray: [],
        mappingRoleArray: [],
        mappingGroupArray: [],
        triMappingValueArray: [],
        mappingActionArray: []
    })

    state.useInitialValue = Boolean(state.slotData["initial_value"])
    state.entityList = computed(()=> Object.keys(state.entityData))
    state.slotData["mappings"].forEach(mapping => {
        if(Boolean(mapping['not_intent'])){
            state.mappingIntentTypeArray.push("not_intent")
        }else{
            state.mappingIntentTypeArray.push("intent")
        }
        if(Boolean(mapping['entity'])){
            state.mappingEntityArray.push(mapping['entity'])
        }else{
            state.mappingEntityArray.push(null)
        }
        if(Boolean(mapping['role'])){
            state.mappingRoleArray.push(mapping['role'])
        }else{
            state.mappingRoleArray.push(null)
        }
        if(Boolean(mapping['group'])){
            state.mappingGroupArray.push(mapping['group'])
        }else{
            state.mappingGroupArray.push(null)
        }
        if(Boolean(mapping['action'])){
            state.mappingActionArray.push(mapping['actuib'])
        }else{
            state.mappingActionArray.push(null)
        }
        if(mapping['entity'] != undefined){
            state.useMappingRoleArray.push(Boolean(state.entityData[mapping['entity']].roles.length))
            state.useMappingGroupArray.push(Boolean(state.entityData[mapping['entity']].groups.length))
        }else{
            state.useMappingRoleArray.push(false)
            state.useMappingGroupArray.push(false)
        }
        if(mapping.hasOwnProperty("value")){
            if(mapping['value'] == null){
                state.triMappingValueArray.push(null)
            }else{
                state.triMappingValueArray.push(true)
            }
        }else{
            state.triMappingValueArray.push(false)
        }
    });


    let temp = reactive({
        minValue: state.slotData['min_value'] ?? 0.0,
        maxValue: state.slotData['max_value'] ?? 1.0,
    })

    function onSlotTypeChange(){
        let slotData = state.slotData
        if(!useInfluenceConversationArray.includes(slotData['type'])){
            slotData['influence_conversation'] = false
        }
        if(!useValuesArray.includes(slotData['type'])){
            delete slotData['values']
        }
        if(!useMinMaxValueArray.includes(slotData['type'])){
            delete slotData['min_value']
            delete slotData['max_value']
        }
    }

    function onUseInitialValueChange(){
        if(!state.useInitialValue){
            delete state.slotData["initial_value"]
        }else{
            state.slotData["initial_value"] = ""
        }
    }

    function onMinValueChange(event){
        if(event.value == null){
            delete state.slotData['min_value']
        }else{
            state.slotData['min_value'] = event.value
        }
    }

    function onMaxValueChange(event){
        if(event.value == null){
            delete state.slotData['max_value']
        }else{
            state.slotData['max_value'] = event.value
        }
    }

    function onValuesRemove(){
        if(Array.isArray(state.slotData['values'])){
            if(state.slotData['values'].length == 0){
                delete state.slotData['values']
            }
        }
    }

    function onMappingTypeChange(index){
        let slotType = state.slotData['mappings'][index]['type']
        if(useMappingIntentArray.includes(slotType)){
            delete state.slotData['mappings'][index]['intent']
            delete state.slotData['mappings'][index]['not_intent']
        }
        if(useMappingEntityArray.includes(slotType)){
            delete state.slotData['mappings'][index]['entity']
            delete state.slotData['mappings'][index]['role']
            delete state.slotData['mappings'][index]['group']
        }
        if(useMappingValueArray.includes(slotType)){
            delete state.slotData['mappings'][index]['value']
        }
        if(useMappingActionArray.includes(slotType)){
            delete state.slotData['mappings'][index]['action']
        }
    }

    function onAddMapping(){
        if(Boolean(state.slotData['mappings'])){
            state.slotData['mappings'].push({type:"from_entity"})
        }else{
            state.slotData['mappings'] = [{type:"from_entity"}]
        }
        state.mappingIntentTypeArray.push("not_intent")
    }

    function onRemoveMapping(index){
        state.slotData['mappings'].splice(index, 1)
    }

    function onMappingIntentSwitchChange(index){
        if(state.mappingIntentTypeArray[index] == "intent"){
            delete state.slotData["mappings"][index]["not_intent"]
        }else{
            delete state.slotData["mappings"][index]["intent"]
        }
    }

    function onIntentSelectChange(index){
        if(state.slotData["mappings"][index][state.mappingIntentTypeArray[index]].length == 0){
            delete state.slotData["mappings"][index][state.mappingIntentTypeArray[index]]
        }
    }

    function onMappingEntityChange(index){
        if(state.mappingEntityArray[index] == null){
            state.mappingEntityArray[index] = state.entityList[0]
        }
        let entity = state.mappingEntityArray[index]
        if(state.entityList.includes(entity)){
            state.slotData["mappings"][index]["entity"] = entity
            delete state.slotData["mappings"][index]["role"]
            delete state.slotData["mappings"][index]["group"]
            state.mappingRoleArray[index] = null
            state.mappingGroupArray[index] = null
            state.useMappingRoleArray[index] = Boolean(state.entityData[entity].roles.length)
            state.useMappingGroupArray[index] = Boolean(state.entityData[entity].groups.length)
        }
    }

    function onMappingGroupChange(index){
        if(state.mappingGroupArray[index] == null){
            delete state.slotData["mappings"][index]["group"]
        }
        let group = state.mappingGroupArray[index]
        if(state.entityData[state.mappingEntityArray[index]].groups.includes(group)){
            state.slotData["mappings"][index]["group"] = group
        }
    }

    function onMappingRoleChange(index){
        if(state.mappingRoleArray[index] == null){
            delete state.slotData["mappings"][index]["role"]
        }
        let role = state.mappingRoleArray[index]
        if(state.entityData[state.mappingEntityArray[index]].roles.includes(role)){
            state.slotData["mappings"][index]["role"] = role
        }
    }

    function onTriMappingValueChange(index){
        switch(state.triMappingValueArray[index]){
            case true:
                state.slotData["mappings"][index]["value"] = ""
                break
            case false:
                delete state.slotData["mappings"][index]["value"]
                break
            case null:
                state.slotData["mappings"][index]["value"] = null
                break
        }
    }

    function onMappingActionChange(index){
        if(state.mappingActionArray[index] == null){
            delete state.slotData["mappings"][index]["action"]
        }
        let action = state.mappingActionArray[index]
        if(state.actionList.includes(action)){
            state.slotData["mappings"][index]["action"] = action
        }
    }

    function onAddCondition(index){
        if(Boolean(state.slotData['mappings'][index]['conditions'])){
            state.slotData['mappings'][index]['conditions'].push({active_loop:""})
        }else{
            state.slotData['mappings'][index]['conditions'] = [{active_loop:""}]
        }
    }

    function onRemoveCondition(index, conditionIndex){
        state.slotData['mappings'][index]['conditions'].splice(conditionIndex, 1)
    }

    function onConditionRequestedSlotChange(index, conditionIndex){
        let condition = state.slotData["mappings"][index]["conditions"][conditionIndex]
        if(!Boolean(condition['requested_slot'])){
            delete state.slotData["mappings"][index]["conditions"][conditionIndex]["requested_slot"]
        }
    }

    async function onSave(){
        let body = {
            content: state.slotData
        }
        let response = await updateFile(params, "slots", body)
        addBackendMessage("/api.file.update.", response, {file: params.fileName})
    }
</script>

<template>
    <EditorLayout>
        <Button class='saveBtn' @click="onSave">{{ $t('save') }}</Button>
        <div class='editor'>
            <div class='middle'>
                <ScrollPanel class='scroll-panel'>
                    <div class='content'>
                        <div class='title'>
                            <label>{{ $t("type") }} :</label>
                            <select class="switch" v-model="state.slotData['type']" @change="onSlotTypeChange">
                                <option value="any">{{ $t('any') }}</option>
                                <option value="text">{{ $t('text') }}</option>
                                <option value="bool">{{ $t('bool') }}</option>
                                <option value="categorical">{{ $t('categorical') }}</option>
                                <option value="float">{{ $t('float') }}</option>
                                <option value="list">{{ $t('list') }}</option>
                            </select>
                        </div>
                        <div class='inner gap'>
                            <div v-if="state.useInfluenceConversation">
                                <Checkbox class='checkBox' v-model="state.slotData['influence_conversation']" :binary="true" />
                                <label class='checkText'>{{ $t('influenceConversation') }}</label>
                            </div>
                            <div v-if="state.useMinMaxValue">
                                <label class='item-text inner'>{{ $t('maxValue') }}</label>
                                <InputNumber class='value-input' v-model="temp.maxValue" mode="decimal" :useGrouping="false" :maxFractionDigits="10" @input="onMaxValueChange"/><br>
                                <label class='item-text inner'>{{ $t('minValue') }}</label>
                                <InputNumber class='value-input' v-model="temp.minValue" mode="decimal" :useGrouping="false" :maxFractionDigits="10" @input="onMinValueChange"/><br>
                            </div>
                            <div v-if="state.useValues">
                                <label class='item-text inner'>{{ $t('values') }}</label>
                                <Chips class='value-input' v-model="state.slotData['values']" separator="," @remove="onValuesRemove"/><br>
                            </div>
                            <div>
                                <Checkbox class='checkBox' v-model="state.useInitialValue" :binary="true" style="height:27px;" @change="onUseInitialValueChange"/>
                                <label class='checkText item-text'>{{ $t('initialValue') }}</label>
                                <InputText class='value-input' v-if='state.useInitialValue' type="text" v-model="state.slotData['initial_value']"/>
                            </div>
                        </div>
                        <div class='title'>
                            <label>{{ $t("mappings") }}</label>
                            <Button class="addMappingBtn" @click="onAddMapping">{{ $t('add') }}</Button>
                        </div>
                        <div class='inner gap'>
                            <Accordion class='mappings-accordion' :multiple="true">
                                <AccordionTab v-for="(mapping, index) in state.slotData['mappings']" :key='mapping'>
                                    <template #header>
                                        <span>
                                            <select class="mapping-type-switch" v-model="mapping['type']" @change="onMappingTypeChange(index)" @click="$event.stopPropagation()">
                                                <option value="from_entity">{{ $t('fromEntity') }}</option>
                                                <option value="from_text">{{ $t('fromText') }}</option>
                                                <option value="from_intent">{{ $t('fromIntent') }}</option>
                                                <option value="from_trigger_intent">{{ $t('fromTriggerIntent') }}</option>
                                                <option value="custom">{{ $t('custom') }}</option>
                                            </select>
                                            <Button v-if="state.slotData['mappings'].length > 1" class="removeMappingBtn p-button-secondary" icon="pi pi-trash" @click="onRemoveMapping(index)"/>
                                        </span>
                                    </template>
                                    <div class="inner gap">
                                         <div class="gap" v-if="useMappingIntentArray.includes(mapping['type'])">
                                            <select class="mapping-intent-switch" v-model="state.mappingIntentTypeArray[index]" @change="onMappingIntentSwitchChange(index)">
                                                <option value="intent">{{ $t('useIntents') }}</option>
                                                <option value="not_intent">{{ $t('ignoredIntents') }}</option>
                                            </select>
                                            <MultiSelect class="mapping-intent-select inner" v-model="mapping[state.mappingIntentTypeArray[index]]" :options="state.intentList" :placeholder="$t('selectIntents')" @change="onIntentSelectChange(index)" />
                                        </div>
                                        <div class="gap" v-if="useMappingEntityArray.includes(mapping['type'])">
                                            <label class="item-text">{{ $t('entity') }}</label>
                                            <CustomAutoComplete class="inner" v-model="state.mappingEntityArray[index]" :data_list='state.entityList' @onChange="onMappingEntityChange(index)" />
                                            <div class="gap" v-if="state.useMappingRoleArray[index]">
                                                <label class="item-text">{{ $t('role') }}</label>
                                                <CustomAutoComplete class="inner" v-model="state.mappingRoleArray[index]" :data_list="state.entityData[mapping['entity']].roles" @onChange="onMappingRoleChange(index)" />
                                            </div>
                                            <div class="gap" v-if="state.useMappingGroupArray[index]">
                                                <label class="item-text">{{ $t('group') }}</label>
                                                <CustomAutoComplete class="inner" v-model="state.mappingGroupArray[index]" :data_list="state.entityData[mapping['entity']].groups" @onChange="onMappingGroupChange(index)" />
                                            </div>
                                        </div>
                                        <div class="tri-value-div gap" v-if="useMappingValueArray.includes(mapping['type'])">
                                            <TriStateCheckbox class="tri-mapping-value" v-model="state.triMappingValueArray[index]" @click="onTriMappingValueChange(index)" />
                                            <label class="item-text">{{ $t('value') }}</label>
                                            <InputText class='mapping-value-input inner' v-if="state.triMappingValueArray[index]" type="text" v-model="mapping['value']"/>
                                            <label v-if="state.triMappingValueArray[index] == null" class="item-text inner">{{ $t('null') }}</label>
                                        </div>
                                        <div class="gap" v-if="useMappingActionArray.includes(mapping['type'])">
                                            <label class="item-text">{{ $t('action') }}</label>
                                            <CustomAutoComplete class="inner" v-model="state.mappingActionArray[index]" :data_list="state.actionList" @onChange="onMappingActionChange(index)" />
                                        </div>
                                    </div>
                                    <div class='title gap'>
                                        <label>{{ $t('conditions') }}</label>
                                        <Button class="inner addConditionBtn" @click="onAddCondition(index)">{{ $t('add') }}</Button>
                                    </div>
                                    <div class="inner gap relative" v-for="(condition, conditionIndex) in mapping['conditions']" :key="condition">
                                        <Button class="removeConditionBtn" @click="onRemoveCondition(index, conditionIndex)" icon="pi pi-trash" />
                                        <label>{{ $t('condition') }} {{conditionIndex + 1}} :</label>
                                        <div class="inner">
                                            <label class="item-text">{{ $t('active_loop') }}</label>
                                            <InputText class='inner' type="text" v-model="condition['active_loop']"/>
                                        </div>
                                        <div class="inner">
                                            <label class="item-text">{{ $t('requestedSlot') }}</label>
                                            <InputText class='inner' type="text" v-model="condition['requested_slot']" @input="onConditionRequestedSlotChange(index, conditionIndex)"/>
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
</template>

<script>
    export default {
        name: ["SlotEditor"],
    }
</script>

<style lang="scss" scoped>
    .saveBtn {
        position: absolute;
        top: 18px;
        right: 24px;
    }
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
    .switch {
        position: absolute;
        margin-top: 8px;
        margin-left: 12px;
        width: 150px;
        height: 36px;
        font-size: 20px;
        text-align: center;
        background-color: #333333;
        color: #E0E0E0;
    }
    .mapping-type-switch {
        margin-left: 6px;
        width: 416px;
        height: 38px;
        font-size: 20px;
        text-align: center;
        background-color: #333333;
        color: #E0E0E0;
    }
    .mapping-intent-switch {
        width: 150px;
        height: 36px;
        font-size: 18px;
        text-align: center;
        background-color: #333333;
        color: #E0E0E0;
    }
    .mapping-intent-select {
        width: 235px;
        color: #1b1b1b;
        max-width: 235px;
    }
    .inner {
        margin-left: 30px;
    }
    .checkBox {
        height: 24px;
    }
    .checkText {
        margin-left: 10px;
    }
    .value-input {
        position: absolute;
        margin-left: 20px;
        height: 32px;
    }
    .item-text {
        display: inline-block;
        width: 150px;
    }
    .mappings-accordion {
        width: 500px;
        color: #E0E0E0;
        background-color: #1e1e1e;
        :deep(.p-accordion-header-link) {
            height: 38px;
        }
        :deep(.p-accordion-content) {
            font-size: 24px;
            color: #E0E0E0;
            background-color: #1e1e1e;
        }
    }
    .removeMappingBtn {
        position: absolute;
        right: -1px;
        height: 38px;
    }
    .addMappingBtn {
        position: absolute;
        margin-top: 7px;
        margin-left: 20px;
    }
    .gap {
        margin-top: 10px;
    }
    .tri-value-div {
        position: relative;
    }
    .tri-mapping-value {
        position: absolute;
        left: -30px;
        margin-top: 6px;
        transform: scale(1.2);
    }
    .mapping-value-input {
        height: 32px;
        position: absolute
    }
    .addConditionBtn {
        margin-bottom: 4px;
    }
    .removeConditionBtn {
        position: absolute;
        margin-top: -2px;
        left: -32px;
        transform: scale(0.6);
    }
    .relative {
        position: relative
    }
</style>