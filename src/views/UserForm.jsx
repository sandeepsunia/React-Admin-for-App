import React from 'react'
import { bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import * as actionCreators from '../actions';

let UserForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={ handleSubmit }>
      
    </form>
  );
};

UserForm = reduxForm({
  form: 'userForm',
})(UserForm);



export default UserForm
