
window["wbApps"]["voltage_div"] = function(desktop) {

    function build_calculator(wnd){
        var dom = wnd.getAreaDOM().find(".appWrapper");
        //build_app(dom);
        //wnd.moveToTop();

        var allRadios = dom.find("input[name=type]");

        function storeNumberWithRadio(radio){
            var number = radio.closest("tr").find("input[type=number]");
            number.attr("data-lv",number.val());
            number.val("");
            number.attr("disabled","disabled");
        }

        function restoreNumberWithRadio(radio){
            if(radio == null) return;
            var number = radio.closest("tr").find("input[type=number]");
            var val = number.attr("data-lv");
            number.val(val);
            number.attr("disabled",null);
        }

        var lastChecked = null;
        allRadios.change(function(){
            restoreNumberWithRadio(lastChecked);
            storeNumberWithRadio($(this));
            lastChecked = $(this);
        });

        storeNumberWithRadio(lastChecked = allRadios.filter(":checked"));

        var r1Input = dom.find("input[name=r1Val]");
        var r2Input = dom.find("input[name=r2Val]");
        var v1Input = dom.find("input[name=v1Val]");
        var v2Input = dom.find("input[name=v2Val]");

        function getValueScale(elem){
            var sel = elem.closest("tr").find("select");
            return elem.val() * sel.val();
        }

        dom.find("input[type=radio]").change(function(){
            var res = null;
            var unkVar = lastChecked.val(); // Unknown variable

            var r1 =  getValueScale(r1Input);
            var r2 = getValueScale(r2Input);
            var v1 = getValueScale(v1Input);
            var v2 = getValueScale(v2Input);

            if(unkVar === "r1"){
                res = r2 * (v1/v2 -1);
            } else if(unkVar === "r2"){

            } else if(unkVar === "v1"){

            } else if(unkVar === "v2"){

            }

            console.log(res);
        }).trigger("change");
    }

    var  app = new wb.Application(desktop);
    app.setName("Voltage Div");

    var wnd = new wb.Window(app)
        .setTitle("Voltage Div")
        .setSize(380, 340)
        .setCentered()
        .build();

    wnd.getAreaDOM().load("/apps/voltage_div/dom.html?t=" + new Date().getTime(), function () {
        build_calculator(wnd);
        wnd.moveToTop();
    });

    wnd.setActive();
}
