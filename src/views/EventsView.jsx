'use strict'

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import EventModal from './EventModal';
import dateFormat from 'dateformat';

import {
    Button, 
    Col,
    Chip,
    Tag,
    Dropdown, 
    Icon,
    Input,
    Modal,
    NavItem, 
    Pagination, 
    Row,
    Table,
} from 'react-materialize';

export class EventsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          ...props,
          activePage: 1,
          eventsPerPage: props.eventsPerPage ? props.eventsPerPage : 5,
          openModal: false,
          editMode: false,
          currentEvent: props.currentEvent,
          trackId: props.trackId,
          toggle: props.toggle
        };
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handlePageCountChange = this.handlePageCountChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }

    handlePageCountChange() {
        this.setState({eventsPerPage: parseInt($('#items').val())})
        this.setState({activePage: 1});
    }
    componentWillMount () {
        this.fetchData();
    }

    fetchData () {
        let token = this.props.token;
        let confId = this.props.confId;
        let subtrack = 2
        let trackId = this.props.location.query.trackId
        if (trackId) {
            this.setState({trackId: trackId})
            this.props.actions.setEditMode(false, trackId)
            this.props.actions.flushEvent()
            this.props.actions.toggle(false)
        }
        this.props.actions.fetchTracksData(token, confId, subtrack);
        this.props.actions.fetchSpeakersData(token);
        this.props.actions.fetchEventsData(token, confId, trackId);
    }
    
    handleSearch(event) {
        let string = event.target.value
        let matchedEvents1 = []
        let matchedEvents = []
        let events = this.props.events
        let str = ''
        events.map(event => {
            if (event.length !== 0) {
                for(var i = 0; i < event.length; i++) {
                    str = event[i].event.title
                    if(str.toLowerCase().includes(string.toLowerCase()))
                        matchedEvents.push(event[i]) 
                }
            }
        })
        this.setState({activePage: 1});
        matchedEvents1.push(matchedEvents)
        this.props.dispatch(this.props.actions.receiveMatchedEvents(matchedEvents1))
    }

    getMembers(members) {
        if (Object.keys(members).length !== 0) {
           let joinmem = []
           members.map(members => {
               joinmem.push(members.email)
           })
           return joinmem.join();
        }
    }

    render () {
        const { actions, token, confId } = this.props;
        let eventsShow = []
        this.props.matchedEvents.map(event => {
            if (event.length !== 0) {
                Object.keys(event).map((key, value) => {
                eventsShow.push(event[key])
            })}
        })
        let count = eventsShow.length
        let eventsPerPage = this.state.eventsPerPage
        let lastPage = (count%eventsPerPage == 0) ? Math.floor(count/eventsPerPage) : Math.floor(count/eventsPerPage) + 1
        if (this.state.activePage == lastPage)
            eventsShow = eventsShow.slice(eventsPerPage*(lastPage-1), (count%eventsPerPage == 0) ? eventsPerPage*(lastPage-1)+eventsPerPage : eventsPerPage*(lastPage-1) + count%eventsPerPage)
        else
            eventsShow = eventsShow.slice(eventsPerPage*(this.state.activePage-1), eventsPerPage*this.state.activePage)
        return (
            <div>
                <h3>Events</h3> 
                <Row>
                    <Input s={6} label="Search" validate onChange={this.handleSearch}><Icon>search</Icon></Input>
                </Row>
                <EventModal
                    token={token}
                    currentEvent={this.state.currentEvent}
                    editMode={this.state.editMode}
                    openModal={this.state.openModal}
                    createHeader='Add Event'
                    editHeader='Edit Event'
                    trackId={this.state.trackId}
                    actions={actions}/>
                
                <Button waves='light' 
                    className='teal' 
                    onClick={() => {
                        actions.setEditMode(false)
                        actions.flushEvent()
                        actions.toggle(false)
                    }}>Add Event</Button>
                    <Link to="/drafts">
						<Button waves='light' className="teal">Drafts</Button>
					</Link>
              <div class="container">
              <Table striped="true" responsive="true" bordered="true" hoverable="true">
                  <thead>
                      <tr>
                          <th data-field="img">Image</th>
                          <th data-field="id">Name</th>
                          <th data-field="desc">Description</th>
                          <th data-field="time">Time Block</th>
                          <th data-field="location">Location</th>
                          <th data-field="speakers">Speakers</th>
                          <th data-field="edit">Edit</th>
                          <th data-field="delete">Delete</th>
                      </tr>
                  </thead>

                  <tbody>
                  {eventsShow.map(event => {
                        return (
                            <tr key={event.event.id}>
                            {event.event.image ? <td><Icon small>done</Icon></td> : <td><Icon small>launch</Icon></td>}
                            <td>{event.event.title}</td>
                            <td>{event.event.metadata ? event.event.metadata.description : ""}</td>
                            <td>{dateFormat(event.schedule.startDate, "yyyy-mm-dd HH:MM:ss")} - {dateFormat(event.schedule.endDate, "yyyy-mm-dd HH:MM:ss")}</td>
                            <td>{event.event.metadata ? event.event.metadata.location : ""}</td>
                            <td>{this.getMembers(event.members)}</td>

                            <td>
                            <Button
                                floating 
                                waves='light' 
                                onClick={() => {
                                    actions.editEvent(event, token)
                                    actions.toggle()
                                }}>
                                <Icon small>edit</Icon>
                            </Button>
                            </td>
                            <td>
                            <Button
                                floating 
                                className="red"
                                waves='light' 
                                onClick={() => {
                                    actions.deleteEvent(event.event.id, token, confId, this.state.draftPage);
                                }}><Icon small>delete</Icon></Button>
                            </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            </div>

              <Col s={12}>
              Show Entries
              <Input s={1} type='select' id="items" defaultValue={this.state.eventsPerPage} onChange={this.handlePageCountChange}>
                    <option value='5'>5</option>
                    <option value='10'>10</option>
                    <option value='20'>20</option>
                    <option value='50'>50</option>
                </Input>
              </Col>

          <Col s={12}>
            <div>
              <Pagination
                activePage={this.state.activePage}
                items={count%eventsPerPage == 0 ? Math.floor(count/eventsPerPage) : Math.floor(count/eventsPerPage)+1}
                onSelect={this.handlePageChange}
              />
            </div>
          </Col>



          </div>
              );
    }
}

const mapStateToProps = (state) => ({
    events: state.data.events,
    confId: state.config.confId,
    speakers: state.data.speakers,
    isFetching: state.data.isFetching,
    tracks: state.data.tracks,
    matchedEvents: state.data.matchedEvents,
    eventsPerPage: state.data.eventsPerPage,
    currentEvent: state.data.currentEvent,
    toggle: state.data.toggle,
    editMode: state.data.editMode,
    trackId: state.data.trackId
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsView);
