import React, {Component} from 'react';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import { NavLink } from "react-router-dom";

export default class Footer extends Component{
    //scroll to top
    scrollToTop() {
        scroll.scrollToTop();
    }
    render() {
        return (
            <div className="footer">
                        <div className="container">
                            <div className="row text-center">
                                <div className="col-lg-2 col-md-3 col-sm-12">
                                    <div className="footer-logo">
                                        <h2><img className="img-fluid logo-img" src="/media/images/chatchilla-logo-white.svg" alt="Feature" /></h2>
                                    </div>
                                </div>
                                
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                <Navbar>
                                
                                    <ul className="footer-menu">
                                        <li><NavLink to="/privacy">Privacy</NavLink> </li>
                                        <li><NavLink to="/terms">Terms</NavLink> </li>
                                    </ul>
                                
                                </Navbar>
                                </div>
                                <div className="col-lg-4 col-md-3 col-sm-12">
                                    <div className="footer-links">
                                        <ul>
                                            <li><a href="https://www.instagram.com/" target="_blank"> <img className="img-fluid" src="/media/icons/in.png" alt="Icon" /> </a> </li>
                                            <li><a href="https://www.linkedin.com/" target="_blank"> <img className="img-fluid" src="/media/icons/li.png" alt="Icon" /> </a> </li>
                                            <li><a href="https://twitter.com/" target="_blank">  <img className="img-fluid" src="/media/icons/tw.png" alt="Icon" /> </a> </li>
                                            <li><a href="#main"> <img className="img-fluid" src="/media/icons/tt.png" alt="Icon" /> </a> </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <a id="back-top" className="back-to-top js-scroll-trigger"  onClick={this.scrollToTop}></a>
                        </div>
                    </div>
        );
    }
}