import sourceImg from '../../assets/common/image/regional/homepage_qydc_map_icon_location.png';

const getOption = (workAndLiveAnalysis, source) => {
  let workTitle = '工作地 Top10';
  let liveTitle = '居住地 Top10';
  workAndLiveAnalysis = workAndLiveAnalysis || [];
  let workPlaces = workAndLiveAnalysis.workPlaceTopTen
    .sort((a, b) => b.population - a.population)
    .map((dataItem) => {
      dataItem.name = dataItem.placeName;
      dataItem.value = dataItem.geometry.coordinates.concat([dataItem.population]);
      return dataItem;
    });
  let livePlaces = workAndLiveAnalysis.livePlaceTopTen
    .sort((a, b) => b.population - a.population)
    .map((dataItem) => {
      dataItem.name = dataItem.placeName;
      dataItem.value = dataItem.geometry.coordinates.concat([dataItem.population]);
      return dataItem;
    });

  let colorline = ['#FF6C6C', '#FAAB6B', '#FFCC19', '#49c1ff', '#a6c84c'];
  let color = ['#FFCC19', '#FAAB6B', '#FF6C6C', '#49c1ff', '#a6c84c'];

  let series = [{
    name: workTitle,
    type: 'effectScatter',
    coordinateSystem: 'geo',
    zlevel: 3,
    rippleEffect: {
      brushType: 'stroke'
    },
    tooltip: {
      formatter: (item) => {
        return item.name + ':' + item.value[2] + '人';
      }
    },
    label: {
      normal: {
        show: true,
        position: 'right',
        color: '#fff',
        formatter: '{b}',
      }
    },
    symbolSize: function (val) {
      return (val[2] * 12) / workPlaces[0].population + 3;
    },
    itemStyle: {
      normal: {
        color: (value) => {
          if (value.dataIndex < 3) {
            return colorline[value.dataIndex];
          }
          return color[3];
        },
      }
    },
    data: workPlaces
  }, {
    name: liveTitle,
    type: 'effectScatter',
    coordinateSystem: 'geo',
    zlevel: 3,
    rippleEffect: {
      brushType: 'stroke'
    },
    tooltip: {
      formatter: (item) => {
        return item.name + ':' + item.value[2] + '人';
      }
    },
    label: {
      normal: {
        show: true,
        position: 'right',
        color: '#fff',
        formatter: '{b}',
      }
    },
    symbolSize: function (val) {
      return (val[2] * 12) / livePlaces[0].population + 3;
    },
    itemStyle: {
      normal: {
        color: (value) => {
          if (value.dataIndex < 3) {
            return colorline[value.dataIndex];
          }
          return color[3];
        },
      }
    },
    data: livePlaces
  }]; //职住地点
  let workLines = [];
  let liveLines = [];
  if (!!source) {
    workLines = workPlaces.map((v) => {
      return {
        fromName: v.placeName,
        toName: source.placeName,
        coords: [v.geometry.coordinates, source.geometry.coordinates],
        population: v.population
      }
    });
    liveLines = livePlaces.map((v) => {
    	if(v.type==='routeAnalysis'){
    		return {
    			fromName: source.placeName,
    			toName: v.placeName,
    			coords: [source.geometry.coordinates, v.geometry.coordinates],
    			population: source.population,
    		}
    	}else{
    		return {
    			fromName: v.placeName,
    			toName: source.placeName,
    			coords: [v.geometry.coordinates, source.geometry.coordinates],
    			population: v.population,
    		}
    	}
    });
  }

  series.push({
    type: 'scatter',
    coordinateSystem: 'geo',
    zlevel: 2,
    tooltip: {
      trigger: 'item',
      formatter: function (item) {
        return item.data.placeName;
      }
    },
    label: {
      normal: {
        show: false,
      }
    },
    //symbol: 'image://' + sourceImg,
    //symbolSize: [36, 50],
    //symbolOffset: [0, -20],
    data: (source && source.imgClass ? [source] : []).map(item => {
      item.name = item.placeName;
      item.value = item.geometry.coordinates;
      return item;
    })
  });
  series.push({
    name: workTitle,
    type: 'lines',
    coordinateSystem: 'geo',
    zlevel: 1,
    effect: {
      show: true,
      period: 6,
      trailLength: 0.7,
      color: '#fff',
      symbolSize: 3
    },
    lineStyle: {
      normal: {
        color: (value) => {
          if (value.dataIndex < 3) {
            return colorline[value.dataIndex];
          }
          return color[3];
        },
        width: 0,
        curveness: 0.2
      }
    },
    data: workLines
  });
  series.push({
    name: workTitle,
    type: 'lines',
    coordinateSystem: 'geo',
    zlevel: 2,
    symbol: ['none', 'arrow'],
    symbolSize: 0,
    tooltip: {
      formatter: (item) => {
        return item.data.fromName + ' > ' + item.data.toName + ' : ' + item.data.population;
      }
    },
    label: {
      normal: {
        show: true,
        position: 'right',
        color: '#fff',
        formatter: '{b}',
      }
    },
    effect: {
      show: true,
      period: 6,
      trailLength: 0,
      symbolSize: 0
    },
    lineStyle: {
      normal: {
        color: (value) => {
          if (value.dataIndex < 3) {
            return colorline[value.dataIndex];
          }
          return color[3];
        },
        width: 1,
        opacity: 0.6,
        curveness: 0.2
      }
    },
    data: workLines
  });
  series.push({
    name: liveTitle,
    type: 'lines',
    coordinateSystem: 'geo',
    zlevel: 1,
    effect: {
      show: true,
      period: 6,
      trailLength: 0.7,
      color: '#fff',
      symbolSize: 3
    },
    lineStyle: {
      normal: {
        color: (value) => {
          if (value.dataIndex < 3) {
            return colorline[value.dataIndex];
          }
          return color[3];
        },
        width: 0,
        curveness: 0.2
      }
    },
    data: liveLines
  });
  series.push({
    name: liveTitle,
    type: 'lines',
    coordinateSystem: 'geo',
    zlevel: 2,
    symbol: ['none', 'arrow'],
    symbolSize: 0,
    tooltip: {
      formatter: (item) => {
        return item.data.fromName + ' > ' + item.data.toName + ' : ' + item.data.population;
      }
    },
    label: {
      normal: {
        show: true,
        position: 'right',
        color: '#fff',
        formatter: '{b}',
      }
    },
    effect: {
      show: true,
      period: 6,
      trailLength: 0,
      symbolSize: 0
    },
    lineStyle: {
      normal: {
        color: (value) => {
          if (value.dataIndex < 3) {
            return colorline[value.dataIndex];
          }
          return color[3];
        },
        width: 1,
        opacity: 0.6,
        curveness: 0.2
      }
    },
    data: liveLines
  });
  //职住地箭头和线
  return {
    title: {
      text: '',
      subtext: '',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false,
      orient: 'vertical',
      right: '20',
      bottom: '20',
      data: [workTitle, liveTitle],
      textStyle: {
        color: '#fff'
      },
      selectedMode: 'single'
    },
    series: series,
  };
};
export default getOption;
