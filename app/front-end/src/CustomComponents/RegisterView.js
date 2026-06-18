import { Component } from "react";
import axios from "axios";

class RegisterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "register",
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

  QcheckUserWithDB = () => {
    axios
      .post("http://localhost:5000/api/auth/signin", {
        username: this.state.user.username,
        password: this.state.user.password,
      })
      .then((res) => {
        console.log(this.state);
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

  QSaveUserToDB = (e) => {
    e.preventDefault();
    this.setState({ error: "" });

    axios
      .post("http://localhost:5000/api/auth/signup", {
        username: this.state.user.username,
        password: this.state.user.password,
        name: this.state.user.name,
        surname: this.state.user.surname,
        email: this.state.user.email,
      })
      .then((res) => {
        console.log(this.state);
        this.QcheckUserWithDB();
        this.props.QRegistrationDataFromChild(this.state.user);
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
      <div id="menu" className="row">
        <form onSubmit={(e) => this.QSaveUserToDB(e)}>
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
            <label htmlFor="exampleInputUsername1" className="form-label">
              Username
            </label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="username"
              type="text"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="password"
              type="password"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputName1" className="form-label">
              Name
            </label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="name"
              type="text"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputSurname1" className="form-label">
              Surname
            </label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="surname"
              type="text"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="email"
              type="email"
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default RegisterView;
