import * as pageBreak from "./functions/pageBreak.js";
import * as lineNumber from "./functions/lineNumber.js";
import * as textReflow from "./functions/textReflow.js";
import * as utility from "./functions/utilityFunctions.js"
// Run the help functions to obtain a description of the modules
pageBreak.help()
lineNumber.help()
textReflow.help()

window.addEventListener("DOMContentLoaded", () =>{
    console.log("index.js ran");
    // Set up initial grid conditions
    lineNumber.setUpGrids();
    textReflow.numberingGridReflow();
    // Introduce delay to enable MathJAX to render before numbering
    setTimeout(utility.numberingOnNumberingGrid, 2000);
});
