var wbWindowMap = {}

export function Desktop(dom) {
    this._activeWnd;
    this._apps = [];
    this._dom = dom;
    this._backgroundColor =
    $(window).bind('touchmove mousemove', (e) => {
        e.preventDefault();
        if (this._activeWnd)
            this._activeWnd.updateWindowTransform(e);
    });
}

Desktop.prototype.addApp = function(app){

}

Desktop.prototype.setActiveWindow = function (wnd) {
    this._activeWnd = wnd;
}

Desktop.prototype.getDOM = function () {
    return this._dom;
}

Desktop.getEventPositionXY = function (e) {
    var x, y;
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
        x = e.clientX;
        y = e.clientY;
    }
    return {x: x, y: y};
}

Desktop.prototype.addAppToTaskbar = function (appName, wnd) {
    var appsBar = $(".wbTaskbar .wbAppsBar");


    function clearAllFocus() {
        appsBar.find(".focus").removeClass("focus");
    }

    clearAllFocus();

    var appBar = $("<div class=\"app\"></div>").text(wnd.getTitle());

    appBar.attr("data-uuid", wnd.getUUID())
        .click(function () {
            clearAllFocus();
            if (wnd.taskbarToggle())
                $(this).addClass("focus");
        }).addClass("focus");

    appsBar.append(appBar);
}

Desktop.prototype.removeAppFromTaskbar = function (wnd) {
    var appsBar = $(".wbTaskbar .wbAppsBar");
    var entry = appsBar.find(".app[data-uuid=" + wnd.getUUID() + "]");
    entry.remove();
}

Desktop.prototype.dispose = function (app) {

}

Desktop.prototype.getSize = function () {
    var w = parseInt(this._dom.css("width"));
    var h = parseInt(this._dom.css("height"));
    return {width: w, height: h};
}

