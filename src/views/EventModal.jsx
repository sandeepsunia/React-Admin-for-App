'use strict'

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import { findDOMNode } from 'react-dom'
import Autosuggest from 'react-autosuggest';
import dateFormat from 'dateformat';
import {
  Button,
  Col,
  Chip,
  Dropdown,
  Icon,
  Input,
  Modal,
  NavItem,
  Pagination,
  Row,
  Table,
  Tag,
} from 'react-materialize';

const initEvent = {
  event: {
    title: "",
    image: "",
    trackId: "",
    status: "",
    scheduleId: "",
    metadata: {}
  },
  members: {},
  schedule: {}
}

export class eventModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.token,
      toggle: props.toggle || false,
      editMode: props.editMode || false,
      currentEvent: props.currentEvent ? (Object.keys(props.currentEvent).length == 0 ? initEvent : props.currentEvent) : initEvent,
      draftPage: props.draftPage,
      startDate: props.currentEvent ? (Object.keys(props.currentEvent).length == 0 ? '' : (props.currentEvent.schedule ? dateFormat(props.currentEvent.schedule.startDate, "yyyy-mm-dd HH:MM:ss") : '')) : '',
      endDate: props.currentEvent ? (Object.keys(props.currentEvent).length == 0 ? '' : (props.currentEvent.schedule ? dateFormat(props.currentEvent.schedule.endDate, "yyyy-mm-dd HH:MM:ss") : '')) : '',
      actions: props.actions,
      createHeader: props.createHeader,
      editHeader: props.editHeader,
      //autosaveDraftId: props.autosaveDraftId,
      tracks: props.tracks,
      trackId: props.trackId,
      value: '',
      suggestions: []
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      trackId: nextProps.trackId,
      editMode: nextProps.editMode,
      currentEvent: nextProps.editMode ? nextProps.currentEvent : initEvent,
      startDate: nextProps.editMode ? dateFormat(nextProps.currentEvent.schedule.startDate, "yyyy-mm-dd HH:MM:ss") : '',
      endDate: nextProps.editMode ? dateFormat(nextProps.currentEvent.schedule.endDate, "yyyy-mm-dd HH:MM:ss") : '',
      toggle: nextProps.toggle,
      tracks: nextProps.tracks,
      editHeader: nextProps.editHeader,
      //autosaveDraftId: nextProps.autosaveDraftId,
      createHeader: nextProps.createHeader,
      token: nextProps.token,
      draftPage: nextProps.draftPage
    })
  }

  getSuggestions = value => {
    let speakers = this.props.speakers;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : speakers.filter(lang =>
      lang.email.toLowerCase().slice(0, inputLength) === inputValue
    );
  };


  getSuggestionValue = suggestion => suggestion.email;

  renderSuggestion = suggestion => (
    <div>
      {suggestion.email}
    </div>
  );

  submitHandler(status) {
    event.preventDefault();
    const token = this.props.token;
    const confId = this.props.confId;
    const formData = {};
    for (const field in this.refs) {
      if (field == 'startDate' || field == 'endDate') 
        formData[field] = this.refs[field].props.value ? this.refs[field].props.value : ''
      else if (field == 'file')
        formData[field] = findDOMNode(this.refs.file).files[0]
      else if (field == 'map')
        formData[field] = this.refs[field].props.value == false ? '' : 'on'
      else{
        formData[field] = this.refs[field].props.value ? this.refs[field].props.value : ''
      }
    }
    formData.speakers = this.state.value
    formData.status = status
    this.closeModal();
    // if (this.props.autosaveDraftId && !this.state.draftPage)
    //   this.state.actions.deleteEvent(this.props.autosaveDraftId, token, confId, this.state.draftPage);
    if (this.state.editMode)
      this.state.actions.postEditEvent(this.state.currentEvent.event.id, token, confId, formData, this.state.draftPage);
    else {
        this.state.actions.postCreateEvent(token, confId, formData, this.state.draftPage);
    }
    
  }

  openModal() {
    this.setState({ toggle: true })
  }

  closeModal() {
    this.setState({ toggle: false })
  }

  setData(e, field) {
    let event = this.state.currentEvent
    if (field == 'eventTitle')
      event.event['title'] = e.target.value
    else if (field == 'startDate') {
      this.setState({startDate: e.target.value})
      event.schedule[field] = e.target.value
    }
    else if (field == 'endDate') {
      this.setState({endDate: e.target.value})
      event.schedule[field] = e.target.value
    }
    else if (field == 'map')
      event.event.metadata[field] = e.target.checked == false ? '' : 'on'
    else if (field == 'trackId')
      event.event.trackId = e.target.value
    else
      event.event.metadata[field] = e.target.value

    this.setState({
      currentEvent: {
        event: event.event ,
        members: event.members ? event.members : '',
        schedule: event.schedule ? event.schedule : ''
      }
    })
  }
  
  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  
  getMembers(members) {
    if (Object.keys(members).length !== 0) {
        let joinmem = []
        members.map(members => {
            joinmem.push(members.email)
        })
        return joinmem.join();
    }
    return ''
  }

  formatDate(date) {
    return dateFormat(date, "yyyy-mm-dd HH:MM:ss")
  }

  render() {
    const { tracks } = this.props
    const { suggestions, currentEvent} = this.state;
    const value = this.state.value ? this.state.value : this.getMembers(currentEvent.members)
    const inputProps = {
      ref: 'speakers',
      placeholder: 'Speakers',
      value,
      onChange: this.onChange
    };
    let selectorOptions = tracks.map( (track, index) => {
      return (
          <option key={index} value={track.id}>
            {track.title}
          </option>
        )
      })
    let style = {'zIndex': 1003,
      'display': 'block',
      'opacity': 1,
      'transform': 'scaleX(1)',
      'top': '10%'}
      
    return (
      <Modal 
        id='eventModal' 
        className='modal' 
        style={this.state.toggle ? style : {}}
        fixedFooter
        actions={<div>
          <Button waves='light' className='modal-action modal-close red'
            onClick={() => this.state.actions.toggle(this.state.toggle)}>CLOSE</Button>
          <Button waves='light' className="modal-action modal-close teal" 
            onClick={() => {this.submitHandler('draft'); }}> Draft</Button>
            <Button waves='light' className="modal-action modal-close teal" 
            onClick={() => {this.submitHandler('published'); }}> Publish </Button>
        </div>}
        header={<div>{this.state.editMode ? this.state.editHeader : this.state.createHeader}</div>}
      >
        <div>
        <Row>
        <div>
          <p className="option">Image Upload (Optional)</p>
          <div className="file-field input-field">
            <div className="btn">
              <span>
                <Icon>camera_alt</Icon>
              </span>
              <input type="file" ref="file"/>
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" value={this.state.currentEvent.event.metadata ? this.state.currentEvent.event.metadata.imageName : ""}/>
            </div>
          </div>
        </div>

        <div>
        <Input s={12} label="Event Title" ref="eventTitle" value={this.state.currentEvent.event.title} onChange={(e) => this.setData(e, 'eventTitle')}  />
        <Input s={12} label="Start Time(YYYY-MM-DD HH:MM:SS)" ref="startDate" value={this.state.startDate} onChange={(e) => this.setData(e, 'startDate')} />
        <Input s={12} label="End Time(YYYY-MM-DD HH:MM:SS)" ref="endDate" value={this.state.endDate} onChange={(e) => this.setData(e, 'endDate')} />
        <Input s={12} label="Location" ref="location" value={this.state.currentEvent.event.metadata ? this.state.currentEvent.event.metadata.location : ""} onChange={(e) => this.setData(e, 'location')}/>
        <Input s={12} label="Description (Optional)" ref="description" value={this.state.currentEvent.event.metadata ? this.state.currentEvent.event.metadata.description : ""} onChange={(e) => this.setData(e, 'description')}/>
        <Input s={6} type='select' label="track" ref="trackId" value={this.state.currentEvent.event.trackId ? this.state.currentEvent.event.trackId : (this.props.trackId ? this.props.trackId : (tracks[0] ? tracks[0].id : ''))} onChange={(e) => this.setData(e, 'trackId')}>
          {selectorOptions}
        </Input>
        </div>
        <Row>
        <Col s={12}>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />
        </Col>
        
        <Col s={12}>
          <p className="option">Enable Google Maps?</p>
          <Input s={12} type='switch' ref="map" value={this.state.currentEvent.event.metadata ? (this.state.currentEvent.event.metadata.map == 'on' ? 'on' : '') : ""} checked={this.state.currentEvent.event.metadata ? (this.state.currentEvent.event.metadata.map == 'on' ? true : false) : false} onChange={(e) => this.setData(e, 'map')}/>
        </Col>
        </Row>
        </Row>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  speakers: state.data.speakers,
  confId: state.config.confId,
  tracks: state.data.tracks,
  token: state.auth.token,
  toggle: state.data.toggle,
  currentEvent: state.data.currentEvent,
  isFetching: state.data.isFetching,
  editMode: state.data.editMode,
  draftPage: state.data.draftPage,
  autosaveDraftId: state.data.autosaveDraftId
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(eventModal);
