# canopy-node-client

`canopy-node-client` is a Node/JS and TypeScript Client for
[Canopy](https://canopyservicing.com) that allows you to use normal Node
syntax to Products, Customers, Accounts, LineItems and other data
from the Canopy
[API](https://docs.canopyservicing.com/doc/latest).

## Install

```bash
# with npm
$ npm install canopy-node-client
```

## Usage

This README isn't going to cover all the specifics of what Canopy is,
and how to use it - it's targeted as a _companion_ to the Canopy developer
[docs](https://docs.canopyservicing.com/doc/latest)
that explain each of the endpoints and how the general Canopy
[API](https://docs.canopyservicing.com/doc/latest) works.

However, we'll put in plenty of examples so that it's clear how to use this
library to interact with Canopy.

### Getting your Client ID and Secret

This client is _currently_ targeted at the M2M usage pattern where a
Canopy-generated Client ID and Client Secret are generated from the
[API Keys](https://uat.canopyservicing.com/app/keys) page - after a
sandbox has been created. These will then be passed in to the client
constructor, and used to generate the _Access Token_ that Canopy
Authentication works with.

These tokens have a _relatively_ short lifespan, so the Client is capable of detecting a call that failed due to a token expiration, and will
re-authenticate, as needed, and repeat the call. This allows the user of
this client a lot of freedom while maintaining the security of the
communications with Canopy.

### Creating the Client

All Canopy functions are available from the client, and the basic
construction of the client is:

```typescript
import { Canopy } from 'canopy-node-client'
const client = new Canopy(clientId, clientSecret)
```

If you'd like to provide the base host in the constructor, for example,
if you wanted to point to the Canopy `sandbox`, you can do that
with:

```typescript
const client = new Canopy(clientId, clientSecret, {
  host: 'uat-api.canopyservicing.com',
})
```

where the options can include:

* `host` - the hostname where all Canopy calls should be sent

### Product Calls

As stated in the Canopy
[documentation](https://docs.canopyservicing.com/doc/latest#endpoint-products):

> Create and launch credit products within the Canopy system.

#### [Create Product](https://docs.canopyservicing.com/doc/latest#operation-createproduct)

You can create a Product in the Canopy system with a single call:

```typescript
const resp = await client.product.create(prodInfo)
```

where `prodInfo` is the structure of a Product, as set up in the `Product`
interface definition, and the response will be something like:

```javascript
{
  success: true,
  product: {
    productId: 19437,
    externalProductId: '9dec4e99-8d72-44b2-a9d6-7da9a989c643',
    createdAt: '2022-05-07T08:41:26-05:00',
    effectiveAt: '2022-05-07T08:41:23-05:00',
    isActive: true,
    admin: { migrationMode: false },
    productOverview: {
      productName: 'Daily Due',
      productType: 'REVOLVING',
      productShortDescription: '1Day13apr.',
      productLongDescription: 'credit card.',
      productColor: '#0000FF',
      externalFields: []
    },
    productLifecyclePolicies: {
      paymentDuePolicies: [Object],
      paymentPouringPolicies: [Object],
      feePolicies: [Object],
      billingCyclePolicies: [Object],
      interestPolicies: [Object],
      defaultAttributes: [Object]
    },
    promotionalPolicies: {
      promoLen: 0,
      promoMinPayType: 'PERCENT_PRINCIPAL',
      promoMinPayFloorCents: null,
      promoMinPayPercent: 100,
      promoPurchaseWindowLen: 0,
      promoInterestDeferred: true,
      promoResetOnFirstCharge: false,
      promoDefaultInterestRatePercent: 0,
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
    },
    productSummary: { accountsOverview: [Object] },
    attributes: {}
  }
}
```

If there had been an error, the response could be something like:

```javascript
{
  "success": false,
  "error": {
    "type": "canopy",
    "code": "canopy_code_name"
    "message": "(Error message from Canopy...)",
    "details": [
      {
        "instancePath": "/body",
        "schemaPath": "#/properties/body/required",
        "keyword": "required",
        "params": { "missingProperty": "product_overview" },
        "message": "must have required property product_overview"
      },
      ...
    ]
  }
}
```

where:

* `details` may, or may not, be included in the response if Canopy decides
  to enumerate the reasons for the failure.

So looking at the `success` value of the response will quickly let you know the outcome of the call.

#### [Get all Products](https://docs.canopyservicing.com/doc/latest#operation-getproducts)

You can get a list of all Products at Canopy with no arguments:

```typescript
const resp = await client.product.list()
```

and the result will look something like:

```javascript
{
  success: true,
  products: [
    {
      createdAt: '2022-05-07T13:49:00+00:00',
      productId: 19438,
      adminConfig: [Object],
      effectiveAt: '2022-05-07T13:48:57+00:00',
      productSummary: [Object],
      productOverview: [Object],
      externalProductId: '97ad4442-1596-42f9-adc4-1593845a99e7',
      promotionalPolicies: [Object],
      postPromotionalPolicies: [Object],
      productLifecyclePolicies: [Object]
    },
    {
      createdAt: '2022-05-07T13:41:26+00:00',
      productId: 19437,
      adminConfig: [Object],
      effectiveAt: '2022-05-07T13:41:23+00:00',
      productSummary: [Object],
      productOverview: [Object],
      externalProductId: '9dec4e99-8d72-44b2-a9d6-7da9a989c643',
      promotionalPolicies: [Object],
      postPromotionalPolicies: [Object],
      productLifecyclePolicies: [Object]
    },
    {
      createdAt: '2022-05-05T11:07:19+00:00',
      productId: 19410,
      adminConfig: [Object],
      effectiveAt: '2022-05-05T11:07:17+00:00',
      productSummary: [Object],
      productOverview: [Object],
      externalProductId: '9e58d8ab-fa75-45ca-830e-7111b68c90f7',
      promotionalPolicies: [Object],
      postPromotionalPolicies: [Object],
      productLifecyclePolicies: [Object]
    }
  ],
  paging: {
    hasMore: false,
    endingBefore: 'VTJGc2RHVmt',
    startingAfter: 'VTJGc2RHVmtY'
  }
}
```


#### []()

You can get a list of all Products at Canopy with no arguments:

```typescript
const resp = await client.product.list()
```

and the result will look something like:

```javascript
{
  success: true,
}
```










## Development

For those interested in working on the library, there are a few things that
will make that job a little simpler. The organization of the code is all in
`src/`, with one module per _section_ of the Client: `product`, `account`,
etc. This makes location of the function very easy.

Additionally, the main communication with the Canopy service is in the
`src/index.ts` module in the `fire()` function. In the constructor for the
Client, each of the _sections_ are created, and then they link back to the
main class for their communication work.

### Setup

In order to work with the code, the development dependencies include `dotenv`
so that each user can create a `.env` file with a single value for working
with Canopy:

* `CANOPY_CLIENT_ID` - this is the Canopy-generated "Client ID" from the
  Canopy API Keys page.
* `CANOPY_CLIENT_SECRET` - this is the Canopy-generated "Client Secret"
  from the Canopy API Keys page.
* `CANOPY_HOST` - this is the sepcific host where calls should be sent, and
  will default to the Canopy production host, but can also be set to be the
  `sandbox` instance for testing.

### Testing

There are several test scripts that test, and validate, information on the
Canopy service exercising different parts of the API. Each is
self-contained, and can be run with:

```bash
$ npm run ts tests/products.ts

> canopy-node-client@0.1.0 ts
> ts-node -r dotenv/config "tests/product.ts"

getting list of Products...
Success! Found 1 Products.
creating new Product...
Success!
getting list of Products now...
Success! Found 2 Products.
```

Each of the tests will run a series of calls through the Client, and check the
results to see that the operation succeeded. As shown, if the steps all
report back with `Success!` then things are working.

If there is an issue with one of the calls, then an `Error!` will be printed
out, and the data returned from the client will be dumped to the console.
