
// https://www.geeksforgeeks.org/convert-infix-expression-to-postfix-expression/

window.appCalculator = function calculator(dom) {
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
        let st = [];
        let result = "";

        for (let i = 0; i < s.length; i++) {
            let c = s[i];

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
            }
            else {
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

    let padButtons =  dom.find(".pad button");

    let numbers = padButtons.filter(".number");

    numbers.click( e => {
        let numberStr = $(e.target).text();
        addInput(numberStr);
    });

    padButtons.filter(".exe").click( e => { runExp(); });
    padButtons.filter(".ac").click( e => { clearLine(); });
    padButtons.filter(".del").click( e => { delChar(); });
    padButtons.filter(".plus").click( e => { addInput("+"); });
    padButtons.filter(".sub").click( e => { addInput("-"); });
    padButtons.filter(".mult").click( e => { addInput("*"); });
    padButtons.filter(".div").click( e => { addInput("/"); });
    padButtons.filter(".exp").click( e => { addInput("e"); });
    padButtons.filter(".dot").click( e => { addInput("."); });
    padButtons.filter(".symbol").click( function(e){ addInput( $(this).text()); });

    let lcd =  dom.find(".lcd_display");

    function getCurrentExp(){
        return lcd.find(".input.current");
    }

    function addInput(str){
        let c = getCurrentExp();
        c.text( c.text() + str);
    }

    function delChar(){
        let c = getCurrentExp();
        if(c.text().length > 0)
            c.text(c.text().substr(0,c.text().length-1));
    }

    function clearLine(){
        let c = getCurrentExp();
        c.text("");
    }

    function postfixEval( expr ) {
        let stack = [];
        const arr = expr.split(" ").filter((el)=>el !== "" )
        console.log( arr );
        for(let e of arr){
            if(isNaN(e)){
                let y = stack.pop();
                let x = stack.pop();
                const result = eval(x+e+y)
                stack.push(result)
                //console.log( result );
            } else {
                stack.push( parseFloat(e) );
            }
        }
        //console.log( typeof stack[0] );
        return stack[0];
    }

    function runExp(){
        let c = getCurrentExp();
        let expInfix = c.text();
        let postfix = infixToPostfix(expInfix);
        console.log(postfix);
        console.log(postfixEval(postfix));
        let val = postfixEval(postfix);
        lcd.append($("<p class=\"result\"></p>").text(val));
        c.removeClass("current");
        lcd.append($("<p class=\"input current\"></p>"));

        lcd[0].scrollTop = lcd[0].scrollHeight+20;
    }
    //let exp = "a+b*(c^d-e)^(f+g*h)-i";
    //infixToPostfix(exp);

}