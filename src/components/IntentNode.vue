<script setup>
    import { Handle, Position } from '@braks/vue-flow'
    import { useRoute } from 'vue-router'

    const params = useRoute().params
    
    defineProps({
        id: String,
        data: Object,
        intent_list: Array,
        entity_data: Object,
        entity_list: Array
    })

</script>


<template>
    <div class='node'>
        <Handle :id="id + '_in'" type="target" :position="Position.Top" />
        <div class='title'>
            <label>Intent</label><br>
            <CustomAutoComplete id="aciton" v-model="intent_temp" class="intentAutoComplete" :data_list='intent_list' @onChange="onIntentChange" inputStyle="text-align:center; font-size: 6px;" />
            <Button class="plusBtn" icon="pi pi-plus" iconPos="right" @click="onAddEntity"/>
        </div>
        <div class='entity' v-for="(value, index) in entities" :key="(value, index)">
            <Button class="deleteBtn" icon="pi pi-trash" @click="onDeleteEntity(index)"/>
            <label>entity</label>
            <CustomAutoComplete v-model="value['entity']" class="entityAutoComplete" :data_list='entity_list' @onChange="onEntityChange(index)" inputStyle="font-size: 6px;"/>
            <div v-if="value['entity'] != undefined && entity_data[value['entity']] != undefined">
                <div class='role' v-if="entity_data[value['entity']].hasOwnProperty('roles') && entity_data[value['entity']].roles.length != 0">
                    <label class='entity_data'>role</label>
                    <CustomAutoComplete v-model="value['role']" class="roleAutoComplete" :data_list="entity_data[value['entity']].roles" @onChange="onRoleChange(index)" inputStyle="font-size: 6px;" />
                </div>
                <div class='group' v-if="entity_data[entities[0]['entity']].hasOwnProperty('groups') && entity_data[value['entity']].groups.length != 0">
                    <label class='entity_data'>group</label>
                    <CustomAutoComplete v-model="value['group']" class="groupAutoComplete" :data_list="entity_data[value['entity']].groups" @onChange="onGroupChange(index)" inputStyle="font-size: 6px;" />
                </div>
                <Checkbox class="value-check" v-model="value_check[index]" @click="onValueCheckChange(index)" :binary="true" />
                <label>value</label>
                <InputText v-if="value_check[index]" v-model="value['value']" class="input-value" />
            </div>
        </div>
        <Handle :id="id + '_out'" type="source" :position="Position.Bottom" />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                entities: this.$props.data.entities,
                intent_temp: this.$props.data.name,
                value_check: this.$props.data.entities.map(data => {
                    return Boolean(data.value)
                })
            }
        },
        methods: {
            onIntentChange(){
                if(this.intent_temp == null){
                    this.intent_temp = this.intent_list[0]
                }else{
                    this.data.name = this.intent_temp
                }
            },
            onAddEntity(){
                if(this.entity_list.length != 0){
                    this.entities.push({"entity": this.entity_list[0]})
                }
            },
            onEntityChange(index){
                if(this.entities[index].entity == null){
                    delete this.entities[index].entity
                }
                this.value_check[index] = false
                delete this.entities[index].role
                delete this.entities[index].group
            },
            onRoleChange(index){
                if(this.entities[index].role == null){
                    delete this.entities[index].role
                }
            },
            onGroupChange(index){
                if(this.entities[index].entity == null){
                    delete this.entities[index].entity
                }
            },
            onDeleteEntity(index){
                this.entities.splice(index, 1)
            },
            onValueCheckChange(index){
                if(this.value_check[index] == true){
                    delete this.entities[index].value
                }else if(this.value_check[index] == false){
                    this.entities[index].value = ""
                }
            }
        }
    }
</script>


<style scoped lang="scss">
    .node{
        color: #ff6600;
        background-color: white;
        padding: 10px;
        border-radius: 3px;
        width: 180.1px;
        font-size: 12px;
        border-width: 0.5px;
        border-style: solid;
        border-color: var(#222222);
    }
    .title{
        text-align: center;
    }
    .plusBtn{
        position: absolute;
        border-width: initial;
        border-radius: initial;
        border-width: initial;
        padding: initial;
        width: 15.5px;
        height: 15.5px;
        right: 8px;
        top: 13px;
    }
    .entity{
        text-align: left;
        margin-top: 10px;
        margin-left: 10px;
    }
    .entityAutoComplete{
        display: inline-flex;
        width: 110px;
        height: 18px;
        right: -8px;
        top: 2px;
    }
    .roleAutoComplete{
        display: inline-flex;
        width: 110px;
        height: 18px;
        right: -19px;
        top: 2px;
    }
    .groupAutoComplete{
        display: inline-flex;
        width: 110px;
        height: 18px;
        right: -8px;
        top: 2px;
    }
    .deleteBtn{
        position: absolute;
        margin-top: -1px;
        left: -1px;
    }
    .input-value {
        position: absolute;
        width: 110px;
        height: 10px;
        right: 8px;
        margin-top: 2px;
        font-size: 6px;
    }
    .intentAutoComplete {
        height: 18px;
        left: 10px;
        margin-right: 10px;
        margin-top: 4px;
    }
</style>

<style lang="scss">
    #app > div.bottom > div > div > div.vue-flow__viewport.vue-flow__container > div.vue-flow__transformationpane.vue-flow__container > div > div.vue-flow__node.vue-flow__node-intent.nopan.selectable > div {
        div.entity > span > button{
            width: 15px;
        }
        div.entity > div > div.role > span > button {
            width: 15px;
        }
        div.entity > div > div.group > span > button {
            width: 15px;
        }
        div.entity > button {
            width: 24px;
            height: 24px;
            transform: scale(0.6);
        }
        div.entity > div > div.p-checkbox.p-component.value-check {
            transform: scale(0.7);
            top: 1.5px;
            margin-left: -20px;
        }
    } 
</style>