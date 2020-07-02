import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectPlans } from "../../reducers/plan/plan.selectors";
import { updatePlans } from "../../reducers/user/user.actions";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
import Payment from "../Payment/Payment";
import PlanCards from "../PlanCard/PlanCard";
import "./Navigation.css";

class Settings extends React.Component {
  state = {
    price: 0,
    selected_sms_plan: this.props.currentUser.sms_plan,
    selected_voice_plan: this.props.currentUser.voice_plan,
    selected_did_plan: this.props.currentUser.did_plan,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected_sms_plan: nextProps.currentUser.sms_plan,
      selected_voice_plan: nextProps.currentUser.voice_plan,
      selected_did_plan: nextProps.currentUser.did_plan,
    });
  }

  handleSelectedCard = async (type, plan) => {
    if (type === "sms") {
      await this.setState({ selected_sms_plan: plan });
    } else if (type === "voice") {
      await this.setState({ selected_voice_plan: plan });
    } else if (type === "dids") {
      await this.setState({ selected_did_plan: plan });
    }
    this.resetPrice();
  };

  getSlashing = () => {
    if (!this.props.currentUser.sms_plan_date) {
      return 1;
    }
    return (
      (31556926000 -
        (new Date() - new Date(this.props.currentUser.sms_plan_date))) /
      31556926000
    );
  };

  resetPrice = async () => {
    await this.setState({ price: 0 });
    if (this.state.selected_sms_plan) {
      if (!this.props.currentUser.sms_plan) {
        await this.setState({
          price:
            this.state.price +
            parseInt(
              this.props.plans.sms_plan.filter(
                (plan) => plan.id === this.state.selected_sms_plan
              )[0].price
            ),
        });
      } else {
        await this.setState({
          price:
            this.state.price +
            parseInt(
              this.props.plans.sms_plan.filter(
                (plan) => plan.id === this.state.selected_sms_plan
              )[0].price -
                this.props.plans.sms_plan.filter(
                  (plan) => plan.id === this.props.currentUser.sms_plan
                )[0].price
            ),
        });
      }
    }

    if (this.state.selected_voice_plan) {
      if (!this.props.currentUser.voice_plan) {
        await this.setState({
          price:
            this.state.price +
            parseInt(
              this.props.plans.voice_plan.filter(
                (plan) => plan.id === this.state.selected_voice_plan
              )[0].price * this.getSlashing()
            ),
        });
      } else {
        await this.setState({
          price:
            this.state.price +
            parseInt(
              this.props.plans.voice_plan.filter(
                (plan) => plan.id === this.state.selected_voice_plan
              )[0].price
            ) *
              this.getSlashing() -
            parseInt(
              this.props.plans.voice_plan.filter(
                (plan) => plan.id === this.props.currentUser.voice_plan
              )[0].price
            ) *
              this.getSlashing(),
        });
      }
    }

    if (this.state.selected_did_plan) {
      if (!this.props.currentUser.did_plan) {
        await this.setState({
          price:
            this.state.price +
            parseInt(
              this.props.plans.did_plan.filter(
                (plan) => plan.id === this.state.selected_did_plan
              )[0].price * this.getSlashing()
            ),
        });
      } else {
        await this.setState({
          price:
            this.state.price +
            parseInt(
              this.props.plans.did_plan.filter(
                (plan) => plan.id === this.state.selected_did_plan
              )[0].price * this.getSlashing()
            ) -
            parseInt(
              this.props.plans.did_plan.filter(
                (plan) => plan.id === this.props.currentUser.did_plan
              )[0].price * this.getSlashing()
            ),
        });
      }
    }
  };

  handleToken = async (token) => {
    this.props.updatePlans(token, {
      sms_plan: this.state.selected_sms_plan,
      voice_plan: this.state.selected_voice_plan,
      did_plan: this.state.selected_did_plan,
    });
  };

  getCardClass = function (
    userPlan,
    availablePlans,
    currentPlan,
    selectedPlan
  ) {
    if (currentPlan === userPlan && userPlan !== selectedPlan) {
      return "";
    }
    if (currentPlan === selectedPlan) {
      return "card_selected";
    }
    if (!userPlan) {
      return "";
    }
    let disabled = false;
    let passed = false;
    availablePlans.map((plan) => {
      if (plan.id === currentPlan) {
        passed = true;
        return "";
      }
      if (plan.id === userPlan && !passed) {
        disabled = true;
      }
    });
    return disabled ? "" : "card_disabled";
  };

  render(props) {
    return (
      <div className="plans__container">
        <div className="plans__header">SMS Plans</div>
        <div className="plan__section">
          {this.props.plans.sms_plan.map((sms_plan, i) => {
            const className = this.getCardClass(
              this.props.currentUser.sms_plan,
              this.props.plans.sms_plan,
              sms_plan.id,
              this.state.selected_sms_plan
            );
            return (
              <div
                className="card"
                key={i}
                onClick={(_) => this.handleSelectedCard("sms", sms_plan.id)}
                className={
                  className === "card_disabled" ? "div_disabled" : null
                }
              >
                <PlanCards
                  key={sms_plan.id}
                  title={`${sms_plan.name}`}
                  features={[
                    `$${sms_plan.price} per month`,
                    `${sms_plan.sms_limit} monthly messages`,
                    `${sms_plan.complimentary_dids} Unique dids`,
                    "Broadcasting Tool",
                    "Unlimited contacts",
                    "Unlimited groups",
                    "Unlimited Invites",
                    "Unlimited fields",
                  ]}
                  card_selected={className}
                />
              </div>
            );
          })}
        </div>
        <div className="plans__header">Voice Plans (Optional)</div>
        <div className="plan__section">
          {this.props.plans.voice_plan.map((voice_plan, i) => {
            let className = this.getCardClass(
              this.props.currentUser.voice_plan,
              this.props.plans.voice_plan,
              voice_plan.id,
              this.state.selected_voice_plan
            );

            if (!this.state.selected_sms_plan) {
              className = "card_disabled";
            }

            return (
              <div
                className="card"
                key={i}
                onClick={(_) => this.handleSelectedCard("voice", voice_plan.id)}
                className={
                  className === "card_disabled" ? "div_disabled" : null
                }
              >
                <PlanCards
                  title={`${voice_plan.name}`}
                  features={[
                    `$${voice_plan.price} per month`,
                    `${voice_plan.voice_limit} monthly minutes`,
                  ]}
                  card_selected={className}
                />
              </div>
            );
          })}
        </div>
        <div className="plans__header">Did Plans (Optional)</div>
        <div className="plan__section">
          {this.props.plans.did_plan.map((did_plan, i) => {
            let className = this.getCardClass(
              this.props.currentUser.did_plan,
              this.props.plans.did_plan,
              did_plan.id,
              this.state.selected_did_plan
            );

            if (!this.state.selected_sms_plan) {
              className = "card_disabled";
            }

            return (
              <div
                className="card"
                key={i}
                onClick={(_) => this.handleSelectedCard("dids", did_plan.id)}
                className={
                  className === "card_disabled" ? "div_disabled" : null
                }
              >
                <PlanCards
                  title={`${did_plan.name}`}
                  features={[
                    `$${did_plan.price} per month`,
                    `${did_plan.did_limit} monthly unique dids`,
                  ]}
                  card_selected={className}
                />
              </div>
            );
          })}
        </div>
        <div>
          <Payment
            handleToken={this.handleToken}
            purchaseAmount={this.state.price}
            email={this.props.currentUser.email}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  plans: selectPlans,
});

const mapDispatchToProps = (dispatch) => ({
  updatePlans: (token, purchaseAmount, plans) =>
    dispatch(updatePlans(token, purchaseAmount, plans)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
