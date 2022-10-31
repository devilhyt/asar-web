<script setup>
    import { Handle, Position } from '@braks/vue-flow'
    import { reactive } from 'vue'

    let props = defineProps({
        id: String,
        data: Object,
        form_list: Array
    })

    if(!props.data.hasOwnProperty("name")){
        props.data.name = props.form_list[0]
    }

    let state = reactive({
        form: props.data.name
    })

    function onFormChange(){
        if(state.form == null){
            state.form = props.form_list[0]
        }
        if(props.form_list.includes(state.form)){
            props.data.name = state.form
        }
    }
</script>

<template>
    <div class='node'>
        <Handle :id="id + '_in'" type="target" :position="Position.Top" />
        <div>{{ $t('form') }}</div>
        <CustomAutoComplete v-model="state.form" class="formAutoComplete" :data_list='props.form_list' @onChange="onFormChange" inputStyle="text-align:center; font-size: 6px;" />
        <Handle :id="id + '_out'" type="source" :position="Position.Bottom" />
    </div>
</template>

<style scoped lang="scss">
    .node {
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
    .formAutoComplete {
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