// [wiki] pageNumberFunction: Selects the .page classed elements (which are utogenerated and all pages are available at the beginning of the file, although a delay is required to ensure that rendering and expansion occurs prior to page numbering), then for each page, generates a slashNumber element (placed at the bottom of the page). The slashNumberSpanDiv (containing the actual page number text) is attached to slashNumberSpan, which is subsequently appended to slashNumber, which is subsequently appended to the page element. The reason for separating and reattaching elements is to provide independent styling


export function pageNumberFunction(){
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
}
