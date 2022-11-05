import { pythonGenerator } from "blockly/python"
import Blockly from "blockly/core"
import { toolbox } from "./toolbox"

Blockly.BlockColor = {}

let fullToolbox = toolbox

process.env.VUE_APP_BLOCKLYDIR.split(",").forEach(dir => {
    import("./blocks/" + dir).then(module => {
        if(module.default.hasOwnProperty("toolbox")){
            fullToolbox["contents"].push(module.default.toolbox)
        }
    })
})

pythonGenerator.INDENT = "    "

let customTheme = Blockly.Theme.defineTheme("dark", {
    "base": Blockly.Themes.Classic,
    "componentStyles": {
        "workspaceBackgroundColour": "#303030",
        "toolboxBackgroundColour": "#242424",
        "toolboxForegroundColour": "#E0E0E0",
        "flyoutBackgroundColour": "#2b2b2b",
        "flyoutForegroundColour": "#E0E0E0",
        "scrollbarColour": "#505050",
        "insertionMarkerColour": "#A0A0A0"
    }
})


export default {
    options: {
        grid: {
            spacing: 20,
            length: 3,
            colour: "#555555",
            snap: true,
        },
        toolbox: fullToolbox,
        theme: customTheme
    }
}