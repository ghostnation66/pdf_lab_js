// Set up export help function (JS modules )
export function help(){
  console.log("generateCitation.js manages all in text citation and bibliography rendering for pdf_lab_js. The functions utilities in this module rely on a bibtex formatted file called bibliography.js which is automatically loaded into the DOM by including it as a source script, so it's object data is discoverable by the utility functions");
};

const Cite = require('citation-js');


// The render_text_citation function will replace the bibliography identifier in bibliography.js (such as SEvgI2006) with the "number" it will reference in the bibliography. Use span elements classed with "text-ctation" to prevent blocking.
export function render_text_citation(){
  // Collect all text citation classed elements
  var textCitations = document.querySelectorAll(".text-citation");
  // Loop through the textCitations array, and perform a regex based extraction method to include only the data necessary for rendering the text citation in the document
  textCitations.forEach(function(node){
    let citation = new Cite(bibliography);
    // The .format() method is utilized to generate the output in bibliography format, we pass an anonymous object to define the output format (html), bibliography language (en-US). For more information visit https://larsgw.github.io/citation.js/api/tutorial-output_options.html
    let output = citation.format('bibliography', {
      format: 'html',
      template: 'apa',
      lang: 'en-US',
      // entry: node.textContent,
      // prepend (entry){
      // return `${entry.address}`
      // }
      prepend (entry) {
        return `[${entry.id}]: `
      },
    });
    //The outputArray ingests the ENTIRE bibliography and converts it to a list delimited by newlines
    let outputArray = output.split('\n');
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
    });
    //Simply replaces teh text-citation bibtex reference with the output value
    node.innerHTML = "[" + textCitationIndex + "]";
  });
}

export function render_bibliography(){
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
  // Collect the bibliography div element with the "citations" class
  let citationsContainer = document.getElementById('citations');
  // If the div element exists, the innerHTML will render out the entire bibliography with the prepended "bibliography-number" classed element.
  if (citationsContainer !== null){
      citationsContainer.innerHTML = output;
      // console.log(output);
  }else{
      // console.log("Citation item was null...");
  }
}
