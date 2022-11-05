import Blockly from "blockly"
import { pythonGenerator } from "blockly/python"


Blockly.defineBlocksWithJsonArray([
    {
        "type": "rpi_delay_second",
        "message0": "delay %1",
        "args0": [
            {
                "type": "input_value",
                "name": "SECOND",
                "check": [
                    "Number"
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["RPI_DELAY"],
        "tooltip": "Delay * seconds"
    }
])

pythonGenerator["rpi_delay_second"] = function(block){
	pythonGenerator.definitions_["import_time"] = "import time"
	var second = pythonGenerator.valueToCode(block, "SECOND", pythonGenerator.ORDER_ATOMIC) || "1"
	return "time.sleep(" + second + ")\n"
}