import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import moment from 'moment';

export default class Speed extends React.Component {
	constructor(props) {
	    super(props);
	}

	render() {
		return (
			<div id='speed'>
				<div>
					{this.props.currentDate} <br/>
					內湖 - 圓山 南下 預估車速
					<div className="speed">
						{this.props.currentSpeed}
						<span style={{ fontSize: `18` }}>
							km/hr
						</span>
					</div>
				</div>
				<hr/>
				<div className="row" style={{ textAlign: `center` }}>
					<div className="col-md-4">
						氣溫 <br/>
						<div className="temp">
							{this.props.currentTemp}
							<span style={{ fontSize: `18` }}>
								°C
							</span>
						</div>
					</div>
					<div className="col-md-4">
						行駛約 <br/>
						<div className="temp">
							{this.props.currentEstimateTime}
							<span style={{ fontSize: `14` }}>
								分鐘
							</span>
						</div>
					</div>
					<div className="col-md-4">
						能見度 <br/>
						<div className="temp" style={{ fontSize: `48` }}>
							佳
						</div>
					</div>
				</div>
			</div>
		);
	}
}