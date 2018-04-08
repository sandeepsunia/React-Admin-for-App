'use strict'

import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import {Link} from 'react-router';
import { Col, Card, Row, Button, Modal, Input} from 'react-materialize';

export default class TracksView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            tracks: props.tracks,
            currentTrack: {},
            isButtonDisabled: false
        };
        this.add = this.add.bind(this)
        this.delete = this.delete.bind(this)
    }

    componentWillMount () {
        this.fetchData();
    }

    fetchData () {
        let token = this.props.token;
        let confId = this.props.confId;
        this.props.actions.fetchTracksData(token, confId);
    }

    delete(trackId) {
        event.preventDefault();
        let token = this.props.token;
        this.props.actions.deleteTrack(token, trackId, this.props.tracks);
    }

    add(trackTitle) {
        event.preventDefault();
        let token = this.props.token;
        let confId = this.props.confId;
        trackTitle = this.refs['trackTitle'].state.value ? this.refs['trackTitle'].state.value : '';
        let startDate = this.refs['startDate'].state.value ? this.refs['startDate'].state.value : '';
        let endDate = this.refs['endDate'].state.value ? this.refs['endDate'].state.value : '';
        this.setState({currentTrack: {}})
        if (startDate && endDate && trackTitle)
            this.props.actions.createTrack(token, confId, trackTitle, startDate, endDate);
        else
            alert('Please provide Track details for new Track')
    }

    setData(e, field) {
    let currentTrack = this.state.currentTrack
    currentTrack[field] = e.target.value

    this.setState({
      currentTrack: {
        ...currentTrack
      }
    })
  }

    render () {
        return (
		    <div>
		      <h3>Tracks</h3>
			    <div>
                {this.props.submitError ? <div>{this.props.submitError}</div> : ""}
                <Row>
                {this.props.tracks.map((track, index) => (
                    <Col key={track.id} s={4}>
					    <Card textClassName='white-text' title={track.title} actions={
                            <p>
                            <Link to={'/subtracks?id=' + track.id + '&trackName=' + track.title}>
						        <Button waves='light' className="teal">Add Subtracks</Button>
					        </Link>
                            <Link to={'/events?trackId=' + track.id}>
						        <Button waves='light' className="teal">Add Events</Button>
					        </Link>
                                <a href='#'>
			                    <Modal id={'modalFor' + track.id}
                                    header='Are you sure?'
                                    trigger={<Button className='red' >Delete</Button>}
                                >
                                    <Button waves='light' className="red modal-action modal-close"
                                        onClick={()=> {$('#' + 'modalFor' + track.id).toggle(); 
                                        this.delete(track.id); }}>Delete</Button>
                                </Modal>
			 			        </a>
                            </p>}>
                        </Card>
					</Col>
                ))}
                <Col s={4}>
                <Card textClassName='white-text' title="New Track" actions={<a href='#'>
			                <Modal id='newtrack'
                                header='Create New Parent Track'
                                trigger={<Button floating large  waves='light' icon='add' />}
                                fixedFooter
                                actions={<div>
                                    <Button waves='light' className='modal-action modal-close red'>CLOSE</Button>
                                    <Button waves='light' className="modal-action modal-close teal"
                                    onClick={ () => {$('#newtrack').toggle(); this.add()}}>Add</Button>
                                </div>}
                            >
                                <Input s={6} label="Track Title" ref="trackTitle" type='text' value={this.state.currentTrack.trackTitle} onChange={(e) => this.setData(e, 'trackTitle')}/>
                                <Input s={6} label="From Date(YYYY-MM-DD HH:MM:SS)" ref='startDate' type="text" value={this.state.currentTrack.startDate} onChange={(e) => this.setData(e, 'startDate')}/>
                                <Input s={6} label="End Date(YYYY-MM-DD HH:MM:SS)" ref='endDate' type="text" value={this.state.currentTrack.endDate} onChange={(e) => this.setData(e, 'endDate')}/>
                                
                            </Modal>
			 			</a>}>
                    
                </Card>
            </Col>
            </Row>
					
			    </div>
		    </div>
        )
    }
}

const mapStateToProps = (state) => ({
    tracks: state.data.tracks,
    isFetching: state.data.isFetching,
    submitError: state.data.submitError,
    currentTrack: state.data.currentTrack
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TracksView);


