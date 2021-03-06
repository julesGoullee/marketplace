import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

import { getLocation } from '@dapps/modules/location/selectors'
import { isRootPage, isModalPage } from 'modules/location/selectors'
import { getWallet } from 'modules/wallet/selectors'
import { isConnected, isConnecting } from 'modules/wallet/selectors'
import { isLoading as isLoadingParcels } from 'modules/parcels/selectors'
import { getPendingTransactions } from '@dapps/modules/transaction/selectors'
import { navigateTo } from '@dapps/modules/location/actions'
import { getCenter } from 'modules/location/utils'
import { getActivePage } from './utils'

import Navbar from './Navbar'

const mapState = state => {
  const wallet = getWallet(state)
  const { pathname } = getLocation(state)
  const activePage = getActivePage({
    pathname,
    address: wallet && wallet.address
  })
  const center = getCenter(pathname)
  return {
    activePage,
    wallet,
    center,
    isRootPage: isRootPage(state),
    isLoading: isLoadingParcels(state),
    isConnected: isConnected(state),
    isConnecting: isConnecting(state),
    isModal: isModalPage(state),
    activityBadge: getPendingTransactions(state, wallet.address).length
  }
}

const mapDispatch = dispatch => ({
  onNavigate: url => dispatch(navigateTo(url)),
  onBack: () => dispatch(goBack())
})

export default connect(mapState, mapDispatch)(Navbar)
