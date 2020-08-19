import React from "react";
import { connect } from "react-redux";
import { getTransactions } from "../actions";
import isEmpty from "is-empty";
class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], pageIndex: 0 };
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }
  async componentDidMount() {
    await this.props.getTransactions(this.props.userId);
    this.setState({ count: this.props.transactions.length });
    const pages = Math.ceil(this.props.transactions.length / 14 );
    let data = [];
    for (let i = 0; i < pages; i++) {
      if (i === pages - 1) data[i] = this.props.transactions.splice(0);
      else data[i] = this.props.transactions.splice(0, 14);
    }
    this.setState({ data });
  }
  renderTransactions() {
    if (isEmpty(this.state.data)) {
      return;
    } else {
      return this.state.data[this.state.pageIndex].map(
        ({ transaction_type, coin, volume, price, time, _id }) => {
          return (
            <tr key={_id}>
              <th key={_id} scope="row">
                {transaction_type}
              </th>
              <td>{coin}</td>
              <td>
                {transaction_type === "Add Money"
                  ? `$${volume.toLocaleString()}`
                  : volume.toLocaleString()}
              </td>
              <td>{price === null ? null : `$${price.toLocaleString()}`}</td>
              <td>{time}</td>
            </tr>
          );
        }
      );
    }
  }
  renderPaginate() {
    const currentPage = this.state.pageIndex
    return (
      <>
        <li className={`page-item ${currentPage === 0?'disabled': ''}`}>
          <button className='page-link' onClick={this.handlePrev}>
            Previous
          </button>
        </li>
        {this.renderPag()}
        <li className={`page-item ${currentPage === this.state.data.length - 1?'disabled': ''}`}>
          <button className="page-link" onClick={this.handleNext}>
            Next
          </button>
        </li>
      </>
    );
  }
  renderPag() {
    const pages = [...this.state.data.keys()];
    return pages.map((page) => {
      return (
        <li
          key={page}
          className={`page-item ${
            this.state.pageIndex === page ? "active" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={(e) => this.handlePage(e, page)}
          >
            {page + 1}
          </button>
        </li>
      );
    });
  }
  handlePage(e, pageIndex) {
    e.preventDefault();
    this.setState({ pageIndex });
  }
  handleNext(e) {
    e.preventDefault();
    const currentPage = this.state.pageIndex;
    if (currentPage === this.state.data.length - 1) {
    } else this.setState({ pageIndex: currentPage + 1 });
  }
  handlePrev(e) {
    e.preventDefault();
    const currentPage = this.state.pageIndex;
    if (currentPage === 0) {
    } else this.setState({ pageIndex: currentPage - 1 });
  }
  render() {
    if (this.props.transactions === undefined) {
      return (
        <div>
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <span id="spinnertext">Loading</span>
        </div>
      );
    } else {
      return (
        <div className="container">
          <table className="table table-hover my-3">
            <thead className="thead-dark" >
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Cryptocurrency</th>
                <th scope="col">Amount</th>
                <th scope="col">Price</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>{this.renderTransactions()}</tbody>
          </table>
          <ul className="pagination" style={{ justifyContent:'center' }}>
            {this.renderPaginate()}
          </ul>
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
  transactions: state.sim.transactions,
});
export default connect(mapStateToProps, { getTransactions })(History);
