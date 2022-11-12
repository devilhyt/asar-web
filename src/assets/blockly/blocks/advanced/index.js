import Blockly from "blockly"
import { pythonGenerator } from "blockly/python"


Blockly.BlockColor["advanced"] = "#000000"
Blockly.defineBlocksWithJsonArray([
    {
        "type": "advanced_area_code",
        "message0": "%1",
        "args0": [
            {
                "type": "field_multilinetext",
                "name": "CODE",
                "text": "Code area",
                "spellcheck": false
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["advanced"],
        "tooltip": "DIY"
    },
    {
        "type": "advanced_area_data",
        "message0": "%1",
        "args0": [
            {
                "type": "field_multilinetext",
                "name": "DATA",
                "text": "Data area",
                "spellcheck": false
            }
        ],
        "output": null,
        "colour": Blockly.BlockColor["advanced"],
        "tooltip": "DIY"
    }
])

pythonGenerator["advanced_area_code"] = function(block) {
    var value_code = block.getFieldValue("CODE")
    var code = value_code + "\n";
    return code;
}

pythonGenerator["advanced_area_data"] = function(block) {
    var data = block.getFieldValue("DATA")
    return [data, pythonGenerator.ORDER_ATOMIC]
}



export default {
    "toolbox": {
        
        "kind": "category",
        "name": "Advanced",
        "colour": "#000000",
        "contents": [
            {
                "kind": "block",
                "type": "advanced_area_code"
            },
            {
                "kind": "block",
                "type": "advanced_area_data"
            }
        ]
    }
} 