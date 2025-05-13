// Set up export help function (JS modules )
export function help(){
  console.log("pageBreak.js manages all pagination requirements of pdf_lab_js. Page breaking is enforce on all HTML elements classed with the 'page-break' class and pages are numbered accordingly with an aesthetic bar placed at the bottom of every page. Once imported, it executes automatically on the elements within the DOM");
};

// Set up data structure to contain page data
var Config = {};
Config.pixelsPerInch = 96;
Config.pageHeightInCentimeter = 29.7; // must match 'min-height' from 'css/sheets-of-paper-*.css' being used
Config.pageMarginBottomInCentimeter = 2; // must match 'padding-bottom' and 'margin-bottom' from 'css/sheets-of-paper-*.css' being used

// Execute page breaking and numbering functions in tandem after a delay (to permit any preceding effects to transpire prior)
window.addEventListener("DOMContentLoaded", function () {
    const delay = 2000;
    // Set a delay so that the page numbering and breaking is applied AFTER the numberingGrid elements are resized to appropriate structures
    setTimeout(applyPageBreaks, delay);
    setTimeout(pageNumberFunction, delay);

});

function pageNumberFunction(){

    let pages = document.querySelectorAll(".page");
    let index = 1;
    // JS complains if the variable below is not initialized
    let page

    for (page of pages){

        const page_number_marker = document.createElement('div');
        page_number_marker.classList.add("page-number-marker");

        const page_number_marker_span = document.createElement('span');

        const page_number_marker_index = document.createElement('div');
        page_number_marker_index.classList.add("page-number-marker-index");
        page_number_marker_index.textContent = "P" + index;
        index++;

        page_number_marker_span.append(page_number_marker_index);
        page_number_marker.append(page_number_marker_span);
        page.prepend(page_number_marker);

    }
}

// Applies manual and automatic page breaks. The HTML document primarily implements manual page breaking
function applyPageBreaks() {
    applyManualPageBreaks();
    // applyAutomaticPageBreaks(Config.pixelsPerInch, Config.pageHeightInCentimeter, Config.pageMarginBottomInCentimeter);

    document.querySelectorAll(".document .page").forEach(function (element) {
        if (!element.classList.contains("has-events")) {
            element.addEventListener("blur", function () {
                applyPageBreaks();
            });

            element.classList.add("has-events");
        }
    });
}


/* Applies any manual page breaks in preview mode (screen, non-print) where CSS Paged Media is not fully supported. This function screens all children of the page element to determine if they have a page-break class within them. If so, they are manipulated in such as way that there is a "page" HTML element inserted adjacent to the element */
function applyManualPageBreaks() {
    var docs, pages, snippets;
    /*Generate a docs variable to store a NodeList, which is required to subsequently iterate through the NodeList of it's child elements because the querySelectorAll function only performs a shallow copy, as in, it does NOT copy the children of the query object */
    docs = document.querySelectorAll(".document");
    // Iterate through the document element, finding all "page" classed elements
    for (var d = docs.length - 1; d >= 0; d--) {
        pages = docs[d].querySelectorAll(".page");
        // Iterate through the pages, collecting their children in the snippets array
        for (var p = pages.length - 1; p >= 0; p--) {
            snippets = pages[p].children;
            // Iterate through the snippets array, screening for elements with "page-break" classes
            for (var s = snippets.length - 1; s >= 0; s--) {
                // Iterate through the snippets with page-break" classes elements and insert a new page adjacent to the current page in the iteration cycle
                if (snippets[s].classList.contains("page-break")) {
                    pages[p].insertAdjacentHTML("afterend", "<div class=\"page\" contenteditable=\"false\"></div>");
                    // For every other element remaining in the snippet, reappent it to the page newly inserted after the page-break element
                    for (var n = snippets.length - 1; n > s; n--) {
                        pages[p].nextElementSibling.insertBefore(snippets[n], pages[p].nextElementSibling.firstChild);
                    }
                    // Remove the "page-break" element, it has now been replaces by a "page" classed element
                    snippets[s].remove();
                }
            }
        }
    }
}


/* Applies (where necessary) automatic page breaks in preview mode (screen, non-print) where CSS Paged Media is not fully supported.*/
function applyAutomaticPageBreaks(pixelsPerInch, pageHeightInCentimeter, pageMarginBottomInCentimeter) {
    var inchPerCentimeter = 0.393701;
    var pageHeightInInch = pageHeightInCentimeter * inchPerCentimeter;
    var pageHeightInPixels = Math.ceil(pageHeightInInch * pixelsPerInch);
    var pageMarginBottomInInch = pageMarginBottomInCentimeter * inchPerCentimeter;
    var pageMarginBottomInPixels = Math.ceil(pageMarginBottomInInch * pixelsPerInch);
    var docs, pages, snippets, pageCoords, snippetCoords;
    docs = document.querySelectorAll(".document");

    for (var d = docs.length - 1; d >= 0; d--) {
        pages = docs[d].querySelectorAll(".page");

        //The pages variable is iterated through (top-down) so as to identify any oversized page elements
        for (var p = 0; p < pages.length; p++) {
            if (pages[p].clientHeight > pageHeightInPixels) {
                //If pages are oversized, a new page element is inserted DIRECTLY after the page as a sibling
                pages[p].insertAdjacentHTML("afterend", "<div class=\"page\" contenteditable=\"false\"></div>");
                pageCoords = pages[p].getBoundingClientRect();
                //The elements withint he page are stored in the snippets array
                snippets = pages[p].querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol");

                //The snippets array is processed (bottom-up) to determine if any snippets exceed the page height
                for (var s = snippets.length - 1; s >= 0; s--) {
                    snippetCoords = snippets[s].getBoundingClientRect();
                    //If a snippet element exceeds the page height, it will be inserted as the first child in the page that was created in a previous line. The for loop causes it to repeat until a snippet that does not exceed the page limit is identified. This is essentially a prepend function
                    if ((snippetCoords.bottom - pageCoords.top + pageMarginBottomInPixels) > pageHeightInPixels) {
                        pages[p].nextElementSibling.insertBefore(snippets[s], pages[p].nextElementSibling.firstChild);
                    }
                }
                //Because the pages are processed top-down, the pages array object is updated to reflect the addition of the newly added page. This forms a chain that will eventually fill up and add pages at the end of the document, and if those pages exceed the page dimension limits, they will continue being processed until no page is in violation of the page limits.
                pages = docs[d].querySelectorAll(".page");
            }
        }
    }
}
