import { Component } from "react";

class HomeView extends Component {
  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  render() {
    return (
      <div id="menu" className="row">
        <h1>User page</h1>
        <button
          onClick={() => this.QSetViewInParent({ page: "loginView" })}
          type="login"
          className="btn btn-primary ms-2"
        >
          LOGIN
        </button>
      </div>
    );
  }
}

export default HomeView;
