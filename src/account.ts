import type { Canopy, CanopyOptions, CanopyError, ExternalField } from './'
import type { Customer } from './customer'

export interface Account {
  effectiveAt?: string;
  accountId: string | number;
  productId?: string | number;
  externalProductId?: string | number;
  accountOverview?: {
    accountStatus: string;
    accountStatusSubtype?: string;
    isActiveScra?: boolean;
  };
  accountProduct?: {
    productId: string | number;
    productOverview?: {
      product_name: string;
      product_color?: string;
      product_short_description?: string;
      product_long_description: string;
      product_time_zone?: string;
      product_type: string;
    };
    productLifecycle?: {
      lateFeeImplCents: number;
      defaultProductLateFeeCents?: number;
      paymentReversalFeeImplCents: number;
      defaultProductPaymentReversalFeeCents?: number;
      originationFeeImplCents?: number;
      annualFeeImplCents?: number;
      monthlyFeeImplCents?: number;
      loanEndDate?: string;
    };
    promoOverview?: {
      promoPurchaseWindowInclusiveStart?: string;
      promoPurchaseWindowExclusiveEnd?: string;
      promoInclusiveStart?: string;
      promoExclusiveEnd?: string;
      promoImplInterestRatePercent?: number;
      defaultProductPromoInterestRate?: number;
      promoLen?: number;
      defaultProductPromoLen?: number;
    };
    postPromoOverview?: {
      postPromoInclusiveStart?: string;
      postPromoExclusiveEnd?: string;
      postPromoImplInterestRatePercent?: number;
      defaultProductPostPromoInterestRate?: number;
      postPromoLen?: number;
      defaultProductPostPromoLen?: number;
    };
    productDurationInformation?: {
      promoLen?: number;
      promoPurchaseWindowLen?: number;
    };
  };
  externalFields?: ExternalField[];
  minPayDueCents?: {
    statementMinPayCents: number;
    minPayCents?: number;
    minPayDueAt?: string;
  },
  additionalMinPayDetails?: {
    minPayFeesCents?: number;
    currentMinPayCents?: number;
    unpaidMinPayCents?: number;
  },
  additionalStatementMinPayDetails?: {
    statementMinPayChargesPrincipalCents: number;
    statementMinPayInterestCents: number;
    statementMinPayAmInterestCents: number;
    statementMinPayDeferredCents: number;
    statementMinPayAmDeferredInterestCents: number;
    statementMinPayFeesCents: number;
    statementPaymentsCents: number;
    previousStatementMinPayCents: number;
    statementCurrentMinPayCents?: number;
    statementUnpaidMinPayCents?: number;
  },
  paymentProcessorConfig?: PaymentProcessorConfig;
  disbursementsConfig?: {
    disbursementSourcePayoutEntityId?: string;
    disbursementSplitPercentages?: {
      principal?: PayoutSplitPercent[];
    };
  };
  payoutsConfig?: {
    payoutSplitPercentages?: {
      principal: PayoutSplitPercent[];
      interest: PayoutSplitPercent[];
      fee: PayoutSplitPercent[];
    }[];
  };
  issuerProcessorDetails?: {
    lithic?: {
      accountToken?: string;
    };
  };
  cycleType?: {
    firstCycleInterval?: string;
    lateFeeGrace?: string;
  };
  discounts?: {
    prepaymentDiscountConfig?: {
      loadDiscountCents?: number;
      loanDiscountAt?: string;
    };
  };
  summary?: AccountSummary;
  associatedEntities?: {
    merchantName?: string;
    lenderName?: string;
  };
  plaidConfig?: {
    plaidAccessToken?: string;
    plaidAccountId?: string;
    checkBalanceEnabled?: boolean;
  };
  payoutEntities?: any;
  cards?: Card[];
  customers: Customer[];
  promoOverview?: PromoOverview;
  postPromoOverview?: {
    postPromoImplInterestRatePercent?: number;
    postPromoLen?: number;
  };
  assignCustomers?: {
    customerId: string;
    customerAccountRole?: string;
    customerAccountExternalId?: string;
  }[];
}

export interface PaymentProcessorConfig {
  ach?: PaymentAchConfig;
  debitCard?: PaymentDebitCardConfig;
  creditCard?: PaymentCreditCardConfig;
  autopayEnabled?: boolean;
  defaultPaymentProcessorMethod?: string;
}

export interface PaymentAchConfig {
  paymentProcessorName: string;
  repayConfig?: {
    repayCardNumber: string;
    repayExpDate: string;
    repayNameOnCard: string;
    repayStreet: string;
    repayZip: string;
  };
  dwollaConfig?: {
    dwollaPlaidToken: string;
  };
  modernTreasuryConfig?: {
    name: string;
    accountNumber?: string;
    accountType?: string;
    routingNumber?: string;
    plaidProcessorToken?: string;
  };
  canopyNachaConfig?: {
    bankRoutingNumber: string;
    bankAccountNumber: string;
    bankAccountType?: string;
  };
}

export interface PaymentDebitCardConfig {
  paymentProcessorName: string;
  repayConfig?: {
    repayCardNumber: string;
    repayExpDate: string;
    repayNameOnCard: string;
    repayStreet: string;
    repayZip: string;
  };
  authorizeNetConfig?: {
    cardNumber: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
  };
}

export interface PaymentCreditCardConfig {
  paymentProcessorName: string;
  checkoutConfig?: {
    sourceId?: string;
    cardToken?: string;
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
  };
}

export interface PayoutSplitPercent {
  payoutEntityId: string;
  splitPercent: number;
}

export interface AccountSummary {
  totalBalanceCents?: number;
  principalCents?: number;
  interestBalanceCents?: number;
  interestAccrualInterval?: string;
  amInterestBalanceCents?: number;
  deferredInterestBalanceCents?: number;
  amDeferredInterestBalanceCents?: number;
  feesBalanceCents?: number;
  totalPaidToDateCents?: number;
  totalInterestPaidToDateCents?: number;
  creditLimitCents: number;
  maxApprovedCreditLimitCents?: number;
  interestRatePercent?: number;
  availableCreditCents?: number;
  openToBuyCents?: number;
  totalPayoffCents?: number;
  lateFeeCapPercent?: number;
  paymentReversalFeeCapPercent?: number;
}

export interface Card {
  spendLimit?: number;
  lithic?: {
    token?: string;
    cardProgramToken?: string;
    lastFour?: string;
    type?: string;
    state?: string;
    memo?: string;
  };
}

export interface PromoOverview {
  promoLen?: number;
  promoMinPayType?: string;
  promoPurchaseWindowLen?: number;
  promoMinPayPercent?: number;
  promoImplInterestRatePercent?: number;
}

export interface TemporaryPromo {
  tempPromoId?: string;
  tempPromoInclusive_start?: string;
  tempPromoExclusiveEnd?: string;
  interestRatePercent?: number;
  interestRatePercentPrev?: number;
  lateFeeCents?: number;
  lateFeeCentsPrev?: number;
}

export interface EffectiveInterestRate {
  accountId?: string | number;
  effectiveAtInclusiveStart?: string;
  effectiveAtExclusiveEnd?: string;
  intrerestRate?: string;
  interestRateId?: string;
  tags?: {
    scra?: boolean;
  };
}

import { isEmpty } from './'

export class AccountApi {
  client: Canopy;

  constructor(client: Canopy, _options?: CanopyOptions) {
    this.client = client
  }

  /*
   * Function to take an 'accountId' for an Account, and return that Account,
   * if it exists. The Canopy docs suggest that the 'accountId' is:
   *
   *    This is the ID used to identify the account in your system. For most
   *    use-cases, we strongly recommend using the ID from the system the
   *    account was originally created in -- for most use-cases, this is
   *    created as part of the origination system that approves a borrower.
   *    This will be the account that is used to refer to the borrower for
   *    all subsequent requests. Note: both strings and integers are accepted.
   *
   * So this is something _supplied_ by the Origination system, and is used
   * in Canopy to more easily refer to the Accounts.
   */
  async byId(accountId: string | number, options?: {
    external?: boolean,
  }): Promise<{
    success: boolean,
    account?: Account,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `accounts/${accountId}`,
      options
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
    return { success: true, account: resp?.payload }
  }

  /*
   * Function to create a new Account based on the provided data. The Canopy
   * docs suggest that the 'accountId' is:
   *
   *    This is the ID used to identify the account in your system. For most
   *    use-cases, we strongly recommend using the ID from the system the
   *    account was originally created in -- for most use-cases, this is
   *    created as part of the origination system that approves a borrower.
   *    This will be the account that is used to refer to the borrower for
   *    all subsequent requests. Note: both strings and integers are accepted.
   *
   * So this is something _supplied_ by the Origination system, and is used
   * in Canopy to more easily refer to the Accounts.
   */
  async create(data: Partial<Account>): Promise<{
    success: boolean,
    account?: Account,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      'accounts',
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
    return { success: true, account: resp?.payload }
  }

  /*
   * Function to soft-delete an Account based on the provided 'accountId'.
   */
  async delete(accountId: string | number): Promise<{
    success: boolean,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'DELETE',
      `accounts/${accountId}`,
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
    return { success: true }
  }

  /*
   * Function to take an accountId and some Account status values, and update
   * the Account with that Id with these values. The return value will be
   * the updated Account.
   */
  async updateStatus(accountId: string | number, data: {
    accountStatus?: string,
    accountSubstatus?: string,
  } = {}): Promise<{
    success: boolean,
    account?: Account,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'PUT',
      `accounts/${accountId}/status`,
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
    return { success: true, account: resp?.payload }
  }

  /*
   * Function to take an accountId and some Account Payment Processor Config,
   * and update the Account with that Id with these values. The return value
   * will be the updated Payment Processor Config.
   */
  async updatePaymentProcessor(accountId: string | number, data: Partial<PaymentProcessorConfig>): Promise<{
    success: boolean,
    config?: PaymentProcessorConfig,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'PUT',
      `accounts/${accountId}/payment_processor_config`,
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
    return { success: true, config: resp?.payload }
  }

  /*
   * Function to take an accountId and return a list of Temporary Promos for
   * that Account.
   */
  async getTempPromos(accountId: string | number): Promise<{
    success: boolean,
    promos?: TemporaryPromo[],
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `accounts/${accountId}/temp_promos`,
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
    return { success: true, promos: resp?.payload?.results }
  }

  /*
   * Function to take an accountId and data for a temporary promo, and adds
   * that Temporary Promos for that Account.
   */
  async createTempPromo(accountId: string | number, _data: Partial<TemporaryPromo>): Promise<{
    success: boolean,
    promo?: TemporaryPromo,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/temp_promos`,
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
    return { success: true, promo: resp?.payload }
  }

  /*
   * Function to take an accountId and a potential time interval, and
   * returns the effective interest rate for that Account for that
   * period.
   */
  async getEffectiveInterestRate(accountId: string | number, _options: {
    effectiveAtInclusiveStart?: string,
    effectiveAtExclusiveEnd?: string,
  } = {}): Promise<{
    success: boolean,
    rates?: EffectiveInterestRate[],
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'GET',
      `accounts/${accountId}/interest_rates`,
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
    return { success: true, rates: resp?.payload }
  }

  /*
   * Function to take an accountId and an Effective Interest Rate definition,
   * and adds it to the Account specified.
   */
  async createEffectiveInterestRate(accountId: string | number, data: Partial<EffectiveInterestRate>): Promise<{
    success: boolean,
    rate?: EffectiveInterestRate,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'POST',
      `accounts/${accountId}/interest_rates`,
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
    return { success: true, rate: resp?.payload }
  }

  /*
   * Function to take an accountId and an Effective Interest Rate definition,
   * and adds it to the Account specified. The 'interestRateId' in the
   * EffectiveInterestRate argument needs to be specified so that the correct
   * rate can be updated.
   */
  async updateEffectiveInterestRate(accountId: string | number, data: Partial<EffectiveInterestRate>): Promise<{
    success: boolean,
    rate?: EffectiveInterestRate,
    error?: CanopyError,
  }> {
    const resp = await this.client.fire(
      'PUT',
      `accounts/${accountId}/interest_rates`,
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
    return { success: true, rate: resp?.payload }
  }
}
