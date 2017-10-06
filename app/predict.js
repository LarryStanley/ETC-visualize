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

export default class Predict extends React.Component {
	constructor(props) {
	    super(props)
		this.props.onRef(this)
		this.state = {
			containerWidth: 600
		}
	}

	componentDidMount() {
		this.setState({
			containerWidth: this.container.offsetWidth
		})
	}

	drawPredict() {
		var self = this
		const node = self.node

	}

	render() {
		let width = this.state.containerWidth
		let height = 300

		let data = {
		  points: [
		    [ { x: 0, y: 20 }, { x: 1, y: 30 }, { x: 2, y: 10 }, { x: 3, y: 5 },
		      { x: 4, y: 8 }, { x: 5, y: 15 }, { x: 6, y: 10 } ]
		    ],
		  xValues: [0,1,2,3,4,5,6],
		  yMin: 0,
		  yMax: 30
		};

	    let xScale = scalePoint()
	                   .domain(data.xValues)
	                   .range([0, width]);

	    let yScale = scaleLinear()
	                   .range([height, 10])
	                   .domain([data.yMin, data.yMax]);

		return (
			<div id="predict">
				<div className="container" ref={input => {this.container = input}}>
					<div className="title">基隆端（基隆港）- 基隆（長庚） 未來七天預測</div>
					<div className="row">
						<div className="col-md-12">
							<div className="col-md-2">
								今天
								<div className="speed">
									90
									<span style={{ fontSize: `18` }}>
										km/hr
									</span>
								</div>
							</div>
							<div className="col-md-10">
								<div className="col-md-3">
									00:00 ~ 03:00
									<div className="secondSpeed">
									78
										<span style={{ fontSize: `18` }}>
											km/hr
										</span>
									</div>
								</div>
								<div className="col-md-3">
									03:00 ~ 06:00
									<div className="secondSpeed">
									95
										<span style={{ fontSize: `18` }}>
											km/hr
										</span>
									</div>
								</div>
								<div className="col-md-3">
									06:00 ~ 09:00
									<div className="secondSpeed">
									93
										<span style={{ fontSize: `18` }}>
											km/hr
										</span>
									</div>
								</div>
								<div className="col-md-3">
									09:00 ~ 12:00
									<div className="secondSpeed">
									98
										<span style={{ fontSize: `18` }}>
											km/hr
										</span>
									</div>
								</div>
								<div className="col-md-3">
									12:00 ~ 15:00
									<div className="secondSpeed">
									85
										<span style={{ fontSize: `18` }}>
											km/hr
										</span>
									</div>
								</div>
								<div className="col-md-3">
									15:00 ~ 18:00
									<div className="secondSpeed">
									89
										<span style={{ fontSize: `18` }}>
											km/hr
										</span>
									</div>
								</div>
								<div className="col-md-3">
									18:00 ~ 21:00
									<div className="secondSpeed">
									93
										<span style={{ fontSize: `18` }}>
											km/hr
										</span>
									</div>
								</div>
								<div className="col-md-3">
									21:00 ~ 00:00
									<div className="secondSpeed">
									99
										<span style={{ fontSize: `18` }}>
											km/hr
										</span>
									</div>
								</div>
							</div>
						</div>
						<hr/>
						<div className="col-md-12" style={{marginTop: `50px`}}>
							<div className="col-md-2">
								星期二
								<div className="secondSpeed">
									99
									<span style={{ fontSize: `18` }}>
										km/hr
									</span>
								</div>
							</div>
							<div className="col-md-2">
								星期三
								<div className="secondSpeed">
								85
									<span style={{ fontSize: `18` }}>
										km/hr
									</span>
								</div>
							</div>
							<div className="col-md-2">
								星期四
								<div className="secondSpeed">
								78
									<span style={{ fontSize: `18` }}>
										km/hr
									</span>
								</div>
							</div>
							<div className="col-md-2">
								星期五
								<div className="secondSpeed">
								95
									<span style={{ fontSize: `18` }}>
										km/hr
									</span>
								</div>
							</div>
							<div className="col-md-2">
								星期六
								<div className="secondSpeed">
								92
									<span style={{ fontSize: `18` }}>
										km/hr
									</span>
								</div>
							</div>
							<div className="col-md-2">
								星期天
								<div className="secondSpeed">
								92
									<span style={{ fontSize: `18` }}>
										km/hr
									</span>
								</div>
							</div>
						</div>
						<div className="col-md-12">
							 <svg width={this.state.containerWidth} height={height}>
						          <DataSeries
						            xScale={xScale}
						            yScale={yScale}
						            data={data}
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
      .x((d) => { return xScale(d.x); })
      .y((d) => { return yScale(d.y); });

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