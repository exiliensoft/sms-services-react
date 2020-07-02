import React, { useEffect, useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import { resetPassword } from '../../reducers/user/user.actions'
import { Alert } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { selectCurrentUser } from '../../reducers/user/user.selectors';
import { createStructuredSelector } from 'reselect';
import './ResetPassword.css';



const ResetPassword = props => {
   const urlParams = new URLSearchParams(window.location.search);
   const myParam = urlParams.get('token');
   const [token, setToken] = useState(myParam)
   const [password, setPassword] = useState("")
   const [showAlert, setShowAlert] = useState(false)
   const [inputPlaceholder, setinputPlaceholder] = useState("New Password")
   const [disableButton, setDisableButton] = useState("false")

   useEffect(_=> {
      setToken(myParam)
      setDisableButton(false)
   },[])
   
   const renderConfirmEmailChangeAlert = _ => {
      if (showAlert) {
      return <Alert variant="success">Your password has been updated!<br />You will be redirected to the login page.</Alert>
      }
   }


   const handleSubmit = async event => {
      event.preventDefault()
      setShowAlert(true)
      const response = await props.resetPassword(token, password)
      setinputPlaceholder("**Password Updated**")
      setDisableButton(true)
      setPassword("")
      setTimeout(_ => {
         setShowAlert(false)
         window.location.href = response;
      }, 5000)
   }
   
   return (
      <div className="form-membership">
         <div className="form-wrapper">
            <h5>Enter New Password</h5>
            {renderConfirmEmailChangeAlert()}
            <form onSubmit={event => handleSubmit(event)}>
               <FormInput type="password" className='form-control' disabled={disableButton} size="input-group-lg" placeholder={inputPlaceholder} required autoFocus onChange={event => setPassword(event.target.value)} value={password} />
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

export default withRouter(connect(mapStateToProps, { resetPassword })(ResetPassword));
