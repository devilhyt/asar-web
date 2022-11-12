import Blockly from "blockly"


Blockly.BlockColor["rasa"] = "#663399"
Blockly.BlockColor["rasa_common"] = "#277AA3"
Blockly.BlockColor["rasa_event"] = "#4F577E"


export const toolbox = {
    "kind": "category",
    "name": "Rasa",
    "colour": Blockly.BlockColor["rasa"],
    "contents": [
        {
            "kind": "category",
            "name": "common",
            "colour": Blockly.BlockColor["rasa_common"],
            "contents": [
                {
                    "kind": "block",
                    "type": "rasa_send",
                },
                {
                    "kind": "block",
                    "type": "rasa_get_slot",
                    "inputs": {
                        "SLOT": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": "slot"
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            "kind": "category",
            "name": "event",
            "colour": Blockly.BlockColor["rasa_event"],
            "contents": [
                {
                    "kind": "block",
                    "type": "rasa_event_return_list_with",
                    "extraState": {
                        "eventCount": 1
                    }
                },
                {
                    "kind": "block",
                    "type": "rasa_event_slot_set",
                    "inputs": {
                        "SLOT": {
                            "block": {
                                "type": "text",
                                "fields": {
                                    "TEXT": "slot"
                                }
                            }
                        }
                    }
                },
                {
                    "kind": "block",
                    "type": "rasa_event_all_slots_reset"
                }
            ]
        }
    ]
}