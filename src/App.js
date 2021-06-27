import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import 'startbootstrap-simple-sidebar/dist/css/styles.css'
import 'bootswatch/dist/united/bootstrap.css';
import HomeView from './HomeView';
import MapView from './MapView';
import WheelView from './WheelView';
import PlacesListModal from './PlacesListModal';
import InviteOthersModal from './InviteOthersModal';
import './style.css'
import { connect } from "react-redux";
import { loadPlaces } from './placesListSlice';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'sideBarToggled': false,
      'showPlacesListModal': false,
      'showInviteModal': false
    }
  }

  componentDidMount() {
    if (!Array.isArray(this.props.places)) {
      this.props.loadPlaces();
    }
    setInterval(() => { this.props.loadPlaces(); }, 3000);// periodacly poll to see if any updates to the place list
    // has been made by anyone else, that's adding to the same list
  }

  handleSidebarToggle = () => {
    this.setState({ 'sideBarToggled': !this.state.sideBarToggled });
  }

  handleModalShow = () => {
    this.setState({ 'showPlacesListModal': true});
  }

  handleModalClose = () => {
    this.setState({ 'showPlacesListModal': false});
  }

  handleInviteModalShow = () => {
    this.setState({ 'showInviteModal': true});
  }

  closeInviteModal = () => {
    this.setState({ 'showInviteModal': false});
  }


  render() {
    return (
      <Router>
        <div className={`d-flex ${this.state.sideBarToggled ? 'toggled' : ''}`} id="wrapper">
          <div className="bg-light border-right" id="sidebar-wrapper">
            <div className="sidebar-heading">Pick a Place</div>
            <div className="list-group">
              <NavLink exact to="/"
                className={`list-group-item list-group-item-action
                            ${this.props.code !== '' ? 'disabled' : ''}`}
                activeClassName="active">
                  Welcome
                </NavLink>

              <NavLink to="/add-places"
                className={`list-group-item list-group-item-action
                            ${this.props.code !== '' ? '' : 'disabled'}`}
                activeClassName="active">
                  Add places
              </NavLink>

              <NavLink to="/pick-a-place"
                className={`list-group-item list-group-item-action
                            ${this.props.places?.length > 3 ? '' : 'disabled'}`}

                activeClassName="active">
                  Pick a Place!
              </NavLink>
            </div>
          </div>

          <div id="page-content-wrapper">
            <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
              <button aria-controls="responsive-navbar-nav"
                type="button"
                aria-label="Toggle navigation"
                class="navbar-toggler collapsed"
                onClick={this.handleSidebarToggle}>
                <span class="navbar-toggler-icon"></span>
              </button>
              <span class="ml-auto">
                <DropdownButton
                  title="Options"
                  id="input-group-dropdown-1"
                >
                  <Dropdown.Item
                    onClick={this.handleModalShow}
                    disabled={this.props.code === ''}
                    >
                      View current picks
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={this.handleInviteModalShow}
                    disabled={this.props.code === ''}
                    >
                      Invite others
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#">
                    Start new pick
                  </Dropdown.Item>
                </DropdownButton>
              </span>

            </nav>
            <div id="app-wrapper">
              <Switch>
                <Route path="/add-places" component={MapView} />
                <Route path="/pick-a-place" component={WheelView} />
                <Route path="/">
                  <HomeView
                    places={this.props.places}
                    code={this.props.code}/>
                </Route>
              </Switch>
              <PlacesListModal
                places={this.props.places}
                show={this.state.showPlacesListModal}
                onHide={this.handleModalClose}/>
              <InviteOthersModal
                code={this.props.code}
                show={this.state.showInviteModal}
                onHide={this.closeInviteModal}/>
            </div>
          </div>
        </div>
      </Router>)
  }
}

export default connect(state => ({ places: state.placesList.places, code: state.placesList.code }), { loadPlaces })(App);
