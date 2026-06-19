import { Component } from "react";
import axios from "axios";

class WhoAmIView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      name: "",
      surname: "",
      email: "",
    };
  }

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  componentDidMount() {
    this.fetchIdLoggedInUser();
  }

  fetchIdLoggedInUser = () => {
    this.setState({ username: "", name: "", surname: "", email: "" });
    const url = `http://localhost:5000/api/whoami`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) =>
        this.setState({
          username: res.data.username,
          name: res.data.name,
          surname: res.data.surname,
          email: res.data.email,
        }),
      )
      .catch((err) => console.log("Error: " + err.message));
  };

  render() {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 p-4">
        <div
          className="card shadow border-0 p-4 w-100"
          style={{ maxWidth: "550px" }}
        >
          <div className="text-center mb-4">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "64px", height: "64px" }}
            >
              <i className="bi bi-person-badge fs-2"></i>
            </div>
            <h3 className="fw-bold text-dark m-0">User Account Profile</h3>
          </div>

          <hr className="text-muted opacity-25 mb-4" />

          <div className="row g-3 pb-4">
            <div className="col-12">
              <div className="bg-light p-3 rounded border-start border-primary border-4 shadow-sm">
                <span
                  className="text-muted text-uppercase fw-bold d-block mb-1"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.05rem" }}
                >
                  Username
                </span>
                <span className="fs-5 fw-bold text-dark">
                  {this.state.username || (
                    <span className="text-muted placeholder-glow">
                      <span className="placeholder col-4"></span>
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="col-6">
              <div className="bg-light p-3 rounded shadow-sm">
                <span
                  className="text-muted text-uppercase fw-bold d-block mb-1"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.05rem" }}
                >
                  First Name
                </span>
                <span className="fw-semibold text-dark">
                  {this.state.name || "—"}
                </span>
              </div>
            </div>

            <div className="col-6">
              <div className="bg-light p-3 rounded shadow-sm">
                <span
                  className="text-muted text-uppercase fw-bold d-block mb-1"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.05rem" }}
                >
                  Last Name
                </span>
                <span className="fw-semibold text-dark">
                  {this.state.surname || "—"}
                </span>
              </div>
            </div>

            <div className="col-12">
              <div className="bg-light p-3 rounded shadow-sm">
                <span
                  className="text-muted text-uppercase fw-bold d-block mb-1"
                  style={{ fontSize: "0.7rem", letterSpacing: "0.05rem" }}
                >
                  Email Address
                </span>
                <span
                  className="fw-semibold text-dark text-truncate d-block"
                  title={this.state.email}
                >
                  <i className="bi bi-envelope text-muted me-2"></i>
                  {this.state.email || "—"}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary text-decoration-none text-light w-100 text-center p-3"
            onClick={() => this.QSetViewInParent({ page: "homeView" })}
          >
            <i className="bi bi-house-door me-1"></i>Return Home
          </button>
        </div>
      </div>
    );
  }
}

export default WhoAmIView;
