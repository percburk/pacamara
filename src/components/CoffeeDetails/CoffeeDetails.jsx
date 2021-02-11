import { useState } from 'react';
import {
  VictoryChart,
  VictoryScatter,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryLabel,
} from 'victory';
import { Box, Typography } from '@material-ui/core';

function CoffeeDetails() {
  const [switchChart, setSwitchChart] = useState(false);
  const [single, setSingle] = useState({ x: '', y: '' });

  const handleClick = (x, y) => {
    setSwitchChart(!switchChart);
    setSingle({ x, y });
  };

  return (
    <>
      <Box>
        <Typography variant="h4" align="center">
          Victory Chart
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <Box height={500} width={500}>
          <VictoryChart
            theme={VictoryTheme.material}
            domain={{ x: [17, 26], y: [1.1, 1.7] }}
          >
            <VictoryLine
              style={{
                data: { stroke: '#c43a31' },
                parent: { border: '1px solid #ccc' },
              }}
              data={[
                { x: 17, y: 1.37 },
                { x: 26, y: 1.37 },
              ]}
            />
            <VictoryLine
              style={{
                data: { stroke: '#c43a31' },
                parent: { border: '1px solid #ccc' },
              }}
              data={[
                { x: 17, y: 1.43 },
                { x: 26, y: 1.43 },
              ]}
            />
            <VictoryLine
              style={{
                data: { stroke: '#c43a31' },
                parent: { border: '1px solid #ccc' },
              }}
              data={[
                { x: 20, y: 1.1 },
                { x: 20, y: 1.7 },
              ]}
            />
            <VictoryLine
              style={{
                data: { stroke: '#c43a31' },
                parent: { border: '1px solid #ccc' },
              }}
              data={[
                { x: 24, y: 1.1 },
                { x: 24, y: 1.7 },
              ]}
            />
            {!switchChart ? (
              <VictoryScatter
                labelComponent={<VictoryTooltip />}
                data={sampleData.map((item) => {
                  return {
                    x: item.ext,
                    y: item.tds,
                    label: `TDS: ${item.tds} EXT: ${item.ext}%`,
                  };
                })}
                size={7}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onClick: (event, data) =>
                        handleClick(data.datum.x, data.datum.y),
                    },
                  },
                ]}
              />
            ) : (
              <VictoryScatter
                labelComponent={<VictoryLabel />}
                size={11}
                data={[
                  {
                    x: single.x,
                    y: single.y,
                    label: `TDS: ${single.y} EXT: ${single.x}%`,
                  },
                ]}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onClick: () => setSwitchChart(!switchChart)
                        
                    }
                  },
                ]}
              />
            )}
          </VictoryChart>
        </Box>
      </Box>
    </>
  );
}

export default CoffeeDetails;
