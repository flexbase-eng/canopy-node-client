import { Canopy } from '../src/index'

(async () => {
  const client = new Canopy(
    process.env.CANOPY_CLIENT_ID!,
    process.env.CANOPY_CLIENT_SECRET!,
    { host: process.env.CANOPY_HOST! }
  )

  console.log('attempting to get an authentication token...')
  const one = await client.authentication.checkToken()
  if (one.success) {
    console.log('Success!')
  } else {
    console.log('Error! I was not able to get a valid auth token')
    console.log(one)
  }

  console.log('checking that the authentication token stuck...')
  if (client.authentication.accessToken) {
    console.log('Success!')
  } else {
    console.log('Error! I was not able to veify the new auth token')
    console.log(client.authentication.accessToken)
  }

  console.log('attempting to reset for a new authentication token...')
  const two = await client.authentication.resetToken()
  if (two.success) {
    console.log('Success!')
  } else {
    console.log('Error! I was not able to get a *new* valid auth token')
    console.log(two)
  }
})()
