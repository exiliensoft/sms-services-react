import React, {Component} from 'react';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import { NavLink } from "react-router-dom";
import Footer from '../Footer/Footer';

export default class Navigation extends Component{
        //scroll to top
        scrollToTop() {
            scroll.scrollToTop();
        }
    render(){
        return(
            <Navbar expand="lg" className="navbar navbar-expand-md navbar-light nav-white fixed-top headerbg-main">
                    <div className="container container-m"> 
                    <Navbar.Brand onClick={this.scrollToTop} className="navbar-brand">
                        <img className="img-fluid logo-img logo-green" src="/media/images/chatchilla-logo-green.svg" alt="Feature" />
                        <img className="img-fluid logo-img logo-white" src="/media/images/chatchilla-logo-white.svg" alt="Feature" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">

                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item"><Link href="#" className="product nav-link" to="hero2" spy={true} smooth={true} duration={500} activeClass="active">Get Started</Link></li>
                                <li className="nav-item"><Link href="#" className="features nav-link" to="features" spy={true} smooth={true} duration={500}>Features</Link></li>
                                <li className="nav-item"><Link href="#" className="pricing nav-link" to="pricing" spy={true} smooth={true} duration={500}>Pricing</Link></li>
                                <li className="nav-item"><Link href="#" className="reviews nav-link" to="reviews" spy={true} smooth={true} duration={500}>Reviews</Link></li>
                                <li className="nav-item"><NavLink to="/login" className="btn btn-outline-dark btn-sm signbtn nav-link">Sign in!</NavLink></li>
                                <li className="nav-item"><NavLink to="/" className="btn btn-outline-dark btn-sm signbtn nav-link">Sitest!</NavLink></li>


                            </ul>

                        </Navbar.Collapse>
                    </div>
                </Navbar>
        );
    }
}
