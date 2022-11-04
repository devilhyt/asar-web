export const toolbox = {
    "kind":"categoryToolbox",
    "contents":[
        {
            "kind": "category",
            "name": "Logic",
            "colour": "%{BKY_LOGIC_HUE}",
            "contents": [
                {
                    "kind": "block",
                    "type": "controls_if"
                },
                {
                    "kind": "block",
                    "type": "logic_compare"
                },
                {
                    "kind": "block",
                    "type": "logic_operation"
                },
                {
                    "kind": "block",
                    "type": "logic_negate"
                },
                {
                    "kind": "block",
                    "type": "logic_boolean"
                },
                {
                    "kind": "block",
                    "type": "logic_null"
                },
                {
                    "kind": "block",
                    "type": "logic_ternary"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Loops",
            "colour": "%{BKY_LOOPS_HUE}",
            "contents": [
                {
                    "kind": "block",
                    "type": "controls_repeat_ext",
                    "inputs": {
                        "TIMES": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 10
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "controls_whileUntil"
                },
                {
                    "kind": "block",
                    "type": "controls_for",
                    "inputs": {
                        "FROM": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        },
                        "TO": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 10
                                }
                            }
                        },
                        "BY": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "controls_forEach"
                },
                {
                    "kind": "block",
                    "type": "controls_flow_statements"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Math",
            "colour": "%{BKY_MATH_HUE}",
            "contents": [
                {
                    "kind": "block",
                    "type": "math_number"
                },
                {
                    "kind": "block",
                    "type": "math_arithmetic",
                    "inputs": {
                        "A": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        },
                        "B": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_single",
                    "inputs": {
                        "NUM": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 9
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_trig",
                    "inputs": {
                        "NUM": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 45
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_constant"
                },
                {
                    "kind": "block",
                    "type": "math_number_property",
                    "inputs": {
                        "NUMBER_TO_CHECK": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 0
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_change",
                    "inputs": {
                        "DELTA": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_round",
                    "inputs": {
                        "NUM": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 3.1
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_on_list"
                },
                {
                    "kind": "block",
                    "type": "math_modulo",
                    "inputs": {
                        "DIVIDEND": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 50
                                }
                            }
                        },
                        "DIVISOR": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 10
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_constrain",
                    "inputs": {
                        "VALUE": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 50
                                }
                            }
                        },
                        "LOW": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        },
                        "HIGH": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 100
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_random_int",
                    "inputs": {
                        "FROM": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 1
                                }
                            }
                        },
                        "TO": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 100
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_random_float"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Text",
            "colour": "%{BKY_TEXTS_HUE}",
            "contents": [
                {
                    "kind": "block",
                    "type": "text"
                },
                {
                    "kind": "block",
                    "type": "text_join"
                },
                {
                    "kind": "block",
                    "type": "text_append",
                    "inputs": {
                        "TEXT": {
                            "block": {
                                "type": "text"
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "text_length",
                    "inputs": {
                        "VALUE": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": "abc"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "text_isEmpty",
                    "inputs": {
                        "VALUE": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": "abc"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "text_indexOf",
                    "inputs": {
                        "VALUE": {
                            "block": {
                                "type": "variables_get",
                                "fields": {
                                    "VAR": "text"
                                }
                            }
                        },
                        "FIND": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": "abc"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "text_charAt",
                    "inputs": {
                        "VALUE": {
                            "block": {
                                "type": "variables_get",
                                "fields": {
                                    "VAR": "text"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "text_getSubstring",
                    "inputs": {
                        "STRING": {
                            "block": {
                                "type": "variables_get",
                                "fields": {
                                    "VAR": "text"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "text_changeCase",
                    "inputs": {
                        "TEXT": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": "abc"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "text_trim",
                    "inputs": {
                        "TEXT": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": "abc"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "text_print",
                    "inputs": {
                        "TEXT": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": "abc"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "text_prompt_ext",
                }
            ]
        },
        {
            "kind": "category",
            "name": "Lists",
            "colour": "%{BKY_LISTS_HUE}",
            "contents": [
                {
                    "kind": "block",
                    "type": "lists_create_with",
                    "extraState": {
                        "itemCount": 0
                    }
                },
                {
                    "kind": "block",
                    "type": "lists_create_with"
                },
                {
                    "kind": "block",
                    "type": "lists_repeat",
                    "inputs": {
                        "NUM": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 5
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "lists_length"
                },
                {
                    "kind": "block",
                    "type": "lists_isEmpty"
                },
                {
                    "kind": "block",
                    "type": "lists_indexOf",
                    "inputs": {
                        "VALUE": {
                            "block": {
                                "type": "variables_get",
                                "fields": {
                                    "VAR": "list"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "lists_getIndex",
                    "inputs": {
                        "VALUE": {
                            "block": {
                                "type": "variables_get",
                                "fields": {
                                    "VAR": "list"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "lists_setIndex",
                    "inputs": {
                        "LIST": {
                            "block": {
                                "type": "variables_get",
                                "fields": {
                                    "VAR": "list"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "lists_getSublist",
                    "inputs": {
                        "LIST": {
                            "block": {
                                "type": "variables_get",
                                "fields": {
                                    "VAR": "list"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "lists_split",
                    "inputs": {
                        "DELIM": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": ","
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "lists_sort"
                }
            ]
        },
        {
            "kind": "category",
            "name": "Color",
            "colour": "%{BKY_COLOUR_HUE}",
            "contents": [
                {
                    "kind": "block",
                    "type": "colour_picker"
                },
                {
                    "kind": "block",
                    "type": "colour_random"
                },
                {
                    "kind": "block",
                    "type": "colour_rgb",
                    "inputs": {
                        "RED": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 255
                                }
                            }
                        },
                        "GREEN": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 128
                                }
                            }
                        },
                        "BLUE": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 0
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "colour_blend",
                    "inputs": {
                        "COLOUR1": {
                            "block": {
                                "type": "colour_picker",
                                "fields": {
                                    "COLOUR": "#A0A0A0"
                                }
                            }
                        },
                        "COLOUR2": {
                            "block": {
                                "type": "colour_picker",
                                "fields": {
                                    "COLOUR": "#0A0A0A"
                                }
                            }
                        },
                        "RATIO": {
                            "block": {
                                "type": "math_number",
                                "fields": {
                                    "NUM": 0.5
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            "kind": "category",
            "name": "Variables",
            "colour": "%{BKY_VARIABLES_HUE}",
            "custom": "VARIABLE"
        },
        {
            "kind": "category",
            "name": "Functions",
            "colour": "#777777",
            "custom": "PROCEDURE"
        },
        {
            "kind": "sep"
        }
    ]
}