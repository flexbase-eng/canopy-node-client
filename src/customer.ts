import type { Canopy, CanopyOptions, CanopyError, CanopyPaging } from './'
import type { Account } from './account'
import type { Product } from './product'


export interface BaseCustomer {
  addressLineOne: string;
  addressLineTwo?: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressCountryCode?: string;
  namePrefix?: string;
  nameFirst?: string;
  nameMiddle?: string;
  nameLast?: string;
  nameSuffix?: string;
  passport?: {
    number: string;
    country: string;
  };
  title?: string;
  phoneNumber: string;
  ssn?: string;
}

export interface Customer extends BaseCustomer {
  customerId?: string;
  customerType?: string;
  verificationStatus?: string;
  internationalCustomerId?: string;
  email: string;
  dateOfBirth: string;
  businessDetails?: Business;
  assignToAccounts?: AccountRef[];
}

export interface BeneficialOwner extends Customer {
  beneficialOwnerId?: string;
}

export interface Business {
  businessLegalName: string;
  doingBusinessAs?: string;
  businessEin: string;
  businessType?: string;
  businessClassificationId?: string;
  website?: string;
  controller?: BaseCustomer;
}

export interface AccountRef {
  accountId: string | number;
  customerAccountRole?: string;
  customerAccountExternalId?: string | number;
}

export interface CustomerAndAccount extends Customer {
  customerAccountRole?: string;
  customerAccountExternalId?: string | number;
  account: Account;
}

import { isEmpty } from './'

export class CustomerApi {
  client: Canopy;

  constructor(client: Canopy, _options?: CanopyOptions) {
    this.client = client
  }

  /*
   * Function to get a list of all available Customers with their associated
   * Accounts in the system at this time. This may result in duplicate
   * Customers and Accounts as they are retured in 'pairs', so that the
   * duplication is to be expected.
   */
  async listAll(options: {
    limit?: number,
    startingAfter?: string,
    endingBefore?: string,
    searchParameters?: string,
  } = {}): Promise<{
    success: boolean,
    pairs?: CustomerAndAccount[],
    error?: CanopyError,
    paging?: CanopyPaging,
  }> {
    // update defaults for the call...
    options.limit ??= 50
    // ...and then make the call
    const resp = await this.client.fire(
      'GET',
      'customers/accounts',
      options,
    )
    if ((resp?.response?.status >= 400) || !isEmpty(resp?.payload?.error)) {
      const deets = !isEmpty(resp?.payload?.error) ? resp?.payload?.error : resp?.payload
      return {
        success: false,
        error: {
          type: 'canopy',
          ...deets
        },
      }
    }
    return {
      success: true,
      pairs: resp?.payload?.results,
      paging: resp?.payload?.paging,
    }
  }

  /*
   * Function to take the attributes of a new Customer, and create that.
   * It allows for the 'customerId' to be set on the call, so that you
   * can pass in useful ids to later look things up on. If you supply
   * a value for the 'customerId', it will be returned as the
   * 'externalCustomerId' - and the 'customerId' will be a Canopy-generated
   * integer. Just so you know what to expect.
   */
  async create(data: Partial<Customer>): Promise<{
    success: boolean,
    customer?: Customer,
    error?: CanopyError,
  }> {
    // fix some of the data that should be pretty obvious
    if (!isEmpty(data?.businessDetails?.businessLegalName) &&
        isEmpty(data?.businessDetails?.doingBusinessAs)) {
      data.businessDetails!.doingBusinessAs = data.businessDetails!.businessLegalName
    }
    // ... now make the call
    const resp = await this.client.fire(
      'POST',
      'customers',
      undefined,
      data,
    )
    console.log('PAYLOAD', resp?.payload)
    if ((resp?.response?.status >= 400) || !isEmpty(resp?.payload?.error)) {
      const deets = !isEmpty(resp?.payload?.error) ? resp?.payload?.error : resp?.payload
      return {
        success: false,
        error: {
          type: 'canopy',
          ...deets
        },
      }
    }
    return { success: true, customer: resp.payload }
  }

  /*
   * Function to update a Customer at Canopy where the 'customerId' has
   * to point to an existing Customer, and the data can be the new values
   * for that Customer.
   */
  async update(customerId: string, data: Partial<Customer>): Promise<{
    success: boolean,
    customer?: Customer,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'PUT',
      `customers/${customerId}`,
      undefined,
      data,
    )
    if ((resp?.response?.status >= 400) || !isEmpty(resp?.payload?.error)) {
      const deets = !isEmpty(resp?.payload?.error) ? resp?.payload?.error : resp?.payload
      return {
        success: false,
        error: {
          type: 'canopy',
          ...deets
        },
      }
    }
    return { success: true, customer: resp.payload }
  }

  /*
   * Function to list all of the Beneficial Owners of Business as they
   * have been registered as that with a call to 'createOwner()', below.
   * The 'customerId' should point to an existing Customer whose 'customerType'
   * is 'business'.
   */
  async listOwners(customerId: string): Promise<{
    success: boolean,
    owners?: BeneficialOwner[],
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `customers/${customerId}/beneficial_owners`,
    )
    if ((resp?.response?.status >= 400) || !isEmpty(resp?.payload?.error)) {
      const deets = !isEmpty(resp?.payload?.error) ? resp?.payload?.error : resp?.payload
      return {
        success: false,
        error: {
          type: 'canopy',
          ...deets
        },
      }
    }
    return { success: true, owners: resp.payload }
  }

  /*
   * Function to create a new Beneficial Owner for a Business. The 'customerId'
   * should point to an existing Customer whose 'customerType' is 'business'.
   */
  async createOwner(customerId: string, data: Partial<BeneficialOwner>): Promise<{
    success: boolean,
    owner?: BeneficialOwner,
    error?: CanopyError,
  }> {
    // fix some of the data that should be pretty obvious
    if (!isEmpty(data?.businessDetails?.businessLegalName) &&
        isEmpty(data?.businessDetails?.doingBusinessAs)) {
      data.businessDetails!.doingBusinessAs = data.businessDetails!.businessLegalName
    }
    // ... now make the call
    const resp = await this.client.fire(
      'POST',
      `customers/${customerId}/beneficial_owners`,
      undefined,
      data,
    )
    if ((resp?.response?.status >= 400) || !isEmpty(resp?.payload?.error)) {
      const deets = !isEmpty(resp?.payload?.error) ? resp?.payload?.error : resp?.payload
      return {
        success: false,
        error: {
          type: 'canopy',
          ...deets
        },
      }
    }
    return { success: true, owner: resp.payload }
  }
}
