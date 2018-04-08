import React from 'react/addons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reactMixin from 'react-mixin';
import * as actionCreators from '../actions';
import {
  Col,
  Row,
} from 'react-materialize';


export class LoginView extends React.Component {

  constructor(props) {
    super(props);
    const redirectRoute = this.props.location.query.next || '/users'; // TODO: Change this to dashboard
    this.state = {
      email: '',
      password: '',
      redirectTo: redirectRoute
    };
  }

  login(event) {
    event.preventDefault();
    this.props.actions.loginUser(this.state.email, this.state.password, this.state.redirectTo);
  }

  render() {
    return (
      <Row>
        <Col s={4} />
        <Col s={4}>
          <div className="z-depth-1 darkgrey lighten-4 row loginForm">
            <h3> Login </h3>
            {this.props.statusText ? <div className='alert alert-info'>{this.props.statusText}</div> : ''}
            <form role='form' className='col s12'>
              <div className="row">
                <div className="input-field col s12">
                  <input type='text'
                    className="validate"
                    valueLink={this.linkState('email')}
                    placeholder='Email' />
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input type='password'
                    className="validate"
                    valueLink={this.linkState('password')}
                    placeholder='Password' />
                </div>
              </div>
              <button type='submit'
                className='waves-effect waves-light btn s12'
                disabled={this.props.isAuthenticating}
                onClick={this.login.bind(this)}>Login</button>
            </form>
          </div>
        </Col>
        <Col s={4} />
      </Row>
    );
  }
}

reactMixin(LoginView.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  isAuthenticating: state.auth.isAuthenticating,
  statusText: state.auth.statusText
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
