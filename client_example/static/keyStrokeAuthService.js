/** `Library` code */
class KeyStrokeAuthService {
  constructor(options) {
    this._loginInput = new KeystrokeInput(options.loginInput);
    this._passwordInput = new KeystrokeInput(options.passwordInput);
    this.registerKeystroke = this.registerKeystroke.bind(this);
    this.authenticateKeystroke = this.authenticateKeystroke.bind(this);
  }

  registerKeystroke() {
    return this._sendRequest('/server/register_keystroke/', this._getRequestData())
      .then(res => {
        this._clearInputsTimestamps();
        return res;
      })
  }

  authenticateKeystroke() {
    return this._sendRequest('/server/authenticate_keystroke/', this._getRequestData())
      .then(res => {
        this._clearInputsTimestamps();
        return res;
      })
  }

  _clearInputsTimestamps() {
    this._loginInput.clearTimestamps();
    this._passwordInput.clearTimestamps();
  }

  _getRequestData() {
    return {
      "login": this._loginInput.input.value,
      "login_timestamps": this._loginInput.timeStamps,
      "password_timestamps": this._passwordInput.timeStamps,
    }
  }

  _sendRequest(url, data) {
    return new Promise((resolve) => {
      $.post(
        url,
        JSON.stringify(data),
        (data) => resolve(data),
        'json'
      );
    })
  }
}

class KeystrokeInput {
  constructor(input) {
    this.input = input;
    this.timeStamps = {
      keydowns: [],
      keydownsAndUps: [],
    };
    this._bindEvents();
  }

  clearTimestamps() {
    this.timeStamps.keydowns = [];
    this.timeStamps.keydownsAndUps = [];
  }

  _bindEvents() {
    this._bindKeydowns();
    this._bindKeyUps();
  }

  _bindKeydowns() {
    this.input.addEventListener('keydown', (e) => {
      if (!this._validateKeyDown(e)) {
        return;
      }
      this.timeStamps.keydowns.push(e.timeStamp);
      this.timeStamps.keydownsAndUps.push(e.timeStamp);
    })
  }

  _bindKeyUps() {
    this.input.addEventListener('keyup', (e) => {
      if (!this._validateKeyDown(e)) {
        return;
      }
      this.timeStamps.keydownsAndUps.push(e.timeStamp);
    })
  }

  _validateKeyDown(e) {
    if (e.code === 'Tab' || e.key === 'Shift' || e.key === 'Enter') {
      return false;
    }
    if (e.code === 'Backspace') {
      this.clearTimestamps();
      this.input.value = '';
      return false;
    }
    if (e.target.value === '') {
      this.clearTimestamps();
    }
    return true;
  }
}