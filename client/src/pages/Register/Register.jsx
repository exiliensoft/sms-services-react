import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FormInput from "../../components/FormInput/FormInput";
import { initiateLocalRegister } from "../../reducers/user/user.actions";
import "./Register.css";

class Register extends Component {
  state = {
    given_name: "",
    family_name: "",
    email: "",
    password: "",
    verify_password: "",
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value.trim() });
  };

  handleDisguisePassword = (password) => {
    let disguisedPassword = [];
    for (let i = 0; i < password; i++) {
      disguisedPassword.push("*");
    }
    return disguisedPassword.join("");
  };

  handleCreateAccount = (_) => {
    this.state.password === this.state.verify_password
      ? this.props.initiateLocalRegister(this.state)
      : console.log("Passwords do not match");
  };

  renderRegisterbutton = (_) => {
    return this.state.password !== this.state.verify_password ||
      this.state.password === "" ? (
      <button
        className="btn btn-primary btn-lg btn-block"
        onClick={(_) => this.handleCreateAccount()}
        disabled
      >
        Register
      </button>
    ) : (
      <button
        className="btn btn-primary btn-lg btn-block"
        onClick={(_) => this.handleCreateAccount()}
      >
        Register
      </button>
    );
  };

  render() {
    return (
      <div className="form-membership">
        <div className="form-wrapper">
          <h5>Create account</h5>
          <div className="form-group input-group-lg">
            <FormInput
              type="text"
              className="form-control"
              size="input-group-lg"
              placeholder="First Name"
              required
              autoFocus
              name="given_name"
              onChange={this.handleInputChange}
              value={this.state.given_name}
            />
          </div>
          <div className="form-group input-group-lg">
            <FormInput
              type="text"
              className="form-control"
              size="input-group-lg"
              placeholder="Last Name"
              required
              autoFocus
              name="family_name"
              onChange={this.handleInputChange}
              value={this.state.family_name}
            />
          </div>
          <div className="form-group input-group-lg">
            <FormInput
              type="email"
              className="form-control"
              size="input-group-lg"
              placeholder="Email"
              required
              name="email"
              onChange={this.handleInputChange}
              value={this.state.email}
            />
          </div>
          <div className="form-group input-group-lg">
            <FormInput
              type="password"
              className="form-control"
              size="input-group-lg"
              placeholder="Password"
              required
              name="password"
              autoComplete="off"
              onChange={this.handleInputChange}
              value={this.state.password}
            />
          </div>
          <div className="form-group input-group-lg">
            <FormInput
              type="password"
              className="form-control"
              size="input-group-lg"
              placeholder="Re-Enter Password"
              required
              name="verify_password"
              autoComplete="off"
              onChange={this.handleInputChange}
              value={this.state.verify_password}
            />
          </div>
          {/* <button className="btn btn-primary btn-lg btn-block" onClick={_ => this.handleCreateAccount()}>Register</button> */}
          {this.renderRegisterbutton()}
          <hr />
          <p className="text-muted">Already have an account?</p>
          <Link to="/" className="btn btn-outline-light btn-sm">
            Sign in!
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(null, { initiateLocalRegister })(Register);
