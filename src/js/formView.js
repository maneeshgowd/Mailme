class FormValidation {
  _userName = document.getElementById("createuser__name");
  _userEmail = document.getElementById("createuser__email");
  _userPass = document.getElementById("createuser__pass");
  _userRepeatPass = document.getElementById("createuser__repass");
  _existingUserEmail = document.getElementById("loginuser__email");
  _existingUserPass = document.getElementById("loginuser__pass");

  _createUser = document.querySelector(".createuser");
  _loginUser = document.querySelector(".loginuser");

  _submitBtn = document.getElementById("submitBtn");
  _loginExistingUser = document.getElementById("login");

  _login = document.getElementById("login-acc");
  _createAcc = document.getElementById("create-acc");


  addHandlerSubmit(handler) {
    this._submitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      handler(
        this._userName,
        this._userEmail,
        this._userPass,
        this._userRepeatPass,
        this._createUser
      );
    });
  }

  addHandlerLogin(handler) {
    this._loginExistingUser.addEventListener("click", (e) => {
      e.preventDefault();
      handler(this._existingUserEmail, this._existingUserPass, this._loaderAnimation);
    });
  }

  addHandlerToggleForm(loginHandler) {
    this._login.addEventListener("click", (e) => {
      loginHandler(this._loginUser, this._createUser, e);
    });
    this._createAcc.addEventListener("click", (e) => {
      loginHandler(this._loginUser, this._createUser, e);
    });
  }
}
export default new FormValidation();
