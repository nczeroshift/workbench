import {Desktop} from "./wbDesktop.js";

export function Window(app) {
    //this._uuid = crypto.randomUUID();
    this._app = app;
    this._title = "Window";
    this._x = null;
    this._y = null;
    this._width = null;
    this._height = null;
    this._dom = null;
    this._lastRect = null;
    this._restoreRect = null;
    this._cursorStartPos = null;
    this._isDragging = null;
    this._closeCallback = null;
    this._resizeCallback = null;
    this._uuid = null;
    this._iconPath = null;
}

Window.prototype.getUUID = function () {
    return this._uuid;
}

Window.prototype.getDOM = function () {
    return this._dom;
}

Window.prototype.setTitle = function (title) {
    this._title = title;
    if(this._dom){
        var statusBar = this._dom.find(".wbStatusBar");
        statusBar.find("label").text(this._title);
    }
    return this;
}

Window.prototype.getTitle = function () {
    return this._title;
}

Window.prototype.setIcon = function(iconPath){
    this._iconPath = iconPath;
    return this;
}

Window.prototype.setCentered = function () {
    var desktop = $(".wbDesktop");
    var w = parseInt(desktop.css("width"));
    var h = parseInt(desktop.css("height"));
    this._x = w / 2 - parseInt(this._width) / 2;
    this._y = h / 2 - parseInt(this._height) / 2;
    this._applyRect();
    return this;
}

Window.prototype.setRect = function (rect) {
    this._x = rect.x;
    this._y = rect.y;
    this._width = rect.width;
    this._height = rect.height;
    this._applyRect();
    return this;
}

Window.prototype.getLastRect = function () {
    return this._lastRect;
}

Window.prototype.getRect = function () {
    return {
        x: this._x,
        y: this._y,
        width: this._width,
        height: this._height
    };
}

Window.prototype.setPosition = function (x, y) {
    this._x = x;
    this._y = y;
    this._applyRect();
    return this;
}

Window.prototype.setSize = function (width, height) {
    this._width = width;
    this._height = height;
    this._applyRect();
    return this;
}

Window.prototype._applyRect = function () {
    if (this._dom) {
        this._dom.css("left", this._x);
        this._dom.css("top", this._y);
        this._dom.css("width", this._width);
        this._dom.css("height", this._height);

        if (this._resizeCallback)
            this._resizeCallback();
    }
}

Window.prototype.close = function () {
    this._dom.remove();

    if (this._closeCallback)
        this._closeCallback();

    //delete wbWindowMap[this._uuid];
}

Window.prototype.minimize = function () {
    this._restoreRect = this.getRect();
    this._dom.hide();
}

Window.prototype.restore = function () {
    if (this._restoreRect) {
        this._dom.css("display", "");
        this._dom.removeClass("maximized");
        this.setRect(this._restoreRect);
        this._restoreRect = null;
    }
}

Window.prototype.taskbarToggle = function () {
    if (this._restoreRect) {
        this._dom.css("display", "");
        this._dom.removeClass("maximized");
        this.setRect(this._restoreRect);
        this._restoreRect = null;
        this.moveToTop();
        return true;
    } else {
        this.minimize();
        return false;
    }
}

Window.prototype.maximize = function () {
    if (this._restoreRect) {
        this._dom.removeClass("maximized");
        this.setRect(this._restoreRect);
        this._restoreRect = null;
    } else {
        this._restoreRect = this.getRect();
        var size = this._app.getDesktop().getSize();
        this._dom.addClass("maximized");
        this.setRect({width: size.width, height: size.height, x: 0, y: 0})
    }
}

Window.prototype.moveToTop = function () {
    var windows = $(".wbWindow");

    //windows.removeClass("active");
    //this._dom.addClass("active");

    this._dom.attr("data-z", 9999);

    windows.sort(function (wA, wB) {
        return parseInt($(wA).attr("data-z")) - parseInt($(wB).attr("data-z"));
    });

    for (var i = 0; i < windows.length; i++) {
        var w = $(windows[i]);
        w.attr("data-z", i);
        w.css("z-index", i + 1);
    }

    return this;
}

Window.prototype.setActive = function () {
    var windows = $(".wbWindow");
    windows.removeClass("active");
    this._dom.addClass("active");
    //this._dom.attr("data-z", 9999);
    return this;
}

Window.prototype.updateWindowTransform = function (e) {
    var sPos = this._cursorStartPos;
    if (sPos) {
        if (this._isDragging) {
            var currentPos = Desktop.getEventPositionXY(e);
            var dx = currentPos.x - sPos.x;
            var dy = currentPos.y - sPos.y;
            this.setSize(this._lastRect.width + dx, this._lastRect.height + dy);
        } else {
            var currentPos = Desktop.getEventPositionXY(e);
            var dx = currentPos.x - sPos.x;
            var dy = currentPos.y - sPos.y;
            this.setPosition(dx, dy);
        }
        return true;
    }
    return false;
}

Window.prototype.build = function () {
    var refHtml = $(".wbSkeleton>.wbWindow")[0].outerHTML;
    var wnd = $(refHtml);
    this._dom = wnd;

    var statusBar = wnd.find(".wbStatusBar");

    statusBar.find("label").text(this._title);
    this._applyRect();

    if (this._iconPath != null) {
        statusBar.addClass("withIcon");
        statusBar.find(".wbAppIcon").css("background-image", "url(\"" + this._iconPath + "\")");
    }

    statusBar.click(() => this.moveToTop().setActive());

    statusBar.find(".wbBtnClose").click(() => this.close());
    statusBar.find(".wbBtnMin").click(() => this.minimize());
    statusBar.find(".wbBtnMax").click(() => this.maximize());

    var fn = (e) => {
        if (this._dom.hasClass("maximized"))
            return;
        this.moveToTop();
        this._cursorStartPos = Desktop.getEventPositionXY(e);
        this._cursorStartPos.x -= this._x;
        this._cursorStartPos.y -= this._y;
        this._app.setActiveWindow(this);
    }

    statusBar.bind("touchstart mousedown", fn).bind("touchend mouseup", (e) => {
        this._cursorStartPos = null;
        this._lastRect = null;
    });

    statusBar.bind("dblclick", (e) => {
        this.maximize();
    });

    var dragIcon = wnd.find(".wbDrag");

    dragIcon.bind("touchstart mousedown", (e) => {
        this.moveToTop();
        this._cursorStartPos = Desktop.getEventPositionXY(e);
        this._lastRect = this.getRect();
        this._isDragging = true;
        this._app.setActiveWindow(this);
    }).bind("touchend mouseup", (e) => {
        this._isDragging = false;
        this._cursorStartPos = null;
        this._lastRect = null;
    });

    $(".wbDesktop").append(wnd);

    return this;
}

Window.prototype.getAreaDOM = function () {
    return this._dom.find(".wbArea");
}

Window.prototype.setCloseCallback = function (fn) {
    this._closeCallback = fn;
}

Window.prototype.setResizeCallback = function (fn) {
    this._resizeCallback = fn;
}
