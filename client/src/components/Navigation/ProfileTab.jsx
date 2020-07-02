import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../reducers/user/user.selectors';
import './Navigation.css';


class Settings extends React.Component {
    render() {
        return (

            <form>
                <div className="form-group">
                    <label className="col-form-label">Avatar</label>
                    <div className="d-flex align-items-center">
                        <div>
                            <figure className="avatar mr-3 item-rtl">
                                <img src={this.props.currentUser.picture === null ? this.props.currentUser.google_picture : this.props.currentUser.picture} className="rounded-circle" defaultValue={this.props.currentUser.picture} />
                            </figure>
                        </div>
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" id="picture" ref="picture" name="picture" accept="image/png, image/jpeg" onChange={this.props.onFileChangeHandler} />
                            <label className="custom-file-label" htmlFor="picture">Choose file</label>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="given_name" className="col-form-label">First Name</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i className="ti-user"></i>
                            </span>
                        </div>
                        <input onChange={this.props.handleInputChange} type="text" className="form-control" id="given_name" ref="given_name" name="given_name" defaultValue={this.props.currentUser.given_name} />
                    </div>
                    <label htmlFor="family_name" className="col-form-label">Last Name</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i className="ti-user"></i>
                            </span>
                        </div>
                        <input onChange={this.props.handleInputChange} type="text" className="form-control" id="family_name" ref="family_name" name="family_name" defaultValue={this.props.currentUser.family_name} />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="col-form-label">Email</label>
                    <input type="text" className="form-control" id="email" value={this.props.currentUser.email} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="cell_phone" className="col-form-label">Cell Phone</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i className="ti-mobile"></i>
                            </span>
                        </div>
                        <input onChange={this.props.handleInputChange} type="tel" className="form-control" id="cell_phone" placeholder="(555) 555-5555" ref="cell_phone" name="cell_phone" defaultValue={this.props.currentUser.cell_phone} />
                    </div>
                </div>
            </form>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings);