import Blockly from "blockly"
import { pythonGenerator } from "blockly/python"
import { getGPIO } from "./util"


Blockly.defineBlocksWithJsonArray([
    {
        "type": "rpi_io_write",
        "message0": "write pin %1 value %2",
        "args0": [
            {
                "type": "input_value",
                "name": "PIN",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "VOLTAGE",
                "check": [
                    "Boolean",
                    "Voltage"
                ]
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["RPI_IO"],
        "tooltip": "Write pin"
    },
    {
        "type": "rpi_io_read",
        "message0": "read %1 pin %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "MODE",
                "options": [
                    ["input", "input"],
                    ["output", "output"]
                ]
            },
            {
                "type": "input_value",
                "name": "PIN",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "output": "Boolean",
        "colour": Blockly.BlockColor["RPI_IO"],
        "tooltip": "Read pin"
    },
    {
        "type": "rpi_io_voltage",
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "VOLTAGE",
                "options": [
                    ["High", "HIGH"],
                    ["Low", "LOW"]
                ]
            }
        ],
        "output": "Voltage",
        "colour": Blockly.BlockColor["RPI_IO"],
        "tooltip": "Voltage"
    },
    {
        "type": "rpi_io_clean_up",
        "message0": "I/O clean up",
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["RPI_IO"],
        "tooltip": "Clean up"
    }
])

pythonGenerator["rpi_io_write"] = function(block){
	var pin = pythonGenerator.valueToCode(this, "PIN", pythonGenerator.ORDER_ATOMIC)
	var voltage = pythonGenerator.valueToCode(this, "VOLTAGE", pythonGenerator.ORDER_ATOMIC)
    var gpio = getGPIO(pin)

    pythonGenerator.definitions_["io_" + gpio] = "GPIO.setup(" + gpio + ", GPIO.OUT)"
    var code = "GPIO.output(" + gpio + ", " + voltage + ")\n"

	return code
}

pythonGenerator["rpi_io_read"] = function(block){
    var mode = block.getFieldValue("MODE")
	var pin = pythonGenerator.valueToCode(this, "PIN", pythonGenerator.ORDER_ATOMIC)
	var gpio = getGPIO(pin)

    if(mode === "input"){
        pythonGenerator.definitions_["io_" + gpio] = "GPIO.setup(" + gpio + ", GPIO.IN)"
    }else{
        pythonGenerator.definitions_["io_" + gpio] = "GPIO.setup(" + gpio + ", GPIO.OUT)"
    }
    var code = "GPIO.input(" + pin + ")"

	return [code, pythonGenerator.ORDER_ATOMIC]
}


pythonGenerator["rpi_io_voltage"] = function(block){
    var voltage = block.getFieldValue("VOLTAGE")
    var code = "GPIO." + voltage
    return [code, pythonGenerator.ORDER_ATOMIC]
}

pythonGenerator["rpi_io_clean_up"] = function(block){
    return "GPIO.cleanup()\n"
}