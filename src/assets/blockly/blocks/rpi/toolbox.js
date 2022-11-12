import Blockly from "blockly"

Blockly.BlockColor["RPI"] = "#6CC04A"
Blockly.BlockColor["RPI_BOARD"] = "#C51A4A"
Blockly.BlockColor["RPI_IO"] = "#AA4A44"
Blockly.BlockColor["RPI_DELAY"] = "#808080"
Blockly.BlockColor["RPI_LCD"] = "#6495ED"

export const toolbox = {
    "kind": "category",
    "name": "Rpi",
    "colour": Blockly.BlockColor["RPI"],
    "contents": [
        {
            "kind": "category",
            "name": "Board",
            "colour": Blockly.BlockColor["RPI_BOARD"],
            "contents": [
                {
                    "kind": "block",
                    "type": "rpi_board"
                }
            ]
        },
        {
            "kind": "category",
            "name": "I/O",
            "colour": Blockly.BlockColor["RPI_IO"],
            "contents": [
                {
                    "kind": "block",
                    "type": "rpi_io_write",
                    "inputs": {
                        "PIN": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 11
                                }
                            }
                        },
                        "VOLTAGE": {
                            "block": {
                                "type": "rpi_io_voltage"
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "rpi_io_read",
                    "inputs": {
                        "PIN": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 11
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "rpi_io_voltage"
                },
                {
                    "kind": "block",
                    "type": "rpi_io_clean_up"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Delay",
            "colour": Blockly.BlockColor["RPI_DELAY"],
            "contents": [
                {
                    "kind": "block",
                    "type": "rpi_delay_second",
                    "inputs": {
                        "SECOND": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            "kind": "category",
            "name": "LCD",
            "colour": Blockly.BlockColor["RPI_LCD"],
            "contents": [
                {
                    "kind": "block",
                    "type": "variables_set_dynamic",
                    "fields": {
                        "VAR": {
                            "name": "lcd"
                        }
                    },
                    "inputs": {
                        "VALUE": {
                            "block": {
                                "type": "rpi_lcd_define",
                                "fields": {
                                    "ADDRESS": "0x27"
                                },
                                "inputs": {
                                    "EXPANDER": {
                                        "block": {
                                            "type": "text",
                                            "fields": {
                                                "TEXT": "PCF8574"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "rpi_lcd_print",
                    "inputs": {
                        "TEXT": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": "Hello World !"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "rpi_lcd_cursor",
                    "inputs": {
                        "ROW": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": "0"
                                }
                            }
                        },
                        "COLUMN": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": "0"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "rpi_lcd_clear"
                }
            ]
        }
    ]
}