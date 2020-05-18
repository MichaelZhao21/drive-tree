function doGet() {
	var index = HtmlService.createTemplateFromFile('Index').evaluate();
	index.setTitle("Drive Tree");
	return index;
}

function include(filename) {
	return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getSize() {
	return DriveApp.getStorageUsed();
}

function getTree() {
	var root = DriveApp.getRootFolder().getFoldersByName("A SAFE PLACE FOR YOUR FILES").next(); // TODO: change to root lol
	var rootNode = new FolderNode(root);
	var toProcess = [rootNode];
	while (toProcess.length) {
		var next = toProcess.shift();
		genFiles(next);
		toProcess = toProcess.concat(next.subfolders);
	}
	Logger.log(rootNode);
	return rootNode;
}

function genFiles(node) {
	var folderIt = node.folder.getFolders();
	var fileIt = node.folder.getFiles();
	while (folderIt.hasNext()) {
		node.subfolders.push(new FolderNode(folderIt.next()));				
	}
	while (fileIt.hasNext()) {
		node.files.push(fileIt.next().getName());
	}
}

function FolderNode(folder) {
	var subfolders = [];
	var files = [];
	return {folder, folderName: folder.getName(), subfolders, files};
}
