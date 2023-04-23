// Models
import { PolygonProps } from '../../models/customPropsResource'
// Styling import
import { chartStyles } from './ExtractionChart'

// Custom component to display the user's TDS/Extraction window on the chart
export default function RangePolygon({ data, scale }: PolygonProps) {
  const points = data.reduce((pointStr, { x, y }) => {
    if (scale?.x && scale?.y) {
      return `${pointStr} ${scale?.x(x)},${scale?.y(y)}`
    }
    return pointStr
  }, '')

  return <polygon points={points} style={chartStyles.polygon} />
}
