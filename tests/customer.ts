import { v4 as uuidv4 } from 'uuid'
import { Canopy } from '../src/index'

(async () => {
  const client = new Canopy(
    process.env.CANOPY_CLIENT_ID!,
    process.env.CANOPY_CLIENT_SECRET!,
    { host: process.env.CANOPY_HOST! }
  )

  console.log('getting list of Customers and Accounts...')
  const one = await client.customer.listAll()
  if (one.success) {
    console.log(`Success! Found ${one.pairs!.length} Customer/Account pairs.`)
  } else {
    console.log('Error! Listing the Customer/Account pairss failed, and the output is:')
    console.log(one)
  }

  console.log('creating new Customer...')
  const cpyCustId = uuidv4()
  const now = new Date().toISOString()
  const testCust = {
    customerId: cpyCustId,
    customerType: 'person',
    nameFirst: 'Chip',
    nameLast: 'Conners',
    phoneNumber: '3175551212',
    addressLineOne: '123 Main St',
    addressCity: 'Indianapolis',
    addressState: 'IN',
    addressZip: '46224',
    ssn: '111224444',
    email: 'chip@concrete.com',
    dateOfBirth: '1980-10-10',
    businessDetails: {
      businessLegalName: "Chip's Concrete",
      businessEin: '888-88-8888',
      businessType: 'llc',
    },
    verificationStatus: 'verified',
  }
  const two = await client.customer.create(testCust)
  console.log('[create]', two)
  if (two.success) {
    console.log('Success!')
  } else {
    console.log('Error! Creating Product failed, and the output is:')
    console.log(two)
  }

  console.log('getting list of current Customers and Accounts...')
  const tre = await client.customer.listAll()
  console.log('[list]', tre)
  if (tre.success) {
    console.log(`Success! Found ${tre.pairs!.length} Customer/Account pairs.`)
  } else {
    console.log('Error! Listing the Customer/Account pairss failed, and the output is:')
    console.log(tre)
  }

})()
