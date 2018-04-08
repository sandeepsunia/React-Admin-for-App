'use strict'

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import UserModal from './UserModal';
import { findDOMNode } from 'react-dom'
import {
  Button,
  Col,
  Table,
  Dropdown,
  NavItem,
  Icon,
  Row,
  Input,
  Modal,
  Pagination
} from 'react-materialize';


export class UsersView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      activePage: 1,
      usersPerPage: props.usersPerPage ? props.usersPerPage : 5,
      openModal: false,
      editMode: false
    };
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handlePageCountChange = this.handlePageCountChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleCsvSubmit = this.handleCsvSubmit.bind(this);
  }

  handleCsvSubmit(event) {
		event.preventDefault();
		const token = this.props.token;
    const confId = this.props.confId;
    const formData = {};
    for (const field in this.refs) {
            if (field == 'file')
                formData[field] = findDOMNode(this.refs.file).files[0]
            else
    		  		formData[field] = this.refs[field].state.value ? this.refs[field].state.value : '';
		}
    this.props.actions.uploadUsers(formData, token);
  }
  
  handlePageChange(pageNumber) {
    this.setState({activePage: pageNumber});
  }

  handlePageCountChange() {
    this.setState({usersPerPage: parseInt($('#items').val())})
    this.setState({activePage: 1});
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    let token = this.props.token;
    this.props.actions.fetchUsersData(token);
  }

  handleSearch(event) {
    let string = event.target.value
    let matchedUsers = []
    let users = this.props.users
    let str = ''
    matchedUsers = users.filter(user => user.name.toLowerCase().includes(string.toLowerCase()))
    this.setState({activePage: 1});
    this.props.dispatch(this.props.actions.receiveMatchedUsers(matchedUsers))
  }

  render() {
    const { matchedUsers, users, actions, token } = this.props;
    let count = matchedUsers.length
    let usersShow = []
    let usersPerPage = this.state.usersPerPage
    let lastPage = (count%usersPerPage == 0) ? Math.floor(count/usersPerPage) : Math.floor(count/usersPerPage) + 1
    if (this.state.activePage == lastPage)
        usersShow = matchedUsers.slice(usersPerPage*(lastPage-1), (count%usersPerPage == 0) ? usersPerPage*(lastPage-1)+usersPerPage : usersPerPage*(lastPage-1) + count%usersPerPage)
    else
        usersShow = matchedUsers.slice(usersPerPage*(this.state.activePage-1), usersPerPage*this.state.activePage)
    return (
      <div>
        <h3>Users</h3>
        <Row><Input s={6} label="Search" validate onChange={this.handleSearch}><Icon>search</Icon></Input></Row>
        <div>
          <UserModal
            token={token}
            currentUser={this.state.currentUser}
            editMode={this.state.editMode}
            openModal={this.state.openModal}
            createHeader='Create User'
            editHeader='Edit User'
            actions={actions}/>
            <div>
              <p className="option">CSV Upload</p>
              <div className="file-field input-field">
                <div className="btn">
                  <span>
                    <Icon>insert_chart</Icon>
                  </span>
                  <input  type="file" ref="file"/>
                </div>
                <div className="file-path-wrapper">
                  <input placeholder="Header row(order should be same) -- email, name, affiliation, title, contact, speaker(speaker can take value true or false)" className="file-path validate" type="text" value=''/>
                </div>
              </div>
            </div>
            <div>
            {this.props.uploadMessage ? <div className='alert alert-info'><h4>{this.props.uploadMessage}</h4></div> : ''}
            <Button  
              className="teal"
              waves='light' onClick={this.handleCsvSubmit}>Submit</Button>
              </div>
              <br></br>
        </div>
        <div>
        <Button waves='light'
          className="teal"
          onClick={() => {
            actions.setEditMode(false)
            actions.flushUser()
            actions.toggle(false)
          }}>Create User</Button>
        
        <Table striped={true} responsive={true} bordered={true} hoverable={true}>
            <thead>
              <tr>
                <th data-field="image">Image</th>
                <th data-field="name">Name</th>
                <th data-field="email">Email</th>
                <th data-field="title">Title</th>
                <th data-field="affilliation">Affiliation</th>
                <th data-field="contact">Contact</th>
                <th data-field="bio">Bio</th>
                <th data-field="abstract">Abstract</th>
                <th data-field="talk">Talk Title</th>
                <th data-field="edit">Edit</th>
                <th data-field="delete">Delete</th>
              </tr>
            </thead>

            <tbody>
              {usersShow.map(user => {
                return (
                  <tr key={user.id}>
                  {user.picture ? <td><Icon small>done</Icon></td> : <td><Icon small>launch</Icon></td>}
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.title}</td>
                    <td>{user.affiliation}</td>
                    <td>{user.contact}</td>
                    <td>{user.bio}</td>
                    <td>{user.speaker ? user.abstract : ""}</td>
                    <td>{user.speaker ? user.talkTitle : ""}</td>
                    <td>
                      <Button
                        floating 
                        waves='light' 
                        onClick={() => {
                          actions.editUser(user, token)
                          actions.toggle()
                        }}><Icon small>edit</Icon></Button>
                      
                    </td>
                    <td>
                      <Button
                        floating 
                        className="red"
                        waves='light' 
                        onClick={() => {
                          actions.deleteUser(user.id, token);
                        }}><Icon small>delete</Icon></Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>    
        </div>
        <Col s={12}>
        <Input s={1} type='select' id="items" defaultValue={this.state.usersPerPage} onChange={this.handlePageCountChange}>
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
            items={count%usersPerPage == 0 ? Math.floor(count/usersPerPage) : Math.floor(count/usersPerPage)+1}
            onSelect={this.handlePageChange}
            />
        </div>
        </Col>
      </div>

    );

  }
}

const mapStateToProps = (state) => ({
  users: state.data.users,
  isFetching: state.data.isFetching,
  uploadMessage: state.data.uploadMessage,
  matchedUsers: state.data.matchedUsers,
  usersPerPage: state.data.usersPerPage,
  submitError: state.data.submitError
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
