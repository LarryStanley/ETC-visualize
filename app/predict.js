import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import moment from 'moment';
import { scaleLinear, scalePoint, scaleOrdinal } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { axisLeft, axisBottom } from 'd3-axis'
import { line } from 'd3-shape'
import * as d3 from 'd3';
import axios from 'axios';
import ReactLoading from 'react-loading';

export default class Predict extends React.Component {
	constructor(props) {
	    super(props)
		this.props.onRef(this)
		this.getData = this.getData.bind(this)
		this.getPredictData = this.getPredictData.bind(this)
		

	    let xScale = scalePoint()
	                   .domain([])
	                   .range([0, 600]);

	    let yScale = scaleLinear()
	                   .range([300, 10])
	                   .domain([60, 130]);

		this.state = {
			containerWidth: 600,
			road_name: "基隆端（基隆港）- 基隆（長庚）",
			station: "01F0005S",
			card_type: 31,
			next_days: [],
			points: {points: []},
			today_mean: 90,
			todays: [80, 80, 80, 80, 80, 80, 80, 80],
			xScale: xScale,
			yScale: yScale,
			loading: true

		}
	}

	componentDidMount() {
		this.setState({
			containerWidth: this.container.offsetWidth
		}, () => {
			this.getData()
		})
	}

	drawPredict() {
		var self = this
		const node = self.node

	}

	getPredictData(station, road_name, card_type) {
		this.setState({
			road_name: road_name,
			station: station,
			card_type: card_type,
			loading:true
		}, () => {
			this.getData()
		})
	}

	getData() {
		var self = this;
		var url = 'https://etc-api.ncufood.info/predict?start=' + this.state.station + "&card_type=" + this.state.card_type
		axios.get(url )
		.then(function(response) {
			var allX = [];
			for (var i = 0; i < response.data.points.length; i++) {
				allX.push(response.data.points[i].day)
			}
			let xScale = scalePoint()
	                   .domain(allX)
	                   .range([0, self.state.containerWidth]);

		    self.setState({
		    	today_mean: response.data.today_mean,
		    	todays: response.data.todays,
		    	next_days: response.data.next_days,
		    	points: {points: [response.data.points]},
		    	xScale: xScale,
		    	loading: false
		    })
		})
		.catch(function(error) {
		  console.log(error);
		});
	}

	render() {
		let width = this.state.containerWidth
		let height = 300

		return (
			<div id="predict">
                {this.state.loading && <Loading/>}
				<div className="container" ref={input => {this.container = input}}>
					<div className="title" style={{marginTop: `10%`}}>{ this.state.road_name } 未來七天預測</div>
					<div className="row">
						<div className="col-md-12">
							<div className="col-md-2">
								今天
								<div className="speed">
									{parseInt(this.state.today_mean)}
									<span style={{ fontSize: `18` }}>
										km/hr
									</span>
								</div>
							</div>
							<div className="col-md-10">
								{this.state.todays.map((item, index) => (
									<div className="col-md-3"  key={index}>
										{index*3 + ":00 ~ " + ((index+1)*3) + ":00"}
										<div className="secondSpeed">
										{item.average_speed}
											<span style={{ fontSize: `18` }}>
												km/hr
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
						<hr/>
						<div className="col-md-12" style={{marginTop: `50px`}}>
							{this.state.next_days.map((item, index) => (
							<div className="col-md-2" key={index}>
								{moment().add(index+1, 'days').format("MM/DD")}
								<div className="secondSpeed">
									{parseInt(item)}
									<span style={{ fontSize: `18` }}>
										km/hr
									</span>
								</div>
							</div>
							))}
						</div>
						<div className="col-md-12">
							 <svg width={this.state.containerWidth} height={height}>
						          <DataSeries
						            xScale={this.state.xScale}
						            yScale={this.state.yScale}
						            data={this.state.points}
						            width={width}
						            height={height}
						            />
						      </svg>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

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
      colors:            d3.scaleOrdinal(d3.schemeCategory10)
    };
  },

  render() {
    let { data, colors, xScale, yScale, interpolationType } = this.props;
    let line = d3.line()
      .curve(d3.curveBasis)
      .x((d) => { 
      	return xScale(d.day); })
      .y((d) => { return yScale(d.average_speed); });

    let lines = data.points.map((series, id) => {
      return (
        <Line
          path={line(series)}
          stroke={"#D06B40"}
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

const Line = React.createClass({

  propTypes: {
    path:         React.PropTypes.string.isRequired,
    stroke:       React.PropTypes.string,
    fill:         React.PropTypes.string,
    strokeWidth:  React.PropTypes.number
  },

  getDefaultProps() {
    return {
      stroke:       'blue',
      fill:         'none',
      strokeWidth:  3
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

class Loading extends React.Component{
    render() {
        return(
            <div className="predictLoading">
                <div style={{ left: `50%`, marginRight: `32px` , position: `absolute`}}>
                    <ReactLoading type="bars"/>
                </div>
            </div>
        )
    }
}