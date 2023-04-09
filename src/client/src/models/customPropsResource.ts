import { VictoryContainerProps } from 'victory'

export interface PolygonProps extends VictoryContainerProps {
  data: {
    x: number
    y: number
  }[]
}
