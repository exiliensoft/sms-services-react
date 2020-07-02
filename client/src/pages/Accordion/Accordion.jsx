import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome'
import PropTypes from 'prop-types';
import './Accordion.scss';
//import '../node_modules/font-awesome/css/font-awesome.min.css';

export default class Accordion extends Component {
    state={
        showInfo:false
    }

    handleToggle=()=>{
        this.setState({
            showInfo:!this.state.showInfo
        })
    }
    render(props) {
        const {title,texts} = this.props;
        return (
            <div className="single_accordion">
                <div className={this.state.showInfo ? "tab active":"tab"} onClick={this.handleToggle}>
                    <p>{title}</p> <FontAwesome
								className="super-crazy-colors"
								name={this.state.showInfo ? "fas fa-minus":"fas fa-plus"}
								size="1x"
								
								style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
							  />
                </div>
                <div className={this.state.showInfo ? "showContent content":"content"}>
                    <p>{texts}</p>
                </div>
            </div>
            
        );
    }
}

