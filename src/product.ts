import type {
  Canopy,
  CanopyOptions,
  CanopyError,
  CanopyPaging,
  ExternalField,
} from './'

export interface Product {
  effectiveAt?: string;
  productId?: string | number;
  externalProductId?: string | number;
  productOverview: {
    productName: string;
    productType: string;
    productShortDescription: string;
    productLongDescription: string;
    productColor?: string;
    externalFields?: ExternalField[];
  };
  productLifecyclePolicies: ProductLifecyclePolicies;
  promotionalPolicies: PromotionalPolicies;
  postPromotionalPolicies?: PostPromotionalPolicies;
  productSummary?: {
    accountsOverview?: {
      accountCountTotal: number;
    };
  };
  admin?: {
    migrationMode?: boolean;
  };
}

export interface ProductLifecyclePolicies {
  paymentDuePolicies?: {
    delinquentOnNConsecutiveLateFees?: number;
    chargeOffOnNConsecutiveLateFees?: number;
  };
  paymentPouringPolicies?: {
    pendingPmtOffectsAvailCredit?: boolean;
  };
  feePolicies?: {
    lateFeeGrace?: string;
    surchargeFeeInterval?: string;
    defaultSurchargeFeeStructure?: Surcharge[];
  };
  billingCyclePolicies?: {
    cycleInterval: string;
    cycleDueInterval?: string;
    firstCycleInterval?: string;
    closeOfBusinessTime?: string;
    productTimeZone?: string;
  };
  interestPolicies?: {
    interestCalcTime?: string;
    interestCalcMethod?: string;
  };
  defaultAttributes?: {
    defaultCreditLimitCents: number;
    defaultLateFeeCents?: number;
    defaultPaymentReversalFeeCents?: number;
  };
}

export interface Surcharge {
  surchargeStartInclusiveCents: number;
  surchargeEndExclusiveCents?: number;
  percentSurcharge: number;
}

export interface PromotionalPolicies {
  promoLen?: number;
  promoMinPayType?: string;
  promoMinPayFloorCents?: number;
  promoMinPayPercent?: number;
  promoPurchaseWindowLen?: number;
  promoInterestDeferred?: boolean;
  promoResetOnFirstCharge?: boolean;
  promoDefaultInterestRatePercent?: number;
  promoAprRangeInclusiveLower?: number;
  promoAprRangeInclusiveUpper?: number;
}

export interface PostPromotionalPolicies {
  postPromoLen?: number;
  postPromoAmLenRangeInclusiveLower?: number;
  postPromoAmLenRangeInclusiveUpper?: number;
  postPromoMinPayType?: string;
  postPromoDefaultInterestRatePercent?: number;
  postPromoAprRangeInclusiveLower?: number;
  postPromoAprRangeInclusiveUpper?: number;
}

import { isEmpty } from './'

export class ProductApi {
  client: Canopy;

  constructor(client: Canopy, _options?: CanopyOptions) {
    this.client = client
  }

  /*
   * Function to get a list of all available Products in the system at this
   * time.
   */
  async list(options: {
    limit?: number,
    startingAfter?: string,
    endingBefore?: string,
  } = {}): Promise<{
    success: boolean,
    products?: Product[],
    error?: CanopyError,
    paging?: CanopyPaging,
  }> {
    // update defaults for the call...
    options.limit ??= 50
    // ...and then make the call
    const resp = await this.client.fire(
      'GET',
      'products',
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
      products: resp?.payload?.results,
      paging: resp?.payload?.paging,
    }
  }

  /*
   * Function to take the attributes of a new Product, and create that.
   * It allows for the 'productId' to be set on the call, so that you
   * can pass in useful ids to later look things up on. If you supply
   * a value for the 'productId', it will be returned as the
   * 'externalProductId' - and the 'productId' will be a Canopy-generated
   * integer. Just so you know what to expect.
   */
  async create(data: Partial<Product>): Promise<{
    success: boolean,
    product?: Product,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      'products',
      undefined,
      { ...data },
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
    return { success: true, product: resp.payload }
  }
}
