import React, { Component } from "react";
import { Button, Navbar, Nav, NavItem, Accordion, Card } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { Link, animateScroll as scroll } from 'react-scroll';
import '../Landing/Landing.scss';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

class Terms extends Component {
    componentDidMount = _ => {
        window.addEventListener("scroll", this.toggleBodyClass);
        this.toggleBodyClass();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.toggleBodyClass);
    }
    //change  background color of header on scroll
    toggleBodyClass = () => {
        if (window.scrollY > 70) {
            document.body.classList.add("header-bg");
        } else {
            document.body.classList.remove("header-bg");
        }
    };
    //scroll to top
    scrollToTop() {
        scroll.scrollToTop();
    }
    render() {
        return (
            <div className="wrapper">
                <div className="main " id="main">
                <Navigation />
                <div className="bg-gray">
                        <div className="container-m">
                        <div className="term-sect">
<p><strong>LEGAL NOTICE & DISCLAIMER</strong></p>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

<p><strong>LEGAL NOTICE & DISCLAIMER</strong></p>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>


<p><strong>LEGAL NOTICE & DISCLAIMER</strong></p>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>


<p><strong>LEGAL NOTICE & DISCLAIMER</strong></p>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>




                        </div>
                        </div>
                        </div>
                <Footer />
            </div>
            </div>
        )
    }
}

export default Terms;