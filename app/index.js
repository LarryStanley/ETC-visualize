import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import demoFancyMapStyles from "./map-style.json";
import './main.scss'
import Bar from './bar';
import Speed from './speed';

const MainMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 24.788899, lng: 120.996769 },
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
  })
)(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={props.center}
    defaultOptions={{ styles: demoFancyMapStyles }}
  >
  </GoogleMap>
);



ReactDOM.render( 
  <div style={{position: `absolute`, height: `100%`, width: `100%`}}>
    <MainMap />
    <Speed />
    <Bar />
  </div>, document.getElementById('app'));
