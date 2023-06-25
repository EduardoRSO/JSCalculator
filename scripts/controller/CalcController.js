class CalcController {

  constructor() {
    this._displayCalc = "0";
    this._currentDate;

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
