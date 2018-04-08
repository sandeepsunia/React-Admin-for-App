'use strict'

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import {
  Button,
  Icon,
  Input,
  Dropdown,
  Modal,
  NavItem,
  Pagination,
  Row,
  Table,
} from 'react-materialize';


export class TrackModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: props.openModal
    }
    this.delete = this.delete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openModal) {
      this.setState({
        openModal: nextProps.openModal
      })
    }
  }

  delete(trackId) {
    event.preventDefault();
    let token = this.props.token;
    this.props.actions.deleteTrack(token, trackId, this.props.tracks);
}

  render() {
    
    return (
      <Modal id='trackModal' header='Are you sure?'>
        <Button waves='light' className='red' onClick={()=> {this.delete(this.state.trackId); }}>Delete</Button>
      </Modal>
    );

  }
}

const mapStateToProps = (state) => ({
  tracks: state.data.tracks,
  trackId: state.trackId,
  isFetching: state.data.isFetching
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackModal);
