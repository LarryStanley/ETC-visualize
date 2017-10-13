import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import moment from 'moment';
import axios from 'axios';
import { scaleLinear, scalePoint, scaleOrdinal } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { axisLeft, axisBottom } from 'd3-axis'
import { line } from 'd3-shape'
import * as d3 from 'd3';
import ReactLoading from 'react-loading';

export default class Static extends React.Component {
	constructor(props) {
	   	super(props)
      this.props.onRef(this)
      this.changeTimeType = this.changeTimeType.bind(this)
      this.updateStatic = this.updateStatic.bind(this)
      this.drawStaic = this.drawStaic.bind(this)
      this.state = {
        maxSpeed: 50,
        miniSpeed: 50,
        linearStaticGraphyData: {
          points: [],
          yMin: 50,
          yMax: 130
        },
        xScale: scalePoint().domain([1, 360]).range([1 ,960]),
        yScale: scaleLinear().domain([50, 50]).range([0, 200]),
        station: "",
        year: 2014,
        car_type: 31,
        time_type: "A",
        currentWeatherStation: "C0AD00",
        currentPoints: 0,
        allStaticPoints: [],
        loading: true
      }
	}

	getDefaultProps(){
	    return {
	      width:  600,
	      height: 300
	    }
	  }

  getData(station, year, car_type, currentWeatherStation) {
    var self = this;
    this.setState({
      loading: true
    })
     axios.get("https://etc-api.ncufood.info/history/month/station?station=" + station + "&year=" + year
      + "&car_type=" + car_type + "&time_type=" + self.state.time_type)
        .then(function(response) {
          if (response.data.length){
            self.setState({
              allStaticPoints: response.data,
              currentPoints: 0
            }, () => {
              self.drawStaic(station, year, car_type, currentWeatherStation)
            })
          }       
        })
        .catch(function(error) {
          console.log(error);
        });
  }

  drawStaic(station, year, car_type, currentWeatherStation) {
    var domain =[]
    var maxSpeed = -1000
    var miniSpeed = 1000
    var self = this
    for (var i = 0; i < self.state.currentPoints + 1; i++) {
      for (var j = 0; j < self.state.allStaticPoints[i].length; j++) {
        domain.push(self.state.allStaticPoints[i][j].day)
        if (parseInt(self.state.allStaticPoints[i][j].average_speed) > maxSpeed)
          maxSpeed = self.state.allStaticPoints[i][j].average_speed
        if (parseInt(self.state.allStaticPoints[i][j].average_speed) < miniSpeed)
          miniSpeed = self.state.allStaticPoints[i][j].average_speed
      }
    }

    self.setState({
      maxSpeed: maxSpeed,
      miniSpeed: miniSpeed
    })
    
    const node = self.node
    domain = domain.sort((a, b) => a - b)
    let xScale = scalePoint()
                   .domain(domain)
                   .range([1 ,self.container.offsetWidth]);

    let yScale = scaleLinear()
                  .domain([miniSpeed, maxSpeed])
                  .range([1, 400]);
    var newPoints = self.state.allStaticPoints.slice(0, self.state.currentPoints +1)
    self.setState({
      xScale: xScale,
      yScale: yScale,
    }, ()=> {
      self.setState({
         linearStaticGraphyData: {
          points: newPoints,
          yMin: 50,
          yMax: 130
        },
        station: station,
        car_type: car_type,
        year: year,
        currentWeatherStation: currentWeatherStation,
        loading: false
      }, () => {
      })
    })
  }

  changeTimeType(event) {
    var self = this;
    this.setState({time_type: event.target.value}, () => {
      self.getData(self.state.station, self.state.year, self.state.car_type)
    })
  }

  updateStatic() {
    var self = this
    if (this.state.currentPoints < 3) {
      this.setState({
        currentPoints: this.state.currentPoints +1
      }, () => {
        self.drawStaic(self.state.station, self.state.year, self.state.car_type, self.state.currentWeatherStation)
      })
    }
  }

	componentDidMount() {
	}

	componentDidUpdate() {
	}

  componentWillUpdate(nextProps, nextState) {


  }

	render() {
		return (
			<div id="static">
        {this.state.loading && <Loading/>}
				<div className="container" ref={input => {this.container = input}}>
          <div className="row" style={{ marginTop: `5%`}}>
            <div className="col-md-2">
              <div className="form-group">
                <select value={this.state.time_type} onChange={this.changeTimeType} className="form-control">
                  <option value="A">00:00 ~ 02:59</option>
                  <option value="B">03:00 ~ 05:59 </option>
                  <option value="C">06:00 ~ 08:59</option>
                  <option value="D">09:00 ~ 11:59</option>
                  <option value="E">12:00 ~ 14:59</option>
                  <option value="F">15:00 ~ 17:59</option>
                  <option value="G">18:00 ~ 20:59</option>
                  <option value="H">21:00 ~ 23:59</option>
                </select>
              </div>
            </div>
            <div className="col-md-5">
              <div className="title">
                <span style={{ color: `#1a8079` }}>{this.props.road_name}</span> 速度年變化
              </div>
            </div>
          </div>
          {parseInt(this.state.maxSpeed)}
				  <svg width="100%" height={this.props.height} ref={node => this.node = node}>
              {this.container && this.state.linearStaticGraphyData.points.length &&
			          <DataSeries
			            xScale={this.state.xScale}
			            yScale={this.state.yScale}
			            data={this.state.linearStaticGraphyData}
			            width={this.props.width}
			            height={this.props.height}
			            />
              }
			      </svg>
            {parseInt(this.state.miniSpeed)}
            <div className="row" style={{ marginBottom: `10px` }}>
              <div className="col-md-1">一月</div>
              <div className="col-md-1">二月</div>
              <div className="col-md-1">三月</div>
              <div className="col-md-1">四月</div>
              <div className="col-md-1">五月</div>
              <div className="col-md-1">六月</div>
              <div className="col-md-1">七月</div>
              <div className="col-md-1">八月</div>
              <div className="col-md-1">九月</div>
              <div className="col-md-1">十月</div>
              <div className="col-md-1">十一月</div>
              <div className="col-md-1">十二月</div>
              <div className="col-md-1">
                <div className="orange">
                </div>
                <div className="orange-text">
                  車速
                </div>
              </div>
              { this.state.currentPoints > 0 &&
               <div className="col-md-1 fadeIn">
                <div className="pink">
                </div>
                <div className="pink-text">
                  氣溫
                </div>
              </div>
              }
              { this.state.currentPoints > 1 &&
              <div className="col-md-1 fadeIn">
                <div className="blue">
                </div>
                <div className="blue-text">
                  雨量
                </div>
              </div>
              }
              { this.state.currentPoints > 2 &&
              <div className="col-md-1 fadeIn">
                <div className="green">
                </div>
                <div className="green-text">
                  風速
                </div>
              </div>
              }
              <div className="col-md-12 illustration" style={{ textAlign: `center` }}>
                { this.state.currentPoints == 0 &&
                  <div className="fadeIn">
                    這邊是 「{this.props.road_name} 」速度年變化圖 <br/>
                    有看到季節性的變化嗎？<br/>
                  
                  <a onClick={this.updateStatic}>跟溫度比較看看 <span className="glyphicon glyphicon-arrow-right"></span></a>
                </div>
                }
                { this.state.currentPoints == 1 &&
                  <div className="fadeIn">
                  從模型結果來看 <br/>
                  氣溫可能會影響到路段的速度<br/>
                 <a onClick={this.updateStatic}>跟雨量比較看看 <span className="glyphicon glyphicon-arrow-right"></span></a>
                 </div>
                }
                { this.state.currentPoints == 2 &&
                  <div className="fadeIn">
                  從模型結果來看 <br/>
                  很明顯的氣溫會影響到路段的速度<br/>
                   <a onClick={this.updateStatic}>跟雨量比較看看 <span className="glyphicon glyphicon-arrow-right"></span></a>
                 </div>
                }
                { this.state.currentPoints == 3 &&
                  <div>可以選取其他路段看看天氣是否跟路段有相關性</div>
                }
              </div>
            </div>
				</div>
			</div>
		);
	}
}

const Line = React.createClass({

  propTypes: {
    path:         React.PropTypes.string.isRequired,
    stroke:       React.PropTypes.string,
    fill:         React.PropTypes.string,
    strokeWidth:  React.PropTypes.number
  },

  getDefaultProps() {
    return {
      stroke:       'red',
      fill:         'none',
      strokeWidth:  2
    };
  },

  render() {
    let { path, stroke, fill, strokeWidth } = this.props;
    return (
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        />
    );
  }

});

const DataSeries = React.createClass({

  propTypes: {
    colors:             React.PropTypes.func,
    data:               React.PropTypes.object,
    interpolationType:  React.PropTypes.string,
    xScale:             React.PropTypes.func,
    yScale:             React.PropTypes.func
  },

  getDefaultProps() {
    return {
      data:               [],
      interpolationType:  'cardinal',
      colors:             d3.scaleOrdinal(d3.schemeCategory10)
    };
  },

  render() {
    let { data, colors, xScale, interpolationType } = this.props;
    var color = ["#D06B40", "#D48CB4", "#6694FC", "#80B891"]

    let lines = data.points.map((series, id) => {
      var allValues = []
      for (var j = 0; j < series.length; j++) {
        allValues.push(series[j].average_speed)
      }

      var max = allValues.reduce(function(a, b) {
          return Math.max(a, b);
      });

       var mini = allValues.reduce(function(a, b) {
          return Math.min(a, b);
      });

      if (id) {
        var yScale = scaleLinear()
                .domain([max, mini])
                .range([0, 400]);
      } else {
         var yScale = scaleLinear()
                .domain([mini, max])
                .range([0, 400]); 
      }

        let line = d3.line()
          .curve(d3.curveBasis)
          .x((d) => { 
            return xScale((d.day)); })
          .y((d) => { 
            return yScale(d.average_speed); 
          });

      return (
        <Line
          path={line(series)}
          stroke={color[id]}
          key={id}
          />
      );
    });

    return (
      <g>
        <g>{lines}</g>
      </g>
    );
  }

});

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