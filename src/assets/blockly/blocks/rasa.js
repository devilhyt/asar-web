import Blockly from 'blockly'
import { pythonGenerator } from 'blockly/python'

Blockly.defineBlocksWithJsonArray([
    {
        "type": "rasa_send",
        "message0": "Send %1 %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "type",
                "options": [
                    ["text", "text"],
                    ["image url", "image"]
                ]
            },
            {
                "type": "input_value",
                "name": "content",
                "check": [
                    "String",
                    "Number"
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 255,
        "tooltip": "rasa",
        "helpUrl": "send something to user"
    }
])


pythonGenerator['rasa_send'] = function(block) {
    var value_type = block.getFieldValue('type')
    var value_content = pythonGenerator.valueToCode(block, 'content', pythonGenerator.ORDER_ATOMIC);
    var code = 'dispatcher.utter_message(' + value_type.toString() + '='+ value_content.toString() + ')\n';
    return code;
};