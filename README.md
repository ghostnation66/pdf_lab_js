# Saving pages to PDF

In order to save to a properly-formed PDF (simply printing to PDF seems to offset line numbering at this time), we use the SingleFile extension by Mozilla to extract all data, and use shot-scraper to save the html file to PDF. In order to generate PDF documents without borders, the CSS file will need to be modified so that the html,body tags are colored with a white background, and the .page.boxshadow is commented out. Upon extracting the site ot a file via SingleFile (which must run in a live-server on a localhost port), perform the following command with the indicated flags to obtain a clean, paginated document:

<code>shot-scraper pdf pdf_lab_js_file.html --print-background -o screenie.pdf</code>

Because the margins are so large, using the pdfcrop utility provided by a tex live installation will remove margins, and add 20pts of margin back:

<code>pdfcrop --margins '20 20 20 20' screenie.pdf screenie_cropped.pdf</code>

# Upcoming patch updates

Patch: Alphabetize all CSS rules
Patch: Reduce HTML footprint of slashtabs, rename to section-tab
Patch: Generate quad-figure CSS object (4 equally spaced regions to insert images, with independent scalability)
Patch: Generate HTML line rendering; instead of rendering sequential line numbers, we need to implement line numbers that utilize a regex function to screen the raw HTML file and output a line number for each new line in document, correlating them to the page render lines.



# Upcoming major updates

Major 1: Design text reflow system to automatically reflow the text of numberingGrids and HTML elements within the dual-column element
Major 2: Create a scraper that is provided an HTML element as an argument and generates a javascript object representation of it (with accurate nesting features). This can be used in later reflow projects to scan for specific class elements and reflow them to other elements (directed graph based reflow, pointing like a doubly-linked list)
Major 3: Develop the pdf_lab_js wiki using shot-scraper to extract individual CSS elements and display images of them in a search-able file-system which enables the user to type in the CSS selector and find a PNG representation of the output.
