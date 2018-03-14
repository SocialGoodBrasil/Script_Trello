/** ____________________________________________________________
    ____________________________________________________________

Date: 12/03/2018       Created By:
                    -> Alexandre Fortes
                    -> Bruno Evangelista
                    -> Maicon Francisco
                      
                   <---Social Good Brasil--->
                 http://socialgoodbrasil.org.br/
               
____________________________________________________________
____________________________________________________________ **/


// Load moment.js library
var moment = Moment.load();
//Import da biblioteca: MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48 

// ************************ Funções *******************************
// Create menu item on Spreadsheet
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Update from Trello", functionName: "main"} ];
  ss.addMenu("Trello", menuEntries);
}

// Função para buscar a data e hora da última Ação
function findLastActionTime(boardName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(boardName);
  var values = sheet.getRange("A1:A").getValues();
  var lastRow = values.filter(String).length;
  return sheet.getRange(lastRow, 1).getValue();
}

// Função que busca informações do Cartão para mostrar informações sobre o Label dele
function label(cardID){
     var response = UrlFetchApp.fetch(url + "cards/" + cardID + "/labels?" + key_and_token);
     var labels = JSON.parse(response);
       if (labels.length > 0) { // Se o card tem label, mostra o label
          var labelName = labels[0].name;
          return labelName;
        }
        var labelName = " ";
        return labelName;
}

// Função que busca informações do Cartão para mostrar informações sobre a lista dele
function listCard(cardID){
     var response = UrlFetchApp.fetch(url + "cards/" + cardID + "/list?" + key_and_token);
     var list = JSON.parse(response);
       if (list.length > 0) { // Se o card tem lista, mostra a lista
          var listName = list[0].name;
          return listName;
        }
        var listName = " ";
        return listName;
}
// ******************************************************

// ****************** Informações do Trello *************************
// Trello variables
var api_key = "COLOQUE AQUI A SUA API KEY";
var api_token = "COLOQUE AQUI O SEU TOKEN";
var url = "https://api.trello.com/1/";
var key_and_token = "key=" + api_key + "&token=" + api_token;

// ******* Boards do Trello ****************

// Coloque aqui os ID's dos boards
var boards = ["ID DO BOARD 1", "ID DO BOARD 2"];

// Coloque aqui o nome das abas da planilha de acordo com o board que você quer selecionar
var boardNames = ["ABA DO BOARD 1", "ABA DO BOARD 2"];
// ******************************************************


//****************** Função main *************************
function main() {
  
  // Cria a Planilha
  //var ss = SpreadsheetApp.getActiveSheet().clear();
  //ss.appendRow(["Data", "Quem", "Tag", "Ação", "Lista Origem", "Lista Destino", "Card","Label"]);
  
  // Loop para percorrer cada Quadro em busca das Ações
  for (var i = boards.length - 1; i >= 0; i--) {
    var boardID = boards[i];
    var boardName = boardNames[i];
    Logger.log(boardName);
    Logger.log(boardID);
    
    
    // Selecionar a planilha do respectivo Quadro
    var ss = SpreadsheetApp.getActiveSheet();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(boardName);
    
    // Puxa todas as ações relacionadas ao Quadro
    var response = UrlFetchApp.fetch(url + "boards/" + boardID + "/?actions=all&actions_limit=1000&" + key_and_token);
    var actions = JSON.parse(response.getContentText()).actions; 

    continueScript(actions, boardName, sheet);
    //SpreadsheetApp.flush();
  }
}
//********* FIM DA MAIN ********************
    
function continueScript(actions, boardName, sheet){
    
    for (var i = actions.length - 1; i >= 0; i--) {
      var action = actions[i];

// ******************************************************     
      // 1. Verificar se a ação é nova ou não
      var actionTime = action.date;
      var lastActionTime = findLastActionTime(boardName);
      
      if (moment(lastActionTime).isAfter(moment(actionTime)) || moment(lastActionTime).isSame(moment(actionTime))) {
        continue; // Ignorar essa ação, pois ela é antiga
      }                      
// ******************************************************      
      // 2. Mostra as informações importantes da Ação
      var actionType = action.type;
      var userFullName = action.memberCreator.fullName;
      var member = " ";
      var listAfter =" ";
// ****************************************************** 
      // 3. Switch para os três tipos de ações que queremos monitorar
        switch(actionType) {            
        //*************************************    
          case "updateCard":
            var cardName = action.data.card.name;
            var cardID = action.data.card.id;
            var listAction = action.data.list;
            var labelName = label(cardID);           
            // Se não  tiver uma lista
            if ( listAction == undefined){
              var listAfter = action.data.listAfter.name;
              var listBefore = action.data.listBefore.name;
              // Se o cartão foi movido dentro da mesma lista
              if (listAfter == listBefore){
                  listAfter = " ";
                  sheet.appendRow([actionTime, userFullName, member, actionType, listBefore, listAfter, cardName, labelName]); //  ["Data", "Quem","Ação", "Lista Origem", "Lista Destino", "Card","Label"]
                break;
              // Se o cartão foi movido de uma lista para outra
              }else{
                sheet.appendRow([actionTime, userFullName, member, actionType, listBefore, listAfter, cardName, labelName]); //  ["Data", "Quem","Ação", "Lista Origem", "Lista Destino", "Card","Label"]
              }
            }
            break;
        //*************************************                
          case "createCard":
            var cardName = action.data.card.name;
            var cardID = action.data.card.id; 
            var labelName = label(cardID);
            var listBefore = action.data.list.name;
            var listAfter = " ";            
            // Se a lista não tem nome
            if (listBefore == undefined){
              var listBefore = " ";
              sheet.appendRow([actionTime, userFullName, member, actionType, listBefore, listAfter, cardName, labelName]); //  ["Data", "Quem","Ação", "Lista Origem", "Lista Destino", "Card","Label"]
            break;
            // Se a lista tem nome  
            }else{
              sheet.appendRow([actionTime, userFullName, member, actionType, listBefore, listAfter, cardName, labelName]); //  ["Data", "Quem","Ação", "Lista Origem", "Lista Destino", "Card","Label"]
            }
            break;            
        //*************************************                
          case "addMemberToCard":
            var cardName = action.data.card.name;
            var cardID = action.data.card.id; 
            var labelName = label(cardID);
            var listBefore = listCard(cardID);
            var member = action.member.initials;         
            // Se não foi adicionado nenhum membro no card
            if (member == undefined){
              var member = " ";
              sheet.appendRow([actionTime, userFullName, member, actionType, listBefore, listAfter, cardName, labelName]); //  ["Data", "Quem", "Tag","Ação", "Lista Origem", "Lista Destino", "Card","Label"]
              break;            
           // Se foi adicionado um membro no card 
            }else{
              sheet.appendRow([actionTime, userFullName, member, actionType, listBefore, listAfter, cardName, labelName]); //  ["Data", "Quem", "Tag","Ação", "Lista Origem", "Lista Destino", "Card","Label"]
            }
            break;       
        }
      continue;
    }
   }
