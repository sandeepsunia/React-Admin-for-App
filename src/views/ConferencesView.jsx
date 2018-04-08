'use strict'

import React from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import {Link} from 'react-router';
import { findDOMNode } from 'react-dom'

import { 
    Button,
    Col, 
    Dropdown, 
    Icon,
    Input, 
    NavItem,
    Row,
    Table, 
} from 'react-materialize';

export class ConferencesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            conferences: props.conferences,
            submitError: props.submitError,
            statusMessage: props.statusMessage
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getFormattedDate = this.getFormattedDate.bind(this);
    }

    componentWillMount () {
        this.fetchData();
    }

    fetchData () {
        let token = this.props.token;
        let confId = this.props.confId;
        this.props.actions.fetchConferencesData(token, confId);
    }

    handleSubmit(event) {
		event.preventDefault();
		const redirectTo = this.props.location.query.next || '/conferences';
        const token = this.props.token;
        const confId = this.props.confId;
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
        this.props.actions.updateConference(token, confId, formData);
	}
    
    getFormattedDate(date) {
        let d = new Date(date);
        return d.getFullYear() + "-" + 
        ("00" + (d.getMonth() + 1)).slice(-2) + "-" + 
        ("00" + d.getDate()).slice(-2) + " " +
        ("00" + d.getHours()).slice(-2) + ":" + 
        ("00" + d.getMinutes()).slice(-2) + ":" + 
        ("00" + d.getSeconds()).slice(-2)
    }

    render () {
        const venueName = this.props.conferences.venue ? this.props.conferences.venue.venueName : ''
        const venueAddress = this.props.conferences.venue ? this.props.conferences.venue.venueAddress : ''
        const venuePhone = this.props.conferences.venue ? this.props.conferences.venue.venuePhone : ''
        const venueDescription = this.props.conferences.venue ? this.props.conferences.venue.venueDescription : ''
        const organiserName = this.props.conferences.organiser ? this.props.conferences.organiser.organiserName : ''
        const organiserPhone = this.props.conferences.organiser ? this.props.conferences.organiser.organiserPhone : ''
        const organiserEmail = this.props.conferences.organiser ? this.props.conferences.organiser.organiserEmail : ''
        const organiserUrl = this.props.conferences.organiser ? this.props.conferences.organiser.organiserUrl : ''
        const organiserBio = this.props.conferences.organiser ? this.props.conferences.organiser.organiserBio : ''
        const conferenceMessage = this.props.conferences.metadata ? this.props.conferences.metadata.conferenceMessage : ''
        const conferenceTwitterHandle = this.props.conferences.metadata ? this.props.conferences.metadata.conferenceTwitterHandle : ''
        const conferenceTwitterHashtag = this.props.conferences.metadata ? this.props.conferences.metadata.conferenceTwitterHashtag : ''
        const conferenceMaps = this.props.conferences.metadata ? this.props.conferences.metadata.conferenceMaps : ''
        const sponsorName = this.props.conferences.metadata ? this.props.conferences.metadata.sponsorName : ''
        const sponsorUrl = this.props.conferences.metadata ?  this.props.conferences.metadata.sponsorUrl : ''
        const sponsorLevel = this.props.conferences.metadata ? this.props.conferences.metadata.sponsorLevel : ''
        const sponsorBio = this.props.conferences.metadata ? this.props.conferences.metadata.sponsorBio : ''
        const sponsorLogoName = this.props.conferences.metadata ? this.props.conferences.metadata.sponsorLogoName : ''
        const organiserLogoName = this.props.conferences.organiser ? this.props.conferences.organiser.organiserLogoName : ''
        const conferenceLogoName = this.props.conferences.metadata ? this.props.conferences.metadata.conferenceLogoName : ''
        const conferenceImageName = this.props.conferences.image ? this.props.conferences.image : ''
        const startDate = this.getFormattedDate(this.props.conferences.schedule ? this.props.conferences.schedule.startDate : '')
        const endDate = this.getFormattedDate(this.props.conferences.schedule ? this.props.conferences.schedule.endDate : '')

        
        return (
            
            <div className="view">
                {this.props.submitError ? <div>{this.props.submitError}</div> : ""}
                {this.props.isUpdating === false ? <div> {this.props.statusMessage} </div> : ""}
                
                <div>
                <Row className="conferenceBox"> 
                    <h5 className="bold">Conference</h5>
                    <Input s={6} label="Name" ref="conferenceName" defaultValue={this.props.conferences.title} />
                    <Input s={6} label="Conference Abbreviation" ref="abbreviation" validate defaultValue={this.props.conferences.abbreviation}  />
                    <Input s={6} label="From Date(YYYY-MM-DD HH:MM:SS)" ref='startDate' type="text" defaultValue={this.getFormattedDate(startDate)}/>
                    <Input s={6} label="End Date(YYYY-MM-DD HH:MM:SS)" ref='endDate' type="text" defaultValue={this.getFormattedDate(endDate)}/>
                    <Input s={6} label="Website URL" validate ref="url" defaultValue={this.props.conferences.url}  />
                    <Input s={12} label="Description" validate ref="description" defaultValue={this.props.conferences.description}  />
                  
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
                            <input className="file-path validate" type="text" defaultValue={conferenceImageName}/>
                        </div>
                        </div>
                    </div>
                    </Col>
                </Row>

                <Row className="conferenceBox">
                    <h5 className="bold">Venue</h5>
                    <Input s={4} label="Name" validate ref="venueName" defaultValue={venueName}  />
                    <Input s={4} label="Address (number, street, city, state, zip)"  ref="venueAddress" defaultValue={venueAddress} />
                    <Input s={4} label="Phone" validate ref="venuePhone" defaultValue={venuePhone} />
                    <Input s={12} label="Description" validate ref="venueDescription" defaultValue={venueDescription}  />
                </Row>


                <Row className="conferenceBox">
                    <h5 className="bold">Organizer</h5>
                    <Input s={6} label="Name" validate ref="organiserName" defaultValue={organiserName}  />
                    <Input s={6} label="Phone" validate ref="organiserPhone" defaultValue={organiserPhone}  />
                    <Input s={6} label="Email" validate ref="organiserEmail" defaultValue={organiserEmail}  />
                    <Input s={6} label="Website URL" validate ref="organiserUrl" defaultValue={organiserUrl}  />
                    <Input s={12} label="Bio (max 50 characters)" validate ref="organiserBio" defaultValue={organiserBio}  />
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
                            <input className="file-path validate" type="text" defaultValue={organiserLogoName}/>
                        </div>
                        </div>
                    </div>
                    </Col>
                </Row>



                <Row className="conferenceBox">
                    <h5 className="bold">Conference (Optional)</h5>
                    <Input s={6} label="Welcome Message" validate ref="conferenceMessage" defaultValue={conferenceMessage}  />
                    <Input s={6} label="Twitter Handle" validate ref="conferenceTwitterHandle" defaultValue={conferenceTwitterHandle}  />
                    <Input s={6} label="Twitter Hashtag" validate ref="conferenceTwitterHashtag" defaultValue={conferenceTwitterHashtag}  />
                    <Col s={6}>
                        <p className="option">Enable Google Maps?</p>
                        <Input s={12} type='switch' ref="conferenceMaps" defaultChecked={conferenceMaps}  />
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
                            <input className="file-path validate" type="text" defaultValue={conferenceLogoName}/>
                        </div>
                        </div>
                    </div>
                    </Col>
                </Row>


                <Row className="conferenceBox">
                    <h5 className="bold">Sponsors (Optional)</h5>
                    <Input s={4} label="Name" validate  ref="sponsorName" defaultValue={sponsorName} />
                    <Input s={4} label="Website URL" validate ref="sponsorUrl" defaultValue={sponsorUrl}  />
                    <Input s={2} type='select' label="Level" ref="sponsorLevel" defaultValue={sponsorLevel}>
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
                    <Input s={12} label="Bio (max 50 characters)" ref="sponsorBio" defaultValue={sponsorBio}  />
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
                            <input className="file-path validate" type="text" defaultValue={sponsorLogoName}/>
                        </div>
                        </div>
                    </div>
                    </Col>
                </Row>
                <Button className='red' waves='light' onClick={this.handleSubmit}>Save</Button>
                </div>
            </div>
        );
    }
}


  const mapStateToProps = (state) => ({
      conferences: state.data.conferences,
      confId: state.config.confId,
      isFetching: state.data.isFetching,
      isUpdating: state.data.isUpdating,
      statusMessage: state.data.statusMessage,
      submitError: state.data.submitError
  });
  
  const mapDispatchToProps = (dispatch) => ({
    actions : bindActionCreators(actionCreators, dispatch)
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(ConferencesView);
