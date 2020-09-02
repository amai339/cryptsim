import React from "react";
import { connect } from "react-redux";
import { getSimWallet, getAllCoins, getMoneyInvested } from "../actions";
import Loading from "./Loading";
class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    await this.props.getMoneyInvested(this.props.userId);
    if (this.props.sim_wallet === undefined) {
      await this.props.getSimWallet(this.props.userId);
    }
    if (this.props.coin_data === undefined) await this.props.getAllCoins();
    let coin_map = new Map();
    this.props.coin_data.forEach(({ name, price, symbol, id }) => {
      coin_map.set(name, { price, symbol, id });
    });
    let portfolio = [];
    let totalValue = 0;
    this.props.sim.sim_wallet.forEach(({ coin, volume }) => {
      const currentCoin = coin_map.get(coin);
      const price = currentCoin.price;
      const percent = Number((volume * price).toFixed(2));
      totalValue += percent;
      portfolio.push({
        coin,
        volume,
        price,
        percent,
        symbol: currentCoin.symbol,
        id: currentCoin.id,
      });
    });
    for (let i = 0; i < portfolio.length; i++) {
      portfolio[i].percent = (
        (portfolio[i].percent / totalValue) *
        100
      ).toFixed(2);
    }
    this.setState({ portfolio, totalValue });
  }
  renderPortfolio() {
    return this.state.portfolio.map(
      ({ coin, volume, percent, price, symbol, id }) => {
        return (
          <tr key={coin}>
            <td key={coin}>
              <p id="trow">
                <img
                  src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`}
                  alt={symbol}
                  width="32"
                  height="32"
                  style={{ marginRight: "6px" }}
                />

                {coin}
              </p>
            </td>
            <td>
              <p id="trow">
                $
                {(volume * price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>{" "}
              <p id="muted">
                {" "}
                {volume} {symbol}
              </p>
            </td>
            <td>
              <p id="trow">{percent}%</p>
            </td>
          </tr>
        );
      }
    );
  }
  renderNetProfit() {
    const netProfit = this.props.sim.moneyInvested.profit;
    if (netProfit < 0) {
      return (
        <>
          <div className="text-danger">{`-$${(
            netProfit * -1
          ).toLocaleString()}`}</div>
          <p style={{ fontSize: "20px" }} className="text-muted">
            Net Profit
          </p>
        </>
      );
    } else if (netProfit > 0) {
      return (
        <>
          <div className="text-success">
            {`$${netProfit.toLocaleString()}`}{" "}
          </div>
          <p style={{ fontSize: "20px" }} className="text-muted">
            Net Profit
          </p>
        </>
      );
    } else {
      return (
        <>
          <div className="text-dark">${netProfit}</div>
          <p style={{ fontSize: "20px" }} className="text-muted">
            Net Profit
          </p>
        </>
      );
    }
  }
  render() {
    if (this.state.portfolio === undefined) {
      return <Loading />;
    } else {
      return (
        <div className="container">
          <div className="jumbotron my-4" style={{ padding: "30px" }}>
            <div className="container">
              <h1 className="display-4" style={{ textAlign: "center" }}>
                {this.renderNetProfit()}
              </h1>
              <hr className="my-4" />
              <p className="lead" style={{ textAlign: "center" }}>
                Total Portfolio Value: $
                {this.state.totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <br />
                Total Money Invested: $
                {this.props.sim.moneyInvested.invested.toLocaleString()}
              </p>
            </div>
          </div>
          <table className="table table-hover my-3 rounded">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Asset</th>
                <th scope="col">Balance</th>
                <th scope="col">Allocation</th>
              </tr>
            </thead>
            <tbody>{this.renderPortfolio()}</tbody>
          </table>
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
  coin_data: state.coin.coin_data,
  sim: state.sim,
});
export default connect(mapStateToProps, {
  getSimWallet,
  getAllCoins,
  getMoneyInvested,
})(Portfolio);
