'use strict'

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findDOMNode } from 'react-dom'
import * as actionCreators from '../actions';
import {
  Button,
  Table,
  Dropdown,
  NavItem,
  Pagination,
  Icon,
  Row,
  Input,
  Modal
} from 'react-materialize';


const initUser = {
  name: "",
  email: "",
  password: "",
  title: "",
  picture: "",
  bio: "",
  affiliation: "",
  abstract: "",
  talkTitle: "",
  contact: "",
  speaker: false
}

export class UserModal extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      token: props.token,
      toggle: props.toggle || false,
      editMode: props.editMode || false,
      currentUser: props.currentUser ? (Object.keys(props.currentUser).length == 0 ? initUser : props.currenrUser) : initUser,
      actions: props.actions,
      createHeader: props.createHeader,
      editHeader: props.editHeader
    }
    this.submitHandler = this.submitHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(`Edit Mode ${JSON.stringify(nextProps.editMode)}`)
    console.log(`Current User ${JSON.stringify(nextProps.currentUser)}`)
    this.setState({
      toggle: nextProps.toggle,
      editMode: nextProps.editMode,
      toggle: nextProps.toggle,
      currentUser: nextProps.editMode ? nextProps.currentUser : initUser,
      editHeader: nextProps.editHeader,
      createHeader: nextProps.createHeader,
      token: nextProps.token
    })
    
  }

  submitHandler() {
    const formData = {};
    if (this.state.editMode){
      for (const field in this.refs) {
        if (field == 'file')
          formData[field] = findDOMNode(this.refs.file).files[0]
        else
          formData[field] = this.refs[field].props.value;
      }
      this.state.actions.postEditUser(this.state.currentUser.id, formData, this.state.token);
    } else {
      for (const field in this.refs) {
        if (field == 'file')
          formData[field] = findDOMNode(this.refs.file).files[0]
        else
          formData[field] = this.refs[field].state.value;
      }
      this.state.actions.postCreateUser(formData, this.state.token);
    }
  }

  openModal() {
    this.setState({ toggle: true })
  }

  closeModal() {
    this.setState({ toggle: false })
  }

  setData(e, field) {
    let user = this.state.currentUser
    if (field == 'speaker')
      user[field] = e.target.checked == false ? false : true
    else
      user[field] = e.target.value
    this.setState({
      currentUser: {
        ...user
      }
    })
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  render() {
    // const { toggle, editMode, actions, createHeader, editHeader } = this.props
    let style = {'zIndex': 1003,
      'display': 'block',
      'opacity': 1,
      'transform': 'scaleX(1)',
      'top': '5%'}
    return (
      <Modal 
        id='userModal' 
        className='modal' 
        style={this.state.toggle ? style : {}}
        fixedFooter
        actions={<div>
          <Button waves='light' className='red'
            onClick={() => this.state.actions.toggle(this.state.toggle)}>CLOSE</Button>
          <Button waves='light' className="modal-action modal-close teal" 
            onClick={ this.submitHandler.bind(this) }>Save</Button>
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
                  <input className="file-path validate" type="text" value={this.state.currentUser.picture ? 'Image Exists' : ''}/>
                </div>
              </div>
            </div>
              <Input s={12} ref='name' label="Full Name" value={this.state.currentUser.name} onChange={(e) => this.setData(e, 'name')}/>
                {!this.state.editMode ? 
                  <div>
                    <Input s={12} ref='email' label="Email" value={this.state.currentUser.email} onChange={(e) => this.setData(e, 'email')}/>
                    <Input s={12} ref='password' type="password" label="Password"/>
                  </div>: ""}
              <Input s={12} ref='title' label="Title" value={this.state.currentUser.title} onChange={(e) => this.setData(e, 'title')}/>
              <Input s={12} ref='affiliation' label="Affiliation" value={this.state.currentUser.affiliation} onChange={(e) => this.setData(e, 'affiliation')}/>
              <Input s={12} ref='contact' label="Contact" value={this.state.currentUser.contact} onChange={(e) => this.setData(e, 'contact')}/>
              <Input s={12} ref='bio' label="Bio (max 250 words)" value={this.state.currentUser.bio} onChange={(e) => this.setData(e, 'bio')} />
              <Row>
                Speaker?<Input type='switch' ref='speaker'  value={this.state.currentUser.speaker ? this.state.currentUser.speaker : false} checked={this.state.currentUser.speaker ? true : false} onChange={(e) => this.setData(e, 'speaker')}/>                        
              </Row>
              {this.state.currentUser.speaker ?
              <div>
                <Input s={12} ref='abstract' label="Abstract (max 250 words)" value={this.state.currentUser.abstract} onChange={(e) => this.setData(e, 'abstract')} />
                <Input s={12} ref='talkTitle' label="Talk Title (max 250 words)" value={this.state.currentUser.talkTitle} onChange={(e) => this.setData(e, 'talkTitle')} />
              </div>
                : ""} 
            {this.props.submitError ? <div className='alert alert-info'>{this.props.submitError}</div> : ''}
          </Row>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  toggle: state.data.toggle,
  currentUser: state.data.currentUser,
  editMode: state.data.editMode,
  isFetching: state.data.isFetching,
  submitError: state.data.submitError
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserModal);
