import chalk from 'chalk'
import inquirer from 'inquirer'
import prompt from 'prompt-sync'
import fs from 'fs'

operation()

//Menu com as opções para o usuário
function operation() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que deseja ?',
        choices: [
          'Exibir lista de propriedades',
          'Adicionar propriedades',
          'Remover propriedades',
          'Sair',
        ],
      },
    ])
    .then((answer) => {
      const action = answer['action']

      if (action === 'Exibir lista de propriedades') {
        ExibirLista()
      } else if (action === 'Adicionar propriedade') {
        CriarLista()
      } else if (action === 'Remover propriedade') {
        RemoverRegra()
      } else if (action === 'Sair') {
        console.log(chalk.bgBlue.black('Muito Obrigado!')) 
        process.exit()
      }
    })
}

const command = prompt()

//Cria a lista com as regras e fazer o tratamento de erro
const CriarLista = (entrada) => {
  let propriedades = []
  while (entrada != "sair") {
    entrada = command("Insira uma propriedade:")
    if(propriedades.indexOf(`"${entrada}"`) == -1 && entrada != 'sair'){
      propriedades.push(`"${entrada}"`);
    } else if(entrada == 'sair'){
      console.log(chalk.bgGreen.black('Lista finalizada')) 
    } else if(propriedades.indexOf(`"${entrada}"`) != -1){
      console.log(chalk.red("Esta propriedade já foi adicionada, escolha outra por favor!")) 
    }
  }
  let resultado = propriedades.sort().join("\n") //Guarda a lista em ordem alfabética 
  console.log(resultado)
  CriarJson(propriedades)
}

//Função que cria um arquivo json com a lista
function CriarJson(propriedades) {  
  console.log(propriedades)
  inquirer.prompt([ 
    {
      name: 'arquivo',
      message: 'Deseja criar um arquivo com a lista?:',
    },
  ])
  .then((answer) => {
    if(answer.arquivo == 'sim'){
      console.info(answer['arquivo'])

      const lista = 'CSS'
  
      if (!fs.existsSync('propriedades')) {
        fs.mkdirSync('propriedades')
      }
  
      if (fs.existsSync(`propriedades/${lista}.json}`)) {
        console.log(chalk.bgpink.black('Lista atualizada!'),)
      }

      fs.writeFileSync(`propriedades/${lista}.json`, `{"propriedades": [${propriedades}]}`, //criação do arquivo
      function (err){
        console.log(err)
      },)

      console.log(chalk.green('Arquivo criado com sucesso!'))
      operation()

    } else {
      console.log(chalk.bgpink.black('Obrigado!'))
      operation()
    }
  })
}

//Para exibir a lista com as regras
function ExibirLista() {
  var jsonData = fs.readFileSync("propriedades/CSS.json", "utf8");
  var list = JSON.parse(jsonData);
  var newList = list.propriedades
  console.log(newList.sort().join("\n"))
  operation() //volta para o menu
}

//Função para remover uma regra
function RemoverRegra(){
  inquirer
    .prompt([
      {
        name: 'remove',
        message: 'Digite a propriedade para ser removida:',
      },
    ])
    .then((answer) => {
      let propCSS = answer['remove']

      var jsonData = fs.readFileSync("propriedades/CSS.json", "utf8");

      var list = JSON.parse(jsonData);
      var newList = list.propriedades;
    
      if (newList.includes(propCSS)) {
        let busca = propCSS
        let index = newList.indexOf(busca);
        while(index >= 0){
          newList.splice(index, 1);
          index = newList.indexOf(busca);}

        console.log(chalk.bgGreen.black('Propriedade removida!'))
        console.log(newList.sort().join("\n"))
        fs.writeFileSync(`propriedades/CSS.json`, `{"propriedades": ["${newList}"]}`)
        operation() 
      }
      else {
        console.log(chalk.bgRed.black('Esta propriedade já foi removida, escolha outra!'))
        console.log(newList.sort().join("\n"))
        RemoverRegra()
      }
    })
 }