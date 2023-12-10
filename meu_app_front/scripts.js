/*
  --------------------------------------------------------------------------------------
  Funções para modificar a tela inicial quando um dos botões é acionado
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

/*
----------------------------------------------------------------------------------------
  Chamada da função para carregamento da lista de clientes
----------------------------------------------------------------------------------------
*/

function aparecerLista () {
  var SumirListaDaTelaInicial = document.getElementById('listaDeClientes');
  SumirListaDaTelaInicial.style = "display:block;";
}

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
    .then((response) => {
      if (response.status == 200) {
        insertList(inputCPF, inputNome, inputTelefone)
        alert("Cliente adicionado!")
      } else {
        alert ("Já existe um cliente cadastrado com este CPF")
      }
    }
    )
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
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const cpfCliente = div.getElementsByTagName('td')[0].innerHTML

      // removendo a máscara do cpf para deletar o cliente do banco de dados.
      let cpfRemoveString = cpfCliente.toString()
      let cpfFormat = cpfRemoveString.replace (/\.|-/gm,'')
      let cpfClean = parseFloat(cpfFormat)

      // confirmação da remoção.
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteCliente(cpfClean)
        alert("Cliente foi pro espaço!")
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
    postCliente(inputCPF, inputNome, inputTelefone)
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir clientes na lista apresentada
  --------------------------------------------------------------------------------------
*/

const insertList = (cpf, nome, telefone) => {
  var client = [cpf, nome, telefone]
  let cpfDoBanco = client[0];
  let telefoneString = client[2].toString()
  var table = document.getElementById('myTable');
  var row = table.insertRow();
  var clean = parseFloat(client[0])


  for (var i = 0; i < client.length; i++) {
    var cel = row.insertCell(i);
    // Aplicando máscara no CPF e telefone do cliente
    let cpfString = cpfDoBanco.toString()
    var cpfFormat = cpfString.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4")
    var telefoneFormat = telefoneString.replace( /(\d{2})(\d{4,5})(\d{4})/g, "($1) $2 - $3")
    client[0] = `${cpfFormat}`
    client[2] = `${telefoneFormat}`
    cel.textContent = client[i];
  }
  // retornando o cpf para float.
  client[0] = clean
  insertButton(row.insertCell(-1))
  // Sumindo com os dados adicionados nos campos iniciais.
  document.getElementById("newCPF").value = "";
  document.getElementById("newNome").value = "";
  document.getElementById("newTelefone").value = "";

  removeElement()
}
