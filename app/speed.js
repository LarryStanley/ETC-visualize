import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";

export default class Speed extends React.Component {
	constructor(props) {
	    super(props);
	    console.log('constructor');
	 }
	render() {
		return (
			<div id='speed'>
				<div>
					2017/09/25 <br/>
					內湖 - 圓山 南下 預估車速
					<div className="speed">
						86
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
							26
							<span style={{ fontSize: `18` }}>
								°C
							</span>
						</div>
					</div>
					<div className="col-md-4">
						行駛約 <br/>
						<div className="temp">
							15
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