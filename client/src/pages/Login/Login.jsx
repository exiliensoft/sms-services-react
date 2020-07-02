import React from "react";
import { Button, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import { Link, withRouter } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import { initiateLocalLogin, resendConfirmationEmail } from "../../reducers/user/user.actions";
import { selectCurrentUser } from '../../reducers/user/user.selectors';
import "./Login.css";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    sentEmailConfirmation: false
  };

  componentDidMount() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value.trim() });
  };

  attemptLocalLogin = (event) => {
    event.preventDefault();
    this.props.initiateLocalLogin({
      username: this.state.username,
      password: this.state.password,
    });
  };

  renderSentEmailAlert = _ => {
    return this.state.sentEmailConfirmation ? <Alert variant="primary">Verification email sent!</Alert> : null
  }

  resendConfirmationEmailAction = async _ => {
    this.setState({ sentEmailConfirmation: true })
    this.props.resendConfirmationEmail(this.props.currentUser.email)
    setTimeout(_ => {
      this.setState({
        sentEmailConfirmation: false
      })
    }, 5000);
  }

  renderAuthErrorAlert = _ => {
    switch (this.props.currentUser.authError) {
      case "unverifiedEmail":
        return <Alert variant="danger">Your email has not been confirmed.<br/><Button onClick={this.resendConfirmationEmailAction}>Re-Send Confirmation Email</Button></Alert>
      case "nonExistentAccount":
        return <Alert variant="info">We can't find an account with this email. Please register now.</Alert>
      case "incorrectPassword":
        return <Alert variant="warning">Your email address or password doesn’t match our records.</Alert>
    }
  }

  render() {
    return (
      <div className="form-membership">
        <div className="form-wrapper">
          <h5>Sign in</h5>
          {this.renderSentEmailAlert()}
          {this.renderAuthErrorAlert()}
          <FormInput type="text" placeholder="Email" size="input-group-lg" required autoFocus name="username" value={this.state.username} onChange={this.handleInputChange} />
          <FormInput type="password" placeholder="Password" size="input-group-lg" required name="password" value={this.state.password} onChange={this.handleInputChange} />
          <div className="form-group d-flex justify-content-between">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
            <Link to="forgot-password">Reset password</Link>
          </div>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={(event) => this.attemptLocalLogin(event)}
          >
            Sign in
          </button>
          <br />
          <br />
          Or
          <br />
          <Button href="/authorization/google" variant="danger" size="lg">
            Sign in with Google
          </Button>
          <hr />
          <p className="text-muted">Don't have an account?</p>
          <Link to="register" className="btn btn-outline-light btn-sm">
            Register now!
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default withRouter(connect(mapStateToProps, { initiateLocalLogin, resendConfirmationEmail })(Login));
