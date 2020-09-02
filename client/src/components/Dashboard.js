import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import { connect } from "react-redux";
import {
  getAllCoins,
  getWatchlist,
  updateWatchlist,
  getSimWallet,
  buyCoin,
  sellCoin,
  getMoney,
} from "../actions";
import * as CryptoCharts from "cryptocharts";
import Modal from "react-modal";
import Loading from "./Loading";
import classnames from "classnames";
import isEmpty from "is-empty";
Modal.setAppElement("#transaction");
const customStyles = {
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  content: {
    size: "50%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalisOpen: false,
      errors: "",
      success: "",
      amount: "",
      price: "",
      clicked: {},
      updated: false,
    };
    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  async componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      await this.props.getWatchlist(this.props.userId);
      this.setState({ watch: this.props.watchlist });

      this.props.getAllCoins();
      this.props.getSimWallet(this.props.userId);
      await this.props.getMoney(this.props.userId);
    }
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    const isNumber = !isNaN(e.target.value);
    if (e.target.value === "") {
      this.setState({ errors: "", success: "", price: "", cost: "" });
    } else if (isNumber) {
      const cost = this.state.clicked.price * Number(e.target.value);
      this.setState({ price: cost });
      this.setState({
        errors: "",
        cost: `${e.target.value} ${
          this.state.clicked.name
        } is equal to $${cost.toFixed(2)}`,
      });
    } else {
      this.setState({
        errors: "Please Add a numerical value",
        success: "",
        cost: "",
      });
    }
  };
  async openModal(clicked) {
    this.setState({ modalisOpen: true, clicked });
    await this.props.getAllCoins();
    const watch_map = new Map();
    this.props.coin.forEach((e) => {
      watch_map.set(e.symbol, e);
    });
    let updated_coin = {};
    const updated_watch = this.state.watch.map((e) => {
      if (e.symbol === clicked.symbol) updated_coin = watch_map.get(e.symbol);
      return watch_map.get(e.symbol);
    });
    this.setState({
      watch: updated_watch,
      clicked: updated_coin,
      modalisOpen: true,
      updated: true,
    });
  }
  async afterOpen() {}

  async closeModal() {
    this.setState({
      errors: "",
      success: "",
      modalisOpen: false,
      amount: "",
      clicked: {},
      price: "",
      cost: "",
      updated: false,
    });
    await this.props.getSimWallet(this.props.userId);
  }
  onBuy = async (e) => {
    e.preventDefault();
    if (this.state.price > this.props.sim.amount) {
      this.setState({ errors: "Not enough money" });
    } else if (this.state.price) {
      this.setState({
        success: `Bought ${this.state.amount} for $${this.state.price.toFixed(
          2
        )}`,
      });
      await this.props.buyCoin(
        this.props.userId,
        this.state.clicked.name,
        this.state.amount,
        this.state.price
      );
      setTimeout(() => {
        this.closeModal();
      }, 250);
    }
  };
  onSell = async (e) => {
    e.preventDefault();
    let currentAmount = 0;
    this.props.sim.sim_wallet.forEach((e) => {
      if (e.coin === this.state.clicked.name) {
        currentAmount = e.volume;
      }
    });
    if (this.state.amount > currentAmount) {
      this.setState({ errors: `Not enough ${this.state.clicked.name}` });
    } else if (this.state.price) {
      this.setState({
        success: `Sold ${this.state.amount} for $${this.state.price.toFixed(
          2
        )}`,
      });
      await this.props.sellCoin(
        this.props.userId,
        this.state.clicked.name,
        this.state.amount,
        this.state.price
      );
      setTimeout(() => {
        this.closeModal();
      }, 250);
    }
  };

  renderSearch() {
    if (this.mounted) {
      return (
        <Multiselect
          options={this.props.coin}
          selectedValues={this.state.watch}
          onSelect={this.onSelect}
          onRemove={this.onRemove}
          displayValue="name"
          showCheckbox="true"
          avoidHighlightFirstOption="true"
          placeholder="Add or Remove Coin to Watchlist"
          style={{
            chips: { display: "none" },
            inputField: { width: "20rem" },
          }}
        />
      );
    }
  }
  onSelect = (list, item) => {
    this.setState({ watch: [...list] });
    this.props.updateWatchlist(list, this.props.userId);
  };
  onRemove = (list, item) => {
    let x = [...this.state.watch];
    for (let i = 0; i < x.length; i++) {
      if (x[i].id === item.id) {
        x.splice(i, 1);
      }
    }
    this.setState({ watch: [...x] });
    this.props.updateWatchlist(x, this.props.userId);
  };

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
    if (this.state.watch === undefined) {
      return <Loading />;
    } else {
      const keys = Object.values(this.state.watch);
      return keys.map((coinData) => {
        let { name, price, dailyChange, symbol, id } = coinData;
        if (/^\d/.test(name)) {
          name = "a" + name;
        }
        const fixedPrice = price.toFixed(2);
        name = name.split(" ").join("_").split(".").join("_");
        const exists = document.getElementById(name);
        return (
          <div key={id} className="col-md-4 ">
            <div className="mb-3" id="dog">
              <div className="card shadow">
                <div className="card-header">
                  <img
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`}
                    alt={coinData.name}
                    width="30"
                    height="30"
                    style={{ verticalAlign: "middle", marginRight: "5px" }}
                  />{" "}
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
                  <div id={name}></div>
                  {exists === null ? this.renderCharts(name, symbol) : null}
                  <hr />
                  <button
                    className="btn btn-primary"
                    onClick={() => this.openModal(coinData)}
                  >
                    Buy/Sell
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
  }
  renderWallet() {
    let v = 0;
    this.props.sim.sim_wallet.forEach((e) => {
      if (e.coin === this.state.clicked.name) {
        v = e.volume;
      }
    });
    return v;
  }
  renderSellButton() {
    const ret = this.renderWallet();
    if (ret === 0) {
      return false;
    }
    return true;
  }
  renderModal() {
    if (isEmpty(this.state.clicked)) return null;
    return (
      <Modal
        isOpen={this.state.modalisOpen}
        onRequestClose={this.closeModal}
        style={customStyles}
        onAfterOpen={this.afterOpen}
      >
        {this.state.updated ? (
          this.renderModalform()
        ) : (
          <h4>Updating prices...</h4>
        )}
      </Modal>
    );
  }
  renderModalform() {
    const { name, symbol, price, id } = this.state.clicked;
    const fixedPrice = price.toFixed(2);
    return (
      <form className="form">
        <div className="text-center">
          <img
            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`}
            alt={symbol}
            width="50"
            height="50"
          />
          <h1 className="h3 font-weight-normal"> ${fixedPrice}</h1>
          <p>
            USD Balance: ${this.props.sim.amount.toLocaleString()}
            <br />
            {name} Balance: {this.renderWallet().toLocaleString()} {symbol}
          </p>
        </div>
        <hr />
        <div className="form-label-group">
          <input
            autoComplete="off"
            onChange={this.onChange}
            value={this.state.amount || ""}
            id="amount"
            placeholder="Enter Amount"
            className={classnames("form-control", {
              "is-invalid": this.state.errors.length > 0,
              "is-valid": this.state.success.length > 0,
            })}
          />
          <span>{this.state.cost}</span>
          <div className="invalid-feedback">{this.state.errors}</div>
          <div className="valid-feedback">{this.state.success}</div>
          <label htmlFor="amount">Enter Amount</label>
        </div>
        <button
          className="btn btn-success btn-block"
          disabled={this.state.errors.length > 0}
          onClick={this.onBuy}
        >
          Buy
        </button>
        {this.renderSellButton() ? (
          <button
            className="btn btn-danger btn-block"
            disabled={this.state.errors.length > 0}
            onClick={this.onSell}
          >
            Sell
          </button>
        ) : null}
      </form>
    );
  }
  render() {
    if (this.props.watchlist === undefined || this.props.coin === undefined) {
      return <Loading />;
    }
    return (
      <div className="container" id="firstRow">
        {this.renderSearch()}
        <div className="row" style={{ marginTop: "15px" }}>
          {this.renderData()}
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  coin: state.coin.coin_data,
  userId: state.auth.user.id,
  watchlist: state.user.watchlist,
  sim: state.sim,
});

export default connect(mapStateToProps, {
  getAllCoins,
  getWatchlist,
  updateWatchlist,
  getSimWallet,
  buyCoin,
  sellCoin,
  getMoney,
})(Dashboard);
