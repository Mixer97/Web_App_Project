import { Component } from "react";

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "login",
    };
  }

  QGetTextFromField = (e) => {
    this.setState((prevState) => ({
      user: { ...prevState.user, [e.target.name]: e.target.value },
    }));
  };

  QSentUserToParent = (state) => {
    this.props.QUserFromChild(state.user);
  };

  render() {
    return (
      <div id="menu" className="row">
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputUsername1" className="form-label">
              Username
            </label>
            <input
              onChange={(e) => this.QGetTextFromField(e)}
              name="username"
              type="text"
              className="form-control"
              id="exampleInputUsername1"
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
              id="exampleInputPassword1"
            />
          </div>
          <button
            onClick={() => this.QSentUserToParent(this.state)}
            type="submit"
            className="btn btn-primary"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default LoginView;
