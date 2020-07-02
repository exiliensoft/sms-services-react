import React, { useState } from 'react';
import { Alert } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import FormInput from '../../components/FormInput/FormInput';
import { updatingUserAuthError, sendForgotPasswordEmail } from "../../reducers/user/user.actions";
import { selectCurrentUser } from '../../reducers/user/user.selectors';
import { createStructuredSelector } from 'reselect';
import './ForgotPassword.css'



const ForgotPassword = props => {
   const [email, setEmail] = useState("")

   const renderAlerts = _ => {
      if (props.currentUser.authError === "nonExistentAccount") {
         return <Alert variant="info">We can not find an account with that email</Alert>
      } else if (props.currentUser.authError === "resetPasswordEmailSent") {
         return <Alert variant="success">Reset Password Email Sent!</Alert>
      }
   }


   const submitForm = async event => {
      event.preventDefault()
      await props.sendForgotPasswordEmail(email)
      setEmail("")
      setTimeout(_ => {
         props.updatingUserAuthError(null)
      }, 5000)
   }

   return (
      <div className="form-membership">
         <div className="form-wrapper">
            <h5>Reset password</h5>
            {renderAlerts()}
            <form onSubmit={event => submitForm(event)}>
               <FormInput type="text" className="form-control" size="input-group-lg" placeholder="Email" required autoFocus onChange={event => setEmail(event.target.value)} value={email} />
               <button className="btn btn-primary btn-lg btn-block">Submit</button>
               <hr />
               <p className="text-muted">Take a different action.</p>
               <Link to="register" className="btn btn-sm btn-outline-light mr-1">Register now!</Link>
            or
            <Link to="/login" className="btn btn-sm btn-outline-light ml-1">Login!</Link>
            </form>
         </div>
      </div>
   )
}

const mapStateToProps = createStructuredSelector({
   currentUser: selectCurrentUser
});

export default withRouter(connect(mapStateToProps, { updatingUserAuthError, sendForgotPasswordEmail })(ForgotPassword));
