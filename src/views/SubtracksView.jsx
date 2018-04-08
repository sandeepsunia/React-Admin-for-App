'use strict'

import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import {Link} from 'react-router';
import { Col, Card, Row, Button, Modal, Input} from 'react-materialize';

export default class SubtracksView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
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
        let subtrack=1;
        let parentId = this.props.location.query.id ? this.props.location.query.id : 0
        let trackName = this.props.location.query.trackName
        this.props.actions.fetchTracksData(token, confId, subtrack=1, parentId, trackName);
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
       let subtrack=1
       let parentId = this.props.location.query.id ? this.props.location.query.id : 0
       let trackName = this.props.location.query.trackName
       trackTitle = this.refs['trackTitle'].state.value ? this.refs['trackTitle'].state.value : '';
       let startDate = this.refs['startDate'].state.value ? this.refs['startDate'].state.value : '';
       let endDate = this.refs['endDate'].state.value ? this.refs['endDate'].state.value : '';
       this.props.actions.createTrack(token, confId, trackTitle, startDate, endDate, subtrack=1, parentId, trackName);
    }

    render () {
        console.log(this.props.location)
        return (
		    <div>
		        <h5>
                <Link to="/tracks">{this.props.location.query.trackName}  </Link>
                >>  SubTracks</h5>
			    <div>

                <Row>
                {this.props.tracks.map((track, index) => (
                    <Col key={track.id} s={4}>
					    <Card textClassName='white-text' title={track.title} actions={
                            <p>
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
                <Card textClassName='white-text' title="New SubTrack" actions={<a href='#'>
			                <Modal id='newsubtrack'
                                header='Create New SubTrack'
                                trigger={<Button floating large  waves='light' icon='add' />}
                                fixedFooter
                                actions={<div>
                                    <Button waves='light' className='modal-action modal-close red'>CLOSE</Button>
                                    <Button waves='light' className="modal-action modal-close teal"
                                    onClick={ () => {$('#newtrack').toggle(); this.add()}}>Add</Button>
                                </div>}
                            >
                                <Input s={6} label="Track Title" ref="trackTitle" />
                                <Input s={6} label="From Date(YYYY-MM-DD HH:MM:SS)" ref='startDate' type="text"/>
                                <Input s={6} label="End Date(YYYY-MM-DD HH:MM:SS)" ref='endDate' type="text"/>
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
    isFetching: state.data.isFetching
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SubtracksView);


