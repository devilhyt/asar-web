<script setup>
    import { Background, Controls, MiniMap, VueFlow, useVueFlow, graphPosToZoomedPos} from '@braks/vue-flow'
    import { ref } from 'vue'
    import { initialElements } from '../assets/flow/initial-elements.js'
    import { useRoute } from 'vue-router'
    import { getAllFileData, getFileList, updateFile , getFileData, getBultinActionList} from '../assets/utils/backend.js'
    import { nanoid } from 'nanoid'

    const params = useRoute().params
    
    const intent_list = await getFileList(params, "intents")
    const entity_data = await getAllFileData(params, "entities")
    const entity_list = Object.keys(entity_data)
    const custom_action_list = await getFileList(params, "actions")
    const response_list = await getFileList(params, "responses")
    const bultin_action_list = await getBultinActionList(params)
    const action_list = custom_action_list.concat(bultin_action_list)
    const slot_list = await getFileList(params, "slots")

    var selectedItem

    const listbox_items = [
        {
            type: "intent",
            name: "Intent"
        },
        {
            type: "action",
            name: "Action"
        },
        {
            type: "response",
            name: "Response"
        },
        {
            type: "slot_was_set",
            name: "slot_was_set"
        }
    ]

    const { addNodes, getEdges, getNode, getNodes, onPaneReady, onConnect, addEdges,setNodes,setEdges, setTransform, toObject, viewport, getTransform, project} = useVueFlow({node:initialElements, deleteKeyCode:"Delete"})

    const elements = ref(initialElements)

    async function onSave(){
        let body = {
            "content": toObject()
        }
        await updateFile(params, "stories", body)
    }

    onPaneReady(({ fitView }) => {
        fitView()
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

    async function addCustomNode(type, name){
        let data = {
            type: type,
            name: name
        }
        switch(type){
            case "intent":
                data["name"] = intent_list[0]
                data["entities"] = [{entity: entity_list[0]}]
                break
            case "action:":
                data["name"] = action_list[0]
                break
            case "response":
                data["name"] = response_list[0]
                break
            case "slot_was_set":
                data["name"] = slot_list[0]
                data["slots"] = [{slot: slot_list[0]}]
                break
        }
        const { x, y } = project({ x: window.innerWidth / 2, y:window.innerHeight / 2 })

        addNodes([{
            id: nanoid(),
            position: { x: x-90, y: y-100 },
            type: type,
            data: data
        }])
    }

    function addEnd(){
        if(!getNodes.value.map(x => x.id).includes("end")){
            addNodes([{
                id: 'end',
                type: 'output',
                label: 'End',
                position: { x: 250, y: 405 },
                data: {
                    "type": "end"
                }
            }])
        }
    }

    async function onRestore (){
        const inital_elements = await getFileData(params, "stories")
        if (Object.keys(inital_elements).length != 0) {
            const [x = 0, y = 0] = inital_elements.position
            setNodes(inital_elements.nodes)
            setEdges(inital_elements.edges)
            setTransform({ x, y, zoom: inital_elements.zoom || 0 })
        }
    }

    onRestore()
    
</script>

<template>
    <EditorLayout>
        <template v-slot:top >
            <Button label="Save" class='saveBtn' @click='onSave'/>
        </template>
        <VueFlow v-model="elements" class="basicflow" :default-zoom="1.5" :min-zoom="0.2" :max-zoom="4">
            <Background pattern-color="#aaa" gap="8" />
            <MiniMap />
            <Controls />
            <div class="list-box">
                <span class="item" v-for="item in listbox_items" :key="item">
                    <label>{{ item.name }}</label>
                    <Button class='addBtn p-button-secondary' label='add' @click="addCustomNode(item.type, item.name)"/>
                </span>
            </div>
            <div class="controls">
                <button style="background-color: #777777; color: white" @click="onRestore">Restore</button>
                <button style="background-color: #425123; color: white" @click="addEnd">add end</button>
                <button style="background-color: #123423; color: white" @click="logToObject">log toObject</button>
            </div>
            
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
                <SlotWasSetNode v-bind="props" :slot_list="slot_list" />
            </template>
        </VueFlow>
    </EditorLayout>
</template>

<script>
    export default {
        name: "StoryEditor"
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
        background:#1C1C1C;color:#fffffb
    }

    .basicflow .controls {
        position:absolute;
        left:10px;
        top:10px;
        z-index:4;
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        gap:8px
    }

    .basicflow .controls button {
        padding:5px;
        border-radius:5px;
        font-weight:500;
        -webkit-box-shadow:0px 5px 10px 0px rgba(0,0,0,.3);
        box-shadow:0 5px 10px #0000004d;
        cursor:pointer
    }

    .basicflow .controls button:hover {
        opacity:.8;
        transform:scale(105%);
        transition:.25s all ease
    }

    .list-box{
        position:absolute;
        width: 15rem;
        right: 10px;
        top: 10px;
        z-index: 4;
        background: #fffffb;
        color: #1c1c1c;
        border-style: solid;
        border-bottom: 0px;
        border-radius: 4px;
        .item {
            display: block;
            padding-top: 2px;
            padding-left: 5px;
            border-top: 0px;
            border-left: 0px;
            border-right: 0px;
            border-bottom: 1px;
            border-style: solid;
            .addBtn {
                position: absolute;
                height: 22px;
                right: 5px;
            }
        } 
    }
    
    .saveBtn{
        position: absolute;
        right: 10px;
        top: 19px;
    }
</style>