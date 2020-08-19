import React, { Component } from "react";

import { connect } from "react-redux";
import { loginUser } from "../actions";
import classnames from "classnames";
import {Link} from 'react-router-dom'

class Login extends Component {
  state = { email: "", password: "", errors: {} };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="col-lg-6 col-md-7 mx-auto mt-5">
        <div className="text-center mb-4">
          <h1>Login</h1>
          <p>
            or Create an account <Link to="/register">here</Link>
          </p>
        </div>
        <form className="form-signin" onSubmit={this.onSubmit}>
          <div className="form-label-group">
            <input
              onChange={this.onChange}
              value={this.state.email}
              error={errors.email}
              id="email"
              type="email"
              placeholder="Email"
              className={classnames("form-control", {
                "is-invalid": errors.email || errors.emailnotfound,
              })}
            />
            <div className="invalid-feedback">
              {errors.email}
              {errors.emailnotfound}
            </div>
            <label htmlFor="email">Email Address</label>
          </div>
          <div className="form-label-group">
            <input
              onChange={this.onChange}
              value={this.state.password}
              error={errors.password}
              id="password"
              type="password"
              placeholder="Password"
              className={classnames("form-control", {
                "is-invalid": errors.password || errors.passwordincorrect,
              })}
            />
            <div className="invalid-feedback">
              {errors.password}
              {errors.passwordincorrect}
            </div>
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Sign in
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
