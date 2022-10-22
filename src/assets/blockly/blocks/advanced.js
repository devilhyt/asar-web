import Blockly from 'blockly'


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


// Blockly.Blocks['advanced_codeArea'] = {
//     init: function() {
//         this.appendDummyInput()
//             .appendField(new Blockly.FieldMultilineInput('Code area'),'code');
//         this.setPreviousStatement(true, null);
//         this.setNextStatement(true, null);
//         this.setTooltip("Insert code");
//     }
// };

Blockly.Python['advanced_codeArea'] = function(block) {
    var value_code = block.getFieldValue('code')
    var code = value_code + '\n';
    return code;
};