import React from 'react';
import './FormInput.scss';


const FormInput = ({ handleChange, size, ...otherProps }) => (
   <div className={`form-group ${size}`} >
      <input className="form-control" onChange={handleChange} {...otherProps} />
   </div >
)

export default FormInput;