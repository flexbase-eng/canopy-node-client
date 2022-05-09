import fetch from 'node-fetch'
import FormData = require('formdata')
import path from 'path'
import camelCaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'


import { AuthenticationApi } from './authentication'
import { ProductApi } from './product'
import { CustomerApi } from './customer'
import { AccountApi } from './account'
import { LineItemApi } from './line-item'

const ClientVersion = require('../package.json').version
const PROTOCOL = 'https'
const CANOPY_HOST = 'api.canopyservicing.com'

/*
 * These are the acceptable options to the creation of the Client:
 *
 *   {
 *     host: "uat.canopysericing.com/api",
 *     clientId: "abcdefg123456xyz",
 *     clientSecret: "5544667722abcdef",
 *   }
 *
 * and the construction of the Client will use this data for all
 * calls made to Canopy.
 */
export interface CanopyOptions {
  host?: string;
  clientId?: string;
  clientSecret?: string;
}

/*
 * These are the standard error objects from Canopy - and will be returned
 * from Canopy for any bad condition. We will allow these - as well as just
 * strings in the errors being returned from the calls.
 */
export interface CanopyError {
  type: string;
  code?: string;
  message?: string;
  helpUrl?: string;
  details?: CanopyErrorDetail[];
}

export interface CanopyErrorDetail {
  instancePath?: string;
  schemaPath?: string;
  keyword?: string;
  params?: any;
  message?: string;
}

/*
 * These are the standard paging parameters from Canopy - and will be returned
 * from Canopy for any list-like request. We will keep these as-is, so the
 * caller can understand what the data set looks like in a little more detail.
 */
export interface CanopyPaging {
  hasMore: boolean;
  startingAfter?: string;
  endingBefore?: string;
}

/*
 * This is used in several of the modules, and to avoid circular referencing,
 * let's put it here in the root module, and let folks pull it in as needed.
 */
export interface ExternalField {
  key: string;
  value: string;
}

/*
 * This is the main constructor of the Canopy Client, and will be called
 * with something like:
 *
 *   import { Canopy } from "canopy-node-client"
 *   const client = new Canopy({
 *     clientId: '54321dcba77884',
 *     clientSecret: '4433221',
 *   })
 */
export class Canopy {
  host: string
  clientId: string
  clientSecret: string
  authentication: AuthenticationApi
  product: ProductApi
  customer: CustomerApi
  account: AccountApi
  lineItem: LineItemApi

  constructor (clientId: string, clientSecret: string, options?: CanopyOptions) {
    this.host = options?.host || CANOPY_HOST
    this.clientId = options?.clientId || clientId
    this.clientSecret = options?.clientSecret || clientSecret
    // now construct all the specific domain objects
    this.authentication = new AuthenticationApi(this, options)
    this.product = new ProductApi(this, options)
    this.customer = new CustomerApi(this, options)
    this.account = new AccountApi(this, options)
    this.lineItem = new LineItemApi(this, options)
  }

  /*
   * Function to fire off a GET, PUT, POST, (method) to the uri, preceeded
   * by the host, with the optional query params, and optional body, and
   * puts the 'apiKey' into the headers for the call, and fires off the call
   * to the Peach host and returns the response.
   */
  async fire(
    method: string,
    uri: string,
    query?: { [index: string] : number | string | string[] | boolean },
    body?: object | object[] | FormData,
  ): Promise<{ response: any, payload?: any }> {
    // build up the complete url from the provided 'uri' and the 'host'
    let url = new URL(PROTOCOL+'://'+path.join(this.host, uri))
    if (query) {
      query = snakecaseKeys(query)
      Object.keys(query).forEach(k => {
        if (something(query![k])) {
          url.searchParams.append(k, query![k].toString())
        }
      })
    }
    const isForm = isFormData(body)
    // make the appropriate headers
    let headers = {
      Accept: 'application/json',
      'X-Canopy-Client-Ver': ClientVersion,
    } as any
    if (!isForm) {
      headers = { ...headers, 'Content-Type': 'application/json' }
    }
    // allow a few retries on the authentication token expiration
    let response
    for (let cnt = 0; cnt < 3; cnt++) {
      if (uri !== 'auth/token' || method !== 'POST') {
        const auth = await this.authentication.checkToken()
        if (!auth?.success) {
          return { response: { payload: auth } }
        }
        headers = { ...headers, 'Authorization': 'Bearer ' + this.authentication.accessToken }
      }
      // now we can make the call... see if it's a JSON body or a FormData one...
      try {
        response = await fetch(url, {
          method: method,
          body: isForm ?
            (body as any) :
            (body ? JSON.stringify(snakecaseKeys(body)) : undefined),
          headers,
        })
        const payload = declutter(camelCaseKeys((await response?.json()), { deep: true }))
        // check for an invalid token from the service
        if (response.status == 403 && payload?.error?.code === 'not_authorized') {
          const auth = await this.authentication.resetToken()
          if (!auth?.success) {
            return { response: { ...response, payload: auth } }
          }
          // ...and try it all again... :)
          continue
        }
        return { response, payload }
      } catch (err) {
        return { response }
      }
    }
    // this will mean we retried, and still failed
    return { response }
  }
}

/*
 * Simple function used to weed out undefined and null query params before
 * trying to place them on the call.
 */
function something(arg: any) {
  return arg || arg === false || arg === 0 || arg === ''
}

/*
 * Function to examine the argument and see if it's 'empty' - and this will
 * work for undefined values, and nulls, as well as strings, arrays, and
 * objects. If it's a regular data type - then it's "not empty" - but this
 * will help know if there's something in the data to look at.
 */
export function isEmpty(arg: any): boolean {
  if (arg === undefined || arg === null) {
    return true
  } else if (typeof arg === 'string' || Array.isArray(arg)) {
    return arg.length == 0
  } else if (typeof arg === 'object') {
    return Object.keys(arg).length == 0
  }
  return false
}

/*
 * Simple predicate function to return 'true' if the argument is a FormData
 * object - as that is one of the possible values of the 'body' in the fire()
 * function. We have to handle that differently on the call than when it's
 * a more traditional JSON object body.
 */
function isFormData(arg: any): boolean {
  let ans = false
  if (arg && typeof arg === 'object') {
    ans = (typeof arg._boundary === 'string' &&
           arg._boundary.length > 20 &&
           Array.isArray(arg._streams))
  }
  return ans
}

/*
 * Convenience function to create a PeachError based on a simple message
 * from the Client code. This is an easy way to make CanopyError instances
 * from the simple error messages we have in this code.
 */
export function mkError(message: string): CanopyError {
  return {
    type: 'client',
    message,
  }
}

/*
 * Function to recursively remove all the 'empty' values from the provided
 * Object and return what's left. This will not cover the complete boolean
 * falsey set.
 */
export function removeEmpty(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(itm => removeEmpty(itm)) }
  else if (typeof obj === 'object') {
    return Object.entries(obj)
      .filter(([_k, v]) => !isEmpty(v))
      .reduce(
        (acc, [k, v]) => (
          { ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }
        ), {}
      )
  }
  return obj
}

/*
 * Canopy has several standard fields in their responses - mostly associated
 * with the 'paging' data, and it makes sense to clear out empty values and
 * "declutter" the response data for the caller, that's what this function is
 * doing.
 */
export function declutter(arg: any): any {
  // see if we have anything to do at all...
  if (isEmpty(arg) || typeof arg !== 'object') {
    return arg
  }
  // make a copy of the argument, and then clean up what's needed
  let ret = { ...arg }
  if (!isEmpty(ret.paging)) {
    ret.paging = removeEmpty(ret.paging)
  }
  return ret
}
