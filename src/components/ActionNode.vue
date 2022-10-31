<script setup>
    import { Handle, Position } from '@braks/vue-flow'
    import { reactive } from 'vue'

    let props = defineProps({
        id: String,
        data: Object,
        action_list: Array
    })

    let state = reactive({
        action: props.data.name
    })

    function onActionChange(){
        if(state.action == null){
            state.action = props.action_list[0]
        }
        if(props.action_list.includes(state.action)){
            props.data.name = state.action
        }
        console.log(props.data.name)
    }
</script>

<template>
    <div class='node'>
        <Handle :id="id + '_in'" type="target" :position="Position.Top" />
        <div>{{ $t('action') }}</div>
        <CustomAutoComplete class="actionAutoComplete" v-model="state.action" :data_list='props.action_list' @onChange="onActionChange" inputStyle="text-align:center; font-size: 6px;" />
        <Handle :id="id + '_out'" type="source" :position="Position.Bottom" />
    </div>
</template>

<style scoped lang="scss">
    .node{
        color: #007a14;
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
    .actionAutoComplete {
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