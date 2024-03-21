
window["wbApps"]["document"] = function(desktop, path){
    var fileObj = resolveFSFromPath(virtual_fs, path);
    if(!fileObj)
        throw new Error("File not found");

    var filePath = fileObj["path"];

    var app = new wb.Application(desktop);
    app.setName("Document: " + fs_GetLastFolderName(path));

    var ds = desktop.getSize();

    var wh = ds.height - 40;
    var ww = Math.min(600,ds.width);

    var wx = (ww - ds.width) / 2.0;
    var wy = (wh - ds.height) / 2.0;

    var wnd = new wb.Window(app)
        .setTitle(fs_GetLastFolderName(path))
        .setIcon("img/icon_doc.svg")
        .setSize(ww, wh)
        .setCentered()
        .build();


    wnd.getAreaDOM().load("/apps/document/dom.html?t=" + new Date().getTime(), function () {
        wnd.getAreaDOM().find(".contentLoader").load(filePath,function(){

        });
    });
    //console.log(desktop.getSize());

    wnd.setActive().moveToTop();
}