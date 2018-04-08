import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {App} from '../containers';
import {
    HomeView, 
    LoginView, 
    ProtectedView, 
    UsersView, 
    EventsView, 
    ConferencesView, 
    TracksView, 
    SubtracksView, 
    InitializeView,
    PreviewView,
    DashboardView,
    DraftEventsView,
} from '../views';
import {requireAuthentication} from '../components/AuthenticatedComponent';

export default(
    <Route path='/' component={App}>
        <IndexRoute component={requireAuthentication(DashboardView)}/>
        <Route path="login" component={LoginView}/>
        <Route path="events" component={requireAuthentication(EventsView)} />
        
        <Route path="protected" component={requireAuthentication(ProtectedView)}/>
        <Route path="users" component={requireAuthentication(UsersView)} />
        <Route path="conferences" component={requireAuthentication(ConferencesView)}/>
        <Route path="tracks" component={requireAuthentication(TracksView)}/>
        <Route path="subtracks" component={requireAuthentication(SubtracksView)}/>
        <Route path="drafts" component={requireAuthentication(DraftEventsView)}/>
        <Route path="initialize" component={requireAuthentication(InitializeView)}/>
        <Route path="preview" component={requireAuthentication(PreviewView)}/>
        <Route path="dashboard" component={requireAuthentication(DashboardView)} />
        <Route path="draftevents" component={requireAuthentication(DraftEventsView)} />
    </Route>
);
