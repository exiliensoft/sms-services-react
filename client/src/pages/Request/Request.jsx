import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from '../../reducers/user/user.selectors';
import { fetchUser } from '../../reducers/user/user.actions';
import FormInput from "../../components/FormInput/FormInput";
import { Button, Navbar, Nav, NavItem, Accordion, Card } from 'react-bootstrap';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import '../Landing/Landing.scss';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';

class Request extends Component {

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

    renderRegisterbutton = (_) => {
        return this.state.first_name === "" || this.state.last_name === "" || this.state.user_email === "" || this.state.phone_number === "" ? (
                <button
                    className="btn btn-primary btn-action"
                    disabled
                >
                    Register
                </button>
            ) : (
                <button
                    className="btn btn-primary btn-action"
                >
                    Register
                </button>
            );
    };


    //scroll to top
    scrollToTop() {
        scroll.scrollToTop();
    }
    state = {
        first_name: "",
        last_name: "",
        company_name: "",
        user_email: "",
        phone_number: "",
        company_size: "",
        questions_comments: "",
        message:""
    };
    handleInputChange = (event) => {
        this.setState({ [event.target.name]:event.target.value.trim() });
    }
    render() {
        return (
            <div className="wrapper">
                <div className="main " id="main">
                <Navigation />
                <div className="hero2">
                        <div className="container-m">
                <div className="row">
                    <div className="hero-form request-sect flx_2">
                        <div id="requestForm" data-toggle="validator" className="shake">
                            <div className="row">
                                <div className="form-group col-sm-12">
                                    <FormInput
                                        type="text"
                                        className="form-control form-fields"
                                        size="input-group-lg"
                                        placeholder="First Name"
                                        required
                                        autoFocus
                                        name="first_name"
                                        onChange={this.handleInputChange}
                                        value={this.state.given_name}

                                    />
                                    <div className="help-block with-errors"></div>
                                </div>
                                <div className="form-group col-sm-12">

                                    <FormInput
                                        type="text"
                                        className="form-control form-fields"
                                        size="input-group-lg"
                                        placeholder="Last Name"
                                        required
                                        name="last_name"
                                        onChange={this.handleInputChange}
                                        value={this.state.last_name}

                                    />
                                    <div className="help-block with-errors"></div>
                                </div>
                                <div className="form-group col-sm-12">

                                    <FormInput
                                        type="text"
                                        className="form-control form-fields"
                                        size="input-group-lg"
                                        placeholder="Company Name"
                                        required
                                        name="company_name"
                                        onChange={this.handleInputChange}
                                        value={this.state.company_name}

                                    />
                                    <div className="help-block with-errors"></div>
                                </div>
                                <div className="form-group col-sm-12">

                                    <FormInput
                                        type="email"
                                        className="form-control form-fields"
                                        size="input-group-lg"
                                        placeholder="Work Email"
                                        required
                                        name="user_email"
                                        onChange={this.handleInputChange}
                                        value={this.state.user_email}

                                    />
                                    <div className="help-block with-errors"></div>
                                </div>
                                <div className="form-group col-sm-12">

                                    <FormInput
                                        type="tel"
                                        className="form-control form-fields"
                                        size="input-group-lg"
                                        placeholder="Phone Number"
                                        required
                                        name="phone_number"
                                        onChange={this.handleInputChange}
                                        value={this.state.phone_number}

                                    />
                                    <div className="help-block with-errors"></div>
                                </div>
                                <div className="form-group col-sm-12">

                                    <FormInput
                                        type="text"
                                        className="form-control form-fields"
                                        size="input-group-lg"
                                        placeholder="Company Size"
                                        required
                                        name="company_size"
                                        onChange={this.handleInputChange}
                                        value={this.state.company_size}

                                    />
                                    <div className="help-block with-errors"></div>
                                </div>
                                <div className="form-group col-sm-12">

                                    <textarea type="text"
                                        className="form-control form-fields"
                                        size="input-group-lg"
                                        rows="4"
                                        required
                                        name="message"
                                        onChange={this.handleInputChange}
                                        value={this.state.message}
                                    ></textarea>
                                    <div className="help-block with-errors"></div>
                                </div>
                                <div className="form-flex col-sm-12">

                                    <FormInput
                                        type="checkbox"
                                        className="align-left"
                                        size="input-group-sm"
                                        required
                                        name="agree"
                                        

                                    />I AGREE TO THE TERMS OF USE
                                        <div className="help-block with-errors"></div>
                                </div>
                                <div className="form-group col-sm-12">

                                    <FormInput
                                        type="text"
                                        className="form-control form-fields"
                                        size="input-group-lg"
                                        placeholder="Questions or Comments?"
                                        required
                                        name="questions_comments"
                                        onChange={this.handleInputChange}
                                        value={this.state.questions_comments}

                                    />
                                    <div className="help-block with-errors"></div>
                                </div>
                            </div>
                            {this.renderRegisterbutton()}
                            {/*<Button className="btn btn-primary btn-action" variant="danger">Register</Button>*/}
                            <div id="msgSubmit" className="h3 text-center hidden"></div>
                            <div className="clearfix"></div>

                        </div>
                    </div>
                </div>
                </div>
                </div>

                <Footer />
                
            </div>
        </div>

        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default connect(mapStateToProps, { fetchUser })(Request);