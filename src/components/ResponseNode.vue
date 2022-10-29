<script setup>
    import { Handle, Position } from '@braks/vue-flow'

    defineProps({
        id: String,
        data: Object,
        response_list: Array
    })
</script>

<template>
    <div class='node'>
        <Handle :id="id + '_in'" type="target" :position="Position.Top" />
        <div>{{ $t('response') }}</div>
        <CustomAutoComplete v-model="response_temp" class="responseAutoComplete" :data_list='response_list' @onChange="onResponseChange" inputStyle="text-align:center; font-size: 6px;" />
        <Handle :id="id + '_out'" type="source" :position="Position.Bottom" />
    </div>
</template>

<script>
    export default {
        data(){
            return{
                response_temp: this.$props.data.name
            }
        },
        methods: {
            onResponseChange(){
                if(this.response_temp == null){
                    this.response_temp = this.response_list[0]
                }
                if(this.response_list.includes(this.response_temp)){
                    this.data.name = this.response_temp
                }
            }
        }
    }
</script>

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