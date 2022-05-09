import { v4 as uuidv4 } from 'uuid'
import { Canopy } from '../src/index'

(async () => {
  const client = new Canopy(
    process.env.CANOPY_CLIENT_ID!,
    process.env.CANOPY_CLIENT_SECRET!,
    { host: process.env.CANOPY_HOST! }
  )

  console.log('getting list of Products...')
  const one = await client.product.list()
  if (one.success) {
    console.log(`Success! Found ${one.products!.length} Accounts.`)
  } else {
    console.log('Error! Listing the Accounts failed, and the output is:')
    console.log(one)
  }

  console.log('creating new Product...')
  const cpyProdId = uuidv4()
  const now = new Date().toISOString()
  const testProd = {
    productId: cpyProdId,
    effectiveAt: now,
    productOverview: {
      productName: 'Daily Due',
      productType: 'REVOLVING',
      productShortDescription: '1Day13apr.',
      productLongDescription: 'credit card.',
      productColor: '#0000FF'
    },
    productLifecyclePolicies: {
      paymentDuePolicies: {
        delinquentOnNConsecutiveLateFees: 0,
        chargeOffOnNConsecutiveLateFees: 1
      },
      feePolicies: {
        lateFeeGrace: '0 days'
      },
      billingCyclePolicies: {
        cycleInterval: '1 days',
        cycleDueInterval: '1 days',
        firstCycleInterval: '0 days',
        closeOfBusinessTime: '17:00:00-05:00',
        productTimeZone: 'America/Chicago'
      },
      interestPolicies: {
        interestCalcTime: '11:21:04-08:00'
      },
      defaultAttributes: {
        defaultCreditLimitCents: 6000
      }
    },
    promotionalPolicies: {
      promoLen: 0,
      promoMinPayType: 'PERCENT_PRINCIPAL',
      promoPurchaseWindowLen: 0,
      promoInterestDeferred: true,
      promoDefaultInterestRatePercent: 0,
      promoMinPayPercent: 100,
      promoAprRangeInclusiveLower: 0,
      promoAprRangeInclusiveUpper: 0
    },
    postPromotionalPolicies: {
      postPromoLen: 48,
      postPromoAmLenRangeInclusiveLower: 2,
      postPromoAmLenRangeInclusiveUpper: 5,
      postPromoMinPayType: 'AM',
      postPromoDefaultInterestRatePercent: 13,
      postPromoAprRangeInclusiveLower: 2,
      postPromoAprRangeInclusiveUpper: 15
    }
  }
  const two = await client.product.create(testProd)
  if (two.success) {
    console.log('Success!')
  } else {
    console.log('Error! Creating Product failed, and the output is:')
    console.log(two)
  }

  console.log('getting list of Products now...')
  const tre = await client.product.list()
  if (tre.success) {
    console.log(`Success! Found ${tre.products!.length} Products.`)
  } else {
    console.log('Error! Listing the Products failed, and the output is:')
    console.log(tre)
  }

})()
