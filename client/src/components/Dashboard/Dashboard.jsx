import React, { Component } from 'react'
import { connect } from 'react-redux'
import Navigation from '../Navigation/Navigation.jsx';
import Homepage from '../../pages/Homepage/Homepage.jsx';
import { fetchUser } from '../../reducers/user/user.actions';

export class Dashboard extends Component {

    componentDidMount = _ => {
        this.props.fetchUser()
    }

    render() {
        return (
            <div className="layout">
                <Navigation />
                <Homepage />
            </div>
        )
    }
}

 
 const mapDispatchToProps = dispatch => ({
    fetchUser: user => dispatch(fetchUser(user)),
 });
 
 export default connect(null, mapDispatchToProps)(Dashboard);