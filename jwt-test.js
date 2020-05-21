import { JWT } from 'google-auth-library'
import key from './web-push-test-7fe3a-firebase-adminsdk-twn35-c570831d8a.json'

export async function getAccessToken() {
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/cloud-platform'], // scope
      null
    )

    const token = await jwtClient.authorize()

    if(token.access_token)
      return token.access_token

    return token
}