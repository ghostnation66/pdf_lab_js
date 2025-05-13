// Set up export help function (JS modules )
export function help(){
  console.log("lineNuber.js manages all line numbering funcitonality in the document. It executes automatically after it is imported into the index.js main module.");
};



// This functions sets up all grids for initial placement. Reflow operations should utilize these initial grids for reallocating elements between grids
export function setUpGrids(){
    const delay = 2000;
    var counter = 0;
    let numberingGrids = document.querySelectorAll('.numberingGrid');
    // The numberingGrid elements are converted to their proper structure. Three separate elements will be attached to the individual elements in the numberingGrids array
    numberingGrids.forEach(numberGrid => {
        // Content Extraction. Using innerHTML instead of textContent because mathjax renders prior to the function
        let content = numberGrid.innerHTML;
        // Original text removal
        numberGrid.innerHTML = null;
        // Generating the 1st div, the "verticalBar"
        let verticalBar = document.createElement('div');
        verticalBar.classList.add('verticalBar');
        numberGrid.appendChild(verticalBar);

        // Generating the second div, empty div element to hold the line numberedSpan
        let lineNumbers = document.createElement('div');
        numberGrid.appendChild(lineNumbers);

        // Generating the third div, nestedwith a span element that is reclassed and contains the text content
        let divContainer = document.createElement('div');
        let numberedSpan = document.createElement('span');
        numberedSpan.classList.add('numberedSpan')
        numberedSpan.innerHTML = content;
        divContainer.appendChild(numberedSpan);
        numberGrid.appendChild(divContainer);
        })
}
