import React, { Component } from "react";
import { connect } from "react-redux";
import * as CryptoCharts from "cryptocharts";
import { getCoinsData } from "../actions";
import { Link } from "react-router-dom";
import isEmpty from "is-empty";
class Landing extends Component {
  componentDidMount() {
    if (isEmpty(this.props.coin)) {
      this.props.getCoinsData(["btc", "eth", "xrp", "bch", "ltc", "link"]);
    }
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard')
    }
  }
  componentWillUnmount() {}

  renderCharts(name, symbol) {
    CryptoCharts.priceHistory({
      chart_id: name,
      cryptocompare_tickers: [symbol],
      last_days: 30,
      options: { colors: ["#343a40"], tooltip: { enabled: true } },
    });
  }
  renderChange(change) {
    let fixedChange = +change.toFixed(2);
    if (change < 0)
      return (
        <div style={{ float: "right", color: "red" }}>
          <i
            className="fa fa-caret-down"
            aria-hidden="true"
            style={{ marginRight: "4px" }}
          ></i>
          {`${fixedChange.toString().substr(1)}%`}
        </div>
      );
    else if (change > 0)
      return (
        <div style={{ float: "right", color: "green" }}>
          <i
            className="fa fa-caret-up"
            aria-hidden="true"
            style={{ marginRight: "4px" }}
          ></i>
          {`${fixedChange}%`}
        </div>
      );
    else {
      return <h5 style={{ float: "right" }}>No change</h5>;
    }
  }
  renderData() {
    const { coin } = this.props;
    if (isEmpty(coin)) {
      return;
    } else {
      const keys = Object.values(coin);
      return keys.map((coinData) => {
        let { name, price, dailyChange, symbol, id } = coinData;
        let fixedPrice = price.toFixed(2);
        name = name.split(" ").join("_").split(".").join("_");
        const exists = document.getElementById(name);
        return (
          <div key={name} className="col-md-4">
            <div className="mb-3">
              <div className="card shadow">
                <div className="card-header">
                  <img
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`}
                    alt={symbol}
                    width="30"
                    height="30"
                    style={{ verticalAlign: "center", marginRight:'5px' }}
                  />
                  {coinData.name.split("_").join(" ")}
                  <div
                    className="text-muted"
                    style={{
                      float: "right",
                      fontSize: "12px",
                      verticalAlign: "middle",
                    }}
                  >
                    24h
                  </div>
                  <br />
                  <div
                    style={{
                      float: "left",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    ${fixedPrice}{" "}
                  </div>{" "}
                  {this.renderChange(dailyChange)}
                </div>
                <div className="card-body">
                  {exists === null ? this.renderCharts(name, symbol) : null}
                  <div id={name}></div>
                  <hr />
                  <a
                    href={`https://www.coinbase.com/price/${name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Buy on Coinbase
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
  }
  renderAuth() {
    return (
      <>
        Welcome {this.props.auth.user.name} go to your{" "}
        <Link to="/Dashboard">Dashboard</Link>
      </>
    );
  }
  renderUnAuth() {
    return (
      <>
        Please <Link to="/Login">Login</Link> or{" "}
        <Link to="/Register">Register</Link> to get started.
      </>
    );
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    if (this.props.auth === undefined) return null;
    return (
      <div className="container my-4">
        <div
          className="jumbotron rounded"
          style={{ marginTop: "10px", padding: "30px" }}
        >
          <div className="container">
            <h1 className="display-4">Cryptocurrency Simulator</h1>
            <hr className="my-4"></hr>
            <p className="lead">
              {isAuthenticated ? this.renderAuth() : this.renderUnAuth()}
            </p>
          </div>
        </div>
        <div className="row" id="firstRow">
          {this.renderData()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth, coin: state.coin.default_data };
};
export default connect(mapStateToProps, { getCoinsData })(Landing);
