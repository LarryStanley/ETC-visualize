import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import moment from 'moment';
import axios from 'axios';

export default class Speed extends React.Component {
	constructor(props) {
	    super(props);
        this.playHistory = this.playHistory.bind(this)
        this.yearChange = this.yearChange.bind(this)
		this.monthChange = this.monthChange.bind(this)
		this.directionChange = this.directionChange.bind(this)
		this.roadChange = this.roadChange.bind(this)
		this.roadTypeChange = this.roadTypeChange.bind(this)
	    this.state = {
	    	year: "2014",
	    	month: "9",
	    	playing: false,
	    	stations: [],
	    	road_type: "國1",
	    	selectDirection: "S"
	    }
	}

	componentWillMount() {
		var self = this;
		self.getStation("S", "國1");
	}

	getStation(direciton, road_type) {
		var self = this;
		axios.get('https://etc-api.ncufood.info/station?road_type=' + this.state.road_type + '&direction=' + this.state.selectDirection)
			.then(function(response) {
				self.setState({
				    stations: response.data,
				    selectRoad: response.data[0].station_number
				}, () => {
				})
		})
		.catch(function(error) {
			console.log(error);
		});
	}

	playHistory() {
		if (this.state.playing){
			this.props.pauseHistory(this.state.year, this.state.month)
			this.setState({
				playing: false
			})
		}else{
			this.props.playHistory(this.state.year, this.state.month)
			this.setState({
				playing: true
			})
		}
	}

	roadChange(event) {
		for (var i = this.state.stations.length - 1; i >= 0; i--) {
			if (this.state.stations[i].station_number == event.target.value) {
				this.setState({selectRoad: event.target.value})
				this.props.updateRoadSelection(event.target.value, this.state.stations[i].weather_station_id, this.state.stations[i].lat, this.state.stations[i].lng, this.state.stations[i].start + "-" +this.state.stations[i].end)
				break
			}
		}
	}

	roadTypeChange(event) {
		var self = this;
		this.setState({road_type: event.target.value}, () => {
			self.getStation(self.state.selectDirection, self.state.road_type)
		})
	}
	
	directionChange(event) {
		var self = this;
		this.setState({selectDirection: event.target.value}, () => {
			self.getStation(self.state.selectDirection, self.state.road_type)
		})
	}

	yearChange(event) {
		this.setState({year: event.target.value}, () => {
			this.props.updateTimeStampFromSpeed(this.state.year, this.state.month)
		})
	}

	monthChange(event) {
		this.setState({month: event.target.value}, () => {
			this.props.updateTimeStampFromSpeed(this.state.year, this.state.month)
		})
	}

	render() {
		return (
			<div id='speed'>
				<div>
					{this.props.currentDate} <br/>
					<div className="row">
						<div className="col-md-3 form-group">
							<select className="form-control" value={this.state.road_type} onChange={this.roadTypeChange}>
								<option value="國1">國1</option>
								<option value="國1高架">國1高架</option>
								<option value="國3">國3</option>
								<option value="國3甲">國3甲</option>
								<option value="國5">國5</option>
							</select>	
						</div>
						<div className="col-md-3 form-group">
							<select className="form-control" value={this.state.selectDirection} onChange={this.directionChange}>
								<option value="S">南下</option>
								<option value="N">北上</option>
							</select>	
						</div>
						<div className="col-md-6 form-group">
							<select className="form-control" value={this.state.selectRoad} onChange={this.roadChange}>
				                { this.state.stations.map(value => <option key={value.id} value={value.station_number}>{value.start} - {value.end}</option>) }
				            </select>
						</div>
					</div>				
					 車速
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
						行駛約 <br/>
						<div className="temp">
							{this.props.currentEstimateTime}
							<span style={{ fontSize: `14` }}>
								分鐘
							</span>
						</div>
					</div>
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
						雨量 <br/>
						<div className="temp" style={{ fontSize: `48` }}>
							{this.props.rain}
						</div>
					</div>
				</div>
			    <div className="row center car-type">
    				<div className="col-md-12 title" >車種</div>
			        <div className="col-md-offset-1 col-md-2" style={{ padding: `0 0 0 0` }}>
			        	<a className="hvr-fade activate" href="">
							小客車
				        	<img width="100%" src={require('./images/006-car-white.png')} />
			        	</a>
		        	</div>
			        <div className="col-md-2 " style={{ padding: `0 0 0 0` }}>
			        	<a className="hvr-fade" href="">
				        	小貨車
				        	<img width="100%" src={require('./images/004-delivery-truck-white.png')} />
			        	</a>
		        	</div>
			        <div className="col-md-2" style={{ padding: `0 0 0 0` }}>
			        	<a className="hvr-back-pulse" href="">
				        	大客車
				        	<img width="100%" src={require('./images/005-bus-white.png')} />
			        	</a>
		        	</div>
			        <div className="col-md-2" style={{ padding: `0 0 0 0` }}>
			        	<a className="hvr-back-pulse" href="">
							大貨車
				        	<img width="100%" src={require('./images/002-transport-white.png')} />
			        	</a>
		        	</div>
			        <div className="col-md-2" style={{ padding: `0 0 0 0` }}>
			        	<a className="hvr-back-pulse" href="">
				        	聯結車
				        	<img width="100%" src={require('./images/001-truck-white.png')} />
			        	</a>
		        	</div>
			    </div>
			    <div className="row monthSelection">
    				<div className="col-md-12 title">查看月份</div>
			    	<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="">年</label>
							<select name="" id="year" className="form-control"
									value={this.state.year} onChange={this.yearChange}>
								<option value="2014">2014</option>
								<option value="2015">2015</option>
								<option value="2016">2016</option>
								<option value="2017">2017</option>
							</select>
						</div>
			    	</div>
			    	<div className="col-md-6">
			    		<div className="form-group">
							<label htmlFor="">月</label>
							<select name="" id="month" className="form-control"
									value={this.state.month} onChange={this.monthChange}>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
								<option value="11">11</option>
								<option value="12">12</option>
							</select>
						</div>
			    	</div>
			    	<div className="col-md-12 play">
			    		<a onClick={this.playHistory}>
			    		{this.props.pause &&
							<span className="glyphicon glyphicon-play"></span>
			    		}
			    		{this.props.playing &&
							<span className="glyphicon glyphicon-pause"></span>
			    		}
						</a>
			    	</div>
			    </div>
			</div>
		);
	}
}