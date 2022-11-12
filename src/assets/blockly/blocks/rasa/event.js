import Blockly from "blockly"
import { pythonGenerator } from "blockly/python"


Blockly.defineBlocksWithJsonArray([
    {
        "type": "rasa_event_list_create_with_event",
        "message0": "event",
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["rasa_event"],
        "tooltip": ""
    },
    {
        "type": "rasa_event_list_create_with_container",
        "message0": "array size %1 %2",
        "args0": [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "STACK"
            }
        ],
        "colour": Blockly.BlockColor["rasa_event"],
        "tooltip": ""
    },
    {
        "type": "rasa_event_slot_set",
        "message0": "set slot %1 value to %2",
        "args0": [
            {
                "type": "input_value",
                "name": "SLOT",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        "inputsInline": true,
        "colour": Blockly.BlockColor["rasa_event"],
        "output": "rasa_event"
    },
    {
        "type": "rasa_event_all_slots_reset",
        "message0": "reset all slots %1",
        "args0": [
            {
                "type": "input_dummy"
            }
        ],
        "colour": Blockly.BlockColor["rasa_event"],
        "output": "rasa_event"
    }
])

Blockly.Blocks['rasa_event_return_list_with'] = {
    init: function(){
        this.setPreviousStatement(true, null)
        this.setColour(Blockly.BlockColor["rasa_event"])
        this.setTooltip("return event list")
        this.eventCount_ = 1
        this.updateShape_()
        this.setMutator(new Blockly.Mutator(['rasa_event_list_create_with_event'], this))
    },
    saveExtraState: function(){
        return {
            'eventCount': this.eventCount_
        }
    },
    loadExtraState: function(state){
        this.eventCount_ = state['eventCount']
        this.updateShape_()
    },
    decompose: function(workspace){
        let containerBlock = workspace.newBlock('rasa_event_list_create_with_container')
        containerBlock.initSvg()
        let connection = containerBlock.getInput('STACK').connection
        for(let i = 0; i < this.eventCount_; i++){
            const itemBlock = workspace.newBlock('rasa_event_list_create_with_event')
            itemBlock.initSvg()
            connection.connect(itemBlock.previousConnection)
            connection = itemBlock.nextConnection
        }
        return containerBlock
    },
    compose: function(containerBlock){
        let itemBlock = containerBlock.getInputTargetBlock('STACK')
        const connections = []
        while(itemBlock){
            if(itemBlock.isInsertionMarker()){
                itemBlock = itemBlock.getNextBlock()
                continue
            }
            connections.push(itemBlock.valueConnection_)
            itemBlock = itemBlock.getNextBlock()
        }
        for(let i = 0; i < this.eventCount_; i++){
            const connection = this.getInput('ADD' + i).connection.targetConnection
            if(connection && connections.indexOf(connection) === -1){
                connection.disconnect();
            }
        }
        this.eventCount_ = connections.length
        this.updateShape_()
        for(let i = 0; i < this.eventCount_; i++){
            Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i)
        }
    },
    saveConnections: function(containerBlock){
        let itemBlock = containerBlock.getInputTargetBlock('STACK')
        let i = 0
        while(itemBlock){
            if(itemBlock.isInsertionMarker()){
                itemBlock = itemBlock.getNextBlock()
                continue
            }
            const input = this.getInput('ADD' + i)
            itemBlock.valueConnection_ = input && input.connection.targetConnection
            itemBlock = itemBlock.getNextBlock()
            i++
        }
    },
    updateShape_: function(){
        if(this.eventCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY')
        }else if(!this.eventCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY').appendField("return empty list")
        }
        for(let i = 0; i < this.eventCount_; i++) {
            if(!this.getInput('ADD' + i)){
                const input = this.appendValueInput('ADD' + i).setAlign(Blockly.Input.RIGHT)
                input.setCheck("rasa_event")
                if(i === 0){
                    input.appendField("return event list with")
                }
            }
        }
        for(let i = this.eventCount_; this.getInput('ADD' + i); i++){
            this.removeInput('ADD' + i)
        }
    }
}

pythonGenerator["rasa_event_return_list_with"] = function(block){
    var length = block.eventCount_

    var code = "return [\n"
    for(let i = 0; i < length; i++){
        let event_code = pythonGenerator.valueToCode(block, "ADD" + i, pythonGenerator.ORDER_NONE) || ""
        if(!(event_code === "")){
            code += pythonGenerator.INDENT +  event_code + ",\n"
        }
    }
    code += "]\n"

    return code
}

pythonGenerator["rasa_event_slot_set"] = function(block){
    var slot = pythonGenerator.valueToCode(block, "SLOT", pythonGenerator.ORDER_ATOMIC)
    var value = pythonGenerator.valueToCode(block, "VALUE", pythonGenerator.ORDER_ATOMIC)

    var code = ""
    if(block.getParent() && !(value === "")){
        pythonGenerator.definitions_["import_rasa_events"] = "import rasa_sdk.events as RasaEvents"
        code = "RasaEvents.SlotSet(key=" + slot + ", value=" + value + ")"
    }

    return [code, pythonGenerator.ORDER_ATOMIC]
}

pythonGenerator["rasa_event_all_slots_reset"] = function(block){
    var code = ""
    if(block.getParent()){
        pythonGenerator.definitions_["import_rasa_events"] = "import rasa_sdk.events as RasaEvents"
        code = "RasaEvents.AllSlotsReset()"
    }

    return [code, pythonGenerator.ORDER_ATOMIC]
}