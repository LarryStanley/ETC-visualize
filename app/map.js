import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import demoFancyMapStyles from "./map-style.json";
import axios from 'axios';
import chroma from 'chroma-js';
var Promise = require('bluebird');
import ReactLoading from 'react-loading';

export default class Map extends React.Component {
    constructor(props) {
        super(props)
        this.props.onRef(this)
        var self = this
        this.getRoadHistory = this.getRoadHistory.bind(this)
        this.playHistory = this.playHistory.bind(this)
        this.playingMonthHistory = this.playingMonthHistory.bind(this)
        this.pauseMap = this.pauseMap.bind(this)
        this.changeMapCenter = this.changeMapCenter.bind(this)
        this.state = {
            loading: true,
            currentPlayingIndex: 0,
            currentSpeed: 80,
            playing: false,
            currentMonth: "9",
            currentYear: "2014"
        }
    }

    componentDidMount(rootNode) {
        var self = this
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 24.788899, lng: 120.996769},
          zoom: 10
        });

        map.setOptions({styles: demoFancyMapStyles});
        this.setState({
            map: map,
            roads: {}
        })

        axios.get('https://etc-api.ncufood.info/road')
          .then(function(response) {
            Promise.map(response.data, function(road, i){
                var renderer = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                      strokeColor: "rgba(0,0,0,0)"
                    },
                    suppressMarkers: true,
                    strokeWeight: 30,
                    preserveViewport: true
                });
                renderer.setDirections(JSON.parse(road.direction))
                renderer.setMap(self.state.map)
                var roads = self.state.roads
                roads[road.start] = renderer
                self.setState({
                    roads: roads
                })
            }).then(function() {
                self.getRoadHistory(2014, 1, 25, 'C', 32);
            });
          })
          .catch(function(error) {
            console.log(error);
          });
    }
    componentWillMount() {
    }

    getRoadHistory(year, month, day, time_type, car_type) {
        var self = this;
        self.setState({
            loading: true
        })
        var finalRoad = [];
        var f = chroma.scale(['red','yellow','green']);
        this.setState({colorRoad: []})
        axios.get('https://etc-api.ncufood.info/history?month='+ month +'&year='+ year +'&day='+ day +'&time_type='+ time_type +'&car_type=' + car_type)
          .then(function(response) {
            var i = 0;
            Promise.map(response.data ,function(history, i) {
                if (self.state.roads[history.gantryfrom]){
                    self.state.roads[history.gantryfrom].setMap(null)
                    self.state.roads[history.gantryfrom].setOptions({
                        polylineOptions: {
                            strokeColor: f(history.average_speed/110).hex()
                        }
                    })
                    self.state.roads[history.gantryfrom].setMap(self.state.map)  
                }
            }).then(function() {
                var speed = 80
                var distance = 1.5
                for (var i = response.data.length - 1; i >= 0; i--) {
                    if (response.data[i].gantryfrom == self.props.road) {
                        speed = response.data[i].average_speed
                        distance = response.data[i].distance.distance
                        break;
                    }
                }
                self.props.updateLabel(null, speed, Number(distance/speed *60).toPrecision(1))
                self.setState({
                    loading: false
                })
            });
          })
          .catch(function(error) {
            console.log(error);
          });
    }

    changeMapCenter(lat, lng) {
        var coordinate = new google.maps.LatLng(lat, lng)
        this.state.map.panTo(coordinate)
        this.state.map.setZoom(15)
    }

    playHistory(year, month, car_type) {
        var self = this;
        if (self.state.currentMonth != month || self.state.currentYear != year) {
            self.props.updateTimePeriod(year, month)
            self.setState({
                currentPlayingIndex: 0,
                currentMonth: month,
                currentYear: year
            }, () => {
                self.setState({
                   loading: true
                })
                axios.get('https://etc-api.ncufood.info/history/month?month='+ month +'&year='+ year +'&car_type=' + car_type)
                  .then(function(response) {
                    self.setState({
                        monthHistory: response.data,
                        loading: false,
                        playing: true
                    }, () => {
                        self.playingMonthHistory(0)
                    })
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
            })
        } else if(this.state.currentPlayingIndex == 0) {
            self.setState({
                loading: true
            })
            axios.get('https://etc-api.ncufood.info/history/month?month='+ month +'&year='+ year +'&car_type=' + car_type)
              .then(function(response) {
                self.setState({
                    monthHistory: response.data,
                    loading: false,
                    playing: true
                }, () => {
                    self.playingMonthHistory(0)
                })
              })
              .catch(function(error) {
                console.log(error);
              });
        } else {
            self.setState({
                loading: false,
                playing: true
            }, () => {
                self.playingMonthHistory(this.state.currentPlayingIndex)
            })
        }
    }

    playingMonthHistory(index) {
        var self = this;
        var f = chroma.scale(['red','yellow','green']);
        if (index < self.state.monthHistory.length && this.state.playing) {
            Promise.map(self.state.monthHistory[index] ,function(history, i) {
                if (self.state.roads[history.gantryfrom]){
                    self.state.roads[history.gantryfrom].setMap(null)
                    self.state.roads[history.gantryfrom].setOptions({
                        polylineOptions: {
                            strokeColor: f(history.average_speed/110).hex()
                        }
                    })
                    self.state.roads[history.gantryfrom].setMap(self.state.map)  
                }
            }).then(function() {

                var time = self.state.monthHistory[index][0].year.toString() + "-" + self.state.monthHistory[index][0].month.toString() + "-" + self.state.monthHistory[index][0].day.toString()
                 if (self.state.monthHistory[index][0].time_type == 'A') {
                  time += " 01:30"
                } else if (self.state.monthHistory[index][0].time_type == 'B') {
                  time += " 04:30"
                } else if (self.state.monthHistory[index][0].time_type == 'C') {
                  time += " 07:30"
                } else if (self.state.monthHistory[index][0].time_type == 'D') {
                  time += " 10:30"
                } else if (self.state.monthHistory[index][0].time_type == 'E') {
                  time += " 13:30"
                } else if (self.state.monthHistory[index][0].time_type == 'F') {
                  time += " 16:30"
                } else if (self.state.monthHistory[index][0].time_type == 'G') {
                  time += " 19:30"
                } else {
                  time += " 22:30"
                }
                var speed = 80
                var distance = 1.5
                for (var i = self.state.monthHistory[index].length - 1; i >= 0; i--) {
                    if (self.state.monthHistory[index][i].gantryfrom == self.props.road) {
                        speed = self.state.monthHistory[index][i].average_speed
                        distance = self.state.monthHistory[index][i].distance.distance
                        break;
                    }
                }
                self.props.updateLabel(time, speed, Number(distance/speed *60).toPrecision(1))
                index++;
                setTimeout(function() {
                    self.playingMonthHistory(index)
                    self.setState({
                        currentPlayingIndex: index
                    })
                }, 10)
            });
        } else {
            this.props.pause()
            this.setState({
                playing: false
            })
        }

        if (index > self.state.monthHistory.length) {
            this.setState({
                currentPlayingIndex: 0
            })
        }
    }

    pauseMap() {
        this.setState({
            playing: false
        })
    }

    render () {
        return (
            <div style={{position: `relative`, height: `calc(100% - 150px)`, width: `100%`, minHeight: `700px`}}>
                {this.state.loading && <Loading/>}
                <div id='map' style={{ width: `100%`, height: `100%`}}></div>
            </div>
        );
    }
}

class Loading extends React.Component{
    render() {
        return(
            <div className="loading">
                <div style={{ left: `50%`, marginRight: `32px` , position: `absolute`}}>
                    <ReactLoading type="bars"/>
                </div>
            </div>
        )
    }
}
