const data = [
  {
    x: [1, 2, 3, 4, 5],
    y: [1, 3, 2, 4, 3],
    type: 'scatter',
    name: "Line 1'
  },
  {
    x: [1, 2, 3, 4, 5],
    y: [2, 1, 4, 3, 2],
    type: 'scatter',
    name: 'Line 2'
  }
];

const layout = {
  title: 'Line Graph',
  xaxis: {
    title: 'X Axis'
  },
  yaxis: {
    title: 'Y Axis'
  }
};

Plotly.newPlot('chart', data, layout);

function updateChart() {
  const newData = [
    {
      x: [1, 2, 3, 4, 5],
      y: [Math.random(), Math.random(), Math.random(), Math.random()],
      type: 'scatter',
      name: 'Line 1'
    },
    {
      x: [1, 2, 3, 4, 5],
      y: [Math.random(), Math.random(), Math.random(), Math.random()],
      type: 'scatter',
      name: 'Line 2'
    }
  ]
  
  Plotly.newPlot('chart', newData, layout);
  
}
