import {VictoryChart, VictoryScatter, VictoryTooltip, VictoryLabel} from 'victory'
import {ClickAwayListener} from '@material-ui/core'
// Hooks
import {useAppSelector} from '../../hooks/useAppDispatchSelector'
// Models
import {BrewChartState} from '../../models/stateResource'
// Components
import RangePolygon from './RangePolygon'

// Styling
export const chartStyles = {
  scatter: {
    data: {
      fill: '#35baf6',
      cursor: 'pointer',
    },
  },
  tooltip: {
    stroke: '#35baf6',
    strokeWidth: 1,
  },
  labels: [{fontSize: 16}],
  polygon: {
    fill: 'grey',
    opacity: 0.3,
  },
}

interface Props {
  switchChart: boolean
  setSwitchChart: (set: boolean) => void
  oneBrew: BrewChartState
  setOneBrew: (brew: BrewChartState) => void
}

// ExtractionChart shows a scatter chart of all the brew instances of a coffee
// It's displayed on CoffeeDetails, users can also click on a point to open the
// corresponding brew instance
export default function ExtractionChart({
  switchChart,
  setSwitchChart,
  oneBrew,
  setOneBrew,
}: Props) {
  const {extMin, extMax, tdsMin, tdsMax} = useAppSelector((store) => store.user)
  const brews = useAppSelector((store) => store.brews)
  const extractionWindow = [
    {x: extMin, y: tdsMin},
    {x: extMax, y: tdsMin},
    {x: extMax, y: tdsMax},
    {x: extMin, y: tdsMax},
  ]

  // Toggles the chart between showing all the brews, and one clicked brew
  const handleSwitchChart = ({x, y, i}: BrewChartState) => {
    setOneBrew({x, y, i})
    setSwitchChart(!switchChart)
  }

  return (
    <ClickAwayListener onClickAway={() => setSwitchChart(false)}>
      <VictoryChart domain={{x: [16, 25], y: [1.2, 1.5]}}>
        <RangePolygon data={extractionWindow} />
        {!switchChart ? (
          <VictoryScatter
            style={chartStyles.scatter}
            labelComponent={<VictoryTooltip flyoutStyle={chartStyles.tooltip} />}
            size={6}
            data={brews.map((instance) => ({
              x: Number(instance.ext),
              y: Number(instance.tds),
              label: `TDS: ${instance.tds}, EXT: ${instance.ext}%`,
            }))}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onClick: (event, data) =>
                    handleSwitchChart({
                      x: data.datum.x,
                      y: data.datum.y,
                      i: data.index,
                    }),
                },
              },
            ]}
          />
        ) : (
          <VictoryScatter
            style={chartStyles.scatter}
            labelComponent={<VictoryLabel dy={-20} style={chartStyles.labels} />}
            size={10}
            data={[
              {
                x: oneBrew.x,
                y: oneBrew.y,
                label: `TDS: ${brews[oneBrew.i].tds}, EXT: ${brews[oneBrew.i].ext}%`,
              },
            ]}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onClick: () => setSwitchChart(!switchChart),
                },
              },
            ]}
          />
        )}
      </VictoryChart>
    </ClickAwayListener>
  )
}
