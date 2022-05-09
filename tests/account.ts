import { v4 as uuidv4 } from 'uuid'
import { Canopy } from '../src/index'

(async () => {
  const client = new Canopy(
    process.env.CANOPY_CLIENT_ID!,
    process.env.CANOPY_CLIENT_SECRET!,
    { host: process.env.CANOPY_HOST! }
  )

  console.log('getting Account by Id...')
  const one = await client.account.byId('1')
  if (one.success) {
    console.log('Success!')
  } else {
    console.log('Error! Fetching Account by Id failed, and the output is:')
    console.log(one)
  }

  const cpyProdId = 19410     // from the previous tests
  console.log(`creating new Account on Product ${cpyProdId}...`)
  const cpyAcctId = uuidv4()
  const now = new Date().toISOString()
  const testAcct = {}
  const two = await client.account.create()
  console.log('[create] ', two)
  if (two.success) {
    console.log('Success!')
  } else {
    console.log('Error! Updating Borrower failed, and the output is:')
    console.log(two)
  }

  // let fouB = {} as any
  // if (fouA.success) {
  //   console.log('getting updated Borrower by Id...')
  //   fouB = await client.borrower.byId('BO-9BR3-GW8J')
  //   if (fouB.success) {
  //     console.log('Success!')
  //   } else {
  //     console.log('Error! Fetching updated Borrower by Id failed, and the output is:')
  //     console.log(fouB)
  //   }
  // }

  // if (fouA.success && fouB.success) {
  //   if (fouB.borrower!.externalId === extId) {
  //     console.log('Success! The update to the Borrower for externalId worked!')
  //   } else {
  //     console.log('Error! the Borrower was not updated properly')
  //     console.log(fouB)
  //   }
  // }

  // if (fouA.success) {
  //   console.log('getting updated Borrower by externalId...')
  //   const fouC = await client.borrower.byId(`ext-${extId}`)
  //   if (fouC.success) {
  //     console.log('Success!')
  //   } else {
  //     console.log('Error! Fetching updated Borrower by externalId failed, and the output is:')
  //     console.log(fouC)
  //   }
  // }

  // if (fouA.success) {
  //   console.log('updating Borrower... resetting externalId...')
  //   const fouD = await client.borrower.update('BO-9BR3-GW8J', {
  //     externalId: null,
  //   })
  //   if (fouD.success) {
  //     console.log('Success!')
  //   } else {
  //     console.log('Error! Updating Borrower failed, and the output is:')
  //     console.log(fouD)
  //   }
  // }

  // const acme = {
  //   borrowerType: 'business',
  //   externalId: '4efb9243-9bfd-4fb0-ac64-9719a5176217',
  //   status: 'active',
  //   commPreferences: {
  //     statementDeliveryChannels: [ 'email' ],
  //     sendRemindersWhenCurrent: true,
  //   },
  //   businessDetails: {
  //     businessType: 'LLC',
  //     businessName: 'Acme Steel',
  //     businessLegalName: 'Acme Steel, Inc.',
  //     incorporatedCountry: 'US',
  //     incorporatedState: 'CA',
  //   },
  //   identity: {
  //     identityType: 'taxID',
  //     value: '30-0000000',
  //     valid: true,
  //     issueDate: '2019-12-31',
  //     issuingCountry: 'US',
  //   }
  // }
  // console.log('looking for Borrower: "Acme Steel"...')
  // const fiv0 = await client.borrower.byId(`ext-${acme.externalId}`)
  // if (fiv0?.borrower?.id) {
  //   console.log('The Borrower already exists - this test had to have worked.')
  // } else {
  //   console.log('creating Borrower: "Acme Steel"...')
  //   const fivA = await client.borrower.create(acme)
  //   if (fivA.success) {
  //     console.log('Success!')
  //   } else {
  //     console.log('Error! Creating Borrower failed, and the output is:')
  //     console.log(fivA)
  //   }

  //   let fivB = {} as any
  //   if (fivA.success) {
  //     console.log('getting newly created Borrower by externalId...')
  //     fivB = await client.borrower.byId(`ext-${acme.externalId}`)
  //     if (fivB.success) {
  //       console.log('Success!')
  //     } else {
  //       console.log('Error! Fetching created Borrower by externalId failed, and the output is:')
  //       console.log(fivB)
  //     }
  //   }

  //   if (fivA.success && fivB.success) {
  //     console.log('getting New list of Borrowers...')
  //     const fivC = await client.borrower.get()
  //     if (fivC.success) {
  //       console.log(`Success! Found ${fivC.borrowers!.data.length} Borrowers, out of a total of ${fivC.borrowers!.total}.`)
  //     } else {
  //       console.log('Error! Searching for Borrowers failed, and the output is:')
  //       console.log(fivC)
  //     }
  //   }
  // }

})()
