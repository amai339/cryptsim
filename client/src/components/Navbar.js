import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser, editMoney, getMoney } from "../actions";
import Modal from "react-modal";
import classnames from "classnames";
Modal.setAppElement("#addmoney");
const customStyles = {
  overlay: {
    position: "fixed",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  content: {
    size: "50%",
    top: "10%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { modalisOpen: false, errors: "", money: "", success: "" };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onAdd = async (e) => {
    e.preventDefault();
    const isNumber = !isNaN(this.state.money);
    if (isNumber) {
      //add money
      let toNumber = Number(this.state.money);
      toNumber = toNumber.toFixed(2);
      this.setState({ success: `Added $${this.state.money}`, errors: "" });
      await this.props.editMoney(this.props.auth.user.id, Number(toNumber));
      await this.props.getMoney(this.props.auth.user.id);
      setTimeout(() => {
        this.closeModal();
      }, 100);
    } else {
      this.setState({ errors: "Please enter a valid number" });
    }
  };
  openModal() {
    this.setState({ modalisOpen: true });
  }
  closeModal() {
    this.setState({ money: "", errors: "", success: "", modalisOpen: false });
  }
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  async componentDidMount() {
    await this.props.getMoney(this.props.auth.user.id);
    this.setState({ amount: this.props.sim.amount });
  }
  authenticatedNavBar() {
    return (
      <>
        <ul className="navbar-nav mr-auto">
          <Link to="/Dashboard" className="nav-item nav-link">
            Dashboard
          </Link>
          <Link to="/portfolio" className="nav-item nav-link">
            Portfolio
          </Link>
          <Link to="/history" className="nav-item nav-link">
            History
          </Link>
        </ul>
        <ul className="navbar-nav ml-auto">
          <button
            className="btn btn-link nav-item nav-link"
            onClick={this.openModal}
          >
            Add Money
          </button>
          <button className="btn btn-link nav-item nav-link">
            ${this.renderBalance()}
          </button>
          <button
            type="button"
            className="btn btn-link nav-item nav-link"
            onClick={this.onLogoutClick}
          >
            <i
              className="fa fa-sign-out"
              aria-hidden="true"
              style={{ marginRight: "5px" }}
            ></i>
            Logout
          </button>
        </ul>
      </>
    );
  }
  renderBalance() {
    if (this.props.sim.amount !== undefined)
      return this.props.sim.amount.toLocaleString();
  }
  renderModal() {
    return (
      <Modal
        isOpen={this.state.modalisOpen}
        onRequestClose={this.closeModal}
        style={customStyles}
      >
        <form className="form">
          <div className="form-label-group">
            <input
              autoComplete="off"
              onChange={this.onChange}
              value={this.state.money || ""}
              error={this.state.errors}
              id="money"
              placeholder="Enter Amount"
              className={classnames("form-control", {
                "is-invalid": this.state.errors.length > 0,
                "is-valid": this.state.success.length > 0,
              })}
            />
            <div className="invalid-feedback">{this.state.errors}</div>
            <div className="valid-feedback">{this.state.success}</div>
            <label htmlFor="money">Enter Amount</label>
          </div>
          <button className="btn btn-success btn-block" onClick={this.onAdd}>
            Add
          </button>
        </form>
      </Modal>
    );
  }
  unauthenticatedNavBar() {
    return (
      <>
        <ul className="navbar-nav mr-auto">
          <Link to="/" className="nav-item nav-link">
            Home
          </Link>
        </ul>
        <ul className="navbar-nav ml-auto">
          <Link to="/login" className="nav-item nav-link">
            <i
              className="fa fa-sign-in"
              aria-hidden="true"
              style={{ marginRight: "5px" }}
            ></i>
            Login
          </Link>
          <Link to="/register" className="nav-item nav-link">
            <i
              className="fa fa-user-plus"
              aria-hidden="true"
              style={{ marginRight: "5px" }}
            ></i>
            Register
          </Link>
        </ul>
      </>
    );
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark navbar-rounded shadow-lg"
        id="nav"
      >
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#test"
          aria-controls="test"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="test">
          <div className="container d-flex flex-column flex-md-row justify-content-between">
            {isAuthenticated
              ? this.authenticatedNavBar()
              : this.unauthenticatedNavBar()}
            {this.renderModal()}
          </div>
        </div>
      </nav>
    );
  }
  // return location.pathname == '/login' || location.pathname == '/register' ? null : renderLogin();
}

const mapStateToProps = (state) => {
  return { auth: state.auth, sim: state.sim };
};

export default connect(mapStateToProps, { logoutUser, editMoney, getMoney })(
  Navbar
);
