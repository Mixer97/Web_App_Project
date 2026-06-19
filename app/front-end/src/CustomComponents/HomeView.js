import { Component } from "react";

class HomeView extends Component {
  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  QGetUserInfoFromDb;

  render() {
    return (
      <div className="row row-cols-1 row-cols-md-2 g-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Home page</h2>
              <button
                onClick={() => this.QSetViewInParent({ page: "loginView" })}
                type="login"
                className="btn btn-primary ms-2"
              >
                LOGIN
              </button>
              <button
                onClick={() => this.QSetViewInParent({ page: "registerView" })}
                type="register"
                className="btn btn-primary ms-2"
              >
                REGISTER
              </button>
              <button
                onClick={() => this.QSetViewInParent({ page: "whoAmIView" })}
                type="info"
                className="btn btn-primary ms-2"
              >
                WHO AM I
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeView;
