<script setup>
    import { Background, Controls, MiniMap, VueFlow, useVueFlow, graphPosToZoomedPos} from '@braks/vue-flow'
    import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
    import { useRoute } from 'vue-router'
    import { getAllFileData, getFileList, updateFile , getFileData, getBuiltinActionList, getBuiltinIntentList} from '../assets/utils/backend.js'
    import { addBackendMessage } from '../assets/utils/message.js'
    import { nanoid } from 'nanoid'

    const params = useRoute().params

    function waitAllRequestFinish(){
        return Promise.all([
            getFileList(params, "intents"),
            getAllFileData(params, "entities"),
            getFileList(params, "actions"),
            getFileList(params, "responses"),
            getBuiltinActionList(params),
            getBuiltinIntentList(params),
            getFileList(params, "slots"),
            getFileList(params, "forms")
        ])
    }

    var custom_intent_list, entity_data, custom_action_list, response_list, builtin_action_list, builtin_intent_list, slot_list, form_list

    await waitAllRequestFinish().then((promiseArray) => {
        [custom_intent_list, entity_data, custom_action_list, response_list, builtin_action_list, builtin_intent_list, slot_list, form_list] = promiseArray
    })

    slot_list.push("requested_slot")    
    const entity_list = Object.keys(entity_data)
    const action_list = custom_action_list.concat(builtin_action_list)
    const intent_list = custom_intent_list.concat(builtin_intent_list)

    var selectedItem

    const listbox_items = ["intent", "action", "response", "slot_was_set", "form", "active_loop"]

    const defaultElements = [
        { 
            id: 'start',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
                "type":"start"
            },
            unselectable: true
        },
        { 
            id: 'end',
            type: 'end',
            data:{"type":"end"},
            position: { x: 0, y: 600 },
            unselectable: true
        }
    ]

    const { 
        addNodes, getEdges, getNode, getNodes, onPaneReady,
        onConnect, addEdges,setNodes,setEdges, setTransform, toObject,
        project, getSelectedNodes, fitView
    } = useVueFlow({node: defaultElements, deleteKeyCode: "Delete"})

    const elements = ref([])

    async function onSave(){
        let body = {
            "content": toObject()
        }
        let response = await updateFile(params, "rules", body)
        addBackendMessage("/api.file.update.", response, {file: params.fileName})
    }

    const undeletable_list = ['start', 'end']

    function ignoreDelete(event){
        if(event.key == "Delete"){
            if(getSelectedNodes.value.length != 0){
                if(undeletable_list.includes(getSelectedNodes.value[0].type)){
                    event.stopPropagation()
                }
            }
        }
    }
    
    onMounted(() => {
        document.addEventListener('keydown', ignoreDelete)
    })
    
    onBeforeUnmount(() => {
        document.removeEventListener('keydown', ignoreDelete)
    })

    onConnect((params) => {
        if(getNode.value(params.target).position.y < getNode.value(params.source).position.y){
            return
        }
        if(getNode.value(params.target).type == "action" || getNode.value(params.target).type == "response"){
            if(getEdges.value.filter(edge => (edge.source == params.source && (edge.targetNode.type == "action" || edge.targetNode.type == "response"))).length > 0){
                return
            }
        }
        if(getNode.value(params.target).data["type"] == "end"){
            if(getNode.value(params.source).id == "start"){
                return
            }
            if(getNode.value(params.source).type == "intent"){
                return
            }
        }
        addEdges([params])
    })

    const logToObject = () => console.log(toObject())

    async function addCustomNode(type){
        let data = {
            type: type,
        }
        const { x, y } = project({ x: window.innerWidth / 2, y:window.innerHeight / 2 })

        addNodes([{
            id: nanoid(),
            type: type,
            data: data,
            position: { x: x-90, y: y-100 }
        }])
    }

    async function onRestore (){
        let initialElements = await getFileData(params, "rules")
        if (Object.keys(initialElements).length != 0) {
            const [x = 0, y = 0] = initialElements.position
            setNodes(initialElements.nodes)
            setEdges(initialElements.edges)
            setTransform({ x, y, zoom: initialElements.zoom || 0 })
        }else{
            elements.value = defaultElements
        }
        fitView()
    }
    
    onRestore()
    
</script>

<template>
    <EditorLayout>
        <template v-slot:top >
            <Button label="Save" class='saveBtn' @click='onSave'>{{ $t('save') }}</Button>
        </template>
        <VueFlow v-model="elements" class="basicflow" :default-zoom="1.5" :min-zoom="0.2" :max-zoom="4">
            <Background pattern-color="#aaa" gap="8" />
            <MiniMap />
            <Controls />
            <div class="list-box">
                <span class="item" v-for="item in listbox_items" :key="item">
                    <label>{{ $t(item) }}</label>
                    <Button class='addBtn p-button-secondary' @click="addCustomNode(item)">{{ $t('add') }}</Button>
                </span>
            </div>

            <template #node-start="props">
                <ConditionStartNode v-bind="reactive(props)" :slot_list="slot_list" :form_list="form_list" />
            </template>
            <template #node-end>
                <EndNode />
            </template>
            <template #node-intent="props">
                <IntentNode v-bind="props" :intent_list="intent_list" :entity_data="entity_data" :entity_list="entity_list" />
            </template>
            <template #node-action="props">
                <ActionNode v-bind="props" :action_list="action_list" />
            </template>
            <template #node-response="props">
                <ResponseNode v-bind="props" :response_list="response_list" />
            </template>
            <template #node-slot_was_set="props">
                <SlotWasSetNode v-bind="reactive(props)" :slot_list="slot_list" />
            </template>
            <template #node-form="props">
                <FormNode v-bind="props" :form_list="form_list" />
            </template>
            <template #node-active_loop="props">
                <ActiveLoopNode v-bind="props" :form_list="form_list.concat('null')" />
            </template>
        </VueFlow>
    </EditorLayout>
</template>

<script>
    export default {
        name: "RuleEditor",
        created() {
            document.body.style.backgroundColor = "#333333";
        }
    }
</script>

<style lang="scss" scoped>
    @import 'https://cdn.jsdelivr.net/npm/@braks/vue-flow@0.4.38/dist/style.css';
    @import 'https://cdn.jsdelivr.net/npm/@braks/vue-flow@0.4.38/dist/theme-default.css'; 

    .vue-flow {
        height: 880px;
    }
    .vue-flow__minimap {
        transform: scale(75%);
        transform-origin: bottom right;
    }
    .basicflow .vue-flow__node.dark {
        background:#1C1C1C;
        color:#fffffb;
    }
    .list-box {
        position: absolute;
        width: 15rem;
        right: 10px;
        top: 10px;
        z-index: 4;
        background: #fffffb;
        color: #1c1c1c;
        border-style: solid;
        border-bottom: 0px;
        border-radius: 5px;
        .item {
            display: block;
            padding-top: 2px;
            padding-left: 5px;
            border-top: 0px;
            border-left: 0px;
            border-right: 0px;
            border-bottom: 2px;
            border-style: solid;
            .addBtn {
                position: absolute;
                height: 22px;
                right: 5px;
            }
        } 
    }
    .saveBtn {
        position: absolute;
        top: 18px;
        right: 24px;
    }
</style>