import Blockly from "blockly"
import { pythonGenerator } from "blockly/python"

Blockly.defineBlocksWithJsonArray([
    {
        "type": "rasa_send",
        "message0": "send %1 %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    ["text", "text"],
                    ["image url", "image"],
                    ["button", "buttons"],
                    ["json_message", "json_message"]
                ]
            },
            {
                "type": "input_value",
                "name": "CONTENT",
                "check": "String"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["rasa_common"],
        "tooltip": "send something to user"
    },
    {
        "type": "rasa_get_slot",
        "message0": "get value from slot %1",
        "args0": [
            {
                "type": "input_value",
                "name": "SLOT",
                "check": "String"
            }
        ],
        "inputsInline": true,
        "output": null,
        "colour": Blockly.BlockColor["rasa_common"],
        "tooltip": "get value from slot"
    }
])

pythonGenerator["rasa_send"] = function(block){
    var value_type = block.getFieldValue("TYPE")
    var value_content = pythonGenerator.valueToCode(block, "CONTENT", pythonGenerator.ORDER_ATOMIC)

    var code = ""
    if(!(value_content === "")){
        var code = "dispatcher.utter_message(" + value_type + " = " + value_content + ")\n"
    }
    
    return code
}

pythonGenerator["rasa_get_slot"] = function(block){
    var slot = pythonGenerator.valueToCode(block, "SLOT", pythonGenerator.ORDER_ATOMIC)

    var code = ""
    if(!(slot === "")){
        var code = "tracker.get_slot(" + slot + ")"
    }
    
    return [code, pythonGenerator.ORDER_ATOMIC]
}

