
class wbDesktop{
    #activeWnd;
    #dom;

    constructor(dom){
        this.#dom = dom;
        $(window).bind('touchmove mousemove', (e) => {
            e.preventDefault();
            if(this.#activeWnd)
                this.#activeWnd.updateWindowTransform(e);
        });
    }

    setActiveWindow(wnd){
        this.#activeWnd = wnd;
    }

    getDOM(){
        return this.#dom;
    }

    static getEventPositionXY(e){
        var x, y;
        if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
            x = e.clientX;
            y = e.clientY;
        }
        return {x:x,y:y};
    }
}

class wbWindow{
    #x;
    #y;
    #width;
    #height;
    #title;
    #dom;
    #desktop;
    #lastRect;
    #restoreRect;
    #cursorStartPos;
    #isDragging;

    constructor(desktop){
        this.#title = "Window";
        this.#desktop = desktop;
    }
    
    getDOM(){
        return this.#dom;
    }

    setTitle(title){
        this.#title = title;
        return this;
    }

    setCentered(){
        let desktop = $(".wbDesktop");
        var w = parseInt(desktop.css("width"));
        var h = parseInt(desktop.css("height"));
        this.#x = w / 2 - parseInt(this.#width) / 2;
        this.#y = h / 2 - parseInt(this.#height) / 2;
        this.#applyRect();
        return this;
    }

    setRect(rect){
        this.#x = rect.x;
        this.#y = rect.y;
        this.#width = rect.width;
        this.#height = rect.height;
        this.#applyRect();
        return this;
    }

    getLastRect(){
        return this.#lastRect;
    }

    getRect(){
        return {
            x: this.#x, 
            y: this.#y, 
            width: this.#width, 
            height: this.#height
        };
    }

    setPosition(x,y){
        this.#x = x;
        this.#y = y;
        this.#applyRect();
        return this;
    }

    setSize(width,height){
        this.#width = width;
        this.#height = height;
        this.#applyRect();
        return this;
    }

    #applyRect(){
        if(this.#dom){
            this.#dom.css("left",this.#x);
            this.#dom.css("top",this.#y);
            this.#dom.css("width",this.#width);
            this.#dom.css("height",this.#height);
        }
    }

    #onClose(){
        this.#dom.remove();
    }

    #onMinimize(){

    }

    #onMaximize(){
        if(this.#restoreRect){
            this.#dom.removeClass("maximized");
            this.setRect(this.#restoreRect);
            this.#restoreRect = null;
        }
        else{
            this.#restoreRect = this.getRect();
            var desktop = $(".wbDesktop");
            var w = parseInt(desktop.css("width"));
            var h = parseInt(desktop.css("height"));
            this.#dom.addClass("maximized");
            this.setRect({width: w, height: h, x: 0, y: 0})
        }
    }

    moveToTop(){
        let windows = $(".wbWindow");

        windows.removeClass("active");

        this.#dom.addClass("active");
        this.#dom.attr("data-z", 9999);
        
        windows.sort(function(wA,wB){
            return parseInt($(wA).attr("data-z")) - parseInt($(wB).attr("data-z"));
        });              
        
        for(var i = 0; i < windows.length; i++){
            var w = $(windows[i]);
            w.attr("data-z", i);
            w.css("z-index", i+1);
        }
    }

    updateWindowTransform(e){
        let sPos = this.#cursorStartPos;
            if(sPos){
                if(this.#isDragging){
                let currentPos = wbDesktop.getEventPositionXY(e);
                let dx = currentPos.x - sPos.x;
                let dy = currentPos.y - sPos.y;
                this.setSize(this.#lastRect.width + dx, this.#lastRect.height + dy);
            }else{
                let currentPos = wbDesktop.getEventPositionXY(e);
                let dx = currentPos.x - sPos.x;
                let dy = currentPos.y - sPos.y;
                this.setPosition(dx,dy);
            }
            return true;
        }
        return false;
    }

    build(){
        let refHtml = $(".wbSkeleton>.wbWindow")[0].outerHTML;
        let wnd = $(refHtml);
        this.#dom = wnd;

        let statusBar = wnd.find(".wbStatusBar");

        statusBar.find("label").text(this.#title);
        this.#applyRect();   

        statusBar.click(() => this.moveToTop());

        statusBar.find(".wbBtnClose").click(() => this.#onClose());
        statusBar.find(".wbBtnMin").click(() => this.#onMinimize());
        statusBar.find(".wbBtnMax").click(() => this.#onMaximize());

        statusBar.bind("touchstart mousedown", (e) => {
            if(this.#dom.hasClass("maximized"))
                return;
            this.moveToTop();
            this.#cursorStartPos = wbDesktop.getEventPositionXY(e);
            this.#cursorStartPos.x -= this.#x;
            this.#cursorStartPos.y -= this.#y;
            this.#desktop.setActiveWindow(this);
        }).bind("touchend mouseup",  (e) => {
            this.#cursorStartPos = null;
            this.#lastRect = null;
        });

        statusBar.bind("dblclick", (e) => {
            this.#onMaximize();
        });

        let dragIcon = wnd.find(".wbDrag");

        dragIcon.bind("touchstart mousedown", (e) => {
            this.moveToTop();
            this.#cursorStartPos = wbDesktop.getEventPositionXY(e);
            this.#lastRect = this.getRect();
            this.#isDragging = true;
            this.#desktop.setActiveWindow(this);
        }).bind("touchend mouseup", (e) => {
            this.#isDragging = false;
            this.#cursorStartPos = null;
            this.#lastRect = null;
        });

        $(".wbDesktop").append(wnd);     

        return this;
    }

    getAreaDOM(){
        return this.#dom.find(".wbArea");
    }
}