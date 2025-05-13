import * as utility from "./utilityFunctions.js";
// Set up export help function (JS modules )
export function help(){
  console.log("textReflow.js manages reflow functionality of pdf_lab_js. It identifies a specific reflowable element 'numberingGrid' in this case, and allows text to be passed to subsequent grids if certain text is identified to exceed the vertical limit of the document.");
};

let pageHeightInPixels=1000;
let page;
let delay=3000;
let page_bottom_offset = 30;

// Finds numberingGrid elements that violate a height constraint (default 1000px). Collectes the node elements that are admissible and those that are not, and removes the node elements that are not admissible.
export function numberingGridReflow(){
    let numberingGrids = document.querySelectorAll(".numberingGrid");
    // Obtain slashNumber objects in the DOM, we will use these as page boundaries
    let page_boundary_list = document.querySelectorAll(".slashNumber");
    // Obtain the pages in the DOM to be used to reallocated oversized text to new columns
    let pages = document.querySelectorAll(".page");
    // Iterate through the list of numberingGrids in the DOM, if any of them are inadmissible, pass them to the reflow condition
    for (let i = 0; i < numberingGrids.length; i++) {
      const element = numberingGrids[i];
      // Invoking the page finder function to get the element reference to the page that the numberingGrid is placed on
      // debugger
      let pageIndex = utility.page_indexer(numberingGrids[i], pages) + 1;
      let page_node = utility.page_finder(numberingGrids[i], pages);
      // Obtain the bottom positino of every page. Text reflow candidates will have a DOMRect bottom property that exceeds this value minus some offset (page_bottom_offset)
      let page_node_rect = utility.marginBox(page_node);
      //Get the slashNumber top rect bound and set as the page boundary
      let page_boundary = page_boundary_list[(pageIndex - 1)];
      let page_boundary_bounding_box = utility.marginBox(page_boundary);
      let page_boundary_cutoff = page_boundary_bounding_box.top;
      // The marginBox utility function provides an augmented DOMRect that includes the margin sizes of any element, and also accounts for vertical offset of the scroll position
      let bounding_box_with_margins = utility.marginBox(element);
      // The pages of pdf_lab_js have static "gaps" between the pages and thus must be accountded for for every new page. This gap is scaled by the pageIndex value, because the page offset increases with each page and can be problematic as more and more pages incur a differential page height disparity. We also implement a page_gap_enforcer because pages, unfortunately, can be oversize past a default height.
      let page_gap_enforcer = page_node_rect.bottom - (1197 * pageIndex);
      let page_gap = (pageIndex-1) * 150;
      // let page_bottom_with_offset = page_node_rect.bottom - page_gap_enforcer - page_bottom_offset;
      let page_bottom_with_offset = page_boundary_cutoff - page_bottom_offset;

      // Reflow function begins here. Checks if the bottom position of the numberingGrid is inadmissible to the bottom of the page with some offset
      // if(Math.floor(bounding_box_with_margins.bottom/((pageIndex*pageHeightInPixels) + page_gap)) >= 1){

      if(bounding_box_with_margins.bottom > page_bottom_with_offset){
        debugger

        // This will extract the span element within the numberingGrid, which contains our content ( a mix of text, spans, and other node types)
        let numberedSpan = element.children[2].children[0];
        let goodChildren, badChildren
        // [goodChildren, badChildren]= spanSeparator(numberedSpan, pageIndex, page_gap);
        [goodChildren, badChildren]=spanSeparator(numberedSpan, page_bottom_with_offset);
        // Create two new numbering grid elements with goodChildren, to replace the original numberingGrid at this iteration, and one containing badChildren, to be inserted before the next numbering grid element
        let goodGrid = utility.createNumberingGrid(goodChildren);
        let badGrid = utility.createNumberingGrid(badChildren);
        // debugger
        // numberingGrids[i+1].children[2].children[0].insertAdjacentElement('afterbegin', badGrid);
        // Looping through the badChildren in revese and inserting each individual element into the subsequent numberingGrid. The original numberingGrid will remain, and whether or not we remove the original grid depends on the state of the goodChildren
        for(let child of badChildren.reverse()){
          numberingGrids[i+1].children[2].children[0].insertAdjacentElement('afterbegin', child);
        }
        // If the goodChildren array is empty, it means that the entire block was inadmissible. If this is the case, we will remove the numberingGrid, otherwise, the numbering mechanism will number an empty grid with a single, empty span with no text in it.
        if(goodChildren.length == 0){
          element.remove();
          i--;
        }
        // element.replaceWith(goodGrid);
        // Reset the numbering grid array to obtain a new set of numberingGrids from the newly reflowed grid layout. The grid at the CURRENT step was just modified, and thus we are free to move onto the next numberingGrid element, which may have been enlarged when the badChildren were placed into it from the previous loop
        numberingGrids = document.querySelectorAll(".numberingGrid");
        // The index value is pulled back again to recheck the original numbering grid
        // i--;

      }
    };
}

// Separates span elements within a span element based on admissibility to a vertical constraint. Returns an array of admissible nodes and inadmissible nodes
export function spanSeparator(spanElement, page_bottom_with_offset){
    let rect_box, push_node
    const vertical_offset = window.scrollY;
    // Convert all text data into a span bounded by each word
    utility.spanGenerator(spanElement);
    let goodChildren = [];
    let badChildren = [];
    // debugger
    // [goodChildren, badChildren] = utility.spanSplitter(spanElement, 1000, vertical_offset, pageIndex, page_gap);
    [goodChildren, badChildren]=utility.spanSplitter(spanElement, page_bottom_with_offset);

    // The spanSplitter has provided the individual elements of the spanElement that are admissible and inadmissible. We return them here to pass back into the reflow function
    return [goodChildren,badChildren];
}
// In place bounding box checker, converts any text nodes to individual span elements. Returns an array of the DOMrect of the node, and the usable node (converts text nodes to span of spans)
export function boundingBox(original_node, spanElement, index) {
    let rect
    // If text node is identified, split the entire text string into disparate span elements
    if(original_node.nodeType ==3){
      // Clone the original node to remove reference smashing
      let cloned_original_node = original_node.cloneNode(true);
        // debugger
        // Extract text data
        let node_text_string = cloned_original_node.data;
        const fragment = document.createElement('span');
        let words = node_text_string.split(/\s+/);
        words.forEach((word, index) => {
          const span = document.createElement('span');
          span.textContent = word;
          fragment.appendChild(span);

          // Add a space after each word, except the last one
          if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(' '));
          }
        });
        // Create a temporary span element
        const text_block_span = document.createElement('span');
        // Append the Text Node to the span
        text_block_span.appendChild(cloned_original_node.cloneNode());
        // Append the span to the original node to realize the instance
        original_node.parentElement.appendChild(text_block_span);

        // Get the bounding rectangle of the span
        rect = text_block_span.getBoundingClientRect();

        // Remove the temporary span
        original_node.parentElement.removeChild(text_block_span);
        // Replace text node with span of spans
        spanElement.replaceChild(fragment, original_node);
        cloned_original_node = fragment;
        return [rect, cloned_original_node];
    }else{
        rect = original_node.getBoundingClientRect();
        return [rect, original_node];
    }
}



































function rangeExtractor(spanElement, excess_height) {
    const span_height = spanElement.getBoundingClientRect().height;
    const range = document.createRange();
    // The scroll position can influence the y value of rectboxes, so we offset with the position of the window
    const vertical_offset = window.scrollY;
    range.selectNodeContents(spanElement);
    let total_offset = range.endOffset;
    let full_span_contents = range.cloneRange();
    let span_children = spanElement.childNodes;
    debugger
    let has_already_violated = 0;
    let unviolating_document_fragments = [];
    let violating_document_fragments = [];
    for(let i = 0; i<total_offset; i++){
        range.setStart(spanElement,i);
        range.setEnd(spanElement, i+1);
        // We need to snapshot the range as it is a pointer by default, which would mean the last range in the iteration is the one that applies to all of them.
        let range_snapshot = range.cloneRange();
        var rectBox = range_snapshot.getBoundingClientRect();
        let rectBoxClients = range_snapshot.getClientRects();
        // console.log(rectBox);
        if (has_already_violated){
            // console.log("previous violation occurred, storing the remaining ranges as document fragments");
            violating_document_fragments.push(range_snapshot.cloneContents());
            // Passes the for loop
            continue;
        }
        unviolating_document_fragments.push(range_snapshot.cloneContents());
        // If a range violates the height constraint
        if(rectBox.bottom + vertical_offset > 1000){
            console.log("FOUND A RECTBOX RANGE ELEMENT THAT VIOLATES CONSTRAINT");
            let document_fragment = range_snapshot.cloneContents();
            // If overflow is text based, handle it with this special case. Basically all characters are individually inserted into a numberedSpan element and sized and measured, until they violate the height constraint
            if(document_fragment.firstChild.nodeType == 3){
                console.log("this was a text OOB, extracting text");
                // Initialize height from the top of the span plus scroll position
                let cumulative_height = rectBox.y + vertical_offset;
                let text = document_fragment.textContent;
                // Track how many lines you have passed
                let line_eater_value = 0;
                //Initialize first rectBoxes element to begin subtraction
                let line_width_of_rect = rectBoxClients[line_eater_value].width;
                // Prefix data array for storing non-violating chars
                let prefix = []
                for(let char in text){
                    console.log(text[char]);
                    let temporary_span = document.createElement('span');
                    temporary_span.classList.add('numberedSpan');
                    temporary_span.innerText = `${text[char]}`;
                    // debugger
                    spanElement.insertAdjacentElement('beforebegin', temporary_span);
                    // Collect clientRect of an individual char
                    let char_box = temporary_span.getClientRects();
                    // Extract individual char width. Whitespace is not perceived to have any width, so we force it with a width of 5
                    let char_width = char_box[0].width;
                    if(char_width ==0){
                        console.log("must be a whitespace, adding hardcoded space value");
                        char_width = 3.6;
                    }
                    // Subtract character width from current rectBoxClient width. If line width of current rect was 0 or below last iteration, reassign it. We arbitrary design this so that anything less than a character width would floor to 0.
                    prefix.push(text[char]);
                    if (line_width_of_rect <= char_width){
                        line_eater_value++;
                        line_width_of_rect = rectBoxClients[line_eater_value].width;
                        cumulative_height += char_box[0].height;
                        if(cumulative_height >= 1000){
                            console.log("violated height @ character", text[char], "in line ", line_eater_value);
                            debugger;
                            //Slice prefix and suffix
                            prefix = prefix.join('');
                            let prefixFragment = document.createTextNode(prefix);
                            unviolating_document_fragments.push(prefixFragment);
                            let suffix = text.slice(char);
                            let suffixFragment = document.createTextNode(suffix);
                            violating_document_fragments.push(suffixFragment);
                            //Set the violation switch to on after the first violation. This will tell the for loop to clone everything else into a new array.
                            has_already_violated = 1;
                            break;


                        }
                    }
                    line_width_of_rect -= char_width;
                    // Remove temporary span element from DOM
                    temporary_span.remove();
                }

            }
            console.log(range_snapshot.getClientRects());
        }
        // span_range_constituents.push(range_snapshot);
        // span_range_constituents_boxes.push(rectBox);
        let rect;
        // for(rect of rectBox){
        //     if (rect.y != y_axis_filter){
        //         cumulative_height += rect.height;
        //         console.log("y axis change, height increase", rect.height);
        //         y_axis_filter = rect.y;
        //     }
        // }
        // console.log("range bounding box ", rectBox);
        // debugger
        // window.getSelection().addRange(range_snapshot);
        // debugger
        // range_snapshot.extractContents();
    }
    // console.log(span_range_constituents);
    // console.log(span_range_constituents_boxes);
    // let total_offsets = range.endOffset;
    // range.setStart(spanElement, 0);
    // range.setEnd(spanElement, 3);
    // Get the bounding rectangle for the range
    const rect = range.getClientRects();
    // Clean up the range (optional but good practice)
    range.detach();
    return unviolating_document_fragments, violating_document_fragments;
    // return range;
}
