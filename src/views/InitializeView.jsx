'use strict'

import React from 'react';
import {Link} from 'react-router';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import { findDOMNode } from 'react-dom'
import ConferencesView from './ConferencesView';
import TracksView from './TracksView';
import EventsView from './EventsView';
import UsersView from './UsersView';


import {
	Button,
	Chip,
	Col,
	Dropdown,
	Icon,
	Input,
	Modal, 
	NavItem,
	Row,
	Table, 
    Tab,
    Tabs,
    Tag,
} from 'react-materialize';

export class InitializeView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			...props
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validateFields = this.validateFields.bind(this);
		
    }
	
	validateFields(name, start, end, desc, trackTitle, trackstart, trackend) {
		if (name.length===0 || start.length===0 || end.length===0 || desc.length===0 ||
		trackstart.length===0 || trackend.length===0)
			return false
		return true
	}

	handleSubmit(event) {
		event.preventDefault();
        const token = this.props.token;
		const formData = {};
		for (const field in this.refs) {
			if (field == 'file')
                formData[field] = findDOMNode(this.refs.file).files[0]
            else if (field == 'organiserLogo')
                formData[field] = findDOMNode(this.refs.organiserLogo).files[0]
            else if (field == 'conferenceLogo')
                formData[field] = findDOMNode(this.refs.conferenceLogo).files[0]  
            else if (field == 'sponsorLogo')
                formData[field] = findDOMNode(this.refs.sponsorLogo).files[0]
            else
		  		formData[field] = this.refs[field].state.value ? this.refs[field].state.value : '';
		}
		let valid = this.validateFields(formData['conferenceName'], formData['startDate'], 
			formData['endDate'], formData['description'], formData['trackTitle'], 
			formData['trackStartDate'], formData['trackEndDate'])
		if(valid) {
			this.props.actions.createConference(token, formData);
			this.setState({error: ""})
		} else
			this.setState({ error: 'ConfName, ConfDescription, trackTitle and startDate, endDate for \
			both conference and track required' })	
		
	}
	
    render () {
		const { actions, token, confId } = this.props;
        return (
            <div>
                <h3>Getting Started</h3>
				{this.props.confError ? <div className='alert alert-info red'>{this.props.confError}</div> : ''}
				{this.state.error ? <div className='alert alert-info red'><h4>{this.state.error}</h4></div> : ''}
					<div className="view">
						<Row className="conferenceBox"> 
							<h5 className="bold">Conference</h5>
							<Input s={6}  label="Name" ref="conferenceName"  />
							<Input s={6} label="Conference Abbreviation" ref="abbreviation"  />
							<Input s={6}  label="From Date(YYYY-MM-DD HH:MM:SS)" ref='startDate' type="text"/>
                    		<Input s={6}  label="End Date(YYYY-MM-DD HH:MM:SS)" ref='endDate' type="text"/>
							<Input s={6} label="Website URL" ref="url" />
							<Input s={12}  label="Description" ref="description" />
							<Col s={6}>
							<div>
								<p className="option">Background Image</p>
								<div className="file-field input-field">
								<div className="btn">
									<span>
									<Icon>camera_alt</Icon>
									</span>
									<input type="file" ref="file"/>
								</div>
								<div className="file-path-wrapper">
									<input className="file-path validate" type="text" />
								</div>
								</div>
							</div>
							</Col>
						</Row>

						<Row className="conferenceBox">
							<h5 className="bold">Venue</h5>
							<Input s={4} label="Name" ref="venueName"  />
							<Input s={4} label="Address (number, street, city, state, zip)" ref="venueAddress"  />
							<Input s={4} label="Phone"   ref="venuePhone"/>
							<Input s={12} label="Description" ref="venueDescription" />
						</Row>


						<Row className="conferenceBox">
							<h5 className="bold">Organizer</h5>
							<Input s={6} label="Name" ref="organiserName" />
							<Input s={6} label="Phone" ref="organiserPhone" />
							<Input s={6} label="Email" ref="organiserEmail" />
							<Input s={6} label="Website URL" ref="organiserUrl" />
							<Input s={12} label="Bio (max 50 characters)" ref="organiserBio" />
							<Col s={6}>
							<div>
								<p className="option">Organizer Logo </p>
								<div className="file-field input-field">
								<div className="btn">
									<span>
									<Icon>camera_alt</Icon>
									</span>
									<input type="file" ref="organiserLogo"/>
								</div>
								<div className="file-path-wrapper">
									<input className="file-path validate" type="text" />
								</div>
								</div>
							</div>
							</Col>
						</Row>



						<Row className="conferenceBox">
							<h5 className="bold">Conference (Optional)</h5>
							<Input s={6} label="Welcome Message" ref="conferenceMessage"  />
							<Input s={6} label="Twitter Handle"  ref="conferenceTwitterHandle"  />
							<Input s={6} label="Twitter Hashtag"  ref="conferenceTwitterHashtag" />
							<Col s={6}>
								<p className="option">Enable Google Maps?</p>
								<Input s={12} type='switch' ref="conferenceMaps" />
							</Col>
							<Col s={12}>
							<div>
								<p className="option">Conference Logo </p>
								<div className="file-field input-field">
								<div className="btn">
									<span>
									<Icon>camera_alt</Icon>
									</span>
									<input type="file" ref="conferenceLogo"/>
								</div>
								<div className="file-path-wrapper">
									<input className="file-path validate" type="text" />
								</div>
								</div>
							</div>
							</Col>
						</Row>
						<Row className="conferenceBox">
							<h5 className="bold">Sponsors (Optional)</h5>
							<Input s={5} label="Name" ref="sponsorName"  />
							<Input s={5} label="Website URL"  ref="sponsorUrl" />
							<Input s={2} type='select' label="Level" ref="sponsorLevel" defaultValue='1'>
								<option value='1'>1</option>
								<option value='2'>2</option>
								<option value='3'>3</option>
								<option value='4'>4</option>
								<option value='5'>5</option>
								<option value='6'>6</option>
								<option value='7'>7</option>
								<option value='8'>8</option>
								<option value='9'>9</option>
								<option value='10'>10</option>
							</Input>

							<Input s={12} label="Bio (max 50 characters)" ref="sponsorBio" />
							<Col s={6}>
							<div>
								<p className="option">Sponsor Logo </p>
								<div className="file-field input-field">
								<div className="btn">
									<span>
									<Icon>camera_alt</Icon>
									</span>
									<input type="file" ref="sponsorLogo"/>
								</div>
								<div className="file-path-wrapper">
									<input className="file-path validate" type="text" />
								</div>
								</div>
							</div>
							</Col>
						</Row>
					</div>
					<div className="view">
						<h5 className="bold">Tracks</h5>
						</div>
						<Row>
						<p>You can create only one track form here.</p>
						<Input s={10}  label="Track Title" type='text' ref="trackTitle"/>
						<Input s={5} label="From Date(YYYY-MM-DD HH:MM:SS)" ref='trackStartDate' type="text"/>
                    	<Input s={5} label="End Date(YYYY-MM-DD HH:MM:SS)" ref='trackEndDate' type="text"/>
						</Row>

					<div className="view">
					<h5 className="bold">You are now ready to create events!</h5>
					</div>
					<p>
						Add events, event details, and create speakers. After creating events, move onto Users. Here you can add, update, and delete users.
					</p>

					<div>
						<Button waves='light' className='red' node='a' onClick={this.handleSubmit} >Go to Events</Button>
					</div>

            </div>
        );
    }
}


const mapStateToProps = (state) => ({
	conferences: state.data.conferences
  });
  
  const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(actionCreators, dispatch)
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(InitializeView);
  
