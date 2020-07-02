import React from "react";
import 'react-perfect-scrollbar/dist/css/styles.css';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import Landing from './pages/Landing/Landing.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import { setNavLink } from "./reducers/home/home.actions";
import { connectSocketAsyn } from './reducers/socket/socket.actions';
import { selectCurrentUser } from './reducers/user/user.selectors';
import Request from './pages/Request/Request';
import Privacy from './pages/Privacy/Privacy';
import Terms from './pages/Terms/Terms';
class App extends React.Component {

    componentDidMount = _ => {
        this.props.connectSocketAsyn();
        this.props.setNavLink(localStorage.getItem("link"));
    }

    render() {
        return ( <
            div >
            <
            Switch >
            <
            Route exact path = '/'
            component = { Landing }
            /> <
            Route exact path = '/login'
            component = { Login }
            /> <
            Route exact path = '/requestdemo'
            component = { Request }
            /> <
            Route exact path = '/privacy'
            component = { Privacy }
            /> <
            Route exact path = '/terms'
            component = { Terms }
            /> <
            Route exact path = '/register'
            component = { Register }
            /> <
            Route exact path = '/forgot-password'
            component = { ForgotPassword }
            /> <
            Route exact path = '/reset-password'
            component = { ResetPassword }
            /> <
            Route exact path = '/app'
            component = { Dashboard }
            /> < /
            Switch > <
            /div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
    connectSocketAsyn: () => dispatch(connectSocketAsyn()),
    setNavLink: (link) => dispatch(setNavLink(link)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);