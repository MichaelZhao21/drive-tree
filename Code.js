function doGet() {
	file = HtmlService.createTemplateFromFile('Index').evaluate();
	return file;
}

function include(filename) {
	return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getTree() {
	var root = DriveApp.getRootFolder().getFoldersByName("Robotics").next();
	var rootNode = new FolderNode(root);
	var toProcess = [rootNode];
	while (toProcess.length) {
		var next = toProcess.shift();
		genFiles(next);
		toProcess = toProcess.concat(next.subfolders);
		Logger.log(next.folder);
		Logger.log(toProcess);
	}
	Logger.log(rootNode.subfolders[0].subfolders);
}

function genFiles(node) {
	var folderIt = node.folder.getFolders();
	var fileIt = node.folder.getFiles();
	while (folderIt.hasNext()) {
		node.subfolders.push(new FolderNode(folderIt.next()));				
	}
	while (fileIt.hasNext()) {
		node.files.push(fileIt.next());
	}
}

class FolderNode {
	constructor(folder) {
		this.folder = folder;
		this.subfolders = [];
		this.files = [];
	}
}
