import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Polyline
} from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import demoFancyMapStyles from "./map-style.json";
import './main.scss'
import './hover.scss'
import Bar from './bar';
import Speed from './speed';
import moment from 'moment';
import axios from 'axios';
import chroma from 'chroma-js';
var Promise = require("bluebird");
var async = require('async');

const MainMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `calc(100% - 10px)` }} />,
    center: { lat: 24.788899, lng: 120.996769 },
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentWillMount() {
    },
    componentDidMount() {
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={props.center}
    defaultOptions={{ styles: demoFancyMapStyles }}
  >
    { props.directions.map(function(direction, i){
        return <DirectionsRenderer key={i} directions={direction.direction} color={direction.color}/>;
    })}
  </GoogleMap>
);

class MainFrame extends React.Component {
  constructor(props) {
    super(props)
    this.updateCurrentTime = this.updateCurrentTime.bind(this)
    this.beforeUpdateSlider = this.beforeUpdateSlider.bind(this)
    this.afterUpdateSlider = this.afterUpdateSlider.bind(this)
    this.state = { 
      currentDate: moment("2014-05-30 00:00:00").format("YYYY-MM-DD HH:MM"),
      currentSpeed: 50,
      currentTemp: 23,
      currentEstimateTime: 10,
      showDirection: true,
      road: {},
      colorRoad: [],
      car_type: 31
    }
  }

  componentWillMount() {
    var self = this

     axios.get('https://etc-api.ncufood.info/road')
      .then(function(response) {
        var roads = {}
        Promise.map( response.data,function(road) {
          roads[road.start] = road.direction
        }).then(function() {
          self.setState({
            road: roads
          })
          self.getRoadHistory(2014, 1, 25, 'C', 32);
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getRoadHistory(year, month, day, time_type, car_type) {
    var self = this;
    var finalRoad = [];
    var f = chroma.scale(['red','yellow','green']);
    this.setState({colorRoad: []})
    axios.get('https://etc-api.ncufood.info/history?month='+ month +'&year='+ year +'&day='+ day +'&time_type='+ time_type +'&car_type=' + car_type)
      .then(function(response) {
        var i = 0;
        async.each(response.data ,function(history, i) {
          if (self.state.road[history.gantryfrom]){
            self.setState({
              colorRoad: self.state.colorRoad.concat([{
                direction: JSON.parse(self.state.road[history.gantryfrom]),
                color: f(history.average_speed/110).hex()
              }])
            })
          }
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  updateCurrentTime(value) {
      this.setState({ currentDate: moment.unix(value).format("YYYY-MM-DD HH:MM")})
      this.setState({
        currentSpeed: parseInt(Math.random() * (100 - 40) + 40),
        currentTemp: parseInt(Math.random() * (36 - 10) + 10),
        currentEstimateTime: parseInt(Math.random() * (20 - 10) + 10),
      });
  }

  beforeUpdateSlider(value) {
    this.setState({
      showDirection: true
    });
  }

  afterUpdateSlider(value) {

    var timeString = moment.unix(value).format("YYYY-MM-DD HH:MM");
    timeString = timeString.split(' ');
    var hour = parseInt(timeString[1].split(':')[0]);
    timeString = timeString[0].split('-');
    var year = timeString[0];
    var month = timeString[1];
    var day = timeString[2];
    var time_type = 'A'
    var car_type = this.state.car_type;
    if (hour >=0 && hour < 3) {
      time_type = 'A'
    } else if (hour >= 3 && hour < 6) {
      time_type = 'B'
    } else if (hour >= 6 && hour < 9) {
      time_type = 'C'
    } else if (hour >= 9 && hour < 12) {
      time_type = 'D'
    } else if (hour >= 12 && hour < 15) {
      time_type = 'E'
    } else if (hour >= 15 && hour < 18) {
      time_type = 'F'
    } else if (hour >= 18 && hour < 21) {
      time_type = 'G'
    } else {
      time_type = 'H'
    }

    this.getRoadHistory(year, month, day, time_type, car_type);
    
  }

  render() {
    return (
      <div style={{position: `absolute`, height: `100%`, width: `100%`}}>
        <MainMap directions={this.state.colorRoad} showDirection={this.state.showDirection}/>
        <Speed currentDate={this.state.currentDate} 
              currentSpeed={this.state.currentSpeed} 
              currentTemp={this.state.currentTemp} 
              currentEstimateTime={this.state.currentEstimateTime}/>
        <Bar updateCurrentTime={this.updateCurrentTime} beforeUpdateSlider={this.beforeUpdateSlider} afterUpdateSlider={this.afterUpdateSlider} />
      </div>
    )
  }
}



ReactDOM.render( <MainFrame />, document.getElementById('app'));
