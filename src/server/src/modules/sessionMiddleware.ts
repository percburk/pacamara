// No changes should be required in this file

import cookieSession from 'cookie-session'
import { badSecret, exampleBadSecret } from '../constants/warnings'

/*
  The cookie session makes it so a user can enters their username and password one time,
  and then we can keep them logged in. We do this by giving them a really long random string
  that the browser will pass back to us with every single request. The long random string is
  something the server can confirm, and then we know that we have the right user.

  You can see this string that gets passed back and forth in the
  `application` ->  `storage` -> `cookies` section of the chrome debugger
*/

const serverSessionSecret = () => {
  if (
    !process.env.SERVER_SESSION_SECRET ||
    process.env.SERVER_SESSION_SECRET.length < 8 ||
    process.env.SERVER_SESSION_SECRET === exampleBadSecret
  ) {
    // Warning if user doesn't have a good secret
    console.log(badSecret)
  }

  return process.env.SERVER_SESSION_SECRET
}

export const sessionMiddleware = cookieSession({
  secret: serverSessionSecret() || 'secret', // please set this in your .env file
  keys: ['user'], // this is the name of the req.variable. 'user' is convention, but not required
  maxAge: 60 * 60 * 1000, // Set to 1 hour - 60 min/hour * 60 s/min * 1000 ms/s
  secure: false,
})
