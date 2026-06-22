import { Component } from "react";

class HomeView extends Component {
    constructor(props) {
    super(props);
    this.state = {
      type: "userBookings",
      data: {
        userBooking: {fieldId:"", userId:"", date:"", slot:"", match: "" },
      },
    };
  }


  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  render() {
    const isLoggedIn = !!this.props.currentUser;

    return (
      <div className="container-fluid p-3 pt-3 mt-2">
        <div className="mb-5 text-center justify-content-center">
          <h2 className="fw-bold text-dark mb-1">Welcome to LOOK&BOOK</h2>
          <p className="text-muted small">
            Select an action panel below to manage your account.
          </p>
        </div>

        <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 justify-content-center">
          <div className="col">
            <div
              className="card h-100 border-0 shadow-sm bg-light p-3 text-center text-sm-start transition-all cursor-pointer border-start border-secondary-light border-4"
              onClick={() => this.QSetViewInParent({ page: "loginView" })}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex flex-column justify-content-between p-2">
                <div>
                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3">
                    <i className="bi bi-box-arrow-in-right fs-4"></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">Access Account</h5>
                  <p className="text-muted small mb-0">
                    Sign into an existing secure profile to reserve fields.
                  </p>
                </div>
                <div className="mt-4 text-primary fw-medium small d-none d-sm-block">
                  Open Login Portal{" "}
                  <i className="bi bi-chevron-right ms-1"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div
              className="card h-100 border-0 shadow-sm bg-light p-3 text-center text-sm-start border-start border-secondary-light border-4"
              onClick={() => this.QSetViewInParent({ page: "registerView" })}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex flex-column justify-content-between p-2">
                <div>
                  <div className="bg-success bg-opacity-10 text-success rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3">
                    <i className="bi bi-person-plus fs-4"></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">Create Account</h5>
                  <p className="text-muted small mb-0">
                    Register a new profile to track your tournament brackets.
                  </p>
                </div>
                <div className="mt-4 text-success fw-medium small d-none d-sm-block">
                  Register Now <i className="bi bi-chevron-right ms-1"></i>
                </div>
              </div>
            </div>
          </div>

          {isLoggedIn && (
            <div className="col">
              <div
                className="card h-100 border-0 shadow-sm bg-light p-3 text-center text-sm-start border-start border-secondary-light border-4"
                onClick={() => this.QSetViewInParent({ page: "whoAmIView" })}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body d-flex flex-column justify-content-between p-2">
                  <div>
                    <div className="bg-info bg-opacity-10 text-info rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3">
                      <i className="bi bi-person-bounding-box fs-4"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-1">User Information</h5>
                    <p className="text-muted small mb-0">
                      Inspect secure token settings, sessions, credentials, and
                      names.
                    </p>
                  </div>
                  <div className="mt-4 text-info fw-medium small d-none d-sm-block">
                    View Profile Details{" "}
                    <i className="bi bi-chevron-right ms-1"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default HomeView;