function doGet() {
	file = HtmlService.createTemplateFromFile('Index').evaluate();
	return file;
}

function include(filename) {
	return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
