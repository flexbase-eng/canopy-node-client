import type {
  Canopy,
  CanopyOptions,
  CanopyError,
  CanopyPaging,
  ExternalField,
} from './'

export interface LineItem {
  accountId: string | number;
  lineItemId: string;
  effectiveAt?: string;
  created_at?: string;
  product_id: string;
  lineItemOverview?: {
    lineItemStatus?: string;
    line_item_type: string;
    description?: string;
  };
  lineItemSummary?: LineItemSummary;
  merchantData?: MerchantData;
  issuerProcessorDetails?: {
    lithic?: {
      lastFour?: string;
      transactionToken?: string;
      cardToken?: string;
    };
  };
  externalFields?: ExternalField[];
}

export interface LineItemSummary {
  originalAmountCents?: number;
  balanceCents?: number;
  principalCents?: number;
  interestBalanceCents?: number;
  amInterestBalanceCents?: number;
  deferredInterestBalanceCents?: number;
  amDeferredInterestBalanceCents?: number;
  totalInterestPaidToDateCents?: number;
}

export interface MerchantData {
  name?: string;
  id?: string;
  mccCode?: string;
  phoneNumber?: string;
}

export interface LineItemCharge {
  lineItemId?: string;
  lineItemStatus?: string;
  originalAmountCents: number;
  effectiveAt?: string;
  merchantData?: MerchantData;
  issuerProcessorMetadata?: {
    lithic?: {
      lastFour?: string;
    }
  };
  externalFields?: ExternalField[];
}

export interface LineItemPayment {
  lineItemId?: string;
  lineItemStatus?: string;
  originalAmountCents: number;
  effectiveAt?: string;
  externalFields?: ExternalField[];
}

export interface LineItemOffset {
  line_item_id?: string;
  original_amount_cents: number;
  effective_at?: string;
  allocation?: string;
  external_fields?: ExternalField[];
}

export interface LineItemRefund {
  lineItemId?: string;
  lineItemStatus?: string;
  originalAmountCents: number;
  effectiveAt?: string;
  merchantData?: MerchantData;
  externalFields?: ExternalField[];
}

import { isEmpty } from './'

export class LineItemApi {
  client: Canopy;

  constructor(client: Canopy, _options?: CanopyOptions) {
    this.client = client
  }

  /*
   * Function to get a list of all available Line Items for the provided
   * 'accountId' in the system at this time.
   */
  async get(accountId: string | number, options: {
    limit?: number,
    startingAfter?: string,
    endingBefore?: string,
  } = {}): Promise<{
    success: boolean,
    lineItems?: LineItem[],
    error?: CanopyError,
    paging?: CanopyPaging,
  }> {
    // update defaults for the call...
    options.limit ??= 200
    // ...and then make the call
    const resp = await this.client.fire(
      'GET',
      `accounts/${accountId}/line_items`,
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
      lineItems: resp?.payload?.results,
      paging: resp?.payload?.paging,
    }
  }

  /*
   * Function to get an 'accountId' and 'lineItemId' for a Line Item on that
   * Account, and return it to the caller. This seems to be returned as an
   * array of LineItems, which is just their convention.
   */
  async byId(accountId: string | number, lineItemId: string, options: {
    limit?: number,
    startingAfter?: string,
    endingBefore?: string,
  } = {}): Promise<{
    success: boolean,
    lineItems?: LineItem[],
    error?: CanopyError,
    paging?: CanopyPaging,
  }> {
    // update defaults for the call...
    options.limit ??= 200
    // ...and then make the call
    const resp = await this.client.fire(
      'GET',
      `accounts/${accountId}/line_items/${lineItemId}`,
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
      lineItems: resp?.payload?.results,
      paging: resp?.payload?.paging,
    }
  }

  /*
   * Function to take an 'accountId' and a 'lineItemId' for a Line Item on
   * the Account, and a new 'lineItemStatus' for that Line Item, and update
   * that Line Item status in the system. This will return the updated Line
   * Item to the caller.
   */
  async updateStatus(accountId: string | number, lineItemId: string, lineItemStatus: string): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'PUT',
      `accounts/${accountId}/line_items/${lineItemId}`,
      undefined,
      { lineItemStatus },
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and the details for a Line Item charge
   * for that Account, and then creates that specific Line Item configured
   * as a Charge.
   */
  async createCharge(accountId: string | number, data: Partial<LineItemCharge>): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/charges`,
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and the details for a Line Item Payment
   * for that Account, and then creates that specific Line Item configured
   * as a Payment. The Canopy docs describe it as:
   *
   *   Canopy will simply record the payment details in the system of record
   *   without attempting to leverage the payment processing configuration
   *   to initiate the actual transaction.
   */
  async createPayment(accountId: string | number, data: Partial<LineItemPayment>): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/payments/payment_record`,
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and the details for a Line Item Payment
   * for that Account, and then creates that specific Line Item configured
   * as a Payment. The Canopy docs describe it as:
   *
   *   Canopy will first try to execute a payment via the account or
   *   payment's payment processor configuration, and then store the
   *   corresponding record in Canopy's system.
   */
  async executePayment(accountId: string | number, data: Partial<LineItemPayment>): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/payments/payment_transfer`,
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and the details for a Line Item Offset
   * for that Account, and then creates that specific Line Item configured
   * as a Credit Offset.
   */
  async addCreditOffset(accountId: string | number, data: Partial<LineItemOffset>): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/credit_offsets`,
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and the details for a Line Item Offset
   * for that Account, and then creates that specific Line Item configured
   * as a Debit Offset.
   */
  async addDebitOffset(accountId: string | number, data: Partial<LineItemOffset>): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/debit_offsets`,
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and the details for a manual Line Item
   * Fee for that Account, and then creates that specific Line Item configured
   * as a Manual Fee.
   */
  async addManualFee(accountId: string | number, data: Partial<LineItemOffset>): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/manual_fees`,
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and the details for a manual Line Item
   * Refund for that Account, and then creates that specific Line Item
   * configured as a Refund.
   */
  async addRefund(accountId: string | number, data: Partial<LineItemRefund>): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/refunds`,
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and a 'lineItemId' for a Payment Line
   * Item on that Account, and reverses that Payment.
   */
  async reversePayment(accountId: string | number, lineItemId: string, data: {
    externalFields?: ExternalField[],
  } = {}): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/payment_reversals/${lineItemId}`,
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and a 'lineItemId' for a Fee Line
   * Item on that Account, and waives that Fee.
   */
  async waiveFee(accountId: string | number, lineItemId: string, data: {
    externalFields?: ExternalField[],
  } = {}): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/fee_waiver/${lineItemId}`,
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
    return { success: true, lineItem: resp?.payload }
  }

  /*
   * Function to take an 'accountId' and a 'lineItemId' for a Charge Line
   * Item on that Account, and reverses that Charge.
   */
  async reverseCharge(accountId: string | number, lineItemId: string, data: {
    externalFields?: ExternalField[],
  } = {}): Promise<{
    success: boolean,
    lineItem?: LineItem,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/line_items/charge_reversals/${lineItemId}`,
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
    return { success: true, lineItem: resp?.payload }
  }
}
