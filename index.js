// El Mehdi LAIDOUNI

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Process json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Bonjour, Je suis votre Facebook Messenger Bot')
})

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Bot_Messenger_App') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})


// End Point

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'D�marrer', 'Salut') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Bot: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = process.env.token;

// Echo back messages

function sendTextMessage(sender, text) {
    messageData = {
        text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Two cards.

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Si vous souhaitez suivre",
                    "subtitle": "social network",
                    "image_url": "https://raw.githubusercontent.com/mlaidouni/FacebookBot/master/chatbot-facebook.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.facebook.com/groups/1795624087378868/",
                        "title": "FB Facebook Group"
                    }, {
                        "type": "web_url",
                        "url": "https://www.youtube.com/channel/UCRV86HkxxSGI-whauOMkQdw",
                        "title": "Me Suivre sur Youtube"
                    }, {
                        "type": "web_url",
                        "url": "https://twitter.com/elmehdimobi",
                        "title": "Me Suivre sur Twitter"
                    }],
                }, {
                    "title": "Choses � savoir cr�er un bot",
                    "subtitle": "Quelques questions sur notre bot",
                    "image_url": "https://raw.githubusercontent.com/mlaidouni/FacebookBot/master/facebook-chatbots.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "C�est quoi un bot Facebook?",
                        "payload": "Un bot conversationnel, c�est un logiciel informatique qui r�alise des conversations automatis�es. Un bot Facebook, c�est la m�me chose, mais sur un certain r�seau social",
                    }, {
                        "type": "postback",
                        "title": "Quelles sont les entreprises qui ont essay� les bots ?",
                        "payload": "Il s�agit de CNN, qui vous envoie un briefing par message chaque matin, comme une newsletter, quoi. En France, il y a notamment Skyscanner, Voyages-Sncf et KLM.",
                    }, {
                        "type": "postback",
                        "title": "Comment cr�er votre bot Facebook?",
                        "payload": "Il existe deux fa�ons pour cr�er un bot facebook, soit d'utiliser une plateforme sans codage ou le cr�er en codage",
                    }],
                }, {
                    "title": "Les outils n�cessaires",
                    "subtitle": "pour cr�er Facebook Messenger Bot",
                    "image_url": "https://raw.githubusercontent.com/mlaidouni/FacebookBot/master/Facebook%20Messanger%20Bot.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "C'est quoi Node.js",
                        "payload": "Node.js est une plateforme de d�veloppement Javascript. Ce n'est ni un serveur ,ni un Framework, c'est juste le langage Javascript avec des biblioth�ques permettant de r�aliser des actions comme �crire sur la sortie standard, ouvrir/fermer des connections r�seaux ou encore cr�er un fichier.",
                    }, {
                        "type": "postback",
                        "title": "C'est quoi Heroku",
                        "payload": "Heroku est une plateforme � Cloud � qui permet d�h�berger, de d�velopper tout type d�application. La plateforme appartient � Salesforce, gage de s�curit�, de confidentialit� et de haute performance.",
                    }, {
                        "type": "postback",
                        "title": "C'est quoi GitHub",
                        "payload": "GitHub est un site o� n�importe qui peut d�poser son projet web. Qu'il s'agit de quelques lignes de code pour une page modeste, ou d�une grosse application, les amateurs et professionnels ouvrent des comptes sur GitHub pour soumettre leur travail � l�appr�ciation de tous.",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

