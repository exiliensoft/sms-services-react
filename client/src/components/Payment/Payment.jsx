import React from "react";
import { Button } from 'react-bootstrap';
import StripeCheckout from "react-stripe-checkout";

class Payments extends React.Component {

  renderPurchaseBtn = _ => {
    switch (this.props.purchaseAmount && this.props.purchaseAmount !== 0) {
      case undefined:
        return <Button variant="success" disabled>Add Credits</Button>;
      case "":
        return <Button variant="success" disabled>Add Credits</Button>;
      default:
        return <Button>Add Credits</Button>;
    }
  };

  render() {
    return (
      <StripeCheckout
        name="Chatchilla"
        description={`$${this.props.purchaseAmount} Purchase Confirmation`}
        amount={this.props.purchaseAmount * 100}
        token={token => this.props.handleToken(token)}
        stripeKey={process.env.REACT_APP_STRIPE_KEY}
        email={this.props.email}
      >
        {this.renderPurchaseBtn()}
      </StripeCheckout>
    );
  }
}

export default Payments;