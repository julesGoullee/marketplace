import { createSelector } from 'reselect'
import {
  getData as getParcels,
  getMortgagedParcels
} from 'modules/parcels/selectors'
import { getPublications } from 'modules/publication/selectors'
import { PUBLICATION_STATUS } from 'modules/publication/utils'
import { getDistricts } from 'modules/districts/selectors'
import { isOpen } from 'lib/utils'
import { pickAndMap } from './utils'

export const getState = state => state.address
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const isLoading = state => getLoading(state).length > 0
export const getError = state => getState(state).error
export const getAddresses = createSelector(
  getData,
  getDistricts,
  getParcels,
  getPublications,
  getMortgagedParcels,
  (data, districts, allParcels, publications, mortgagedParcels) =>
    Object.keys(data).reduce((map, address) => {
      const parcelIds = data[address].parcel_ids || []
      const [parcels, parcelsById] = pickAndMap(allParcels, parcelIds)

      const contributions = (data[address].contributions || []).map(
        contribution => ({
          ...contribution,
          district: districts[contribution.district_id]
        })
      )

      // filter only open publications
      const publishedParcels = parcels.filter(parcel =>
        isOpen(
          publications[parcel.publication_tx_hash],
          PUBLICATION_STATUS.open
        )
      )

      return {
        ...map,
        [address]: {
          ...data[address],
          parcels,
          parcelsById,
          contributions,
          publishedParcels,
          mortgagedParcels
        }
      }
    }, {})
)
