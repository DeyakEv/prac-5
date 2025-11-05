const resultInput = document.getElementById('result');
const buttons = document.querySelector('.buttons');

let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForNewOperand = false;
let justCalculated = false;

function updateDisplay() {
    resultInput.value = currentInput;
}

function inputNumber(num) {
    if (waitingForNewOperand || currentInput === '0' || justCalculated) {
        currentInput = num;
        waitingForNewOperand = false;
        justCalculated = false;
    } else {
        currentInput = currentInput + num;
    }
    updateDisplay();
}

function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator && !waitingForNewOperand) {
        const currentValue = parseFloat(currentInput);
        const result = calculate(previousInput, currentValue, operator);
        
        if (result === null) return; // Division by zero
        
        currentInput = String(result);
        previousInput = result;
        updateDisplay();
    }

    waitingForNewOperand = true;
    operator = nextOperator;
    justCalculated = false;
}

function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            if (secondOperand === 0) {
                alert('Не можна ділити на нуль!');
                return null;
            }
            return firstOperand / secondOperand;
        default:
            return secondOperand;
    }
}

function performCalculation() {
    const inputValue = parseFloat(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
        return;
    }

    if (operator) {
        const result = calculate(previousInput, inputValue, operator);
        
        if (result === null) return; // Division by zero

        // Handle multi-digit numbers and decimals properly
        if (Number.isInteger(result)) {
            currentInput = String(result);
        } else {
            // Limit decimal places to avoid floating point errors
            currentInput = String(Math.round(result * 1000000000) / 1000000000);
        }
        
        previousInput = null;
        operator = null;
        waitingForNewOperand = false;
        justCalculated = true;
        updateDisplay();
    }
}

function inputDecimal() {
    if (waitingForNewOperand || justCalculated) {
        currentInput = '0.';
        waitingForNewOperand = false;
        justCalculated = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForNewOperand = false;
    justCalculated = false;
    updateDisplay();
}

// Event listener for button clicks
buttons.addEventListener('click', function(e) {
    const target = e.target;
    const value = target.getAttribute('data-value');
    
    if (!value) return;

    if (target.classList.contains('clear')) {
        clearAll();
    } else if (target.classList.contains('equals')) {
        performCalculation();
    } else if (target.classList.contains('operator')) {
        inputOperator(value);
    } else if (value === '.') {
        inputDecimal();
    } else {
        inputNumber(value);
    }
});

// Keyboard support
document.addEventListener('keydown', function(e) {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        inputOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        performCalculation();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    } else if (key === 'Backspace') {
        if (currentInput.length > 1 && !justCalculated) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});

// Initialize display
updateDisplay();