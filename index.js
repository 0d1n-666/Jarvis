const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const {TOKEN, PREFIX} = require('./config');
const Math = require('mathjs');
const exp = require('./exp.json');
const {data} = require('./command/help.js');
const {partenaires} = require('./command/partenaires.js');

client.on("ready", () => {
    console.log(client.user.username + " est connecté !"); 
    client.user.setActivity("VSCode");
})

// Message de bienvenue //
client.on('guildMemberAdd', member => {
    
    const channel = member.guild.channels.find(ch => ch.name === 'accueil');
  if (!channel) return;
  channel.send(`Wsh mon reuf ${member.user.username}: le sang de la veine.`);
})

// Command ping
client.on("message", message => {

    if(message.content === PREFIX + "ping"){
        message.reply("Pong");
    }

});

// System d'xp
client.on("message", message => {
let addXp = Math.floor(Math.random() * 5) + 1;

if (!exp[message.author.id]){
    exp[message.author.id] = {
        exp: 0,
        level: 1
    }
}

let currentXp = exp[message.author.id].exp;
let currentLevel = exp[message.author.id].level;
let nextLevel = currentLevel * 10;
exp[message.author.id].exp = currentXp + addXp;

if (nextLevel <= currentXp){
    exp[message.author.id].level += 1;
    //message.channel.send(`Bravo ${message.author.username} tu es passé level ${currentLevel} !`);
};

fs.writeFile('./exp.json', JSON.stringify(exp), err => {
    if (err) console.log(err);
})

let levelForAutoPromo = 1;
if (levelForAutoPromo <= currentLevel){
    message.member.roles.add("Autopromo");
}

console.log(message.channel.id)
})

// commande xp
client.on("message", msg => {

    if (!exp[msg.author.id]){
        exp[msg.author.id] = {
            exp: 0,
            level: 1
        }
    }
    
    let currentXp = exp[msg.author.id].exp;
    let currentLevel = exp[msg.author.id].level;
    let nextLevel = currentLevel * 10;
    let expForNextLevelUp = nextLevel - currentXp;

    const nivEmbed = new Discord.RichEmbed()
    .setAuthor(msg.author.username)
    .setColor('#FFD600')
    .addField('Niveau', currentLevel, true)
    .addField('Expérience', currentXp, true)
    .setFooter(`${expForNextLevelUp} points d'expériences requis pour le prochain niveaux.`);
    
    if (msg.content === PREFIX + "level") msg.reply(nivEmbed);

});

client.login(TOKEN);
