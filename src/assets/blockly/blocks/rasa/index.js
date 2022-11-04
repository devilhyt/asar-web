import Blockly from 'blockly'
import { pythonGenerator } from 'blockly/python'


Blockly.defineBlocksWithJsonArray([{
    "type": "advanced_codeArea",
    "message0": "%1",
    "args0": [
        {
            "type": "field_multilinetext",
            "name": "code",
            "text": "Code area",
            "spellcheck": false
        }
    ],
    "previousStatement": null,
    "nextStatement": null
}])

pythonGenerator['advanced_codeArea'] = function(block) {
    var value_code = block.getFieldValue('code')
    var code = value_code + '\n';
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
                    "content": {
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