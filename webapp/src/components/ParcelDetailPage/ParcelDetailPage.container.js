import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getParams } from 'modules/location/reducer'
import { getWallet } from 'modules/wallet/reducer'
import { isLoading as isAddressLoading } from 'modules/address/reducer'
import { getParcels, getError as getParcelError } from 'modules/parcels/reducer'
import { getDistricts } from 'modules/districts/reducer'
import { fetchWallet } from 'modules/wallet/actions'
import { fetchParcel } from 'modules/parcels/actions'
import { openModal } from 'modules/ui/actions'
import { navigateTo } from 'modules/location/actions'

import { buildCoordinate } from 'lib/utils'

import ParcelDetailPage from './ParcelDetailPage'

const mapState = (state, ownProps) => {
  const { x, y } = getParams(ownProps)
  const parcels = getParcels(state)
  const parcel = parcels[buildCoordinate(x, y)]

  return {
    wallet: getWallet(state),
    districts: getDistricts(state),
    isAddressLoading: isAddressLoading(state),
    isParcelError: !!getParcelError(state),
    parcel,
    x,
    y
  }
}

const mapDispatch = dispatch => ({
  onNavigate: location => dispatch(navigateTo(location)),
  onConnect: () => dispatch(fetchWallet()),
  onFetchParcel: (x, y) => dispatch(fetchParcel(x, y)),
  onTransfer: parcel => dispatch(openModal('TransferModal', parcel))
})

export default withRouter(connect(mapState, mapDispatch)(ParcelDetailPage))
