import EditorEvents = require("../editor/EditorEvents");

class ResourceOps extends Atomic.ScriptObject {


}

var resourceOps = new ResourceOps();

export function CreateNewFolder(resourcePath: string, reportError: boolean = true): boolean {

    var title = "New Folder Error";

    var fs = Atomic.getFileSystem();

    if (fs.dirExists(resourcePath) || fs.fileExists(resourcePath)) {
        if (reportError)
            resourceOps.sendEvent(EditorEvents.ModalError, { title: title, message: "Already exists: " + resourcePath });
        return false;

    }

    if (!fs.createDir(resourcePath)) {

        if (reportError)
            resourceOps.sendEvent(EditorEvents.ModalError, { title: title, message: "Could not create " + resourcePath });

        return false;
    }

    var db = ToolCore.getAssetDatabase();
    db.scan();

    return true;

}

export function CreateNewComponent(resourcePath: string, componentName: string, reportError: boolean = true): boolean {

    var title = "New Component Error";

    var fs = Atomic.fileSystem;

    if (fs.dirExists(resourcePath) || fs.fileExists(resourcePath)) {
        if (reportError)
            resourceOps.sendEvent(EditorEvents.ModalError, { title: title, message: "Already exists: " + resourcePath });
        return false;

    }

    var templateFilename = "AtomicEditor/templates/template_component.js";
    var file = Atomic.cache.getFile(templateFilename);

    if (!file) {

        if (reportError)
            resourceOps.sendEvent(EditorEvents.ModalError, { title: title, message: "Failed to open template: " + templateFilename });
        return false;

    }

    var out = new Atomic.File(resourcePath, Atomic.FILE_WRITE);
    var success = out.copy(file);
    out.close();

    if (!success) {
        if (reportError)
            resourceOps.sendEvent(EditorEvents.ModalError, { title: title, message: "Failed template copy: " + templateFilename + " -> " + resourcePath });
        return false;
    }

    ToolCore.assetDatabase.scan();

    return true;

}
