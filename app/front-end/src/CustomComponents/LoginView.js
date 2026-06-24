import { Component } from "react";
import axios from "axios";

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "login",
      user: {},
      error: "",
    };
  }

  QGetTextFromField = (e) => {
    this.setState((prevState) => ({
      user: { ...prevState.user, [e.target.name]: e.target.value },
      error: "",
    }));
  };

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  QcheckUserWithDB = (e) => {
    e.preventDefault();
    this.setState({ error: "" });

    axios
      .post(
        "/api/auth/signin",
        {
          username: this.state.user.username,
          password: this.state.user.password,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        console.log(this.state);
        this.props.QLoginDataFromChild(this.state.user);
      })
      .catch((err) => {
        let message = "Something went wrong. Please try again later.";

        if (err.response) {
          message = err.response.data.msg || `Error: ${err.response.status}`;
        } else if (err.request) {
          message = "Cannot connect to the server. Check your network.";
        } else {
          message = err.message;
        }
        this.setState({ error: message });
      });
  };

  render() {
    return (
      <div
        className="d-flex justify-content-center align-items-center w-100 p-3"
        style={{ minHeight: "70vh" }}
      >
        <div className="card shadow p-4 w-100" style={{ maxWidth: "450px" }}>
          <h2 className="text-center mb-4 fw-bold text-primary">
            Login Portal
          </h2>

          <form onSubmit={(e) => this.QcheckUserWithDB(e)}>
            {this.state.error && (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{this.state.error}</div>
              </div>
            )}

            <div className="mb-3">
              <label
                htmlFor="exampleInputUsername1"
                className="form-label fw-medium"
              >
                Username
              </label>
              <input
                onChange={(e) => this.QGetTextFromField(e)}
                name="username"
                type="text"
                className="form-control"
                id="exampleInputUsername1"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="exampleInputPassword1"
                className="form-label fw-medium"
              >
                Password
              </label>
              <input
                onChange={(e) => this.QGetTextFromField(e)}
                name="password"
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                required
              />
            </div>

            <div className="d-flex gap-2 justify-content-between pb-4">
              <button type="submit" className="btn btn-primary flex-grow-1">
                <i className="bi bi-box-arrow-in-right me-1"></i> Submit
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary flex-grow-1"
                onClick={() => this.QSetViewInParent({ page: "registerView" })}
              >
                <i className="bi bi-person-plus me-1"></i> Register
              </button>
            </div>
            <button
              type="button"
              className="btn btn-secondary text-decoration-none text-light w-100 text-center p-3"
              onClick={() => this.QSetViewInParent({ page: "homeView" })}
            >
              <i className="bi bi-house-door me-1"></i> Cancel & Return Home
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginView;
