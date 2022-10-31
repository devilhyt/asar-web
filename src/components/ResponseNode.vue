<script setup>
    import { Handle, Position } from '@braks/vue-flow'
    import { reactive } from 'vue'

    let props = defineProps({
        id: String,
        data: Object,
        response_list: Array
    })

    if(!props.data.hasOwnProperty("name")){
        props.data.name = props.response_list[0]
    }

    let state = reactive({
        response: props.data.name
    })

    function onResponseChange(){
        if(state.response == null){
            state.response = props.response_list[0]
        }
        if(props.response_list.includes(state.response)){
            props.data.name = state.response
        }
    }
</script>

<template>
    <div class='node'>
        <Handle :id="id + '_in'" type="target" :position="Position.Top" />
        <div>{{ $t('response') }}</div>
        <CustomAutoComplete v-model="state.response" class="responseAutoComplete" :data_list='props.response_list' @onChange="onResponseChange" inputStyle="text-align:center; font-size: 6px;" />
        <Handle :id="id + '_out'" type="source" :position="Position.Bottom" />
    </div>
</template>

<style scoped lang="scss">
    .node{
        color: #00437a;
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
    .responseAutoComplete {
        height: 18px;
        left: 6px;
        margin-top: 10px;
        margin-right: 10px;
        :deep() {
            button {
                width: 15px;
            }
        }
    }
</style>