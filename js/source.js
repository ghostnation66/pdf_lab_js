
// window.print();

var Config = {};
Config.pixelsPerInch = 96;
Config.pageHeightInCentimeter = 29.7; // must match 'min-height' from 'css/sheets-of-paper-*.css' being used
Config.pageMarginBottomInCentimeter = 2; // must match 'padding-bottom' and 'margin-bottom' from 'css/sheets-of-paper-*.css' being used

window.addEventListener("DOMContentLoaded", function () {
	const delay = 2000;

	// Set a delay so that the page numbering and breaking is applied AFTER the numberingGrid elements are resized to appropriate structures
	setTimeout(applyPageBreaks, delay);
	setTimeout(pageNumberFunction, delay);

	// applyPageBreaks();
	// pageNumberFunction();
	// textReflow();
});

function pageNumberFunction(){

	let pages = document.querySelectorAll(".page");
	let index = 1;

	for (page of pages){

		const slashNumber = document.createElement('div');
		slashNumber.classList.add("slashNumber");

		const slashNumberSpan = document.createElement('span');

		const slashNumberSpanDiv = document.createElement('div');
		slashNumberSpanDiv.classList.add("slashNumber-number");
		slashNumberSpanDiv.textContent = "P" + index;
		index++;

		slashNumberSpan.append(slashNumberSpanDiv);
		slashNumber.append(slashNumberSpan);
		page.prepend(slashNumber);

	}
	// $(".page").each(function(index, element){
	// 	let el = $(this);
	// 	/* Generates a new div elemenbt */
	// 	const slashNumber = $("<div class='slashNumber'></div");
	// 		el.prepend(slashNumber);
	// 	/* Adds custom text in the div element field */
	// 	const slashNumberSpan = $("<span></span>");
	// 	slashNumber.append(slashNumberSpan);
	// 	const slashNumberSpanDiv = $("<div class='slashNumber-number'></div");
	// 	slashNumberSpanDiv.text((index+1));
	// 	slashNumberSpan.append(slashNumberSpanDiv);
	//
	//
	// 	newDiv.text((index + 1));
	// 	// el.prepend(slashNumber);
	//
	// });
}

function applyPageBreaks() {
	applyManualPageBreaks();
	applyAutomaticPageBreaks(Config.pixelsPerInch, Config.pageHeightInCentimeter, Config.pageMarginBottomInCentimeter);

	document.querySelectorAll(".document .page").forEach(function (element) {
		if (!element.classList.contains("has-events")) {
			element.addEventListener("blur", function () {
				applyPageBreaks();
			});

			element.classList.add("has-events");
		}
	});
}

/* Applies any manual page breaks in preview mode (screen, non-print) where CSS Paged Media is not fully supported. This function screens all children of the page element to determine if they have a page-break class within them. If so, they are manipulated in such as way that there is a "page" HTML element adjacent to the element */
function applyManualPageBreaks() {
	var docs, pages, snippets;
	/*Generate a docs variable to store a NodeList, which is required to subsequently iterate through the NodeList of it's child elements because the querySelectorAll function only performs a shallow copy, as in, it does NOT copy the children of the query object */
	docs = document.querySelectorAll(".document");

	for (var d = docs.length - 1; d >= 0; d--) {
		pages = docs[d].querySelectorAll(".page");

		for (var p = pages.length - 1; p >= 0; p--) {
			snippets = pages[p].children;

			for (var s = snippets.length - 1; s >= 0; s--) {
				/* Keep in mind, the page-break div is invisible */
				if (snippets[s].classList.contains("page-break")) {
					pages[p].insertAdjacentHTML("afterend", "<div class=\"page\" contenteditable=\"false\"></div>");

					for (var n = snippets.length - 1; n > s; n--) {
						pages[p].nextElementSibling.insertBefore(snippets[n], pages[p].nextElementSibling.firstChild);
					}

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


//Column and Page Reflow Function
function textReflow(){
    let pages = document.querySelectorAll(".page");
    console.log(pages);
    for (let page of pages){
				//Extracting Page coordinates
				let pageCoords = pages[page].getBoundingClientRect();
        if (page.clientHeight > pageHeightInPixels){

            let childList = page.children;
            //Extracts the dual column element from a violating page
            let dualColumn = page.querySelector(".dual-column");
            let columns = dualColumn.children;

            //Checks left and right column for violations. If left column violates bounds, the span extractor function is executed and contents are prepended to the right column. If right column violates bounds, a new page is either generated or content is prepended to the left column elements. If both columns violate, the if statement will first process the left column and then the right. The complication arises in the prepending process. If the left column is snipped and content needs to be prepended to the right column, we need to know if the right column had a continuing numberingGrid from the section. May require disabling of the automatic page reflow function

						//Left column check
						if (columns[0].clientHeight > pageHeightInPixels){
							console.log("Left column is oversized");
							let snippets = columns[0].children;
							//Screens through snippets of oversized column and gets the boundingRect for each snippet
							for(snippet of snippets){
								snippetCoords = snippets[snippet].getBoundingClientRect();
								//Checks if snippet client rect is out of bounds. If it is the case, the element gets placed as the first child in the right column
								if ((snippetCoords.bottom - pageCoords.top + pageMarginBottomInPixels) > pageHeightInPixels) {
									console.log(`Running left column reflow function for a fully violating snippet ${snippet} from ${page}`);
									pages[p].nextElementSibling.insertBefore(snippets[s], pages[p].nextElementSibling.firstChild);
									//Finds the sibling of the left column element, and places the elements accordingly
									columns[0].nextElementSibling.insertBefore(snippets[snippet], columns[0].nextElementSibling.firstChild);
								}
								//If snippets clientRect Top is in bounds but bottom is out of bounds runs a Spanning function to extract the text that is out of bounds
								if ((snippetCoords.bottom - pageCoords.top + pageMarginBottomInPixels) > pageHeightInPixels && (snippetCoords.top - pageCoords.top + pageMarginBottomInPixels) < pageHeightInPixels) {
									console.log(`Running right column reflow function for a fully violating snippet ${snippet} from ${page}`);
								}

							}
						}
						//Right column check
						if (columns[1].clientHeight > pageHeightInPixels){
							console.log("Left column is oversized");



						}





        }else{
            console.log("NO");
        }
    }
}
/* Adds pageNumber div to all pages generated. This needs to be within the page breaking function because it only iterates once if placed outside and the lack of async functionality prevents this prom applying to all pages*/
	// $(".page").each(function(index, element){
	// 	let el = $(this);
	// 	/* Generates a new div elemenbt */
	// 	const slashNumber = $("<div class='slashNumber'></div");
	// 		el.prepend(slashNumber);
	// 	/* Adds custom text in the div element field */
	// 	const slashNumberSpan = $("<span></span>");
	// 	slashNumber.append(slashNumberSpan);
	// 	const slashNumberSpanDiv = $("<div class='slashNumber-number'></div");
	// 	slashNumberSpanDiv.text((index+1));
	// 	slashNumberSpan.append(slashNumberSpanDiv);
	//
	//
	// 	newDiv.text((index + 1));
	// 	// el.prepend(slashNumber);
	//
	// });
}

/* Line Numbering, obsolete */
/* Set a number index to prevent line numbers from restarting with each message element */
var numberIndex = 0;
$(document).ready(function () {
  	$(".message").each(function () {
      	var self = $(this);
      	var numbering = self.find(".lineNumbering").first();
      	var messageText = self.find("p").first();
        /* ParseFloat is required because the jQuery method for .css returns a string. Cannot use ParseInt because there will be an overhead generated during the division step when calculating the number of lines which generates extra lines */
        var lineHeight = parseFloat($(".message").css("line-height"));
        // console.log(messageText.height());
        // console.log(lineHeight);
        /* There exists a discrepancy in using math.floor or math.round to render the number of appropriate lines. Here, math.round performs better because it will round up when the value is nearing the upper integer, which, if floored, will cause the line numbering to be one line less for every paragraph. The lineheight of 10.66667 causes an issue where the rounding serves the calculation better. */
      	var lines = (Math.round((messageText.height()) / lineHeight));
        console.log(lines);
      	var lineNumberingHtml = "";
        /* changes the lineNumbering CSS selector's height to match that of the messageText */
        numbering.css({'height': messageText.height()});

        for(var i=0; i <= lines-1; i++){
            // lineToAppend = "<span class='lines'>" + (numberIndex) + "</span>" + "<br>";
            lineToAppend = "<div class='lines'>" + (numberIndex++) + "</div>";
            numbering.append(lineToAppend);
            /* This code identifies the ith child element of the numbering variable and modifies its CSS */
            // numbering.find(':eq(' + i + ')').css({'transform': 'translate(100%,100%)'});

        }

  	});
});

/* Table of Contents */

/* Setting up ToC as a global variable. The contenteditable field must be false in order to enable hrefs */
var ToC = "<nav role = 'navigation' class='table-of-contents'>" +
					"<div class='content-table'>Table of Contents</div>"
					"<ul>";

$(".section").each(function () {
	let el = $(this);
	let title = el.text();
	let link = "#" + el.attr("id");
	var pageNumber = el.closest(".page");
	/* Setting up the newline element to be inserted into the Toc */
	let newLine = "<li>" + "<a href='" + link + "'>" + title + "</a>" + "</li>";

	ToC += newLine;

});

ToC += "</ul>" + "</nav>";

$(".ToC").prepend(ToC);



/* Subsection Labeling. Currently limited to a depth of 1 section, 1 subsection. Performs top-down rendering of sections */
var partitions = document.querySelectorAll(".section, .subsection")
// console.log(partitions);
var sectionIndex = 1;
var subSectionIndex = 1;

for (var partitionsIndex = 0; partitionsIndex < partitions.length; partitionsIndex++){

    if (partitions[partitionsIndex].className == "section"){

        var sectionNumber = document.createElement("span");
        sectionNumber.classList.add("section-number");
        sectionNumber.textContent = (sectionIndex);

        var sectionLabel = document.createElement("span");
        sectionLabel.classList.add("section-label");
        sectionLabel.textContent = partitions[partitionsIndex].textContent;
        partitions[partitionsIndex].textContent = "";

        partitions[partitionsIndex].appendChild(sectionNumber);
        partitions[partitionsIndex].appendChild(sectionLabel);

        sectionIndex++;
        subSectionIndex = 1;

    };

    if (partitions[partitionsIndex].className === "subsection"){

        var subSectionNumber = document.createElement("span");
        subSectionNumber.classList.add("subsection-number");
        /* Subtract the sectionIndex because the increment occurs after a successful loop of the section conditional statement. We need to backtrack by one */
        subSectionNumber.textContent = (String(sectionIndex - 1) + "." + String(subSectionIndex));

        var subSectionLabel = document.createElement("span");
        subSectionLabel.classList.add("subsection-label");
        subSectionLabel.textContent = partitions[partitionsIndex].textContent;
        partitions[partitionsIndex].textContent = "";

        partitions[partitionsIndex].appendChild(subSectionNumber);
        partitions[partitionsIndex].appendChild(subSectionLabel);

        subSectionIndex++;

    };

}



    //Simple file importing script that uses jQuery's load feature to load data into the element's HTML.For now, the import function ALSO executes individual citations on each block
    $(".import").each(function () {
        let container = $(this);
        let path = container.text();
        container.load(path, function(responseTxt, statusTxt, xhr){
            if(statusTxt == "success"){
                // console.log("Content loaded successfully for element: ", container);
            }
            if(statusTxt == "error"){
                // console.log("Error loading content for element: ", container, " Error: " + xhr.status + ": " + xhr.statusText);
            }
        });
    });


//Setting a delay to let the import data load. This will have to be amended using a promise structure in the future as it is unreliable. Load times will affect the generation of proper citations
setTimeout(executeCitation, 1000);
// executeCitation();

function executeCitation(){

    /* Bibliography Generator */
    const Cite = require('citation-js')

    //The bibliography variable is in the bibliography.js file. It's included in the HTML via script tag inclusion
    let example = new Cite(bibliography)

    let output = example.format('bibliography', {
        format: 'html',
        template: 'apa',
        lang: 'en-US',
        prepend (entry) {
            // return `<span>[${entry.id}]</span> `
            /* Using a span element to spawn the bibliography-number::before pseudoelement in to place the tracking counters and enumerate the bibliography */
            return `<span class="bibliography-number"></span> `
        }

    });

    var citationsContainer = document.getElementById('citations');



    if (citationsContainer !== null){
        citationsContainer.innerHTML = output;
        // console.log(output);
    }else{
        // console.log("Citation item was null...");
    }




    /* In text citation replacer function */
    var textCitations = document.querySelectorAll(".text-citation");

    textCitations.forEach(function(node){


        let citation = new Cite(bibliography);
        //Uses an anonymous object to conveniently pass data directly as a parameter of the function

        let output = citation.format('bibliography', {

            format: 'html',
            template: 'apa',
            lang: 'en-US',
            entry: node.textContent,
            // prepend (entry){
            // return `${entry.address}`
            // }
            prepend (entry) {
                return `[${entry.id}]: `
            },

        });

        //The outputArray ingests the ENTIRE bibliography and converts it to a list delimited by newlines
        outputArray = output.split('\n');
        //The textCitation value is an empty string to store the matched regex function
        let textCitationIndex = ""

        //The function iterates through the outputArray list (containing the ENTIRE bibliography in separate indices of the array) and attempts to find a regex match. Upon finding a match, the textCitations value is set to the current index of the iteration process
        outputArray.forEach((item, index, array) => {
            // const searchString = node.textContent;
            const regex = new RegExp(node.textContent);
            // const regex = /(${searchString})/g;
            const identifyString = regex.test(item);
            if (identifyString){
                textCitationIndex = parseInt(index);
            }

        })

        //Simply replaces teh text-citation bibtex reference with the output value
        node.innerHTML = "[" + textCitationIndex + "]";
    });

}






//This is the line numbering function. It essentially exploits the span elements special property where individual clientRects are generated per reflow within a container and identifies only the first "box" in a row, preventing multiple line numbers from being rendered on the same y axis position, permitting the use of other HTML elements such as <b></b> without such overlapping rendiring issues
window.addEventListener("DOMContentLoaded", function () {
    // Get the <span> element by its class name and have the function return a NodeList
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

    let spanElements = document.querySelectorAll('.numberedSpan');

    //Implementing a delay because the mathjax needs time to render BEFORE the rectBox values are calculated. A 0 delay will cause the code to render prior to the Mathjax. A future implementation might utilize a promise to render the code after the mathjax rendering is complete.
    const delayedFunction = function() {
        spanElements.forEach(spanElement => {
            const children = spanElement.children;
            // console.log("Children: ", children);
            let badBoxX = [];
            let badBoxY = [];
            //BadBoxes store the top and left coordinates (x,y) of the offending rectangles with b tags
            // for(child of children){
            //     if (child.nodeName == "B"){
            //         const boundingRect = child.getBoundingClientRect();
            //         // console.log(boundingRect);
            //         badBoxX.push(boundingRect.x);
            //         badBoxY.push(boundingRect.y);
            //         // console.log("This is the x and y value", badBoxX, badBoxY);
            //     }
            // }

            // Get the client rectangles for each element
            const clientRects = spanElement.getClientRects();
            // console.log("Client Rects", clientRects);
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

            //Finds the maximum width out of the rectangles in the clientRects array
            let min = Infinity, max = -Infinity;
            for (const rect of clientRects) {

                    // min = Math.min(min, rect.width);
                    max = Math.max(max, rect.width);
            }

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
								// newDiv.style.borderRight = '5px solid red';
								// newDiv.style.marginRight = '-5px';


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
    };

    setTimeout(delayedFunction, delay);
});




// $(".import").load('assets/code/figure_a.html');
//
// console.log("loaded boi");


//
//
// fetch('https://api.example.com/data')
//   .then(response => {
//     // Check if the request was successful
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     // Parse the JSON response
//     return response.json();
//   })
//   .then(data => {
//     // Do something with the data
//     console.log(data);
//   })
//   .catch(error => {
//     // Handle any errors that occurred during the fetch
//     console.error('There was a problem with the fetch operation:', error);
//   });
