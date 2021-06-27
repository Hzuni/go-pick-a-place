import React from 'react';
import Modal from 'react-bootstrap/Modal'


export default class PlacesListModal extends React.Component {

  render() {
    return (
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          backdrop="static"
          keyboard={false}>

          <Modal.Header closeButton>
            <Modal.Title>Current possiblilities</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul className="list-group">
            {this.props.places.map(place => (<li className="list-group-item list-group-item-primary" >{place.name}</li>))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <button class="btn btn-lg btn-primary" onClick={this.props.onHide}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
    );
  }
}
