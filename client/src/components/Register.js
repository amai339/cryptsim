import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../actions";
import classnames from "classnames";

class Register extends Component {
  state = { name: "", email: "", password: "", password2: "", errors: {} };

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    // else {
    //   document.getElementById('nav').style.display = "none";
    // }
  }
  // componentWillUnmount() {
  //   document.getElementById('nav').style.display = "flex";
  // }

  componentWillReceiveProps(nextProps) {
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

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
          <div className="col-lg-6 col-md-7 mx-auto mt-5">
            <form className="form-signin" onSubmit={this.onSubmit}>
              <div className='text-center mb-4'>
                <h1>Register</h1>
                <p>or Sign in <Link to='/login'>here</Link></p>
              </div>
              <div className="form-label-group">
                <input onChange={this.onChange} value={this.state.name} error={errors.name} id="name"
                  type="text"
                  placeholder="Name"
                  className={classnames("form-control", {
                    "is-invalid": errors.name,
                  })}
                />
                <div className="invalid-feedback">{errors.name}</div>
                <label htmlFor="name">Name</label>
              </div>
              <div className="form-label-group">
                <input onChange={this.onChange} value={this.state.email} error={errors.email} id="email"
                  type="email"
                  placeholder="Email"
                  className={classnames("form-control", {
                    "is-invalid": errors.email,
                  })}
                />
                <div className="invalid-feedback">{errors.email}</div>
                <label htmlFor="email">Email</label>
              </div>
              <div className="form-label-group">
                <input onChange={this.onChange} value={this.state.password} error={errors.password} id="password"
                  type="password"
                  placeholder="Password"
                  className={classnames("form-control", {
                    "is-invalid": errors.password,
                  })}
                />
                <div className="invalid-feedback">{errors.password}</div>
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-label-group">
                <input onChange={this.onChange} value={this.state.password2} error={errors.password2} id="password2"
                  type="password"
                  placeholder="Confirm password"
                  className={classnames("form-control", {
                    "is-invalid": errors.password2,
                  })}
                />
                <div className="invalid-feedback">{errors.password2}</div>
                <label htmlFor="password2">Confirm Password</label>
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

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
