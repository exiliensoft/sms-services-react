import React, { Component } from 'react'
import { connect } from 'react-redux'
import './PlanCard.css'

export class Plan extends Component {

    renderFeatures = _ => {
        return this.props.features.map((feature, i) => {
            return <li key={i}>{feature}</li>
        })
    }

    render() {
        return (
            <div className={`plan-card ${this.props.card_selected}`}>
                <div className="plan-card__header">
                    {this.props.title}
                </div>
                <div className="plan-card__content">
                    <ul className="plan-card__list">
                        {this.renderFeatures()}
                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Plan)
