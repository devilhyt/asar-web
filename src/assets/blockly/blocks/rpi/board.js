import Blockly from "blockly"
import { pythonGenerator } from "blockly/python"

Blockly.defineBlocksWithJsonArray([
    {
        "type": "rpi_board",
        "message0": "RPi pin mode %1 %2 %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    ["BOARD", "BOARD"],
                    ["GPIO", "BCM"]
                ]
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "statement"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["RPI_BOARD"],
        "tooltip": "rpi board set"
    }
])

pythonGenerator["rpi_board"] = function(block){
    var mode = block.getFieldValue("MODE")

    pythonGenerator.definitions_["import_gpio"] = "import RPi.GPIO as GPIO"
	pythonGenerator.definitions_["setWarnings"] = "GPIO.setwarnings(False)"
    pythonGenerator.definitions_["commentMode"] = "# RPi pin mode = " + mode
    pythonGenerator.definitions_["setMode"] = "GPIO.setmode(GPIO.BCM)"

    var code = ""
    var statementCode = pythonGenerator.statementToCode(block, "statement")
    if(Boolean(statementCode)) {
        code += "try:\n"
        code += statementCode
        code += "except Exception as e:\n"
        code += "    print(e)\n\n"
    }

	return code
};