import Blockly from "blockly"
import { pythonGenerator } from "blockly/python"


Blockly.defineBlocksWithJsonArray([
    {
        "type": "rasa_send",
        "message0": "Send %1 %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    ["text", "text"],
                    ["image url", "image"]
                ]
            },
            {
                "type": "input_value",
                "name": "CONTENT",
                "check": [
                    "String",
                    "Number"
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 255,
        "tooltip": "send something to user"
    }
])


pythonGenerator["rasa_send"] = function(block) {
    var value_type = block.getFieldValue("TYPE")
    var value_content = pythonGenerator.valueToCode(block, "CONTENT", pythonGenerator.ORDER_ATOMIC);
    var code = "dispatcher.utter_message(" + value_type.toString() + "="+ value_content.toString() + ")\n";
    return code;
}

export default {
    "toolbox": {
        "kind": "category",
        "name": "Rasa",
        "colour": "#663399",
        "contents": [
            {
                "kind": "block",
                "type": "rasa_send",
                "inputs": {
                    "CONTENT": {
                        "block": {
                            "type": "text",
                            "fields": {
                                "TEXT": "hi"
                            }
                        }
                    }
                }
            }
        ]
    }
} 