<script setup>
    import Blockly from 'blockly'
    import { pythonGenerator } from 'blockly/python'
    import blocklySetup from'../assets/blockly'
    import { getFileData, updateFile } from '../assets/utils/backend.js'
    import { addBackendMessage } from '../assets/utils/message.js'
    import { reactive, onMounted, getCurrentInstance } from 'vue'
    import { useRoute } from 'vue-router'
    import { useI18n } from 'vue-i18n'

    const params = useRoute().params
    const { t } = useI18n()

    let state = reactive({
        actionData: await getFileData(params, "actions"),
        showCode: false,
        workspace: null,
        pythonCode: ""
    })

    onMounted(() => {
        state.workspace = Blockly.inject(getCurrentInstance().refs["blockly"], blocklySetup.options)
        state.workspace.addChangeListener(updateCode)
        Blockly.serialization.workspaces.load(state.actionData.blockly ?? "", Blockly.getMainWorkspace())
    })

    function updateCode(){
        state.pythonCode = pythonGenerator.workspaceToCode(state.workspace);
    }

    async function onSave(){
        let body = {
            content: {
                blockly: Blockly.serialization.workspaces.save(Blockly.getMainWorkspace()),
                code: state.pythonCode,
                packages: []
            }
        }
        let response = await updateFile(params, "actions", body)
        addBackendMessage("/api.file.update.", response, {file: params.fileName})
    }

</script>

<template>
    <EditorLayout>
        <Button class='saveBtn' @click="onSave">{{ $t('save') }}</Button>
        <div class='editor'>
            <div v-show="!state.showCode">
                <div class='blockly' ref='blockly'></div>
                <div class="button">
                    <Button class='codeBtn' @click="state.showCode = true">{{ $t('code') }}</Button>
                </div>
            </div>
            
            <div v-show="state.showCode">
                <div class="button">
                    <Button class='graphBtn' @click="state.showCode = false">{{ $t('graph') }}</Button>
                </div>
                <ScrollPanel class='scroll-panel'>
                    <pre class='codeBox' v-html="state.pythonCode"></pre>
                </ScrollPanel>
            </div>
        </div>
    </EditorLayout>
</template>

<script>
export default {
    name: 'ActionEditor',
}
</script>

<style scoped>
    .editor {
        position: relative;
    }
    .blockly {
        color: #000000;
        position: fixed;
        height: calc(100vh - 72px);
        width: 100%;
        text-align: left;
        background-color: #222222 !important;
    }
    .button{
        position: absolute;
        top: 10px;
        right: 24px;
    }
    .scroll-panel {
        position: absolute;
        height: calc(100vh - 72px);
    }
    .codeBox{
        margin-left: 50px;
        text-align: left;
    }
    .saveBtn {
        z-index: 2;
        position: absolute;
        top: 18px;
        right: 24px;
    }
</style>
