
window["wbApps"]["explorer"] = function(desktop, path){
    var app = new wb.Application(desktop);
    app.setName("Explorer");

    var ds = desktop.getSize();

    var wh = ds.height - 40;
    var ww = Math.min(600,ds.width);

    var wx = (ww - ds.width) / 2.0;
    var wy = (wh - ds.height) / 2.0;

    var wnd = new wb.Window(app)
        .setTitle(fs_GetLastFolderName(path))
        .setSize(ww, wh)
        .setIcon("img/icon_folder.svg")
        .setCentered()
        .build();

    function handleIcons(wnd, desktop, container, fs, path) {
        var title = fs_GetLastFolderName(path);

        wnd.getAreaDOM().find(".txtFilePath").val(path);
        wnd.setTitle(title);

        container.children().remove();

        initFileIcons(desktop, container, fs, path, function (next) {
            return function(){
                handleIcons(wnd, desktop, container, fs, next);
            }
        });
    }

    wnd.getAreaDOM().load("/apps/explorer/dom.html?t=" + new Date().getTime(), function () {
        var aDOM = wnd.getAreaDOM();
        var folderContent = aDOM.find(".wbFolderContents");
        var backBtn =  aDOM.find(".btnBack");
        var pathInput = aDOM.find(".txtFilePath");

        handleIcons(wnd, desktop, folderContent, virtual_fs, path);

        backBtn.click(function () {
            var currPath= pathInput.val();
            var parentPath = currPath.substring(0,currPath.lastIndexOf("/"));
            handleIcons(wnd, desktop, folderContent, virtual_fs, parentPath);
        });
    });

    wnd.setActive().moveToTop();
}