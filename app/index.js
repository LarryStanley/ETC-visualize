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
import Bar from './bar';
import Speed from './speed';
import moment from 'moment';
import axios from 'axios';

var colors = ["red", 'orange', 'blue'];

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
      this.setState({
        directions: []
      })
    },
    componentDidMount() {
      var self = this
      const DirectionsService = new google.maps.DirectionsService();
      axios.get('https://etc-api.ncufood.info/road')
          .then(function(response) {
            console.log(response)
            response.data.map(function(station, i) {
              if (i < 10) {
                DirectionsService.route({
                  origin: new google.maps.LatLng(station.start.lat, station.start.lng),
                  destination: new google.maps.LatLng(station.end.lat, station.end.lng),
                  travelMode: google.maps.TravelMode.DRIVING,
                }, (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                    console.log("success")
                    self.setState({
                      directions: self.state.directions.concat([result]),
                    });
                  } else {
                    console.log(station.start.lat + "," + station.start.lng + "," + station.end.lat + "," + station.end.lng)
                    console.error(`error fetching directions ${result}`);
                  }
                });
              }
            });
          })
          .catch(function(error) {
            console.log(error);
          });
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={props.center}
    defaultOptions={{ styles: demoFancyMapStyles }}
  >
    { props.showDirection && props.directions.length && props.directions.map(function(direction, i){
        return <DirectionsRenderer key={i} directions={direction} color={props.color}/>;
    })}
  </GoogleMap>
);

class MainFrame extends React.Component {
  constructor(props) {
    super(props)
    this.updateCurrentTime = this.updateCurrentTime.bind(this)
    this.beforeUpdateSlider = this.beforeUpdateSlider.bind(this)
    this.afterUpdateSlider = this.afterUpdateSlider.bind(this)
  }

  componentWillMount() {
    this.state = { 
      currentDate: moment("2015-05-30 00:00:00").format("YYYY-MM-DD HH:MM"),
      currentSpeed: 50,
      currentTemp: 23,
      currentEstimateTime: 10,
      color: "red",
      showDirection: true
    }
  }

  updateCurrentTime(value) {
      this.setState({ currentDate: moment.unix(value).format("YYYY-MM-DD HH:MM")})
      this.setState({
        currentSpeed: parseInt(Math.random() * (100 - 40) + 40),
        currentTemp: parseInt(Math.random() * (36 - 10) + 10),
        currentEstimateTime: parseInt(Math.random() * (20 - 10) + 10),
      })
  }

  beforeUpdateSlider(value) {
    this.setState({
      showDirection: false
    });
  }

  afterUpdateSlider(value) {
    this.setState({
      showDirection: true,
      color: colors[Math.floor(Math.random()*colors.length)],
    });
  }

  render() {
    return (
      <div style={{position: `absolute`, height: `100%`, width: `100%`}}>
        <MainMap color={this.state.color} showDirection={this.state.showDirection}/>
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
