import * as pageBreak from "./function_modules/pageBreak.js";
import * as lineNumber from "./function_modules/lineNumber.js";
import * as textReflow from "./function_modules/textReflow.js";
import * as utility from "./function_modules/utilityFunctions.js"
import * as generateCitation from "./function_modules/generateCitation.js"
import * as elementFormatter from "./function_modules/elementFormatter.js";

// Run the help functions to obtain a description of the modules
pageBreak.help();
lineNumber.help();
textReflow.help();
generateCitation.help();
elementFormatter.help();

window.addEventListener("DOMContentLoaded", () =>{
    // Set up initial grid conditions
    lineNumber.setUpGrids();
    // Format elements, performing expansions, hyperlink matching, and labeling
    elementFormatter.formatElements();
    // Introduce delay in order to enable prism objects to render prior (for example, the filesystem view does not render before the textreflow, which can cause significant issues)
    setTimeout(textReflow.numberingGridReflow, 2500);
    // textReflow.numberingGridReflow();
    // Introduce delay to enable MathJAX to render before numbering
    setTimeout(utility.numberingOnNumberingGrid, 3000);
    setTimeout(generateCitation.render_text_citation, 3000);
    setTimeout(generateCitation.render_bibliography, 3000);

    console.log("index.js ran");
});
