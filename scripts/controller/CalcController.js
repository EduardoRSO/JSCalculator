class CalcController {

  constructor() {
    this._memory = [];
    this._locale = "pt-BR";
    this._displayCalcEL = document.querySelector("#display");
    this._dateEL = document.querySelector("#data");
    this._timeEL = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
  }

  initialize() {
    this.setDisplayDateTime();
    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000);
    this.initKeyboard();
    this.show();
  }

  initKeyboard() {
    document.addEventListener("keyup", e => {
      switch (e.key) {
        case "Escape":
          this.clearAll();
          break;
        case "Backspace":
          this.clearEntry();
          break;
        case "/":
        case "*":
        case "-":
        case "+":
          this.addOperator(e.key);
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
          this.addNumber(parseInt(e.key));
          break;
        case ".":
        case ",":
          this.addDot();
          break;
        case "%":
          this.addPercent();
          break;
        case "=":
        case "Enter":
          this.addEqual();
          break;
      }
    })
  }

  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  initButtonsEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");
    buttons.forEach(btn => {
      this.addEventListenerAll(btn, "click drag", e => {
        let textBtn = btn.className.baseVal.replace("btn-", "");
        this.execBtn(textBtn);
      });
      this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
        btn.style.cursor = "pointer";
      })
    })
  }

  setDisplayDateTime() {
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  get displayCalc() {
    return this._displayCalcEL.innerHTML;
  }
  set displayCalc(value) {
    this._displayCalcEL.innerHTML = value;
  }

  get displayTime() {
    return this._timeEL.innerHTML;
  }
  set displayTime(value) {
    return this._timeEL.innerHTML = value;
  }

  get displayDate() {
    return this._dateEL.innerHTML;
  }
  set displayDate(value) {
    return this._dateEL.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }
  set currentDate(value) {
    this._currentDate = value;
  }

  getLastInsertion() {
    return this._memory[this._memory.length - 1];
  }

  setLastInsertion(value) {
    this._memory[this._memory.length - 1] = value;
  }

  clearAll() {
    this._memory = [];
    this.show();
  }

  clearEntry() {
    this._memory.pop();
    this.show();
  }

  isOperator(value) {
    return (['+', '-', '*', '/'].indexOf(value) > -1);
  }

  isInteger(n) {
    return n === +n && n === (n | 0);
  }

  getResult() {
    let query = this._memory.join("").replace("%", "*0.01");
    if (query == "") return 0;
    try {
      let result = eval(query);
      if (this.isInteger(result)) {
        this.clearAll();
        this._memory.push(result);
      } else {
        this.clearAll();
        this._memory.push(result.toFixed(2));
      }
    }
    catch {
      //warning message maybe (?)
    }
    this.show();
  }

  show() {
    let query = this._memory.join("");
    if (query == "") query = 0;
    this.displayCalc = query;
  }

  getLastStringInsertion() {
    for (let l = this._memory.length; l > 0; l--)
      if (isNaN(this._memory[l - 1])) return this._memory[l - 1];
    return "";
  }

  concatNumbers(value) {
    let a = this.getLastInsertion().toString();
    let b = value.toString();
    return parseInt(a + b);
  }

  setError() {
    this.displayCalc = "Error";
    this.show();
  }

  addPercent() {
    if (this._memory.length > 0) {
      let lastInsertion = this.getLastInsertion();
      if (!isNaN(lastInsertion))
        this._memory.push('%');
    }
    this.show();
  }

  addDot() {
    if (this.getLastStringInsertion() != '.') {
      let lastInsertion = this.getLastInsertion();
      if (isNaN(lastInsertion)) {
        if (lastInsertion == '%') {
          this._memory.push('*');
        }
        this._memory.push(0);
      }
      this._memory.push('.');
    }
    this.show();
  }

  addOperator(value) {
    if (this._memory.length >= 1) {
      let lastInsertion = this.getLastInsertion();
      if (isNaN(lastInsertion)) {
        if (lastInsertion == '%') {
          this._memory.push(value);
        } else {
          this.setLastInsertion(value);
        }
      } else {
        this._memory.push(value);
      }
    }
    this.show();
  }

  addNumber(value) {
    let lastInsertion = this.getLastInsertion();
    if (this._memory.length == 0 || lastInsertion == '.') {
      this._memory.push(value);
    } else if (this.isOperator(lastInsertion)) {
      this._memory.push(value);
    } else if (lastInsertion == '%') {
      this._memory.push('*');
      this._memory.push(value);
    } else {
      this.setLastInsertion(this.concatNumbers(value));
    }
    this.show();
  }

  addEqual() {
    this.getResult();
  }

  execBtn(value) {
    switch (value) {
      case 'ac':
        this.clearAll();
        break;
      case 'ce':
        this.clearEntry();
        break;
      case 'porcento':
        this.addPercent();
        break;
      case 'divisao':
        this.addOperator('/');
        break;
      case 'multiplicacao':
        this.addOperator('*');
        break;
      case 'subtracao':
        this.addOperator('-');
        break;
      case 'soma':
        this.addOperator('+');
        break;
      case 'igual':
        this.addEqual();
        break;
      case 'ponto':
        this.addDot();
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addNumber(parseInt(value));
        break;
    }
    //console.log(this._memory);
  }
}
