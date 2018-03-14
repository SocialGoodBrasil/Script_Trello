# Scritp_Trello

Este script faz o monitoramento das seguintes informações do Trello:
  - Data em que determinada ação foi realizada
  - Quem realizou a ação no board
  - Marcação de pessoas em um card
  - A lista de origem em que um card foi criado
  - A lista de destino quando um card é movido
  - O nome do card
  - O label do card
  
  A organização Social Good Brasil (Florianópolis/SC) criou este script para monitoramento da performance interna, buscando melhorar a qualidade dos nossos programas. Estamos dando nossos primeiros passos com inteligência de dados e acreditamos que compartilhar nossos conhecimentos e conquistas é fundamental. Mais informações: <http://socialgoodbrasil.org.br/>
  
  
## Passo a passo

1- Primeiro você deve criar uma planilha do Google, e colocar a primeira linha da seguinte forma:
```
   | __A__ | __B___ | __C_ |__D__ | ______E_______ | ______F______ |___G___ | ___H___|
 1 |  Data |  Quem  | Tag  | Ação |  Lista Origem  | Lista Destino |  Card  |  Label
``` 
2- Abrir a ferramenta de script do Google, copiar e colar o código 'script_trello' 

3- Importar a biblioteca 'moment', usando a chave: MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48

4- Adicionar as suas informações do Trello em:
```
  var api_key = "COLOQUE AQUI A SUA API KEY";
  var api_token = "COLOQUE AQUI O SEU TOKEN";
  var url = "https://api.trello.com/1/";
  var key_and_token = "key=" + api_key + "&token=" + api_token;
```

5- Colocar o ID dos boards que você  monitorar em:
```
  var boards = ["ID DO BOARD 1", "ID DO BOARD 2"];
```  
6- Colocar o nome da aba da planilha do Google que você escrever as informações do board:
```
  var boardNames = ["ABA DO BOARD 1", "ABA DO BOARD 2"];
```  
  
# Considerações

- A função 'main()' do script está dividida em duas pois a ferramenta de script do Google não permite executar funções com mais de 100 linhas;
- A escrita das informações apenas são realizadas se houve uma nova ação no board;
- Para maiores informações da documentação do Trello:
  <https://developers.trello.com/v1.0/reference#introduction> 
