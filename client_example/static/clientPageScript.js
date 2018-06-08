/** Example of client frontend code */
document.addEventListener('DOMContentLoaded', () => {
	bindRegisterForm();
  bindAuthForm();
});

function bindRegisterForm() {
	const loginInput = document.getElementById('registerLoginInput');
	const passwordInput = document.getElementById('registerPasswordInput');
	const formEl = document.getElementById('registerForm');
	const keyStokeService = new KeyStrokeAuthService({loginInput, passwordInput});
  registerSubmitHandler(formEl, keyStokeService.registerKeystroke, [loginInput, passwordInput]);
}

function bindAuthForm() {
  const loginInput = document.getElementById('authLoginInput');
  const passwordInput = document.getElementById('authPasswordInput');
	const formEl = document.getElementById('authForm');
  const keyStokeService = new KeyStrokeAuthService({loginInput, passwordInput});
  registerSubmitHandler(formEl, keyStokeService.authenticateKeystroke, [loginInput, passwordInput])
}

function registerSubmitHandler(formEl, submitEndPoint, inputElms) {
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    submitEndPoint()
      .then(res => {
        inputElms.forEach(inputEl => inputEl.value = '');
        if (res.message) {
          showAlert(formEl, res.message);
        }
        console.log(res);
      })
      .catch((err) => {
        showAlert(formEl, 'Error occurred. Please clear fields and/or try again later');
        console.log(err);
      })
  })
}

function showAlert(el, message) {
  $(el).find('.alert').remove();
  const alertNode = getAlert(message);
  $(el).append(alertNode);
  const $alert = $(el).find('.alert');
  // setTimeout(() => $alert.alert('close'), 5000)
}

function getAlert(message) {
	const alertString =  `
<div class="alert alert-primary alert-dismissible fade show mt-2" role="alert">
		<span class="alert-message">${message}</span>
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
		</button>
</div>	
`;
  return $.parseHTML(alertString);
}