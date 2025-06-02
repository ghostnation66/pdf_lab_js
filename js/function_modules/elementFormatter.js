export function help(){
  console.log("elementFormatter.js manages all formatting (finds specific element classes and expands them to appropriate HTML) and labeling functionality for pdf_lab_js. Hyperlink construct are also supported and managed in this script");
};

export function formatElements(){
  formatFigures();
  // labelSections();
  // renderHyperlinks();
}

// Reformats the figure class to match the CSS styling expectation, places correct indices, and manages hyperlinking and figure references. Manages single, double, and quad content figures.
export function formatFigures(){
  // Collect all figure classed elements in the document
  let figures = document.querySelectorAll(".figure");
  // Set tracking for figure_index to perform automatic numbering of figures in the hyperlink text
  let figure_index = 1;
  // Iterate through each element in the set
  for (let figure of figures){
    // Extract the data-title property and save it to figure_label, extract the id of the figure and set it as figure_id, which will be used for hyperlink targeting
    let figure_label = figure.dataset.title;
    let figure_id = figure.id;
    // Extract all but the last child of the figure, and save it to figure_content. This allows support for multiple instances of figure data if necessary.
    const figure_content_array = Array.from(figure.children).slice(0, -1);
    // Extract the last child of the figure, and save it as figure_caption
    const figure_caption = figure.lastElementChild;
    console.log("figure processed");
    // Build figure architecture in accordance to CSS properties for the .figure classed elements
    let figure_container_div = document.createElement("div");
    let figure_label_div = document.createElement("div");
    let figure_content_div = document.createElement("div");
    let figure_empty_div = document.createElement("div");
    let figure_caption_div = document.createElement("div");
    // Add id label andclasses to the elements, according to to the CSS styling expectations
    figure_container_div.id = figure_id;
    figure_container_div.classList.add('figure');
    figure_label_div.classList.add('figure-label');
    figure_content_div.classList.add('figure-content');
    // Sequentially append label, content, empty, and caption. Content is pulled from array, inserted into a content_div, and then inserted into the container_div
    figure_label_div.innerText = figure_label;
    figure_container_div.append(figure_label_div);
    figure_content_array.forEach(element => {
      figure_content_div.appendChild(element);
    });
    figure_container_div.append(figure_content_div);
    figure_container_div.append(figure_empty_div);
    figure_container_div.append(figure_caption);
    // Replace the original figure element with the reconstructed element
    figure.replaceWith(figure_container_div);

    // Any <a> elements with the .figure class and an href are automatically formatted so that their innerText contains the word "Figure" and the index of the specific figure in question
    const selector = `a[href="#${figure_id}"]`;
    let hyperlinks = document.querySelectorAll(selector);
    if(hyperlinks){
      for(let hyperlink of hyperlinks){
        hyperlink.textContent = 'Figure ' + figure_index;
        hyperlink.style.color = "blue";
        hyperlink.style.textDecorationLine = "underline";
      };
    };
    figure_index++;
    // let hyperlink_text = document.createElement('div');
    // hyperlink_text.textContent = "HERRO ALL";
    // hyperlink.append(hyperlink_text);
  };

  return

};
