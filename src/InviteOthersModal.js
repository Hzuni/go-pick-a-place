import React from 'react';
import Modal from 'react-bootstrap/Modal'


export default class InviteOthersModal extends React.Component {

  render() {
    return (
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          backdrop="static"
          keyboard={false}>

          <Modal.Header closeButton>
            <Modal.Title>Invite others!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <p>
                  Invite others by sharing this code
                  <h1>{this.props.code}</h1>
              </p>
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
