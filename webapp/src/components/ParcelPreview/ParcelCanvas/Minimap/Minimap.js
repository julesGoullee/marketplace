import React from 'react'
import PropTypes from 'prop-types'

import { coordsType } from 'components/types'
import { Bounds } from 'shared/map'
import { api } from 'lib/api'

import './Minimap.css'

const { minX, maxX, minY, maxY } = Bounds.getBounds()
const MINIMAP_WIDTH = 150 /* pixels */
const MINIMAP_HEIGHT = 149 /* pixels */
const HORIZONTAL_PARCELS = maxX - minX
const VERTICAL_PARCELS = maxY - minY
const PARCEL_WIDTH = MINIMAP_WIDTH / HORIZONTAL_PARCELS
const PARCEL_HEIGHT = MINIMAP_HEIGHT / VERTICAL_PARCELS
const BORDER = 2

export default class Minimap extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    center: coordsType.isRequired,
    address: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
    onChange: () => {}
  }

  componentDidMount() {
    if (this.map) {
      this.map.addEventListener('mousedown', this.handleMouseDown)
      this.map.addEventListener('mousemove', this.handleMouseEvent)
      this.map.addEventListener('mouseup', this.handleMouseUp)
    }
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.removeEventListener('mousedown', this.handleMouseDown)
      this.map.removeEventListener('mousemove', this.handleMouseEvent)
      this.map.removeEventListener('mouseup', this.handleMouseUp)
    }
  }

  handleMouseDown = event => {
    this.isMouseDown = true
    this.handleMouseEvent(event)
  }

  handleMouseUp = event => {
    this.isMouseDown = false
  }

  handleMouseEvent = event => {
    if (this.isMouseDown) {
      const [x, y] = this.mouseToCoords(event.layerX, event.layerY)
      const { onChange } = this.props
      onChange(x, y)
    }
  }

  refMap = map => {
    this.map = map
  }

  mouseToCoords = (x, y) => {
    return [
      Math.round(x / PARCEL_WIDTH + minX),
      Math.round(maxY - y / PARCEL_HEIGHT)
    ]
  }

  getMapURL() {
    const { address } = this.props
    let mapURL = '/map.png?size=1&width=301&height=301&publications=true'

    if (address) {
      mapURL += `&address=${address}`
    }

    return api.getUrl(mapURL)
  }

  render() {
    const { width, height, center } = this.props
    const styles = {
      width: width * PARCEL_WIDTH,
      height: height * PARCEL_HEIGHT,
      top: (maxY - center.y - height / 2) * PARCEL_HEIGHT - BORDER,
      left: (center.x - width / 2 - minX) * PARCEL_WIDTH - BORDER
    }

    if (styles.left < 0) {
      styles.width += styles.left
      styles.left = 0
    }

    if (styles.top < 0) {
      styles.height += styles.top
      styles.top = 0
    }

    if (styles.left + styles.width > MINIMAP_WIDTH - BORDER * 2) {
      styles.width = MINIMAP_WIDTH - BORDER * 2 - styles.left
    }

    if (styles.top + styles.height > MINIMAP_HEIGHT - BORDER * 2) {
      styles.height = MINIMAP_HEIGHT - BORDER * 2 - styles.top
    }

    return (
      <div className="Minimap" ref={this.refMap} onMouseDown={this.mouseDown}>
        <img
          src={this.getMapURL()}
          alt="Minimap"
          width={MINIMAP_WIDTH - BORDER * 2}
          height={MINIMAP_HEIGHT - BORDER * 2}
        />
        <div className="minimap-focus" style={styles} />
      </div>
    )
  }
}
