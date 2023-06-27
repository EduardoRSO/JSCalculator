class CalcController {

  constructor() {
    this._operation = [];
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
  }

  addEventListenerAll(element, events, fn) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  clearAll() {
    this._operation = [];
    this.show();
  }

  clearEntry() {
    this._operation.pop();
    this.show();
  }

  isOperator(value) {
    return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
  }

  lastOperator() {
    for (let i = this._operation.length; i > 0; i--)
      if (this.isOperator(this._operation[i]))
        return this._operation[i];
    return "";
  }

  hasEnoughLength() {
    return this._operation.length >= 1;
  }

  goodSyntax(value) {
    let l = this._operation.length;
    if (value == '.') {
      if (l >= 3 && !this.isOperator(this.lastOperator())) return false;
    }
    if (value == '=') {
      if (l < 3 || !this.isOperator(this.lastOperator())) return false;
    }
    return true;
  }

  cutQuery() {
    let query = this._operation.join("").replace("%", "*0.01*");
    if (this._operation.length > 1 && this._operation.length % 2 != 0)
      this._operation = [];
    this._operation.push(eval(query));
  }

  minQuery(query) {
    let l = this._operation.length;
    // eu quero encontrar a maior query possível que eu possa aplicar o eval, consequentemente reduzindo o length maximo do _operation para números pequenos. Tratando de números grandes se torna um problema, porque ainda não sei como mudar o tamanho da fonte e quebrar a linha. Isso seria legal.
    if (l % 2 != 0) {
      return eval(query).toFixed(2);
    } else {
      let mQuery = this._operation.slice(0, l - 1).join("").replace("%", "*0.01*");
      return eval(mQuery).toFixed(2).toString() + this._operation[l - 1].toString();
    }
  }

  show() {
    let query = this._operation.join("").replace("%", "%*");
    if (query.length >= 10) {
      this.displayCalc = "Error";
    } else if (this._operation.length < 3) {
      this.displayCalc = query;
    }
    else {
      this.displayCalc = this.minQuery(query);
    }
  }

  addOperation(value) {
    if (isNaN(value)) {
      if (this.hasEnoughLength()) {
        if (this.isOperator(value)) {
          if (this.isOperator(this.getLastOperation())) {
            this.setLastOperation(value);
          } else {
            this._operation.push(value);
          }
        } else if (!isNaN(this.getLastOperation()) && this.goodSyntax(value)) {
          if (value == '=') {
            this.cutQuery();
          }
          else {
            this._operation.push(value);
          }
        }
      }
    } else {
      if (this.hasEnoughLength()) {
        if (isNaN(this.getLastOperation())) {
          this._operation.push(value);
        }
        else {
          let concatNumber = this.getLastOperation().toString() + value.toString();
          this.setLastOperation(parseInt(concatNumber));
        }
      } else {
        this._operation.push(value);
      }
    }
    console.log(this._operation);
    this.show();
  }

  setError() {
    this.displayCalc = "Error";
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
        this.addOperation('%');
        break;

      case 'divisao':
        this.addOperation('/');
        break;

      case 'multiplicacao':
        this.addOperation('*');
        break;

      case 'subtracao':
        this.addOperation('-');
        break;

      case 'soma':
        this.addOperation('+');
        break;

      case 'igual':
        this.addOperation('=');
        break;

      case 'ponto':
        this.addOperation('.');
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
        this.addOperation(parseInt(value));
        break;

      default:
        this.setError();
        break;
    }

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
}
