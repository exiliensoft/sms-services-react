import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectNavLink, selectNewMessage } from '../../reducers/home/home.selectors';
import './NavigationItem.scss';



const NavigationItem = ({id,  item: { target, className, notifiy_badge, brackets }, handleClick, link, newMessage }) => (
   <li className={brackets} key={id}>
      <a href="#" data-navigation-target={target} className={`${link === target ? 'active' : ''} ${newMessage && target === 'chats' ? 'notifiy_badge' : ''}`} onClick={() => handleClick(target)}>
         <i className={className}></i>
      </a>
   </li>
);

const mapStateToProps = createStructuredSelector({
   link: selectNavLink,
   newMessage: selectNewMessage
});

export default connect(mapStateToProps)(NavigationItem);

