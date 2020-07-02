import React from 'react';
import './ContactList.scss';


class ContactList extends React.Component {
   // constructor(props) {
   //    super(props)
   // }

   render() {
      return (
         <div id="messages" className="sidebar active">

            <header>
               <span>Chats</span>
               <ul className="list-inline">
                  <li className="list-inline-item" data-toggle="tooltip" title="New Group" >
                     <a className="btn btn-light" href="#" data-toggle="modal" data-target="#newGroup">
                        <i className="fa fa-users"></i>
                     </a>
                  </li>
                  <li className="list-inline-item">
                     <a className="btn btn-light" data-toggle="tooltip" title="New Chat" href="#" data-navigation-target="groups">
                        <i className="ti-comment-alt"></i>
                     </a>
                  </li>
                  <li className="list-inline-item d-lg-none d-sm-block">
                     <a href="#" className="btn btn-light sidebar-close">
                        <i className="ti-close"></i>
                     </a>
                  </li>
               </ul>
            </header>
            <form>
               <input type="text" className="form-control" placeholder="Search chat" />
            </form>
            <div className="sidebar-body">
               <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                     <figure className="avatar avatar-state-success">
                        <img src="https://via.placeholder.com/150" className="rounded-circle" />
                     </figure>
                     <div className="users-list-body">
                        <h5>Patsy Paulton</h5>
                        <p>Traditional heading elscas sdscsd sdcsdsc</p>
                        <div className="users-list-action">
                           <div className="new-message-count">2</div>
                        </div>
                     </div>
                  </li>
                  <li className="list-group-item open-chat">
                     <div>
                        <figure className="avatar">
                           <img src="https://via.placeholder.com/150" className="rounded-circle" />
                        </figure>
                     </div>
                     <div className="users-list-body">
                        <h5>Karl Hubane</h5>
                        <p>Lorem ipsum dolor sitsdc sdcsdc sdcsdcs</p>
                        <div className="users-list-action action-toggle">
                           <div className="dropdown">
                              <a data-toggle="dropdown" href="#">
                                 <i className="ti-more"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                 <a href="#" className="dropdown-item">Open</a>
                                 <a href="#" data-navigation-target="contact-information" className="dropdown-item">Profile</a>
                                 <a href="#" className="dropdown-item">Add to archive</a>
                                 <a href="#" className="dropdown-item">Delete</a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </li>
                  <li className="list-group-item">
                     <div className="avatar-group">
                        <figure className="avatar">
                           <span className="avatar-title bg-warning bg-success rounded-circle">
                              <i className="fa fa-users"></i>
                           </span>
                        </figure>
                     </div>
                     <div className="users-list-body">
                        <h5>Entertainment Group</h5>
                        <p><strong>Maher Ruslandi: </strong>Hello!!!</p>
                        <div className="users-list-action action-toggle">
                           <div className="dropdown">
                              <a data-toggle="dropdown" href="#">
                                 <i className="ti-more"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                 <a href="#" className="dropdown-item">Open</a>
                                 <a href="#" data-navigation-target="contact-information" className="dropdown-item">Profile</a>
                                 <a href="#" className="dropdown-item">Add to archive</a>
                                 <a href="#" className="dropdown-item">Delete</a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </li>
                  <li className="list-group-item">
                     <div>
                        <figure className="avatar avatar-state-warning">
                           <img src="https://via.placeholder.com/150" className="rounded-circle" />
                        </figure>
                     </div>
                     <div className="users-list-body">
                        <h5>Jennica Kindred</h5>
                        <p>I know how important this file is to you. You can trust me ;)</p>
                        <div className="users-list-action action-toggle">
                           <div className="dropdown">
                              <a data-toggle="dropdown" href="#">
                                 <i className="ti-more"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                 <a href="#" className="dropdown-item">Open</a>
                                 <a href="#" data-navigation-target="contact-information" className="dropdown-item">Profile</a>
                                 <a href="#" className="dropdown-item">Add to archive</a>
                                 <a href="#" className="dropdown-item">Delete</a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </li>
                  <li className="list-group-item">
                     <div>
                        <figure className="avatar">
                           <span className="avatar-title bg-info rounded-circle">M</span>
                        </figure>
                     </div>
                     <div className="users-list-body">
                        <h5>Marvin Rohan</h5>
                        <p>Lorem ipsum dolor sitsdc sdcsdc sdcsdcs</p>
                        <div className="users-list-action action-toggle">
                           <div className="dropdown">
                              <a data-toggle="dropdown" href="#">
                                 <i className="ti-more"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                 <a href="#" className="dropdown-item">Open</a>
                                 <a href="#" data-navigation-target="contact-information" className="dropdown-item">Profile</a>
                                 <a href="#" className="dropdown-item">Add to archive</a>
                                 <a href="#" className="dropdown-item">Delete</a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </li>
                  <li className="list-group-item">
                     <div>
                        <figure className="avatar">
                           <img src="https://via.placeholder.com/150" className="rounded-circle" />
                        </figure>
                     </div>
                     <div className="users-list-body">
                        <h5>Frans Hanscombe</h5>
                        <p>Lorem ipsum dolor sitsdc sdcsdc sdcsdcs</p>
                        <div className="users-list-action action-toggle">
                           <div className="dropdown">
                              <a data-toggle="dropdown" href="#">
                                 <i className="ti-more"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right">
                                 <a href="#" className="dropdown-item">Open</a>
                                 <a href="#" data-navigation-target="contact-information" className="dropdown-item">Profile</a>
                                 <a href="#" className="dropdown-item">Add to archive</a>
                                 <a href="#" className="dropdown-item">Delete</a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </li>
               </ul>
            </div>
         </div>
      )
   }
}

export default ContactList;