import { VictoryContainerProps } from 'victory'
import { D3Scale } from 'victory-core'

export interface PolygonProps extends VictoryContainerProps {
  data: {
    x: number
    y: number
  }[]
  scale?: {
    x: D3Scale
    y: D3Scale
  }
}
