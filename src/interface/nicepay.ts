type MapString<T extends string> = Record<T, string>

export type BillKeyRes = MapString<
  | 'ResultCode'
  | 'ResultMsg'
  | 'TID'
  | 'BID'
  | 'AuthDate'
  | 'CardCode'
  | 'CardName'
  | 'CardCl'
  | 'AcquCardCode'
  | 'AcquCardName'
>

export type BillkeyApprovalRes = MapString<
  | 'ResultCode'
  | 'ResultMsg'
  | 'TID'
  | 'Moid'
  | 'Amt'
  | 'AuthCode'
  | 'AuthDate'
  | 'AcquCardCode'
  | 'AcquCardName'
  | 'CardNo'
  | 'CardCode'
  | 'CardName'
  | 'CardQuota'
  | 'CardCl'
  | 'CardInterest'
  | 'CardCl'
  | 'CardInterest'
  | 'CcPartCl'
  | 'MallReserved'
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
