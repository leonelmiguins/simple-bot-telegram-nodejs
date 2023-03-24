/*
Um bot simples para administração de grupos no telegram feito em nodejs.
Criado por: Leonel Miguins.
Não esqueça de adicionar o bot como administrador do grupo!
*/

//precisa ser refatorado

const TelegramBot = require('node-telegram-bot-api');

//insira aqui a token do seu bot que você pegou no @BotFather:
const token = 'SEU_BOT_TOKEN_AQUI';

t = token.length;
console.log("Iniciando...")
//encerra o processo de conexão se o token estiver incorreto ou vazio
if(token == "" ||  t != 46 || token == "SEU_BOT_TOKEN_AQUI"){
console.log("\033[31merro: token incorreto ou vazio!\n")

process.exit(1);
//se tudo correr bem, exibe a menssagem de sucesso!
}else{ setTimeout(() => {console.log("\033[32mbot Conectado com sucesso!\ntoken = "+token)},5000);
}

//Cria um bot que usa 'polling' para buscar novas atualizações:
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; 

  
  bot.sendMessage(chatId, resp);
});

//fica 'escutando' as menssagens recebidas
bot.on('message', (msg) => {

    const parse_mode = {parse_mode: 'HTML'};
  
  //mensagem de boas-vindas:
  if(msg.new_chat_members != undefined) {
    bot.deleteMessage(msg.chat.id, msg.message_id)
    bot.sendMessage(msg.chat.id, `<i>Olá <b>${msg.new_chat_member.first_name}</b>! Seja Bem vindo(a) ao <b>${msg.chat.title}</b> Fique a vontade para conversar e se apresentar, caso queira. Qualquer coisa fale com um adm!</i>😉`,parse_mode)
    console.log(`novo membro: ${msg.new_chat_member.first_name} id: ${msg.new_chat_member.id}`);
  }
  //iniciando o bot com comando /start:
  if(msg.text == "/start"){

    txt =
    "<b><i>O que esse bot pode fazer?\n\n"+
    "✅ menssagem de boas vindas. [ automático ]\n"+
    "✅ silencia membros.\n"+
    "✅ bane membros.\n"+
    "✅ promove membros a adm.\n"+
    "✅ anti-link de canais. [ automático ]\n"+
    "✅ anti-link pornográficos. [ automático ]\n"+
    "✅ anti-conversas nocívas. [ automático ]\n\n"+
    "》 envie /cmd para obter a lista de comandos.</i></b>\n"
    

    bot.sendMessage(msg.chat.id, txt, parse_mode);
    
  }
  //mostrando a lista de comandos disponíveis:
  if(msg.text == "/cmd" || msg.text == "/cmd@KaguyaMakoto_Bot"){

    txt =
    "<i><b>COMANDOS:\n\n"+
    "⚠ Use o comando respondendo a menssagem enviada pelo membro!\n\n"+
    "》 silenciar membro: /s\n"+
    "》 banir membro: /ban\n"+
    "》 promove membro a adm: /adm\n"+
    "》 exibe as regras: /regras\n"+
    "》 sobre o bot: /sobre\n</b></i>";
    

    bot.sendMessage(msg.chat.id, txt, parse_mode);
    
  }
  //comando para promover um membro a administrador:
  if(msg.text == "/adm"){
    // variáveis
    var user = msg.reply_to_message.from.id;
    var name = msg.reply_to_message.from.first_name;
    var adm = "@"+msg.from.username;

    // permissões
    const perms = {
    can_restrict_members: true,
    can_invite_users : true
    }
    

    // pegando o array dos administradores
    bot.getChatAdministrators(msg.chat.id)
    .then( function(data) {

    // tamanho total do array
    t = data.length;

    //criando contador para função while
    cont = 0

    while (cont < t) {

      if(data[cont].user['id'] == msg.from.id){

        bot.promoteChatMember(msg.chat.id, user, perms);
        // sucesso, promove o membro a administrador
        bot.sendMessage(msg.chat.id, `<i><b>${name}</b> foi promovido a <b>adm por ${adm}!</b></i>`, {parse_mode: 'HTML'})
        console.log(name+" foi promovido a adm por: "+adm);

        break;
      }

      if(data[cont].user['id'] == user){

        // erro, não promove se já for adm
        bot.sendMessage(msg.chat.id, "<i>⚠<b> "+name+"</b> já é um administrador!</i>",{parse_mode: 'HTML'})
        break;
      }
      cont ++;
      if(cont == t){

        // erro, não promove se quem requisitou não for adm
        bot.sendMessage(msg.chat.id, "<i><b>"+msg.from.first_name+"</b> Você não é um administrador!\n\n⚠ cuidado! você pode ser banido se continuar enviando um comando restrito.</i>",{parse_mode: 'HTML'})
      }
    }
  })
  
  }
  //comando para banir um membro:
  if(msg.text == "/ban"){

    // permissões
    const perms = {
      can_send_messages: false,
      
    }

    var user = msg.reply_to_message.from.id;
    var name= msg.reply_to_message.from.first_name;
    var adm = "@"+msg.from.username;
        
    // pegando o array dos administradores
    bot.getChatAdministrators(msg.chat.id)
     .then( function(data) {
     t = data.length;
     //criando contador para a função while:
     cont = 0;

     while (cont < t) {

      if(data[cont].user['id'] == msg.from.id && data[cont].user['id'] != user){

        // sucesso, bane
        bot.banChatMember(msg.chat.id, user, perms);;
        bot.sendMessage(msg.chat.id, "<i><b>"+name+"</b> foi banido(a) por: "+adm+"!</i>",parse_mode);
        console.log(name+" foi banido por: "+adm+"!");
        break;
      }
      if(data[cont].user['id'] == user){

        // erro, não bane se já for adm
        bot.sendMessage(msg.chat.id, `<i>⚠<b> ${msg.from.first_name}</b> você não pode banir outro administrador!</i>`,parse_mode)
        break;
      }
      cont ++;
      if(cont == t){

        // erro, não promove se quem requisitou não for adm
        bot.sendMessage(msg.chat.id, `<i><b>${msg.from.first_name}</b> Você não é um administrador!\n\n⚠ cuidado! você pode ser banido se continuar enviando um comando restrito.</i>`,parse_mode)
      }
       
    }

    })

  }
  //comando para silenciar um membro:
  if(msg.text == "/s"){

    var data = Math.round(((new Date()).getTime() + 60000) / 1000)
    // permissões
    const perms = {
      can_send_messages: false,
      until_date: data
      
    }

    var user = msg.reply_to_message.from.id;
    var name= msg.reply_to_message.from.first_name;
    var adm = "@"+msg.from.username;
        
    // pegando o array dos administradores
    bot.getChatAdministrators(msg.chat.id)
     .then( function(data) {
     t = data.length;
     //criando contador para a função while:
     cont = 0;

     while (cont < t) {

      if(data[cont].user['id'] == msg.from.id && data[cont].user['id'] != user){

        // sucesso, bane
        bot.restrictChatMember(msg.chat.id, user, perms);;
        bot.sendMessage(msg.chat.id, "<i><b>"+name+"</b> foi silenciado(a) por: "+adm+" em 60 segundos!</i>",parse_mode);
        console.log(name+" foi silenciado por: "+adm+"!");
        break;
      }
      if(data[cont].user['id'] == user){

        // erro, não bane se já for adm
        bot.sendMessage(msg.chat.id, `<i>⚠<b> ${msg.from.first_name}</b> você não pode silenciar outro administrador!</i>`,parse_mode)
        break;
      }
      cont ++;
      if(cont == t){

        // erro, não promove se quem requisitou não for adm
        bot.sendMessage(msg.chat.id, `<i><b>${msg.from.first_name}</b> Você não é um administrador!\n\n⚠ cuidado! você pode ser banido se continuar enviando um comando restrito.</i>`,parse_mode)
      }
       
    }

    })

  }
  //comando para exibir as regras do grupo:
  if(msg.text == "/regras"){
    //defina suas regras dentro da variável 'texto_regras':
    var texto_regras = "》 ⛔ Proibido conteúdo adulto\n》 ⛔ Proibido conteúdo agressivo\n》 ⛔ Proibido uso de palavrões\n》 ⛔ Proibido desrespeito\n》 ⛔ Proibido vendas\n》 ⛔ Proibido enviar links impróprios";

    bot.sendMessage(msg.chat.id, `<b>REGRAS DO GRUPO\n\n${texto_regras}</b>`, parse_mode);


  

  }
  //anti link pornográfico e de canais do telegram:
  if(msg.text.includes("xvideos") || msg.text.includes("porno") || msg.text.includes("t.me")){
    
    bot.deleteMessage(msg.chat.id, msg.message_id);
    
    var txt;

    if(msg.text.includes("xvideos") || msg.text.includes("porno")){
    var txt = "<i>Sua menssagem foi apagada por que você infligiu as regras!\n\n"+
    "<b>⚠ conteúdo ou conversas com teor pornográfico</b></i>\n\n";
    }
    if(msg.text.includes("t.me")){
      var txt = "<i>Sua menssagem foi apagada por que você infligiu as regras!\n\n"+
      "<b>⚠ links de canais não são permitidos! contate um adm.</b></i>\n\n";
    }

    bot.sendMessage(msg.chat.id, txt ,parse_mode);

  }
  //informações sobre o bot:
  if(msg.text == "/sobre" || msg.text == "/sobre@KaguyaMakoto_Bot"){

    txt =
    "<i><b>SOBRE O BOT:\n\n"+
    "Um simples bot para administração de grupos no telegram feito em nodejs.\n\n"+
    "》 criado por: @leoMiguins\n"+
    "》 versão: 1.1.0</b></i>\n";

    bot.sendMessage(msg.chat.id, txt, parse_mode);
    
  }

});
