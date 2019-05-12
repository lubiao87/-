const getOption = (data) => {
	var convertData = function (data) {
	    var res = [];
	    for (var i = 0; i < data.length; i++) {
            res.push({
                name: data[i].placeName || data[i].name,
                value: data[i].geometry.coordinates.concat(data[i].population),
                id: data[i].placeId || data[i].id,
                geometry: data[i].geometry,
                population: data[i].population,
                avgtimeLen: data[i].avgtimeLen,
                samedayPopulation: data[i].samedayPopulation,
                serviceType: data[i].governmentType || null,
                serviceTypeId: data[i].governmentType || null,
            });
	    }
	    return res;
	};
	let option = {
		    tooltip : {
		    	formatter: (item) => {
		            return item.name + '</br>实时人数：<span style="color: yellow;">' + item.value[2] + '</span>';
		          }
		    },
		    bmap: {
		        center: [112.63, 22.16],
		        zoom: 9,
		        roam: true,
		        mapStyle: {
		            styleJson: [
		                    {
		                        "featureType": "water",
		                        "elementType": "all",
		                        "stylers": {
		                            "color": "#044161"
		                        }
		                    },
		                    {
		                        "featureType": "land",
		                        "elementType": "all",
		                        "stylers": {
		                            "color": "#004981"
		                        }
		                    },
		                    {
		                        "featureType": "boundary",
		                        "elementType": "geometry",
		                        "stylers": {
		                            "color": "#064f85"
		                        }
		                    },
		                    {
		                        "featureType": "railway",
		                        "elementType": "all",
		                        "stylers": {
		                            "visibility": "off"
		                        }
		                    },
		                    {
		                        "featureType": "highway",
		                        "elementType": "geometry",
		                        "stylers": {
		                            "color": "#004981"
		                        }
		                    },
		                    {
		                        "featureType": "highway",
		                        "elementType": "geometry.fill",
		                        "stylers": {
		                            "color": "#005b96",
		                            "lightness": 1
		                        }
		                    },
		                    {
		                        "featureType": "highway",
		                        "elementType": "labels",
		                        "stylers": {
		                            "visibility": "off"
		                        }
		                    },
		                    {
		                        "featureType": "arterial",
		                        "elementType": "geometry",
		                        "stylers": {
		                            "color": "#004981"
		                        }
		                    },
		                    {
		                        "featureType": "arterial",
		                        "elementType": "geometry.fill",
		                        "stylers": {
		                            "color": "#00508b"
		                        }
		                    },
		                    {
		                        "featureType": "poi",
		                        "elementType": "all",
		                        "stylers": {
		                            "visibility": "off"
		                        }
		                    },
		                    {
		                        "featureType": "green",
		                        "elementType": "all",
		                        "stylers": {
		                            "color": "#056197",
		                            "visibility": "off"
		                        }
		                    },
		                    {
		                        "featureType": "subway",
		                        "elementType": "all",
		                        "stylers": {
		                            "visibility": "off"
		                        }
		                    },
		                    {
		                        "featureType": "manmade",
		                        "elementType": "all",
		                        "stylers": {
		                            "visibility": "off"
		                        }
		                    },
		                    {
		                        "featureType": "local",
		                        "elementType": "all",
		                        "stylers": {
		                            "visibility": "off"
		                        }
		                    },
		                    {
		                        "featureType": "arterial",
		                        "elementType": "labels",
		                        "stylers": {
		                            "visibility": "off"
		                        }
		                    },
		                    {
		                        "featureType": "boundary",
		                        "elementType": "geometry.fill",
		                        "stylers": {
		                            "color": "#029fd4"
		                        }
		                    },
		                    {
		                        "featureType": "building",
		                        "elementType": "all",
		                        "stylers": {
		                            "color": "#1a5787"
		                        }
		                    },
		                    {
		                        "featureType": "label",
		                        "elementType": "all",
		                        "stylers": {
		                            "visibility": "off"
		                        }
		                    }
		            ]
		        }
		    },
		    series : [
		        {
		            type: 'scatter',
		            coordinateSystem: 'bmap',
		            data: convertData(data),
		            symbolSize: function (val) {
		                return val[2] / 20;
		            },
		            label: {
		                normal: {
		                    formatter: '{b}',
		                    position: 'right',
		                    show: false
		                },
		                emphasis: {
		                    show: true
		                }
		            },
		            itemStyle: {
		                normal: {
		                    color: '#ddb926'
		                }
		            }
		        },
		        {
		            name: 'Top 5',
		            type: 'effectScatter',
		            coordinateSystem: 'bmap',
		            data: convertData(data.sort(function (a, b) {
		                return b.population - a.population;
		            }).slice(0, 5)),
		            symbolSize: function (val) {
		                return val[2] / 20;
		            },
		            showEffectOn: 'render',
		            rippleEffect: {
		                brushType: 'stroke'
		            },
		            hoverAnimation: true,
		            label: {
		                normal: {
		                    formatter: '{b}',
		                    position: 'right',
		                    show: true
		                }
		            },
		            itemStyle: {
		                normal: {
		                    color: '#f4e925',
		                    shadowBlur: 10,
		                    shadowColor: '#333'
		                }
		            },
		            zlevel: 1
		        },
		        {
		            type: 'custom',
		            coordinateSystem: 'bmap',
		            itemStyle: {
		                normal: {
		                    opacity: 0.5
		                }
		            },
		            animation: false,
		            silent: true,
		            data: [0],
		            z: -10
		        }
		    ]
		};
	return option;
};
export default getOption;
