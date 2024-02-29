//GRUPO: GUILHERME RICCI, ALLAN DE OLIVEIRA E MURILO COSTA.

// APP DE TABELA DO FUTEBOL.

const fs = require("fs");
    //  READLINE É UM MÓDULO QUE FORNECE A POSSIBILIDADE DA INTERAÇÃO DO USUÁRIO COM O APP.
const readline = require("readline");
    //  A VARIAVEL rl QUE VAI POSSIBILITAR ESSA INTERAÇÃO DURANTE O USO DO APP.
const rl = readline.createInterface({
    //  INPUT = ENTRADA PADRÃO DE INFORMAÇÕES(USUÁRIO).
    input: process.stdin,
    //  OUTPUT = SAÍDA PADRÃO DE INFORMAÇÕES(APP).
    output: process.stdout
});
      
            // FUNÇÃO PARA MOSTRAR O MENU DURANTE O USO DO APP.
function exibirMenu() {
  console.log("\nMENU:");
  console.log("1. Buscar registro de times por nome");
  console.log("2. Mostrar tabela atual");
  console.log("3. Adicionar um novo time");
  console.log("4. Excluir um time");
  console.log("5. Sair");

  rl.question("Escolha uma opção: ", (opcao) => {
    switch (opcao) {
        case "1":
            buscarNome();
            break;
        case "2":
            mostrarTabela();
            break;
        case "3":
            adicionarTime();
            break;
        case "4":
            excluirTime();
            break;
        case "5":
            console.log("Saindo...");
            rl.close();
            break;
        default:
            console.log("Opção inválida. Por favor, escolha uma opção válida.");
            exibirMenu();
            break;
    }
  });
}
            //  FUNÇÃO PARA FAZER BUSCA DE UM TIME NA TABELA.
function buscarNome() {
    rl.question("\nDigite o nome do time que deseja encontrar: ", (busca) => {
        let jsonString;
        try {
            jsonString = fs.readFileSync(arquivoJSON, "utf8");
            //console.log("Arquivo lido com sucesso.");
          
            const listaTimes = JSON.parse(jsonString);
          
            // REALIZA A BUSCA PELO NOME DO TIME INSERIDO UTILIZANDO UM FILTRO
            const timeEncontrado = listaTimes.filter((time) => time.nome == busca);
            
            if (timeEncontrado.length === 0) {
                console.log("\nNenhum time encontrado com o nome:", busca);
            } else {
                console.log("\n", busca, "foi encontrado na tabela.");
                timeEncontrado.forEach((time) => {
                    console.log(time);
                });
            }
        } catch (erro) {
          console.log("Erro: ", erro);
        }
        exibirMenu();
    });
    
}
            //  FUNÇÃO PARA MOSTRAR TABELA AO USUÁRIO.
function mostrarTabela() {
    let jsonString;
    try {
        jsonString = fs.readFileSync(arquivoJSON, "utf8");
        //console.log("Arquivo lido com sucesso.");
        
        // CONVERTENDO DE JSON STRING PARA UM OBJETO 
        const listaTimes = JSON.parse(jsonString);
        console.log(listaTimes);
    }
    catch (erro){
        console.log("Erro", erro);
    }
    exibirMenu()
}
            //  FUNÇÃO PARA ADICIONAR UM NOVO TIME A TABELA.
function adicionarTime() {
    rl.question("\nDigite o nome do novo time: ", (nome) => {
        rl.question("\nDigite a pontuação do novo time: ", (pontos) => {
            //  "CARCAÇA" DE COMO SERÁ ADICIONADO NA TABELA.
            const novoTime = {
                "Colocação": "0",
                "nome": nome,
                "pontos": pontos,
            };
    
            const listaTimes = tabela();
            //  ADICIONANDO NOVO TIME A TABELA.
            listaTimes.push(novoTime);
            //  ATUALIZANDO AS COLOCAÇÕES NA TABELA.
            atualizarID(listaTimes);
            //  SALVANDO AS MUDANÇAS FEITA NA TABELA.
            save(listaTimes);
        
            console.log(`\nTime adicionado a tabela.`);
            exibirMenu();
        });
    });
}
            //  FUNÇÃO PARA EXCLUIR UM TIME DA TABELA.
function excluirTime() {
    rl.question("\nDigite o nome do time que deseja excluir: ", (deletar) => {
        const listaTimes = tabela();
        //  
        const indiceTime = listaTimes.findIndex((time) => time.nome === deletar);
    
        if (indiceTime === 0) {
          console.log("Time não encontrado.");
        } else {
            listaTimes.splice(indiceTime, 1)[0];
            atualizarID(listaTimes)
            save(listaTimes);
            console.log(`\nTime excluído da tabela.`);
        }
    
        exibirMenu();
      });
}

//  CHAMANDO A FUNÇÃO PARA INICIAR A INTERFACE DO APP.
exibirMenu();


                            //  FUNÇÕES ENCURTA.NET

// A VARIAVEL arquivoJSON EXISTE PARA ENCURTAR OS CÓDIGOS QUE IRAM UTILIZA-LA.
const arquivoJSON = __dirname + "/tabela.json";

            //  FUNÇÃO PARA ATUALIZAR A CHAVE PRIMÁRIA/ID/COLOCAÇÃO.
function atualizarID(listaTimes) {
    // ORDENA OS TIMES PELA PONTUAÇÃO
    listaTimes.sort((a, b) => parseFloat(b.pontos) - parseFloat(a.pontos));
    
    // ATUALIZA AS ID's COM BASE NA NOVA ORDEM
    listaTimes.forEach((time, index) => {
        time["Colocação"] = index.toString();
    });
}
            //  FUNÇÃO PARA ATUALIZAR A TABELA.
function save(listaTimes) {
    const novaListaTimes = JSON.stringify(listaTimes, null, 2);
    fs.writeFileSync(arquivoJSON, novaListaTimes);
}
            //  FUNÇÃO PARA ENCURTAR QUANDO PRECISAR CHAMAR A TABELA.
function tabela() {
    try {
      const jsonString = fs.readFileSync(arquivoJSON, "utf8");
      return JSON.parse(jsonString);
    } catch (erro) {
      console.error("Erro ao ler o arquivo:", erro);
      return [];
    }
  }
  