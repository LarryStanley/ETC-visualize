import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withProps, lifecycle } from "recompose";
import { WindowResizeListener } from 'react-window-resize-listener'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import demoFancyMapStyles from "./map-style.json";

const MainMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 24.788899, lng: 120.996769 },
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentWillMount() {
      console.log("yes")
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={props.center}
    defaultOptions={{ styles: demoFancyMapStyles }}
  >
  </GoogleMap>
);



ReactDOM.render( <MainMap /> , document.getElementById('app'));