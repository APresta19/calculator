const buttons = document.querySelectorAll('.button-op');
const cButton = document.querySelector('.c-button');
const ceButton = document.querySelector('.ce-button');
const equals = document.querySelector('.equals');

const result = document.querySelector('.result-sec');
const dotButton = document.getElementById('dot');
const operationButtons = document.querySelectorAll('.operation');
//const plusButton = document.getElementById('orange'); //this is weird because it's orange :P
const numButtons = document.querySelectorAll('.num');

let dotDisabled = false;
let operationDisabled = false;

let totalCount = 0;

buttons.forEach(function(button)
{
    button.addEventListener('click',  () =>
    {
        if(!dotDisabled || button.textContent != "." && (!operationDisabled || (!isOperation(button))))
        {
            totalCount++;
            result.textContent += button.textContent;
            if(totalCount > 15)
            {
                removeButtonsExcEquals(true);
            }
            console.log(button.textContent);
        }

        if(button.textContent == ".")
        {
            console.log("DOT");
            dotButton.setAttribute("disabled", "");
            dotDisabled = true;
        }
        if(isOperation(button.textContent))
        {
            console.log(operationDisabled);
            dotButton.removeAttribute("disabled");
            removeOperations(true);
            dotDisabled = false;
        }
    });
});


numButtons.forEach(function(button)
{
    button.addEventListener('click', () =>
    {
        removeOperations(false);
    });
});

cButton.addEventListener('click', () =>
{
    totalCount = 0;
    removeButtonsExcEquals(false);
    result.textContent = "";
    dotDisabled = false;
});

ceButton.addEventListener('click', () =>
{
    totalCount--;
    removeButtonsExcEquals(false);
    result.textContent = result.textContent.substring(0, result.textContent.length - 1);
});

//24 + 5 * 3 / 2
//want to split this line into [24, +, 5, *, 3, /, 2]
//splitting like "/(character)/g" keeps the delimeter
equals.addEventListener('click', () =>
{
    //use this for optimization
    if(totalCount > 15)
    {
        removeButtonsExcEquals(false);
    }
    let str = result.textContent;
    let resArr = str.split(/([+\-*\/])/g);
    console.log(resArr);
    let i = 0;
    console.log(evaluate(resArr, i));
    result.textContent = evaluate(resArr, i);
});

function evaluate(resultArray, i)
{
    //go through the array until you find * or /, then perform the operation on LHS and RHS --> put into new variable
    let length = resultArray.length;

    if(length == 3)
    {
        if(resultArray[1] == "+")
        {
            let calc = parseFloat(resultArray[0]) + parseFloat(resultArray[2]);
            calc = parseFloat(calc.toFixed(4)); 
            return calc;
        }
        else if(resultArray[1] == "-")
        {
            let calc = parseFloat(resultArray[0]) - parseFloat(resultArray[2]);
            calc = parseFloat(calc.toFixed(4)); 
            return calc;
        }
        else if(resultArray[1] == "*")
        {
            let calc = parseFloat(resultArray[0]) * parseFloat(resultArray[2]);
            calc = parseFloat(calc.toFixed(4)); 
            return calc;
        }
        else if(resultArray[1] == "/")
        {
            let calc = parseFloat(resultArray[0]) / parseFloat(resultArray[2]);
            calc = parseFloat(calc.toFixed(4)); 
            return calc;
        }
    }
    for(let k = 0; k < length - 2; k++)
    {
        console.log("init: " + resultArray);
        let mult = resultArray.indexOf("*");
        let div = resultArray.indexOf("/");
        console.log(mult + " " + div);

        //accounts for result being negative 
        if(resultArray[0] == "")
        {
            resultArray[0] = 0;
        }
        console.log("new arr:  " + resultArray);


        if(mult < div && mult != -1 && div != -1)
        {
            resultArray[mult-1] = resultArray[mult-1] * resultArray[mult+1];
            resultArray.splice(mult, 2);
        }
        else  if(div < mult && mult != -1 && div != -1)
        {
            resultArray[div-1] = resultArray[div-1] / resultArray[div+1];
            resultArray.splice(div, 2);
        }
        else if(mult != -1)
        {
            resultArray[mult-1] = resultArray[mult-1] * resultArray[mult+1];
            resultArray.splice(mult, 2);
        }
        else if(div != -1)
        {
            resultArray[div-1] = resultArray[div-1] / resultArray[div+1];
            resultArray.splice(div, 2);
        }
        
        if(mult == -1 && div == -1)
        {
            console.log("i: " + i);
            if(resultArray[i] == "+")
            {
                console.log(i);
                resultArray[i-1] = parseFloat(resultArray[i-1]) + parseFloat(resultArray[i+1]);
                resultArray.splice(i, 2);
            }
            else if(resultArray[i] == "-")
            {
                console.log("- at " + i);
                resultArray[i-1] = parseFloat(resultArray[i-1]) - parseFloat(resultArray[i+1]);
                resultArray.splice(i, 2);
            }
            i++;
            if(i >= resultArray.length)
            {
                i = 0;
            }
        }
        console.log("end: " + resultArray);
    }
    //need to account for floating point calculations being off 1.6 * 3 = 4.8000000000000000001
    let finalNum = resultArray[0];
    finalNum = parseFloat(finalNum.toFixed(4));
    return finalNum;
}
function removeButtonsExcEquals(isRemove)
{
    if(isRemove)
    {
        buttons.forEach(function (button)
        {
            button.classList.add("disabled");
        });
        operationDisabled = true;
    }
    else
    {
        buttons.forEach(function (button)
        {
            button.classList.remove("disabled");
        });
        operationDisabled = false;
    }
}
function removeOperations(isRemove) {
    if(isRemove) 
    {
        operationButtons.forEach(function (button) 
        {
            button.classList.add("disabled");
        });
        console.log("removed");
        operationDisabled = true;
    } 
    else 
    {
        operationButtons.forEach(function (button) 
        {
            button.classList.remove("disabled");
        });
        console.log("not removed");
        operationDisabled = false;
    }
}
function isOperation(el)
{
    if(el == "*" || el == "/" || el == "+" || el == "-")
    {
        return true;
    }
    else
    {
        return false;
    }
}
