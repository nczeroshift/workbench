
window["wbApps"] = {}
export function Application(desktop) {
    this._windows = [];
    this._desktop = desktop;
    this._name = null;
}

Application.prototype.setName = function(name){
    this._name = name;
    return this;
}

Application.prototype.addWindow = function (wnd) {
    this._windows.push(wnd);
    return this;
}

Application.prototype.setActiveWindow = function(wnd){
    this._desktop.setActiveWindow(wnd);
}

Application.prototype.focus = function () {
    return this;
}

Application.prototype.minimize = function () {
    return this;
}

Application.prototype.close = function () {
    this._windows.forEach(i => {
        i.close();
    });
    this._windows = null;
    this._desktop.dispose(this);
}

Application.prototype.getDesktop = function(){
    return this._desktop;
}