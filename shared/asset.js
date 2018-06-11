import { txUtils } from 'decentraland-eth'

export const ASSET_TYPE = Object.freeze({
  parcel: 'parcel',
  estate: 'estate'
})

export function isExpired(expires_at) {
  return parseInt(expires_at, 10) < Date.now()
}

export function hasStatus(obj, status) {
  return (
    obj &&
    obj.status === status &&
    obj.tx_status === txUtils.TRANSACTION_STATUS.confirmed &&
    !isExpired(obj.expires_at)
  )
}
