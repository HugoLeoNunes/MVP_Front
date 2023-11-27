/*
  --------------------------------------------------------------------------------------
  Função para modificar a tela inicial.
  --------------------------------------------------------------------------------------
*/

function exibirCadastro() {
  var divCad = document.getElementById('divCadastrar');
  divCad.style = "display:block;";
  var btnCad = document.getElementById('btnCadastro');
  btnCad.style = "display:none;";
  var btnList = document.getElementById('btnListar');
  btnList.style = "display:none;";
  getList();
  aparecerLista();
}

function exibirListar() {
  var divList = document.getElementById('divListar');
  divList.style = "display:block;";
  var btnList = document.getElementById('btnListar');
  btnList.style = "display:none;";
  var btnCad = document.getElementById('btnCadastro');
  btnCad.style = "display:none;";
  getList();
  aparecerLista();
}

function sumirLista() {
  var SumirListaDaTelaInicial = document.getElementById('listaDeClientes');
  SumirListaDaTelaInicial.style = "display:none;";
}

function aparecerLista () {
  var SumirListaDaTelaInicial = document.getElementById('listaDeClientes');
  SumirListaDaTelaInicial.style = "display:block;";
}


/*
----------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
----------------------------------------------------------------------------------------
*/


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/clientes';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.clientes.forEach(client => insertList(client.cpf, client.nome, client.telefone))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
//getList();


/*
  --------------------------------------------------------------------------------------
  Função para colocar um cliente na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postCliente = async (inputCPF, inputNome, inputTelefone) => {
  const formData = new FormData();
  formData.append('cpf', inputCPF);
  formData.append('nome', inputNome);
  formData.append('telefone', inputTelefone);

  let url = 'http://127.0.0.1:5000/cliente';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/

const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um cliente da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const cpfCliente = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteCliente(cpfCliente)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um cliente da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteCliente = (client) => {
  console.log(client)
  let url = 'http://127.0.0.1:5000/cliente?cpf=' + client;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo cliente com cpf, nome e telefone 
  --------------------------------------------------------------------------------------
*/
const newCliente = () => {
  let inputCPF = document.getElementById("newCPF").value;
  let inputNome = document.getElementById("newNome").value;
  let inputTelefone = document.getElementById("newTelefone").value;

  if (inputCPF === '') {
    alert("Escreva o número do cpf do cliente!");
  } else if (isNaN(inputCPF) || isNaN(inputTelefone)) {
    alert("CPF e Telefone precisam ser números!");
  } else {
    insertList(inputCPF, inputNome, inputTelefone)
    postCliente(inputCPF, inputNome, inputTelefone)
    alert("Cliente adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir clientes na lista apresentada
  --------------------------------------------------------------------------------------
*/

const insertList = (cpf, nome, telefone) => {
  var client = [cpf, nome, telefone]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < client.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = client[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newCPF").value = "";
  document.getElementById("newNome").value = "";
  document.getElementById("newTelefone").value = "";

  removeElement()
}