const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-8eb5a-firebase-adminsdk-v70en-b817a4ddd7.json')
const databaseURL = 'https://fcm-8eb5a.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-8eb5a/messages:send'
const deviceToken =
  'codIdxvTVoM98x7_kjxsZw:APA91bGVQftPqQVNxEqu7opprnTC2doZlC2BiTVIbWymF4A5JxAPdgKssAnCkW37kKKsXNeHGm2CepdE0d-m-O1LE_oOy-2vxjqGKUw6IxP-wMGcPYHE32OuHezK_5QsMKOYTN_nNWye'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()