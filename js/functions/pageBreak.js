[wiki] applyPageBreaks: applies manual and automatic page breaks and draws contextual variables from the configuration values set in the main script (index.js). Applies the blur


export function applyPageBreaks() {
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
