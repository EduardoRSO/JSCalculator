class CalcController {

  constructor() {
    this._displayCalc = "0";
    this._currentDate;
    this.initialize();
  }

  initialize() {

    let displayCalcEL = document.querySelector("#display");
    let dateEL = document.querySelector("#data");
    let timeEL = document.querySelector("#hora");

    displayCalcEL.innerHTML = "4";
    dateEL.innerHTML = "5";
    timeEL.innerHTML = "6";
  }

  get displayCalc() {
    return this._displayCalc;
  }

  get currentDate() {
    return this._currentDate;
  }

  set displayCalc(value) {
    this._displayCalc = value;
  }

  set currentDate(value) {
    this._currentDate = value;
  }
}
