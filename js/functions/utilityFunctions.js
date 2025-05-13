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

// Collects the DOMRect vertical dimensions with the inclusion of the margins of the element (accounts for scroll position)
export function marginBox(element){
  let rectBox = element.getBoundingClientRect();
  const vertical_offset = window.scrollY || document.documentElement.scrollTop;
  const horizontal_offset = window.scrollX;
  let fakeRect = {
    top: rectBox.top,
    bottom: rectBox.bottom,
    left: rectBox.left,
    right: rectBox.right
  };
  const style = window.getComputedStyle(element);
  const marginTop = parseInt(style.marginTop);
  const marginRight = parseInt(style.marginRight);
  const marginBottom = parseInt(style.marginBottom);
  const marginLeft = parseInt(style.marginLeft);
  fakeRect.bottom += (marginBottom+vertical_offset);
  fakeRect.top += (-marginTop+vertical_offset);
  fakeRect.left += (-marginLeft+horizontal_offset);
  fakeRect.right += (marginRight+horizontal_offset);
  return fakeRect;
}

export function show_coordinates(x_position, y_position){
  let target = document.createElement('div');
  target.textContent = "x";
  target.style.position = 'absolute';
  target.style.top = x_position.toString();
  target.style.left = y_position.toString();
  document.body.appendChild(target);
  return target;
}



export function convertSpanChildren(element) {
  if (!element) {
    return; // Handle null or undefined element
  }

  const childNodes = element.childNodes;

  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];

    if (node.nodeType === 3) { // Check for text node
      const text = node.textContent;
      const words = text.split(/\s+/); // Split by spaces (handles multiple spaces)
      const spanArray = [];

      words.forEach(word => {
        if (word) { // Avoid creating empty spans for extra spaces
          const span = document.createElement('span');
          span.textContent = word;
          spanArray.push(span);
        }
      });

      // Create a document fragment to hold the new spans
      const fragment = document.createDocumentFragment();
      spanArray.forEach(span => fragment.appendChild(span));

      // Replace the original text node with the fragment
      element.replaceChild(fragment, node);

      // Since we've modified the children, we need to adjust the index
      // to account for the newly inserted spans.  This is the trickiest part.
      // We've replaced one text node with potentially many span nodes.
      // The simplest way to prevent an infinite loop is to process this level only.
      return; // Exit the function after processing the text node.

    } else if (node.nodeType === 1) { // Check for element node
      // Recursively call the function for element nodes to handle nested elements
      convertSpanChildren(node);
    }
    // else, do nothing.  We only care about elements and text.
  }
}

// Analyzes the child elements of a particular DOM node. If they are text nodes, it will convert every word and space to a span and replace the text node with it's "spanned" representation (every character and whitespace has been placed into a span). This is so that a bounding box can be extracted for every word. If the node's child is not a text node, it will simply reappend the element at the end of the children list so that all elements remain in order.
export function spanGenerator(element){
  //Clone the element and extract children from cloned copy to prevent autoupdating and loop extensions in the later part of the function code
  let cloned_node = element.cloneNode(true);
  // We expect that the children array remain constant
  const children = element.childNodes
  // Create a static array to duplicate all nodes into an unchanging variabe
  // debugger
  let static_children = [];
  for(let child of children){
    static_children.push(child);
  };
  // Iterate through the child nodes, if they are text nodes (nodeType ==3), handle these by turning them into spans
  for(let child of static_children){
    // debugger
    if(child.nodeType ==3){
      let text = child.data;
      const container_span = document.createElement('span');
      let words = text.split(/\s+/);
      words.forEach((word, index) => {
        const text_span = document.createElement('span');
        text_span.textContent = word;
        // container_span.appendChild(span);
        element.insertAdjacentElement('beforeend', text_span);
        if (index < words.length - 1) {
          // container_span.appendChild(document.createTextNode(' '));
          element.insertAdjacentHTML('beforeend', "<span> </span>");
        }
      });
      // child.replaceWith(container_span);
      child.remove();
      // console.log(element.outerHTML);
    }else{
      element.insertAdjacentElement('beforeend', child);
      //We dont need to remove because we are working with live DOM elements
      // child.remove();
    }
  }
  return element;

}

// The spanSplitter function splits a given element into two array, one containing admissible element, the other containing inadmissible elements
export function spanSplitter(element, page_bottom_with_offset){
  let goodChildren = [];
  let badChildren = [];
  // debugger
  for(let child of element.childNodes){
    // debugger
    let bounding_box = child.getBoundingClientRect();
    let child_bounding_box_with_margins = marginBox(child);
    // let child_bottom = bounding_box.bottom + vertical_offset;
    if(child_bounding_box_with_margins.bottom > page_bottom_with_offset){
      badChildren.push(child);
    }else{
      goodChildren.push(child);
    }
  }
  // debugger
  return [goodChildren, badChildren];
}

// Finds the "page" that a specific element is placed on, cross compares it to the pages array, and provides an integer value of the page number. This should not return null if the HTML document is formatted properly, as every element invariably exists within some page element
export function page_indexer(element, pages){
  let element_screener = element;
  let pageIndex = 0;
  while (element_screener) {
    if (element_screener.classList && element_screener.classList.contains('page')) {
      for(let page of pages){
        if(element_screener == page){
          return pageIndex;
        }else{
          pageIndex++;
        };
      };
      return element_screener; // Found the ancestor with the class "page"
    }
    element_screener = element_screener.parentNode; // Move up to the parent
  }
  return null; // No ancestor with the class "page" found
}

export function page_finder(element, pages){
  let element_screener = element;
  let pageIndex = 0;
  while (element_screener) {
    if (element_screener.classList && element_screener.classList.contains('page')) {
      return element_screener; // Found the ancestor with the class "page"
    }
    element_screener = element_screener.parentNode; // Move up to the parent
  }
  return null; // No ancestor with the class "page" found
}
