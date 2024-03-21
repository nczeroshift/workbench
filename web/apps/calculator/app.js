// https://www.geeksforgeeks.org/convert-infix-expression-to-postfix-expression/

window["wbApps"]["calculator"] = function(desktop) {
    function build_calculator(dom) {
        function prec(c) {
            if (c == '^')
                return 3;
            else if (c == '/' || c == '*')
                return 2;
            else if (c == '+' || c == '-')
                return 1;
            else
                return -1;
        }

        function infixToPostfix(s) {
            var st = [];
            var result = "";

            for (var i = 0; i < s.length; i++) {
                var c = s[i];

                if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '.')
                    result += c;
                else if (c == '(')
                    st.push('(');
                else if (c == ')') {
                    while (st[st.length - 1] != '(') {
                        result += " ";
                        result += st[st.length - 1];
                        st.pop();
                    }
                    st.pop();
                } else {
                    while (st.length != 0 && prec(s[i]) <= prec(st[st.length - 1])) {
                        result += " ";
                        result += st[st.length - 1];
                        st.pop();
                    }
                    result += " ";
                    st.push(c);
                }
            }

            while (st.length != 0) {
                result += " ";
                result += st[st.length - 1];
                st.pop();
            }

            return result;
        }

        var padButtons = dom.find(".pad button");

        var numbers = padButtons.filter(".number");

        numbers.click(function (e) {
            var numberStr = $(e.target).text();
            addInput(numberStr);
        });

        padButtons.filter(".exe").click(function (e) {
            runExp();
        });
        padButtons.filter(".ac").click(function (e) {
            clearLine();
        });
        padButtons.filter(".del").click(function (e) {
            delChar();
        });
        padButtons.filter(".plus").click(function (e) {
            addInput("+");
        });
        padButtons.filter(".sub").click(function (e) {
            addInput("-");
        });
        padButtons.filter(".mult").click(function (e) {
            addInput("*");
        });
        padButtons.filter(".div").click(function (e) {
            addInput("/");
        });
        padButtons.filter(".exp").click(function (e) {
            addInput("e");
        });
        padButtons.filter(".dot").click(function (e) {
            addInput(".");
        });
        padButtons.filter(".symbol").click(function (e) {
            addInput($(this).text());
        });

        var lcd = dom.find(".lcd_display");

        function getCurrentExp() {
            return lcd.find(".input.current");
        }

        function addInput(str) {
            var c = getCurrentExp();
            c.text(c.text() + str);
        }

        function delChar() {
            var c = getCurrentExp();
            if (c.text().length > 0)
                c.text(c.text().substr(0, c.text().length - 1));
        }

        function clearLine() {
            var c = getCurrentExp();
            c.text("");
        }

        function postfixEval(expr) {
            var stack = [];
            var arr = expr.split(" ").filter(function (el) {
                return el !== ""
            });
            //console.log( arr );
            for (var i = 0;i<arr.length;i++) {
                var e = arr[i];
                if (isNaN(e)) {
                    var y = stack.pop();
                    var x = stack.pop();
                    var result = eval(x + e + y)
                    stack.push(result)
                    //console.log( result );
                } else {
                    stack.push(parseFloat(e));
                }
            }
            //console.log( typeof stack[0] );
            return stack[0];
        }

        function runExp() {
            var c = getCurrentExp();
            var expInfix = c.text();
            var postfix = infixToPostfix(expInfix);
            console.log(postfix);
            console.log(postfixEval(postfix));
            var val = postfixEval(postfix);
            lcd.append($("<p class=\"result\"></p>").text(val));
            c.removeClass("current");
            lcd.append($("<p class=\"input current\"></p>"));

            lcd[0].scrollTop = lcd[0].scrollHeight + 20;
        }

    }
    var  app = new wb.Application(desktop);
    app.setName("Calculator");

    var wnd = new wb.Window(app)
        .setTitle("Calculator")
        .setSize(336, 320)
        .setCentered()
        .build();

    wnd.getAreaDOM().load("/apps/calculator/dom.html?t=" + new Date().getTime(), function () {
        var dom = wnd.getAreaDOM().find(".appWrapper");
        build_calculator(dom);
        wnd.moveToTop();
    });

    //desktop.addAppToTaskbar("calculator", wnd);

    //wnd.setCloseCallback(function () {
    //    desktop.removeAppFromTaskbar(wnd);
    //});

    wnd.setActive();
}
