<script setup>
    import { Handle, Position } from '@braks/vue-flow'

    defineProps({
        id: String,
        data: Object,
        slot_list: Array
    })
</script>

<template>
    <div class='node'>
        <Handle :id="id + '_in'" type="target" :position="Position.Top" />
        <div>
            <label>{{ $t('slot_was_set') }}</label>
            <Button class="plusBtn" icon="pi pi-plus" iconPos="right" @click="onAddSlot"/>
        </div>
        <div class="slot" v-for="(value, index) in data.slots" :key="(value, index)">
            <Button v-if="slots.length != 1" class="deleteBtn" icon="pi pi-trash" @click="onDeleteSlot(index)"/>
            <label>{{ $t('slot') }}</label>
            <CustomAutoComplete v-model="slot_temp_list[index]" class="slotAutoComplete" :data_list='slot_list' @onChange="onSlotChange(index)" inputStyle="font-size: 6px;" />
            <br>
            <TriStateCheckbox class="value-check" v-model="value_check[index]" @click="onValueCheckChange(index)" />
            <label>{{ $t('value') }}</label>
            <InputText v-if="value_check[index]" v-model="value['value']" class="input-value"/>
            <label v-if="value_check[index] == null" class="tri-text">{{ $t('null') }}</label>
        </div>
        <Handle :id="id + '_out'" type="source" :position="Position.Bottom" />
    </div>
</template>

<script>
    export default {
        data() {
            if(!this.$props.data.hasOwnProperty("name")){
                this.$props.data.name = this.$props.slot_list[0]
            }
            if(!this.$props.data.hasOwnProperty("slots")){
                this.$props.data.slots = [{slot: this.$props.slot_list[0]}]
            }
            return {
                slots: this.$props.data.slots,
                slot_temp_list: this.$props.data.slots.map(data => data.slot),
                value_check: this.$props.data.slots.map(data => {
                    if(data.value === null){
                        return null
                    }else if(typeof data.value === 'string'){
                        return true
                    }
                    return false
                })
            }
        },
        methods: {
            onAddSlot(){
                if(this.slot_list.length != 0){
                    this.slots.push({"slot": this.slot_list[0]})
                    this.slot_temp_list.push(this.slot_list[0])
                    this.value_check.push(false)
                }
            },
            onSlotChange(index){
                if(this.slot_temp_list[index] == null){
                    this.slot_temp_list[index] = this.slot_list[0]
                }
                if(this.slot_list.includes(this.slot_temp_list[index])){
                    this.value_check[index] = false
                    delete this.slots[index].value
                    this.slots[index].slot = this.slot_temp_list[index]
                    if(this.slot_temp_list[index] == "requested_slot"){
                        this.value_check[index] = null
                        this.slots[index].value = null
                    }
                }
            },
            onDeleteSlot(index){
                this.slots.splice(index, 1)
                this.slot_temp_list.splice(index, 1)
                this.value_check.splice(index, 1)
            },
            onValueCheckChange(index){
                if(this.slot_temp_list[index] == "requested_slot"){
                    if(this.value_check[index] === false){
                        this.value_check[index] = null
                    }
                }
                if(this.value_check[index] === true){
                    this.slots[index].value = ""
                }else if(this.value_check[index] === false){
                    delete this.slots[index].value
                }else{
                    this.slots[index].value = null
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .node {
        color: #007d86;
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
    .plusBtn {
        position: absolute;
        border-width: initial;
        border-radius: initial;
        border-width: initial;
        padding: initial;
        width: 15.5px;
        height: 15.5px;
        right: 8px;
        top: 8px;
        :deep() {
            width: 24px;
            height: 24px;
            transform: scale(0.6);
        }
    }
    .slot {
        text-align: left;
        margin-top: 10px;
        margin-left: 10px;
    }
    .slotAutoComplete {
        position: absolute;
        width: 110px;
        height: 12px;
        right: 8px;
        margin-top: 3px;
        :deep() {
            button {
                width: 15px;
            }
        }
    }
    .deleteBtn {
        position: absolute;
        margin-top: -1px;
        left: -1px;
        width: 24px;
        height: 24px;
        transform: scale(0.6);
    }
    .input-value {
        position: absolute;
        width: 110px;
        height: 12px;
        right: 8px;
        margin-top: 4px;
        font-size: 6px;
    }
    .value-check {
        transform: scale(0.7);
        top: 1.5px;
        margin-left: -20px;
        :deep() {
            transform: scale(0.7);
        }
    }
    .tri-text {
        position: absolute;
        right: 96px;
        margin-top: 3px;
    }
</style>