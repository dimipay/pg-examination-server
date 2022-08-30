type MapString<T extends string> = Record<T, string>

export type BillKeyRes = MapString<
  | 'resultCode'
  | 'resultMsg'
  | 'tid'
  | 'orderId'
  | 'bid'
  | 'authDate'
  | 'cardCode'
  | 'cardName'
>

export type BillkeyApprovalRes = {
  status:
    | 'paid'
    | 'ready'
    | 'failed'
    | 'cancelled'
    | 'partialCancelled'
    | 'expired'
} & { amount: number } & MapString<
    | 'resultCode'
    | 'resultMsg'
    | 'tid'
    | 'orderId'
    | 'ediDate'
    | 'paidAt'
    | 'failedAt'
    | 'cancelledAt'
    | 'payMethod'
    | 'balanceAmt'
    | 'goodsName'
  >

export type BillkeyCancelRes = MapString<
  | 'ResultCode'
  | 'ResultMsg'
  | 'ErrorCD'
  | 'ErrorMsg'
  | 'CancelAmt'
  | 'MID'
  | 'Moid'
  | 'Signature'
>
