import React from 'react';
import './NavigationItemModel.scss';


const NavigationItemModel = ({ id, target, className, modal, handleClick }) => (
   <li key={id}>
      <a href="#" onClick={() => handleClick(modal)} data-target={target}>
         <div><i className={className}></i></div>
      </a>
   </li >
);

export default NavigationItemModel;
