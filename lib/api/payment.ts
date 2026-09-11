import { api } from './client';
import type { MastercardPaymentRequest, MastercardPaymentResponse } from '@/types';

export const paymentApi = {
  processMastercard: (input: MastercardPaymentRequest) =>
    api.post<MastercardPaymentResponse>('/payment/mastercard/process', input),
};
