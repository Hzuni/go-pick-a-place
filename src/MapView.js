/* eslint-disable no-undef */
import React from 'react';
import './style.css';
import { GoogleMap, LoadScript, Autocomplete, InfoWindow, Marker } from '@react-google-maps/api';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { setCode } from './placesListSlice';

class MapView extends React.Component {
  constructor(props) {
    super(props);

    const { history } = this.props;
    this.history = history
    this.state = {
      'zoom': 15,
      'markerVisible': false,
    };
  }

  onAutocompleteLoad = (autocomplete) => {
    autocomplete.setFields(['address_components', 'formatted_address',
      'formatted_phone_number', 'photos', 'place_id',
      'geometry', 'icon', 'name']);
    this.autocomplete = autocomplete;
  };

  setInitialCenter() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.setState({
          'currentPlace': {
            location: pos,
            name: '',
            formatted_address: '',
            formatted_phone_number: '',
          }
        });
      },
    );
  }


  onPlaceChanged = () => {
    this.setState({ 'markerVisible': false });
    if (this.autocomplete !== null) {
      let place = this.autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      }

      this.setState({
        'currentPlace': {
          location: place.geometry.location,
          ...place
        }
      });

      this.setState({ 'zoom': 16 });
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  addToPlacesList = async () => {
    this.props.addPlace(this.state.currentPlace)
    this.setState({ markerVisible: false });
  }

  onMarkerPositionChanged = () => {

  }


render() {
  if (this.props.code === '') {
    this.history.push('/');
  }

  if (this.state?.currentPlace?.location !== undefined) {
    return (
      <LoadScript
        googleMapsApiKey="AIzaSyA6S6jnOCifABS94mypmXmzvi6ehz4YApI"
        libraries={["places"]}
      >
        <GoogleMap
          id="map"
          mapContainerStyle={{ width: '100%', height: '90%' }}
          onLoad={(map) => { this.map = map }}
          zoom={this.state.zoom}
          center={this.state.currentPlace.location}
        >
          <Autocomplete
            onLoad={(autocomplete) => {
              this.autocomplete = autocomplete;
              autocomplete.setFields(['address_components', 'formatted_address',
                'formatted_phone_number', 'photos', 'place_id',
                'geometry', 'icon', 'name']);
            }
            }
            onPlaceChanged={this.onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Search for a place"
              id="autocomplete-box"
            />
          </Autocomplete>
          <Marker
            onLoad={(marker) => { this.marker = marker }}
            position={this.state.currentPlace.location}
            visible={this.state.markerVisible}
            onPositionChanged={() => {
              this.state.currentPlace?.name && this.setState({ 'markerVisible': true })

            }}
          >
            {(this.marker && this.state.markerVisible) &&
              <InfoWindow
                onLoad={(infoWindow) => { this.infoWindow = infoWindow }}>
                <div>
                  <div id="info-window-head">
                    <p>{this.state.currentPlace.name}</p>
                  </div>
                  <div id="info-window-body">
                    <p>{this.state.currentPlace.formatted_address}</p>
                    <p>{this.state.currentPlace.formatted_phone_number}</p>
                    <button type="button"
                      class="btn btn-primary btn-sm"
                      id="add-to-places-list"
                      onClick={this.addToPlacesList}>
                      Add to places list</button>
                  </div>
                </div>
              </InfoWindow>
            }

          </Marker>

        </GoogleMap>
      </LoadScript >
    )
  } else {
    this.setInitialCenter()
    return null;
  }
}

};

export default connect(null, { setCode })(withRouter(MapView));