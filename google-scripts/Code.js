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

function getTree(fileName) {
	var outputFile = DriveApp.getRootFolder().getFilesByName(fileName).next();
	var root = DriveApp.getRootFolder();
	var rootNode = new FolderNode(root, 0);
	var toProcess = [rootNode];
	var out = "";
	var processed = "";
	while (toProcess.length) {
		var next = toProcess.shift();
		out = genFiles(next, out);
		toProcess = toProcess.concat(next.subfolders);
		processed += next.folder.getName() + "\n";
		outputFile.setContent("Folders processed:\n" + processed);
	}
	outputFile.setContent(out);
	return rootNode;
}

function genFiles(node, out) {
	out += "|".repeat(Math.max(0, node.depth - 1)) + (node.depth > 0 ? "+" : "") + "-" + node.folder.getName() + "\n";
	var folderIt = node.folder.getFolders();
	var fileIt = node.folder.getFiles();
	while (folderIt.hasNext()) {
		node.subfolders.push(new FolderNode(folderIt.next(), node.depth + 1));
	}
	while (fileIt.hasNext()) {
		var tempNext = fileIt.next();
		var name = tempNext.getName();
		if (tempNext.getMimeType() == "application/vnd.google-apps.shortcut")
			name += " [Shortcut]";
		out += "|".repeat(node.depth + 1) + "-" + name + "\n";
		node.files.push(name);
	}
	return out;
}

function FolderNode(folder, depth) {
	var subfolders = [];
	var files = [];
	return {folder, folderName: folder.getName(), subfolders, files, depth};
}

function createOutput() {
	var now = new Date();
	var name = "drive-tree-";
	name += now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear() + "-";
	name += now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds();
	var outputFile = DriveApp.createFile(name, "Drive Tree\n\n", MimeType.PLAIN_TEXT);
	outputFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
	return {url: outputFile.getUrl().replace("view?usp=drivesdk", "preview"), name: outputFile.getName()};
}