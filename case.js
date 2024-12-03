require("./config")
const fetch = require('node-fetch')
const fs = require('fs')
const util = require('util')
const axios = require('axios')
const { exec } = require("child_process")

module.exports = async (sock, m) => {
try {
const body = (
(m.mtype === 'conversation' && m.message.conversation) ||
(m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
(m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
(m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
(m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
(m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
(m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
) ? (
(m.mtype === 'conversation' && m.message.conversation) ||
(m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
(m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
(m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
(m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
(m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
(m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
) : '';

const budy = (typeof m.text === 'string') ? m.text : '';
const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1)
const text = q = args.join(" ")
const sender = m.key.fromMe ? (sock.user.id.split(':')[0]+'@s.whatsapp.net' || sock.user.id) : (m.key.participant || m.key.remoteJid)
const botNumber = await sock.decodeJid(sock.user.id)
const senderNumber = sender.split('@')[0]
const isCreator = (m && m.sender && [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) || false;
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)

const reply = async(text) => {
    sock.sendMessage(m.chat, {text: text}, { quoted: m})
}

switch(command) {
case "menu": case "help" :{
m.reply(`Hallo ${pushname}!

*Menu*
${prefix}openai - Chat Dengan OpenAI
${prefix}lumin-ai - Chat Dengan Lumin-Ai

*NEWS*
${prefix}cnn - CNN News
${prefix}cnbc - CNBC News
${prefix}kumparan - Kumparan News
${prefix}replubika - Replubika News

*DOWNLOADER*
${prefix}tiktok - Download Video Tiktok

*SCREENSHOT WEBSITE*
${prefix}sstab - Screenshot Website Di Tablet
${prefix}sspc - Screenshot Website Di PC
${prefix}sshp - Screenshot Website Di HP

*SEARCH*
${prefix}covid-19 - Info Covid-19
${prefix}yts - Youtube Search
`)
}
//SSWEB
break
case "sstab": case 'ss-tab': {
    if (!text) return m.reply(`_${prefix + command} url_`)
    let h = `https://btch.us.kg/sstab?url=${text}`

    sock.sendFileUrl(m.chat, h, text, m)
}
break
case "sspc": case 'ss-pc': {
    if (!text) return m.reply(`_${prefix + command} url_`)
    let h = `https://btch.us.kg/sspc?url=${text}`

    sock.sendFileUrl(m.chat, h, text, m)
}
break
case "sshp": case "ss-hp:": {
    if (!text) return m.reply(`_${prefix + command} url_`)
let h = `https://btch.us.kg/sshp?url=${text}`

sock.sendFileUrl(m.chat, h, text, m)
}       
break
//SEARCH
case "covid-19" : {
    let data = await fetch(`${global.api}covid-19`)
    let json = await data.json()

    let y = json.result
    let { totalCases, recovered, deaths, activeCases, closedCases, lastUpdate} = y
    reply(`Total Cases: ${totalCases}\n\nRecovered: ${recovered}\n\nDeaths: ${deaths}\n\nActive Cases: ${activeCases}\n\nClosed Cases: ${closedCases}\n\nLast Update: ${lastUpdate}`)
}
break
case "yts": case "yt-search": {
    let data = await fetch(`${global.api}yt-search?query=${text}`)
    let json = await data.json()
    let final = json.result.all.map(e => `Type: ${e.type}\n\nTitle: ${e.title}\n\nLink: ${e.url}\n`).join(`\n\n`)
    reply(final)
}
break
//DOWNLOADER
case "tiktok": case "ttdl": {
    if (!text) return m.reply(`_.tiktok url_`)
    let data = await fetch(`${global.api}tiktok?url=${text}`)
    let json = await data.json()
    sock.sendMessage(m.chat, {video: {url: json.result.play}, caption: json.result.title,  quoted: m})
}
break
//AI
case "luminai": case "lumin-ai": {
    if (!text) return m.reply(`_.luminai prompt_`)
    let data = await fetch(`${global.api}lumin-ai?query=${text}`)
    let json = await data.json()
    reply(json.result.result)
}
break
case "ai": case "openai":{
if (!text) return m.reply(`_.ai prompt_`)
let data = await fetch(`${global.api}openai?query=${text}`)
let json = await data.json()
reply(json.result)
}
break
//NEWS
case "cnbc": case "cnn": case "kumparan": case "replubika": {
    let data = await fetch(`${global.api}news-${command}`)
    let json = await data.json()
    let final = json.result.map(e => `${e.title}\n\n${e.link}`).join(`\n\n`)
    reply(final)
}
break
default:
if (budy.startsWith('=>')) {
if (!isCreator) return
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return m.reply(bang)
}
try {
m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
m.reply(String(e))
}
}

if (budy.startsWith('>')) {
if (!isCreator) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await m.reply(require('util').format(teks))
}
}

if (budy.startsWith('$')) {
if (!isCreator) return
exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) return m.reply(stdout)
})
}
}

} catch (err) {
console.log(util.format(err))
}
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
