import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import './main.scss'
import './hover.scss'
import Bar from './bar';
import Speed from './speed';
import Map from './Map'
import moment from 'moment';
import axios from 'axios';
import Static from './static';
import Predict from './predict';

class MainFrame extends React.Component {
  constructor(props) {
    super(props)
    this.updateCurrentTime = this.updateCurrentTime.bind(this)
    this.beforeUpdateSlider = this.beforeUpdateSlider.bind(this)
    this.afterUpdateSlider = this.afterUpdateSlider.bind(this)
    this.playHistory = this.playHistory.bind(this)
    this.pause = this.pause.bind(this)
    this.updateLabel = this.updateLabel.bind(this)
    this.updateTimePeriod = this.updateTimePeriod.bind(this)
    this.updateRoadSelection = this.updateRoadSelection.bind(this)
    this.getSelectRoadHistory = this.getSelectRoadHistory.bind(this)
    this.updateTimeStampFromSpeed = this.updateTimeStampFromSpeed.bind(this)
    this.updateCarType = this.updateCarType.bind(this)
    this.state = { 
      currentDate: moment("2014-09-01 00:00:00").format("YYYY-MM-DD HH:MM"),
      currentSpeed: 75,
      currentTemp: 23,
      currentEstimateTime: 10,
      showDirection: true,
      road: {},
      colorRoad: [],
      car_type: 31,
      pause: true,
      playing: false,
      currentTimeStamp: moment("2014-09-01 00:00:00").format("X"),
      startPeriodTime: moment("2014-09-01 00:00:00").format("X"),
      endPeriodTime: moment("2014-09-30 00:00:00").format("X"),
      currentRoadSelect: "01F0005S",
      road_name: "基隆端（基隆港）- 基隆（長庚）",
      currentWeatherStation: "C0AD00",
      rain: 0,
      linearStaticGraphyData: {
        points: [],
          xValues: [],
          yMin: 0,
          yMax: 130

      }
    }
  }

  componentWillMount() {
    var self = this
  }

  componentDidMount() {
    this.getSelectRoadHistory()
  }

  getRoadHistory(year, month, day, time_type, car_type) {
    this.map.getRoadHistory(year, month, day, time_type, car_type)
  }

  playHistory(year, month) {
    this.map.playHistory(year, month, this.state.car_type)
    this.setState({
      playing: true,
      pause: false
    })
  }

  updateCurrentTime(value) {
      this.setState({ currentDate: moment.unix(value).format("YYYY-MM-DD HH:MM")})
      this.setState({
        currentSpeed: parseInt(Math.random() * (100 - 70) + 70),
        currentTemp: parseInt(Math.random() * (36 - 10) + 10),
        currentEstimateTime: parseInt(Math.random() * (20 - 10) + 10),
        currentTimeStamp: value
      });
  }

  beforeUpdateSlider(value) {
    this.setState({
      showDirection: true
    });
  }

  pause() {
    this.map.pauseMap()
    this.setState({
      playing: false,
      pause: true
    })
  }

  updateLabel(time, speed, travel_time) {
    var self = this
    if (!time)
      time = this.state.currentDate
    else {
      var url = 'https://etc-api.ncufood.info/weather?time=' + time + "&stationId=" + this.state.currentWeatherStation
      axios.get(url )
        .then(function(response) {
          if (response.data.length){
            self.setState({
              currentTemp: response.data[0].TEMP,
              rain: response.data[0].H_24R
            })
          }          
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    this.setState({
      currentDate: time,
      currentTimeStamp: moment(time).format("X"),
      currentSpeed: parseInt(speed),
      currentEstimateTime: travel_time
    })
  }

  updateRoadSelection(value, weather_station,lat, lng, road_name) {
    console.log(road_name)
    var self = this
    this.setState({
      currentRoadSelect: value,
      currentWeatherStation: weather_station,
      road_name: road_name
    }, () => {
      this.map.changeMapCenter(lat, lng)
      this.getSelectRoadHistory()
      this.predict.getPredictData(value, road_name, this.state.car_type)
    })
  }

  updateTimeStampFromSpeed(year, month) {
    var date = moment(year + "-" + month + "-" + "01 00:00")
    var endDate = moment(date).endOf('month')
    this.setState({
      currentTimeStamp: date.format("X"),
      currentDate: date.format("YYYY-MM-DD HH:MM"),
      startPeriodTime: date.format("X"),
      endPeriodTime: endDate.format("X")
    })
  }

  updateCarType(type) {
    if (type == 'smallCar') {
      this.setState({
        car_type: 31
      })
    } else if(type == 'smallVan') {
      this.setState({
        car_type: 32
      })
    } else if(type == 'bus') {
      this.setState({
        car_type: 41
      })
    } else if(type == 'bigVan') {
      this.setState({
        car_type: 42
      })
    } else {
      this.setState({
        car_type: 5
      })
    }
  }

  getSelectRoadHistory() {
    var self = this;
    var date = moment(self.state.currentTimeStamp, "X");
    var year = date.format("YYYY");
    console.log(year)
    self.static.getData(this.state.currentRoadSelect, year, self.state.car_type, self.state.currentWeatherStation)
  }

  updateTimePeriod(year, month) {
    var startDate = moment([year, month - 1])
    var endDate = moment(startDate).endOf('month')
    this.setState({
      currentTimeStamp: startDate.format("X"),
      startPeriodTime: startDate.format("X"),
      endPeriodTime: endDate.format("X")
    })
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
        <Map directions={this.state.road} 
                  onRef={ref => (this.map = ref)} 
                  pause={this.pause}
                  updateLabel={this.updateLabel}
                  updateTimePeriod={this.updateTimePeriod}
                  road={this.state.currentRoadSelect} />
        <Speed currentDate={this.state.currentDate} 
              currentSpeed={this.state.currentSpeed} 
              currentTemp={this.state.currentTemp}
              rain={this.state.rain}
              currentEstimateTime={this.state.currentEstimateTime}
              playHistory={this.playHistory}
              pause={this.state.pause}
              playing={this.state.playing}
              pauseHistory={this.pause}
              updateRoadSelection={this.updateRoadSelection}
              updateTimeStampFromSpeed={this.updateTimeStampFromSpeed}
              updateCarType={this.updateCarType} />

        <Bar defaultValue={parseInt(moment("2014-09-01 00:00:00").format("X"))}
        value={this.state.currentTimeStamp} 
   startPeriodTime={this.state.startPeriodTime} 
     endPeriodTime={this.state.endPeriodTime} 
  updateCurrentTime={this.updateCurrentTime} 
beforeUpdateSlider={this.beforeUpdateSlider}
 afterUpdateSlider={this.afterUpdateSlider} />

        <div style={{ position: `absolute`, height: `100%`, width: `100%` }}>
          <Static onRef={ref => (this.static = ref)} road_name={this.state.road_name} width={600} height={400}/>
          <Predict onRef={ref => (this.predict = ref)} height={400}/>
        </div>
      </div>
    )
  }
}



ReactDOM.render( <MainFrame />, document.getElementById('app'));
