/**
 * Payment Provider Abstraction Layer & Integration Interface
 * UNSP International Research Fellowship
 *
 * Implements provider-agnostic payment processing, secure webhook simulation,
 * EMI calculations, and idempotency protection without exposing API secrets in client code.
 */

import {
  Order,
  PaymentProviderConfig,
  EmiPlan,
  PaymentMethodCategory,
  Stage3PaymentStatus,
  OrderStatus
} from '../types';

export interface CreateOrderParams {
  userId: string;
  applicationId: string;
  fellowshipId: string;
  fellowshipName: string;
  amount: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  paymentMethod: PaymentMethodCategory;
  emiPlanId?: string;
  idempotencyKey?: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  orderId: string;
  providerPaymentId: string;
  amount: number;
  currency: string;
  paymentStatus: Stage3PaymentStatus;
  orderStatus: OrderStatus;
  message: string;
  isTestMode: boolean;
}

export interface WebhookPayload {
  eventId: string;
  event: 'payment.captured' | 'payment.failed' | 'refund.processed';
  provider: string;
  timestamp: string;
  signature: string;
  data: {
    orderId: string;
    providerOrderId: string;
    paymentId: string;
    amount: number;
    currency: string;
    status: string;
  };
}

// Default Configuration with Masked Secrets
export const DEFAULT_PAYMENT_CONFIG: PaymentProviderConfig = {
  activeProvider: 'sandbox',
  testMode: true,
  currency: 'INR',
  supportedMethods: {
    upi: true,
    indian_credit_card: true,
    indian_debit_card: true,
    international_credit_card: true,
    international_debit_card: true,
    net_banking: true,
    wallets: true,
    emi: true,
    financing: true
  },
  emiEnabled: true,
  financingEnabled: true,
  maskedKeyId: '••••••••••••••••34a1',
  maskedWebhookSecret: '••••••••••••••••99f2',
  autoEnrollOnPayment: true,
  invoicePrefix: 'UNSP-INV-2026-',
  taxNotice:
    'Tax details, where applicable, are determined according to applicable rules and the final invoice configuration.'
};

export const STANDARD_PROGRAMME_FEE_INR = 150000;

export const CURRENCY_CONVERSIONS: Record<'INR' | 'USD' | 'EUR' | 'GBP', { symbol: string; rate: number; display: string }> = {
  INR: { symbol: '₹', rate: 1, display: '₹1,50,000' },
  USD: { symbol: '$', rate: 0.012, display: '$1,800 USD' },
  EUR: { symbol: '€', rate: 0.011, display: '€1,650 EUR' },
  GBP: { symbol: '£', rate: 0.0095, display: '£1,425 GBP' }
};

// Provider-Calculated EMI Plans for ₹1,50,000
export const STANDARD_EMI_PLANS: EmiPlan[] = [
  {
    id: 'emi-3m',
    months: 3,
    providerName: 'Participating Card & Payment Providers',
    interestRateAnnual: 12.0,
    monthlyInstallment: 51004,
    totalPayable: 153012,
    processingFee: 199,
    isNoCost: false,
    eligibilityConditions: 'Available on major Indian credit cards and selected debit cards subject to bank eligibility.'
  },
  {
    id: 'emi-6m',
    months: 6,
    providerName: 'Participating Card & Payment Providers',
    interestRateAnnual: 13.5,
    monthlyInstallment: 25997,
    totalPayable: 155982,
    processingFee: 199,
    isNoCost: false,
    eligibilityConditions: 'Available on participating credit cards subject to bank terms and credit limits.'
  },
  {
    id: 'emi-9m',
    months: 9,
    providerName: 'Participating Card & Payment Providers',
    interestRateAnnual: 14.0,
    monthlyInstallment: 17652,
    totalPayable: 158868,
    processingFee: 299,
    isNoCost: false,
    eligibilityConditions: 'Available on participating credit cards. Processing fee applied by issuing bank.'
  },
  {
    id: 'emi-12m',
    months: 12,
    providerName: 'Participating Card & Payment Providers',
    interestRateAnnual: 15.0,
    monthlyInstallment: 13540,
    totalPayable: 162480,
    processingFee: 299,
    isNoCost: false,
    eligibilityConditions: 'Available on participating credit cards. Total payable includes bank interest and processing fees.'
  }
];

class PaymentProviderService {
  private config: PaymentProviderConfig = DEFAULT_PAYMENT_CONFIG;
  private processedIdempotencyKeys = new Set<string>();

  getConfig(): PaymentProviderConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<PaymentProviderConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Generates a unique, idempotent Order
   */
  async createPaymentOrder(params: CreateOrderParams): Promise<Order> {
    const idempotency = params.idempotencyKey || `idem-${Date.now()}-${Math.random()}`;

    if (this.processedIdempotencyKeys.has(idempotency)) {
      throw new Error('Duplicate payment request detected. Please refresh your order.');
    }
    this.processedIdempotencyKeys.add(idempotency);

    const orderNumber = `ORD-UNSP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedEmi = params.emiPlanId
      ? STANDARD_EMI_PLANS.find((e) => e.id === params.emiPlanId)
      : undefined;

    const order: Order = {
      id: `ord-${Date.now()}`,
      orderId: orderNumber,
      userId: params.userId,
      applicationId: params.applicationId,
      fellowshipId: params.fellowshipId,
      fellowshipName: params.fellowshipName,
      amount: params.amount,
      currency: params.currency,
      paymentMethod: params.paymentMethod,
      provider: this.config.activeProvider,
      providerOrderId: `prov_${this.config.activeProvider}_${Date.now()}`,
      paymentStatus: 'Payment Pending',
      orderStatus: 'Created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      invoiceId: `${this.config.invoicePrefix}${orderNumber.split('-').pop()}`,
      emiPlan: selectedEmi,
      isTestMode: this.config.testMode,
      idempotencyKey: idempotency
    };

    return order;
  }

  /**
   * Simulates secure server-side/provider payment verification
   */
  async verifyPayment(
    order: Order,
    simulationOutcome: 'success' | 'failed' | 'cancelled' = 'success'
  ): Promise<PaymentVerificationResult> {
    // Artificial slight delay for realistic network verification
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (simulationOutcome === 'failed') {
      return {
        verified: false,
        orderId: order.orderId,
        providerPaymentId: `pay_fail_${Date.now()}`,
        amount: order.amount,
        currency: order.currency,
        paymentStatus: 'Payment Failed',
        orderStatus: 'Failed',
        message: 'Payment authorization declined by issuing bank/provider.',
        isTestMode: order.isTestMode
      };
    }

    if (simulationOutcome === 'cancelled') {
      return {
        verified: false,
        orderId: order.orderId,
        providerPaymentId: `pay_canc_${Date.now()}`,
        amount: order.amount,
        currency: order.currency,
        paymentStatus: 'Payment Cancelled',
        orderStatus: 'Cancelled',
        message: 'Payment session cancelled by user or expired by gateway.',
        isTestMode: order.isTestMode
      };
    }

    const providerPaymentId = `pay_${this.config.activeProvider}_${Date.now()}_succ`;

    return {
      verified: true,
      orderId: order.orderId,
      providerPaymentId,
      amount: order.amount,
      currency: order.currency,
      paymentStatus: 'Payment Successful',
      orderStatus: 'Paid',
      message: 'Payment verified successfully through payment provider signature.',
      isTestMode: order.isTestMode
    };
  }

  /**
   * Validates webhook HMAC signature (simulated server check)
   */
  verifyWebhookSignature(payload: WebhookPayload): boolean {
    if (!payload.signature || payload.signature.length < 16) {
      return false;
    }
    // Strict requirement: Never trust unsigned webhooks
    return payload.signature.startsWith('sha256=');
  }

  /**
   * Generates a sample webhook payload for sandbox testing
   */
  generateTestWebhook(order: Order, event: 'payment.captured' | 'payment.failed'): WebhookPayload {
    return {
      eventId: `evt_${Date.now()}`,
      event,
      provider: this.config.activeProvider,
      timestamp: new Date().toISOString(),
      signature: `sha256=mock_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      data: {
        orderId: order.orderId,
        providerOrderId: order.providerOrderId || `prov_${Date.now()}`,
        paymentId: `pay_${Date.now()}`,
        amount: order.amount,
        currency: order.currency,
        status: event === 'payment.captured' ? 'captured' : 'failed'
      }
    };
  }
}

export const paymentProviderService = new PaymentProviderService();
