import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { createMortgageRequest } from 'modules/mortgage/actions'
import {
  isRequestingMortgageTransactionIdle,
  getError as getMortgageError
} from 'modules/mortgage/selectors'
import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { isLoading, getAuthorizations } from 'modules/authorization/selectors'
import { getPublicationByCoordinate } from 'modules/publication/selectors'
import BuyParcelByMortgagePage from './BuyParcelByMortgagePage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  const wallet = getWallet(state)

  let authorization
  let mana = 0

  if (wallet) {
    authorization = getAuthorizations(state)
    mana = wallet.mana
  }

  return {
    x,
    y,
    mana,
    authorization,
    publication: getPublicationByCoordinate(state, x, y),
    isTxIdle: isRequestingMortgageTransactionIdle(state),
    isConnected: isConnected(state),
    isLoading: isConnecting(state) || isLoading(state),
    error: getMortgageError(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    onConfirm: params => dispatch(createMortgageRequest(params)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(
  connect(mapState, mapDispatch)(BuyParcelByMortgagePage)
)
