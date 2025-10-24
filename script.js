// =================================================================
// 1. CONFIGURAÇÃO DO FIREBASE (JÁ PREENCHIDO COM SUAS CHAVES )
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyC7JKdjEJRpljEFjWMMQLVrAHM5uf2bI6U",
  authDomain: "br-chat-64cde.firebaseapp.com",
  databaseURL: "https://br-chat-64cde-default-rtdb.firebaseio.com",
  projectId: "br-chat-64cde",
  storageBucket: "br-chat-64cde.appspot.com",
  messagingSenderId: "1042460223129",
  appId: "1:1042460223129:web:b9ff68df0b4fcc4306ba08",
  measurementId: "G-GSJNG4PQ8X"
};

firebase.initializeApp(firebaseConfig );
const database = firebase.database();

// =================================================================
// 2. VARIÁVEIS GLOBAIS E SELETORES DE ELEMENTOS
// =================================================================
let nomeUsuario = "";
let salaAtual = "geral";

const loginDiv = document.getElementById('login');
const appDiv = document.getElementById('app');
const inputNome = document.getElementById('nome');
const btnEntrar = document.getElementById('btn-entrar');
const areaMensagens = document.getElementById('mensagens');
const inputMsg = document.getElementById('msg');
const btnEnviar = document.getElementById('btn-enviar');

// =================================================================
// 3. FUNÇÕES
// =================================================================
function entrar() {
  nomeUsuario = inputNome.value.trim();
  if (nomeUsuario) {
    loginDiv.style.display = 'none';
    appDiv.style.display = 'flex';
    trocarSala(salaAtual);
  } else {
    alert("Por favor, digite seu nome para entrar!");
  }
}

function enviar() {
  const textoMensagem = inputMsg.value.trim();
  if (textoMensagem) {
    const mensagem = { nome: nomeUsuario, texto: textoMensagem, timestamp: Date.now() };
    database.ref('salas/' + salaAtual).push(mensagem);
    inputMsg.value = '';
  }
}

function trocarSala(novaSala) {
  salaAtual = novaSala;
  areaMensagens.innerHTML = '<h2>Carregando...</h2>';
  
  // Remove a classe 'ativa' de todas as salas
  document.querySelectorAll('.sala').forEach(el => el.classList.remove('ativa'));
  
  // Adiciona a classe 'ativa' apenas na sala clicada
  document.getElementById('sala-' + novaSala).classList.add('ativa');
  
  carregarMensagens();
}

function carregarMensagens() {
  const refSala = database.ref('salas/' + salaAtual);
  refSala.off();
  areaMensagens.innerHTML = '';

  refSala.on('child_added', (snapshot) => {
    const msg = snapshot.val();
    const loadingMsg = areaMensagens.querySelector('h2');
    if (loadingMsg) loadingMsg.remove();
    const divMensagem = document.createElement('div');
    divMensagem.classList.add('mensagem');
    divMensagem.innerHTML = `<strong>${msg.nome}:</strong> ${msg.texto}`;
    areaMensagens.appendChild(divMensagem);
    areaMensagens.scrollTop = areaMensagens.scrollHeight;
  });
}

// =================================================================
// 4. EVENT LISTENERS (A FORMA CORRETA DE LIDAR COM CLIQUES)
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
  btnEntrar.addEventListener('click', entrar);
  btnEnviar.addEventListener('click', enviar);

  document.getElementById('sala-geral').addEventListener('click', () => trocarSala('geral'));
  document.getElementById('sala-memes').addEventListener('click', () => trocarSala('memes'));
  document.getElementById('sala-jogos').addEventListener('click', () => trocarSala('jogos'));

  inputMsg.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      enviar();
    }
  });
});
