import React from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logoutAndRedirect } from '../actions';
import {
	Button,
	Col,
	Card,
} from 'react-materialize';

export default class DashboardView extends React.Component {
    render () {
        return (
		    <div>
				<h3>Dashboard</h3>

				<Col m={6} s={12}>
						<Card className='' textClassName='white-text' title='Tracks' 
						actions={[<Link to="/tracks">
						<Button waves='light'>Go</Button>
						</Link>]}></Card>
				</Col>

				<Col m={6} s={12}>
						<Card className='' textClassName='white-text' title='Conferences' 
						actions={[<Link to="/conferences">
						<Button waves='light'>Go</Button>
						</Link>]}></Card>
				</Col>

				<Col m={6} s={12}>
						<Card className='' textClassName='white-text' title='Events' 
						actions={[<Link to="/events">
						<Button waves='light'>Go</Button>
						</Link>]}></Card>
				</Col>

				<Col m={6} s={12}>
						<Card className='' textClassName='white-text' title='Users' 
						actions={[<Link to="/users">
						<Button waves='light'>Go</Button>
						</Link>]}></Card>
				</Col>


		    </div>
        );
    }
}