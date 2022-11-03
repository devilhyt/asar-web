<script setup>
    import { Handle, Position } from '@braks/vue-flow'
    import { reactive } from 'vue'

    let props = defineProps({
        id: String,
        data: Object,
        slot_list: Array,
        form_list: Array
    })

    if(!props.data.hasOwnProperty("conversation_start")){
        props.data["conversation_start"] = false
    }

    if(!props.data.hasOwnProperty("wait_for_user_input")){
        props.data["wait_for_user_input"] = false
    }

    let state = reactive({
        useValue: []
    })

    let temp = reactive({
        slot: [],
        activeLoop: []
    })

    if(props.data.hasOwnProperty("condition")){
        state.useValue = props.data["condition"].map(data => {
            if(data.value === null){
                return null
            }else if(typeof data.value === 'string'){
                return true
            }
            return false
        })
        temp.slot = props.data["condition"].map(data => {
            if(data.hasOwnProperty("slot")){
                return data.slot
            }
            return null
        })
        temp.activeLoop = props.data["condition"].map(data => {
            if(data.type == "active_loop"){
                return data.value
            }
            return null
        })
    }

    function onConfigChange(type){
        props.data[type] = state[type]
    }

    function onAddCondition(){
        state.useValue.push(true)
        temp.slot.push(props.slot_list[0])
        let obj = {
            "type": "slot_was_set",
            "slot": props.slot_list[0],
            "value": "",
        }
        if(!props.data.hasOwnProperty("condition")){
            props.data["condition"] = [obj]
        }else{
            props.data["condition"].push(obj)
        }
    }

    function onRemoveCondition(index){
        props.data["condition"].splice(index, 1)
        state.useValue.splice(index, 1)
        temp.slot.splice(index, 1)
        temp.activeLoop.splice(index, 1)
    }

    function onConditionTypeChange(index){
        if(props.data["condition"][index]['type'] == "slot_was_set"){
            props.data["condition"][index]['slot'] = temp.slot[index]
            props.data["condition"][index]['value'] = ""
        }else if(props.data["condition"][index]['type'] == "active_loop"){
            delete props.data["condition"][index]['slot']
            props.data["condition"][index]['value'] = ""
        }
    }

    function onValueCheckChange(index){
        if(state.useValue[index] === true){
            props.data["condition"][index]['value'] = ""
        }else if(state.useValue[index] === false){
            props.data["condition"][index]['value'] = null
        }else{
            delete props.data["condition"][index]['value']
        }
    }

    function onSlotChange(index){
        if(temp.slot[index] == null){
            temp.slot[index] = props.slot_list[0]
        }
        if(props.slot_list.includes(temp.slot[index])){
            state.useValue[index] = false
            delete props.data["condition"][index]['value']
            props.data["condition"][index]['slot'] = temp.slot[index]
        }
    }

    function onActiveLoopChange(index){
        if(temp.activeLoop[index] == null){
            temp.activeLoop[index] = ""
            props.data["condition"][index]['value'] = ""
        }
        if(props.form_list.includes(temp.activeLoop[index])){
            props.data["condition"][index]['value'] = temp.activeLoop[index]
        }
    }
</script>

<template>
    <div class='node'>
        <div class="content inner">
            <Checkbox class="value-check" v-model="props.data['conversation_start']" :binary="true" />
            <label>{{ $t('onConversationStart') }}</label><br>
            <Checkbox class="value-check" v-model="props.data['wait_for_user_input']" :binary="true" />
            <label>{{ $t('waitForUserInput') }}</label>
            <div class="condition gap">
                <label>{{ $t('condition') }}</label>
                <Button class="plusBtn" icon="pi pi-plus" @click="onAddCondition"/>
                <div class="gap" v-for="(condition, index) in props.data['condition']" :key="condition">
                    <select class="switch gap" v-model="condition['type']" @change="onConditionTypeChange(index)">
                        <option value="slot_was_set">{{ $t('slot_was_set') }}</option>
                        <option value="active_loop">{{ $t('active_loop') }}</option>
                    </select>
                    <Button class="removeBtn" icon="pi pi-trash" @click="onRemoveCondition(index)"/>
                    <div v-if="condition['type'] == 'slot_was_set'">
                        <div>
                            <label>{{$t('slot')}}</label>
                            <CustomAutoComplete v-model="temp.slot[index]" class="autoComplete" :data_list='slot_list' @onChange="onSlotChange(index)" inputStyle="font-size: 6px;" />
                        </div>
                        <div>
                            <label>{{$t('value')}}</label>
                        </div>
                        <TriStateCheckbox class="slot_value-check" v-model="state.useValue[index]" @click="onValueCheckChange(index)" />
                        <label  class="null" v-if="state.useValue[index] == false">{{$t('null')}}</label>
                        <InputText class="input-value inner" v-if="state.useValue[index]" v-model="condition['value']" />
                    </div>
                    <div v-if="condition['type'] == 'active_loop'">
                        <CustomAutoComplete v-model="temp.activeLoop[index]" class="autoComplete" :data_list='form_list' @onChange="onActiveLoopChange(index)" inputStyle="font-size: 6px;" />
                    </div>
                </div>
            </div>
        </div>
        <div class="gap">{{ $t('start') }}</div>
        <Handle :id="id + '_out'" type="source" :position="Position.Bottom" />
    </div>
</template>

<style scoped lang="scss">
    .node {
        color: #0000ff;
        background-color: white;
        padding: 10px;
        border-radius: 3px;
        width: 180.1px;
        font-size: 12px;
        text-align: center;
        border-width: 0.5px;
        border-style: solid;
        border-color: var(#222222);
    }
    .content {
        text-align: left;
    }
    .condition {
        position: relative;
    }
    .inner {
        margin-left: 20px;
    }
    .gap {
        margin-top: 5px;
    }
    .value-check {
        transform: scale(0.7);
        top: 1.5px;
        margin-left: -20px;
    }
    .slot_value-check {
        transform: scale(0.7);
        margin-top: 2px;
        margin-left: -3px;
    }
    .plusBtn {
        position: absolute;
        margin-top: -2px;
        left: -22px;
        :deep() {
            width: 24px;
            height: 24px;
            transform: scale(0.6);
        }
    }
    .removeBtn {
        top: 2px;
        :deep() {
            width: 24px;
            height: 24px;
            transform: scale(0.8);
        }
    }
    .switch {
        width: 100px;
        height: 20px;
        font-size: 6px;
        text-align: center;
        background-color: #333333;
        color: #E0E0E0;
    }
    .input-value {
        position: absolute;
        width: 110px;
        height: 12px;
        right: 8px;
        margin-top: 4px;
        font-size: 6px;
    }
    .autoComplete {
        width: 110px;
        height: 12px;
        right: 8px;
        margin-top: 3px;
        margin-left: 28px;
        :deep() {
            button {
                width: 15px;
            }
        }
    }
    .null {
        margin-top: -2px;
        margin-left: 2px;
    }
</style>