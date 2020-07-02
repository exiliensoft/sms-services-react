import React from 'react';
import { Button, Navbar, Nav, NavItem} from 'react-bootstrap';
import { connect } from "react-redux";
import { render } from 'react-dom';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FormInput from "../../components/FormInput/FormInput";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from '../../reducers/user/user.selectors';
import { fetchUser } from '../../reducers/user/user.actions';
import './Landing.scss'
import Accordion from '../Accordion/Accordion.jsx';
import Navigation from '../Navigation/Navigation';
import Footer from '../Footer/Footer';



class Landing extends React.Component {
    componentDidMount = _ => {
        this.props.fetchUser()
        window.addEventListener("scroll", this.toggleBodyClass);
        this.toggleBodyClass();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.toggleBodyClass);
    }
    constructor(props) {
        super(props);
        this.scrollToTop = this.scrollToTop.bind(this);
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
    state = {
        given_name: "",
        family_name: "",
        email: "",
        password: "",
        verify_password: "",
        data:[
            {
                title:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            texts:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                title:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            texts:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                title:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            texts:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                title:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            texts:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            
        ]
    };

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value.trim() });
    };

    handleDisguisePassword = (password) => {
        let disguisedPassword = [];
        for (let i = 0; i < password; i++) {
            disguisedPassword.push("*");
        }
        return disguisedPassword.join("");
    };

    handleCreateAccount = (_) => {
        this.state.password === this.state.verify_password
            ? this.props.initiateLocalRegister(this.state)
            : console.log("Passwords do not match");
    };

    renderRegisterbutton = (_) => {
        return this.state.password !== this.state.verify_password ||
            this.state.password === "" ? (
                <button
                    className="btn btn-primary btn-action"
                    onClick={(_) => this.handleCreateAccount()}
                    disabled
                >
                    Register
                </button>
            ) : (
                <button
                    className="btn btn-primary btn-action"
                    onClick={(_) => this.handleCreateAccount()}
                >
                    Register
                </button>
            );
    };


    renderLoginButton = _ => {
        if (this.props.currentUser) {
            return <Button variant="light" as={Link} to='/app'>Messages</Button>
        } else {
            return <Button variant="light" as={Link} to='/login'>Login</Button>
        }
    }


    render() {
        // setting for slick slider (testimonials)
        var settings = {
            dots: false,
            infinite: true,
            autoplay: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        const {data} = this.state;
        return (
            <div className="wrapper">
                <Navigation/>
                <div className="main " id="main">
                    <div className="hero2">
                        <div className="container-m">
                            <div className="hero-inner yd_flx2">
                                <div className="hero-content flx_1">
                                    <div className="hero-content-inner">
                                        <h4>New Feature</h4>
                                        <h2>Data analytics & Neural networks. </h2>
                                        <p>Military grade infrastructure and advanced technology for your research and development.</p>
                                        {/*<a className="btn-action btn-alt" href="#">Get started</a>*/}
                                    </div>
                                </div>
                                <div className="hero-form flx_2">
                                    <div id="contactForm" data-toggle="validator" className="shake">
                                        <div className="row">
                                            <div className="form-group col-sm-12">

                                                <FormInput
                                                    type="text"
                                                    className="form-control form-fields"
                                                    size="input-group-lg"
                                                    placeholder="First Name"
                                                    required
                                                    autoFocus
                                                    name="given_name"
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
                                                    autoFocus
                                                    name="family_name"
                                                    onChange={this.handleInputChange}
                                                    value={this.state.family_name}
                                                />
                                                <div className="help-block with-errors"> </div>
                                            </div>
                                            <div className="form-group col-sm-12">

                                                <FormInput
                                                    type="email"
                                                    className="form-control form-fields"
                                                    size="input-group-lg"
                                                    placeholder="Email"
                                                    required
                                                    name="email"
                                                    onChange={this.handleInputChange}
                                                    value={this.state.email}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                            <div className="form-group col-sm-12">

                                                <FormInput
                                                    type="password"
                                                    className="form-control form-fields"
                                                    size="input-group-lg"
                                                    placeholder="Password"
                                                    required
                                                    name="password"
                                                    autoComplete="off"
                                                    onChange={this.handleInputChange}
                                                    value={this.state.password}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                            <div className="form-group col-sm-12">

                                                <FormInput
                                                    type="password"
                                                    className="form-control"
                                                    size="input-group-lg"
                                                    placeholder="Re-Enter Password"
                                                    required
                                                    name="verify_password"
                                                    autoComplete="off"
                                                    onChange={this.handleInputChange}
                                                    value={this.state.verify_password}
                                                />
                                                <div className="help-block with-errors"></div>
                                            </div>
                                        </div>
                                        {this.renderRegisterbutton()}
                                        <Button href="/authorization/google" className="btn btn-primary btn-action" variant="danger">
                                            Sign in with Google
                                        </Button>
                                        <div id="msgSubmit" className="h3 text-center hidden"></div>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="features" className="flex-split">
                        <div className="container-s">
                            <div className="flex-intro align-center wow fadeIn">
                                <h2>Build better landing pages</h2>
                                <p> When you get straight to the point the presentation looks attractive on your web pages.
                                Keep it simple and clean always.</p>
                            </div>
                            <div className="flex-inner align-center">
                                <div className="f-image wow">
                                    <img className="img-fluid" src="/media/images/feature2.png" alt="Feature" />
                                    

                                </div>
                                <div className="f-text">
                                    <div className="left-content">
                                        <div className="tld">
                                            <div className="tld-text">
                                                <h6>1</h6>
                                            </div>
                                        </div>
                                        <h2>Data Analytics.</h2>
                                        <p> When you get straight to the point the presentation looks more attractive.</p>
                                        <a onClick={this.scrollToTop}>Know more</a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-inner flex-inverted flex-row-reverse align-center">
                                <div className="f-image f-image-inverted">
                                    <img className="img-fluid" src="/media/images/feature1.png" alt="Feature" />
                                </div>
                                <div className="f-text">
                                    <div className="left-content">
                                        <div className="tld tld2">
                                            <div className="tld-text">
                                                <h6>2</h6>
                                            </div>
                                        </div>
                                        <h2>Asset Tracking.</h2>
                                        <p> When you get straight to the point the presentation looks more attractive.</p>
                                        <a  onClick={this.scrollToTop}>Know more</a>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-inner align-center">
                                <div className="f-image wow">
                                    <img className="img-fluid" src="/media/images/feature2.png" alt="Feature" />

                                </div>
                                <div className="f-text">
                                    <div className="left-content">
                                        <div className="tld">
                                            <div className="tld-text">
                                                <h6>3</h6>
                                            </div>
                                        </div>
                                        <h2>Data Analytics.</h2>
                                        <p> When you get straight to the point the presentation looks more attractive.</p>
                                        <a href onClick={this.scrollToTop}>Know more</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="yd_ft_cst ft_cst2">
                        <div className="container">
                            <div className="row">
                                <div className="flex-inner">
                                    <div className="f-image">
                                        <img className="img-fluid" src="/media/images/dead.png" alt="Feature" />
                                    </div>
                                    <div className="f-text">
                                        <div className="split_text">
                                            <div className="split_text_inner">
                                                <h4>Data Analytics</h4>
                                                <h2>Custom Landing Pages</h2>
                                                <p>Just to justify the above heading some blah blah text needs to be
                                                placed here to make it look good. Necessary, isn't it?
                                    </p>
                                                <a className="btn-action" href onClick={this.scrollToTop}>Know More</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ft_single">
                        <div className="container">
                            <div className="yd_flex">
                                <div className="yd_flex_1">
                                    <div className="flex_content">
                                        <h2>Mobile Integration</h2>
                                        <p>Grow your business with our secure storage, powerful computing, and integrated analytics at affordable price.</p>
                                        <a className="btn-action btn-alt" href onClick={this.scrollToTop}>Get Started</a>
                                    </div>
                                </div>
                                <div className="yd_flex_2">
                                    <div className="flex_main">
                                        <div className="flex_sub">
                                            <div className="sub_image">
                                                <img src="/media/icons/c.png" width="60" alt="Icon" />
                                            </div>
                                            <div className="sub_text">
                                                <h4>Go Mobile</h4>
                                                <p className="d-none d-md-block">Some lorem ipsum text filler lorem ipsum text</p>
                                            </div>
                                        </div>
                                        <div className="flex_sub">
                                            <div className="sub_image">
                                                <img src="/media/icons/b.png" width="60" alt="Icon" />
                                            </div>
                                            <div className="sub_text">
                                                <h4>Video</h4>
                                                <p className="d-none d-md-block">Some lorem ipsum text filler lorem ipsum text</p>
                                            </div>
                                        </div>
                                        <div className="flex_sub">
                                            <div className="sub_image">
                                                <img src="/media/icons/g.png" width="60" alt="Icon" />
                                            </div>
                                            <div className="sub_text">
                                                <h4>Asset Track</h4>
                                                <p className="d-none d-md-block">Some lorem ipsum text filler lorem ipsum text</p>
                                            </div>
                                        </div>
                                        <div className="flex_sub">
                                            <div className="sub_image">
                                                <img src="/media/icons/e.png" width="60" alt="Icon" />
                                            </div>
                                            <div className="sub_text">
                                                <h4>Profiling</h4>
                                                <p className="d-none d-md-block">Some lorem ipsum text filler lorem ipsum text</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="yd_ft_cst">
                        <div className="container">
                            <div className="row">
                                <div className="flex-inner">
                                    <div className="f-text">
                                        <div className="split_text">
                                            <div className="split_text_inner">
                                                <h4>Latest News</h4>
                                                <h2>Responsive Landing Pages.</h2>
                                                <p>Just to justify the above heading some blah blah text needs to be
                                                placed here to make it look good.
                                    </p>
                                                <ul>
                                                    <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Adhoc Report Builders</span></li>
                                                    <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Live Customer Profiling</span></li>
                                                </ul>
                                                <a className="btn-action btn-alt" href onClick={this.scrollToTop}>Know more</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="f-image">
                                        <img className="img-fluid" src="/media/images/feature4.png" height="300" alt="Feature" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="pricing" className="yd_prc2 pricing">
                        <div className="container-s">
                            <div className="pricing-intro">
                                <h1>Our Pricing Plans.</h1>
                                <p>
                                    Our plans are designed to meet the requirements of both beginners and players.
                                    Get the right plan that suits you.
                            </p>
                            </div>
                            <div className="yd_flx2">
                                <div className="flx_1">
                                    <div className="split_text">
                                        <div className="split_text_inner">
                                            <h2>Basic.</h2>
                                            <span>$19.99</span>
                                            <div className="sub_span">/ month</div>
                                            <ul className="prc_features">
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Adhoc Report Builders</span></li>
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Live Customer Profiling</span></li>
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Mobile Integration</span></li>
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Live Assert Tracking</span></li>
                                            </ul>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="flx_2">
                                    <div className="split_text">
                                        <div className="split_text_inner">
                                            <h2>Premium.</h2>
                                            <span>$49.99</span>
                                            <div className="sub_span">/ month</div>
                                            <ul className="prc_features">
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Adhoc Report Builders</span></li>
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Live Customer Profiling</span></li>
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Mobile Integration</span></li>
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Live Assert Tracking</span></li>
                                            </ul>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="flx_1">
                                    <div className="split_text">
                                        <div className="split_text_inner">
                                            <h2>Enterprise.</h2>
                                            <span>$19.99</span>
                                            <div className="sub_span">/ month</div>
                                            <ul className="prc_features">
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Adhoc Report Builders</span></li>
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Live Customer Profiling</span></li>
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Mobile Integration</span></li>
                                                <li><img src="/media/icons/tick.png" width="14" alt="Tick" /> <span>Live Assert Tracking</span></li>
                                            </ul>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div id="disclosure" className="disclosure-sect">
                    <div className="container">
                    <div className="flx_disclosure">
                    <div className="flx_4"><a className="btn-action btn-alt" href onClick={this.scrollToTop}>Know more</a></div>
                    <div className="flx_4"><a className="btn-action btn-alt" href onClick={this.scrollToTop}>Know more</a></div>
                    <div className="flx_4"><a className="btn-action btn-alt" href onClick={this.scrollToTop}>Know more</a></div>
                        </div> 
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                        </div> 
                    </div>
                    {/*}
                    <div id="reviews" className="yd_rev_bg reviews">
                        <div className="container">
                            <div className="rev_block">
                                <div className="rev_block_inner">
                                    <div className="review-cards owl-carousel owl-theme">
                                        <Slider {...settings}>
                                            <div className="rev_txt">
                                                <div className="rev_img">
                                                    <img className="rounded-circle" src="/media/icons/rev.png" alt="Review" />
                                                </div>
                                                <h3>Peter Murray</h3>
                                                <p>"Grow your business with our secure storage, powerful compute, and integrated data analytics.
                                                Just to justify the above heading some blah blah text needs to be placed here to make it look good."
                                                </p>
                                                <h6>VP Sales, Act Corp.</h6>
                                                <h6>Paris, France.</h6>
                                            </div>
                                            <div className="rev_txt">
                                                <div className="rev_img">
                                                    <img className="rounded-circle" src="/media/icons/rev2.png" alt="Review" />
                                                </div>
                                                <h3>Naren Kumar</h3>
                                                <p>"Grow your business with our secure storage, powerful compute, and integrated data analytics.
                                                Just to justify the above heading some blah blah text needs to be placed here to make it look good."
                                                </p>
                                                <h6>Manager, Deloitte Ind.</h6>
                                                <h6>Mumbai, India.</h6>
                                            </div>
                                            <div className="rev_txt">
                                                <div className="rev_img">
                                                    <img className="rounded-circle" src="/media/icons/rev3.png" alt="Review" />
                                                </div>
                                                <h3>Joseph Stalin</h3>
                                                <p>"Grow your business with our secure storage, powerful compute, and integrated data analytics.
                                                Just to justify the above heading some blah blah text needs to be placed here to make it look good."
                                                </p>
                                                <h6>DM, Aprilla Ltd.</h6>
                                                <h6>London, England.</h6>
                                            </div>
                                        </Slider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    */}
                     <div id="faq" className="faq-sect">  
                        <div className="container">
                            <div className="flex-intro align-center wow fadeIn">
                                <h2>FAQs</h2>
                            </div>

                            <div className="accordion">
                                {data.map((item,index)=>{
                                    return <Accordion   key={index} title ={item.title} texts= {item.texts} />
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="yd_cta_box">
                        <div className="containe">
                            <div className="cta_box">
                                <div className="cta_box_inner">
                                    <div className="col-sm-12 col-md-12">
                                        <h4>Start project</h4>
                                        <h2>Chatchilla is designed to meet all your needs. Ready to create your landing page ?</h2>
                                        <NavLink className="btn-action btn-alt" to="/requestdemo">Request Demo</NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}


const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});


export default connect(mapStateToProps, { fetchUser })(Landing);