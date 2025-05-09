// The function numbers the lines on preformed numberingGrids


// Creates a numberingGrid element that renders the nodes passed as parameters
export function createNumberingGrid(node_list){
    //Make function local copy of node_list
    let node_list_copy = cloneNodelist(node_list);
    // Create numberingGrid container
    let numberGrid = document.createElement('div');
    numberGrid.classList.add('numberingGrid');
    // Create vertical bar and add to numberGrid
    let verticalBar = document.createElement('div');
    verticalBar.classList.add('verticalBar');
    numberGrid.appendChild(verticalBar);
    // Create line number lane
    let lineNumbers = document.createElement('div');
    numberGrid.appendChild(lineNumbers);
    // Attach a container div and numberedSpan. Loop through the node_list parameter passed above and add as children to the numbered span
    let divContainer = document.createElement('div');
    let numberedSpan = document.createElement('span');
    numberedSpan.classList.add('numberedSpan');
    for(let node of node_list_copy){
        numberedSpan.append(node);
    }
    divContainer.appendChild(numberedSpan);
    numberGrid.appendChild(divContainer);
    return numberGrid;
}




// Scans all numberingGrid numberedSpan elements and adds line numbers
export function numberingOnNumberingGrid(){
    let spanElements = document.querySelectorAll('.numberedSpan');
    let counter = 0;
    spanElements.forEach(spanElement => {
        const children = spanElement.children;
        let badBoxX = [];
        let badBoxY = [];
        // Get the client rectangles for each element
        const clientRects = spanElement.getClientRects();
        //The yValues array is used to store y values and test all client rects against them
        let yValues = []
        //The goodBoxes only stores unique y values
        let goodBoxes = []
        for (const rect of clientRects){
            //If a rectangle's top coordinate is already stored in the yValues array, it means it is an "internal" rect that should NOT be added to the goodBoxes array for further iteration.
            if(yValues.includes(rect.top)){
                // No execuation to simulate a pass
            }else{
                yValues.push(rect.top);
                goodBoxes.push(rect)
            }
        };
        //Iterates through the goodBoxes array such that all the rectangles in the block are processed
        for (var rect = 0; rect < goodBoxes.length; rect++){
            const newDiv = document.createElement('div');
            //Appends the line number elements into the empty dummy div in the grid
            spanElement.parentNode.previousElementSibling.appendChild(newDiv);
            newDiv.style.position = 'relative';
            const computedStyle = window.getComputedStyle(spanElement);
            // Get the line height property from the computed style
            const lineHeight = computedStyle.getPropertyValue('line-height');
            //Adjusts the vertical alignment of the nuumber placements so they are in the middle of the rects
            newDiv.style.top = '3px';
            //Performs a negative shift so that for a number with a certain number of digits, the entire div is shifted to the right by 4 pixels per digit. It is important to use monospace font because monospace maintains equal spacing for all characters (kerning?)
            newDiv.style.left = -((Math.abs(counter).toString().length)*4) + 'px';
            //The width value must be reviewed if numbers are stacking upon each other
            newDiv.style.width = '15px';
            newDiv.style.fontSize = '6px';
            newDiv.style.fontFamily = 'monospace';
            newDiv.style.fontWeight = 'bold';
            newDiv.style.color = 'grey';
            //Does a difference check on the heights between the rectangles in the current iteration and the upcoming iteration, so long as the rect being processed is not the last one. Subtracts by the total value of the rect height
            if (rect !== goodBoxes.length - 1){
                newDiv.style.paddingBottom = Math.abs(goodBoxes[rect].top - goodBoxes[rect + 1].top) - 10.671875  + (10.67185 - 6)+ 'px';
                // console.log(Math.abs(clientRects[rect].top - clientRects[rect + 1].top));
            }else{
                newDiv.style.paddingBottom = 0;
            }
            newDiv.textContent = counter++;
        }
    });
}

export function ping(){
    console.log("Ping from utilityFunctions.js");
}

// Deep clones an original node_list to prevent reference smashing. Returns the cloned node list
export function cloneNodelist(node_list){
    let cloned_nodes = []
    node_list.forEach(element => {
        const clonedElement = element.cloneNode(true); // Clone the element (deep copy)
        cloned_nodes.push(clonedElement);
    });
    return cloned_nodes;
}
