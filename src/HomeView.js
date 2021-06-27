import axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';


class HomeView extends React.Component {
  constructor(props) {
    super(props);
    const { history } = this.props;
    this.history = history

    this.state = {
      joinByCodeField: '',
      placesListId: ''
    }
  }

  createNew = () => {
    axios.post('/api/place/list').then((resp) => {
      if (resp.status === 200) {
        this.history.push('/add-places');
      }
    });
  }

  handleChange = (event) => {
    this.setState({ joinByCodeField: event.target.value });
  }

  joinByCode = () => {
    axios.get('/api/place/joinByCode', { params: { placesListId: this.state.joinByCodeField } }).then((resp) => {
      if (resp.status === 200) {
        this.history.push('/add-places');
      }
    });
  }

  render() {
    if (this.props.code !== '') {
      this.history.push('/add-places');
      return null;
    } else {
      return (
        <div>
          <div class="jumbotron text-center">
            <h1 class="display-4">Welcome to Go Pick a Place!</h1>
            <p class="lead">
              Why not let a spinny color wheel choose instead
        </p>
            <p>
            </p>
            <p class="lead">
              <div class="container">
                <div class="row justify-content-center" >
                  <div class="col">
                    To get started enter a code sent to you or start your own pick
              </div>
                </div>
              </div>
              <br />
              <br />
              <br />
              <br />
              <div class="row justify-content-center" >
                <div class="col-sm-2">
                  <button id="create-new" class="btn btn-lg btn-primary" styles="width: 100%;" onClick={this.createNew}>Start a new pick!</button>
                </div>
              </div>
              <br />
              <br />
              <br />
              <br />
              <div class="row justify-content-center" >
                <div class="col-sm-2">
                  <div class="form-group">
                    <input
                      class="form-control form-control-lg"
                      type="text"
                      placeholder="code sent to you"
                      value={this.state.joinByCodeField}
                      onChange={this.handleChange}
                      id="join-by-code-input" />
                  </div>
                </div>
                <div class="col-sm-2" styles="width: 100%;">
                  <button id="join-by-code" class="btn btn-lg btn-primary" styles="width: 100%;" onClick={this.joinByCode}>Join by Code</button>
                </div>
              </div>
            </p>

          </div>
        </div>
      )
    }
  }
}
export default withRouter(HomeView);