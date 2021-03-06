import { useSelector } from 'react-redux';
import {
  VictoryChart,
  VictoryScatter,
  VictoryTooltip,
  VictoryLabel,
} from 'victory';
import { ClickAwayListener } from '@material-ui/core';

// Custom component to display the user's TDS/Extraction window on the chart
const Polygon = ({ data, scale }) => {
  const points = data.reduce(
    (pointStr, { x, y }) => `${pointStr} ${scale.x(x)},${scale.y(y)}`,
    ''
  );
  return <polygon points={points} style={{ fill: 'grey', opacity: 0.3 }} />;
};

// ExtractionChart shows a scatter chart of all the brew instances of a coffee
// It's displayed on CoffeeDetails, users can also click on a point to open the
// corresponding brew instance
export default function ExtractionChart({
  switchChart,
  setSwitchChart,
  oneBrew,
  setOneBrew,
}) {
  const { ext_min, ext_max, tds_min, tds_max } = useSelector(
    (store) => store.user
  );
  const brews = useSelector((store) => store.brews);
  const extractionWindow = [
    { x: ext_min, y: tds_min },
    { x: ext_max, y: tds_min },
    { x: ext_max, y: tds_max },
    { x: ext_min, y: tds_max },
  ];

  // Toggles the chart between showing all the brews, and one clicked brew
  const handleSwitchChart = (x, y, i) => {
    console.log(x, y, i);
    setOneBrew({ x, y, i });
    setSwitchChart(!switchChart);
  };

  return (
    <ClickAwayListener onClickAway={() => setSwitchChart(false)}>
      <VictoryChart domain={{ x: [16, 25], y: [1.2, 1.5] }}>
        <Polygon data={extractionWindow} />
        {!switchChart ? (
          <VictoryScatter
            style={{ data: { fill: '#35baf6', cursor: 'pointer' } }}
            labelComponent={
              <VictoryTooltip
                flyoutStyle={{ stroke: '#35baf6', strokeWidth: 1 }}
              />
            }
            size={6}
            data={brews.map((instance) => {
              return {
                x: Number(instance.ext),
                y: Number(instance.tds),
                label: `TDS: ${instance.tds}, EXT: ${instance.ext}%`,
              };
            })}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onClick: (event, data) =>
                    handleSwitchChart(data.datum.x, data.datum.y, data.index),
                },
              },
            ]}
          />
        ) : (
          <VictoryScatter
            style={{ data: { fill: '#35baf6', cursor: 'pointer' } }}
            labelComponent={
              <VictoryLabel dy={-20} style={[{ fontSize: 16 }]} />
            }
            size={10}
            data={[
              {
                x: oneBrew.x,
                y: oneBrew.y,
                label: `TDS: ${brews[oneBrew.i].tds}, EXT: ${
                  brews[oneBrew.i].ext
                }%`,
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
  );
}
