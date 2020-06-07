// Code is coverted to TypeScript by @DanielaCorner on Twitter

// I turned it into a .ts typescript file, why not!
// typescript add a bunch of optional features which are life-savers for complex apps.
// most of all, it lets you specify what type (boolean, string, number, Function, object, and custom types) a variable is
// e.g. const myThing: string = "hello"
// e.g. function myFunction(input1: string, input2: number){ ... }
// it then also enforces that you must pass that type when you call the function, and
// it gives you hints about when you're mixing up your types (like number and string in a calculator app)
// you can see the types of any value by mousing over it.

// grab our elements
const numbers = document.querySelectorAll(".numbers");
const operators = document.querySelectorAll(".operators");
const allClear = document.querySelector(".clear-all");
const clear = document.querySelector(".clear");
const display = document.querySelector(".display-screen");
const decimal = document.querySelector(".decimal");

console.log(decimal);

/**
 * # Hey!
 * If you start a comment with "/\*\*" it's called a *JSDoc*,
 * and then when you mouse over the variable or function below it,
 * this comment pops up in your mouseover tooltip. ✨
 * It has other tricks too, it reads as markdown, [check out the markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/).
 *
 * I use this feature @param quite often, I think it's intended
 * for function parameters, but it's flexible.
 *
 * ![starry-eyed](https://media1.tenor.com/images/b0321de1096222775688294decbd823e/tenor.gif)
 */
const jsDocExample = "<-- mouse over the jsDocExample";

// just for example, here's a custom type
type CalculatorType = {
  displayVal: string; // now if you try to set calculator.displayVal = false, you'll get an error
  firstOperand: number | null;
  isWaitingForSecondOperand: boolean;
  operator: string;
  result: number;
};

/**
 * calculator object that holds information about the display and
 * the current calculation being performed.
 *
 * @param displayVal the currently-displayed value
 * @param firstOperand the first "operand" i.e. the number that will be multiplied, subtracted from etc
 * @param isWaitingForSecondOperand show the display value until we click an operator + another number button
 * @param operator the operation to perform (+,-,*,/)
 * @param result the result of the calculation, which turns into the displayVal eventually
 */
const calculator: CalculatorType = {
  displayVal: "0",
  firstOperand: null,
  isWaitingForSecondOperand: false,
  operator: null,
  result: 0
};

/** update the display to match the calculator's displayVal */
const updateDisplay = function() {
  // typescript sometimes enforces rules like "value does not exist on type Element",
  // you could fix it the proper typescript way to keep your "type safety"
  // but you can always get around them if you don't care by coercing the value to "any"
  // with ": any" or "as any"
  (display as any).value = calculator.displayVal;
};

updateDisplay();

/**
 * when we click a number, either update the display
 *
 * @param number the number we clicked
 * */
function handleClickNumber(number: string) {
  // ^-- that's what made me think of typescript, number: string, confusing otherwise!
  const { displayVal, isWaitingForSecondOperand } = calculator;

  // if we're still waiting for a second operand,
  // (I like booleans to read like sentences, "isThis, shouldThat, didThis" etc)
  // that way you know right away it's a boolean
  if (isWaitingForSecondOperand) {
    // we'll display the value of the clicked number
    calculator.displayVal = number;
    calculator.isWaitingForSecondOperand = false;
  } else {
    // "explanatory boolean" here helps to read the code below more easily
    const isCalculatorCleared = displayVal === "0";

    // we'll update the display to show...
    calculator.displayVal = isCalculatorCleared
      ? number // the clicked number if we're clear, otherwise
      : displayVal + number; // the currently displayed string + the clicked number string
  }

  updateDisplay();
}

/** Object of Calculation Functions */
const calculationFnsPerOperator = {
  "/": (firstOperand, secondOperand) => firstOperand / secondOperand,
  "*": (firstOperand, secondOperand) => firstOperand * secondOperand,
  "-": (firstOperand, secondOperand) => firstOperand - secondOperand,
  "+": (firstOperand, secondOperand) => firstOperand + secondOperand,
  "=": (firstOperand, secondOperand) => secondOperand
};

/** Operators Function */
function handleClickOperator(clickedOperator: string) {
  const { displayVal, firstOperand, operator } = calculator;
  // you can use Number(myString) as well, parseInt will "eagerly evaluate"
  // e.g. parseInt("123+") into 123, Number("123+") turns into NaN 🤓 both seem fine here AFAIK
  // personally I like that Number(myString) is very easy to read
  const inputVal = Number(displayVal);
  console.log(inputVal);

  const shouldNotPerformCalculation =
    operator && calculator.isWaitingForSecondOperand;
  if (shouldNotPerformCalculation) {
    calculator.operator = clickedOperator;
    return;
  }

  const isNoFirstOperand = firstOperand === null;
  if (isNoFirstOperand) {
    // populate the first operand
    calculator.firstOperand = inputVal;
  } else if (operator) {
    // if there's already a first operand, perform the calculation
    const calculationFn = calculationFnsPerOperator[operator];
    const result = calculationFn(firstOperand, inputVal);
    // update the display value
    calculator.displayVal = String(result);
    // result becomes the new first operand
    calculator.firstOperand = result;
  }

  // now we can accept a second operand again
  calculator.isWaitingForSecondOperand = true;
  // and we know the next operator
  calculator.operator = clickedOperator;
  updateDisplay();
}
// show result

/** All Clear Function - reset display to "0" */
function clearAll() {
  calculator.result = 0;
  calculator.displayVal = "0";
  calculator.operator = null;
  calculator.firstOperand = null;
  calculator.isWaitingForSecondOperand = false;

  updateDisplay();
}

/** Clear Function - backspace by one number */
function clearEntry() {
  const numArr = calculator.displayVal.split("");
  // const resArr = calculator.firstOperand
  console.log(numArr);

  numArr.pop();
  calculator.displayVal = numArr.join("");
  calculator.firstOperand = parseFloat(numArr.join(""));
  updateDisplay();
}

/** Handle Decimal Input Function */
function decimalInput(dot: string) {
  if (!calculator.displayVal.includes(dot)) {
    calculator.displayVal += dot;
    updateDisplay();
  }
}

// Event Listener Functions
numbers.forEach(number => {
  number.addEventListener("click", (e: any) =>
    // to make functions as modular/single-purpose as possible ("Single-Responsibility Principle"),
    // ideally we only pass exactly what's necessary into the function (we limit the power we hand over)
    handleClickNumber(e.currentTarget.value)
  );
});
operators.forEach(operator => {
  operator.addEventListener("click", (e: any) =>
    handleClickOperator(e.currentTarget.value)
  );
});
allClear.addEventListener("click", clearAll);
clear.addEventListener("click", clearEntry);
decimal.addEventListener("click", e => decimalInput(e.currentTarget.value));
