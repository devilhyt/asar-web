<script setup>
    import { Handle, Position } from '@braks/vue-flow'

    defineProps({
        id: String,
        data: Object,
        action_list: Array
    })
</script>


<template>
    <div class='node'>
        <Handle :id="id + '_in'" type="target" :position="Position.Top" />
        <div>Action</div>
        <CustomAutoComplete v-model="action_temp" class="actionAutoComplete" :data_list='action_list' @onChange="onActionChange" inputStyle="text-align:center; font-size: 6px;" />
        <Handle :id="id + '_out'" type="source" :position="Position.Bottom" />
    </div>
</template>

<script>
    export default {
        data(){
            return{
                action_temp: this.$props.data.name
            }
        },
        methods: {
            onActionChange(){
                if(this.action_temp == null){
                    this.action_temp = this.action_list[0]
                }else{
                    this.data.name = this.action_temp
                }
            }
        }
    }
</script>

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
        left: 10px;
        margin-right: 10px;
    }
</style>

<style lang="scss">
    #app > div.bottom > div > div > div.vue-flow__viewport.vue-flow__container > div.vue-flow__transformationpane.vue-flow__container > div > div {
        div > span > button {
            width: 15px;
        }
    }
</style>