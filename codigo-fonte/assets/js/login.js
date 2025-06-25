
var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");

var body = document.querySelector("body");

const signupForm = document.querySelector('.first-content .second-column form');
if (signupForm) {
  signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }


    let users = JSON.parse(localStorage.getItem('usuarios')) || [];

    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      alert('Este e-mail já está cadastrado. Faça login ou utilize outro e-mail.');
      return;
    }

    users.push({
      name: name,
      email: email,
      password: password
    });

    localStorage.setItem('usuarios', JSON.stringify(users));
    alert('Cadastro realizado com sucesso! Agora faça seu login.');

    signupForm.reset();

    document.body.className = "sign-in-js";
  });
}

const signinForm = document.querySelector('.second-content .second-column form');
if (signinForm) {
  signinForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('signin-email').value.trim().toLowerCase();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
      alert('Por favor, preencha e-mail e senha.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('usuarios')) || [];

    const validUser = users.find((user) => user.email === email && user.password === password);

    if (validUser) {
      alert(`Bem-vindo(a), ${validUser.name}!`);

      localStorage.setItem('usuarioLogado', JSON.stringify(validUser));
      signinForm.reset();
      window.location.href = '/pmv-ads-2025-1-e1-proj-web-t5-projestudiodeideias-1/codigo-fonte/admin.html';
    } else {
      alert('Usuário ou senha inválidos.');
    }
  });
}

btnSignin.addEventListener("click", function () {
   body.className = "sign-in-js"; 
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
})