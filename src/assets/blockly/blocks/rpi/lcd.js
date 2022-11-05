import Blockly from "blockly"
import { pythonGenerator } from "blockly/python"


Blockly.defineBlocksWithJsonArray([
    {
        "type": "rpi_lcd_define",
        "message0": "LCD Expander %1 Address %2 %3 Back Light : %4 %5 Auto Line Breaks %6",
        "args0": [
            {
                "type": "input_value",
                "name": "EXPANDER",
                "check": "String"
            },
            {
                "type": "field_dropdown",
                "name": "ADDRESS",
                "options": [
                    ["0x20", "0x20"],
                    ["0x21", "0x21"],
                    ["0x22", "0x22"],
                    ["0x23", "0x23"],
                    ["0x24", "0x24"],
                    ["0x25", "0x25"],
                    ["0x26", "0x26"],
                    ["0x27", "0x27"],
                    ["0x38", "0x38"],
                    ["0x39", "0x39"],
                    ["0x3A", "0x3A"],
                    ["0x3B", "0x3B"],
                    ["0x3C", "0x3C"],
                    ["0x3D", "0x3D"],
                    ["0x3E", "0x3E"],
                    ["0x3F", "0x3F"]
                ]
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_dropdown",
                "name": "BACKLIGHT",
                "options": [
                    ["ON", "True"],
                    ["OFF", "False"]
                ]
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "field_dropdown",
                "name": "AUTOLINEBREAKS",
                "options": [
                    ["ON", "True"],
                    ["OFF", "False"]
                ]
            }
        ],
        "inputsInline": true,
        "output": null,
        "colour": Blockly.BlockColor["RPI_LCD"],
        "tooltip": "Define LCD"
    },
    {
        "type": "rpi_lcd_clear",
        "message0": "%1 clear",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR",
                "variable": "lcd"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["RPI_LCD"],
        "tooltip": "Clear LCD"
    },
    {
        "type": "rpi_lcd_cursor",
        "message0": "set %1 cursor position to %2 Row %3 Column %4",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR",
                "variable": "lcd"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_value",
                "name": "ROW",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "COLUMN",
                "check": "Number"
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["RPI_LCD"],
        "tooltip": "Set cursor position"
    },
    {
        "type": "rpi_lcd_print",
        "message0": "%1 write %2",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR",
                "variable": "lcd"
            },
            {
                "type": "input_value",
                "name": "TEXT",
                "check": "String"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.BlockColor["RPI_LCD"],
        "tooltip": "LCD print text"
    }
])


pythonGenerator["rpi_lcd_define"] = function(block){
    var expander = pythonGenerator.valueToCode(this, "EXPANDER", pythonGenerator.ORDER_ATOMIC)
    var address = block.getFieldValue("ADDRESS")
    var backLight = block.getFieldValue("BACKLIGHT")
    var autoLineBreaks = block.getFieldValue("AUTOLINEBREAKS")

    pythonGenerator.definitions_["import_rplcd_i2c"] = "from RPLCD.i2c import CharLCD"

    var code = "CharLCD(i2c_expander=" + expander + ", address=" + address + ", backlight_enabled=" + backLight + ", auto_linebreaks=" + autoLineBreaks + ")"
    return [code, pythonGenerator.ORDER_ATOMIC]
}

pythonGenerator["rpi_lcd_clear"] = function(block){
    var variable_var = pythonGenerator.nameDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.CATEGORY_NAME)

    var code = variable_var + ".clear()\n"
    return code
}

pythonGenerator["rpi_lcd_cursor"] = function(block){
    var variable_var = pythonGenerator.nameDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.CATEGORY_NAME)
    var row = pythonGenerator.valueToCode(this, "ROW", pythonGenerator.ORDER_ATOMIC)
    var column = pythonGenerator.valueToCode(this, "COLUMN", pythonGenerator.ORDER_ATOMIC)

    var code = variable_var + ".cursor_pos = (" + row + ", " + column + ")\n"
    return code
}

pythonGenerator["rpi_lcd_print"] = function(block){
    var variable_var = pythonGenerator.nameDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.CATEGORY_NAME)
    var text = pythonGenerator.valueToCode(this, "TEXT", pythonGenerator.ORDER_ATOMIC)

    var code = variable_var + ".write_string(" + text +")\n"
    return code
}