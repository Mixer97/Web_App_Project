import { Component } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "logonStatus",
      status: {
        userStatus: "Not Registered",
        statusBadgeColor: "bg-secondary",
      },
    };
  }

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  render() {
    const { userStatus, statusBadgeColor } = this.state.status;

    const sidebarStyle = {
      overflowX: "hidden",
      overflowY: "auto",
    };

    return (
      <div
        className="col-3 bg-dark text-white vh-100 p-4 d-flex flex-column"
        style={sidebarStyle}
      >
        <div className="mb-4 d-flex flex-column align-items-center gap-4 w-100">
          Sports app
        </div>
        <div className="d-flex flex-column gap-3">
          {/* HORIZONTAL SEARCH FORM */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
              {/* Changed 'for' to 'htmlFor' for React conformity */}
              <label
                htmlFor="sidebarSearch"
                className="form-label small text-muted"
              >
                Search
              </label>

              {/* Flex wrapper container forces input and button side-by-side */}
              <div className="d-flex align-items-center">
                <input
                  type="search"
                  className="form-control flex-grow-1"
                  id="sidebarSearch"
                  placeholder="Find..."
                />
                <button type="submit" className="btn btn-primary ms-2">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </form>

          {/* NAVIGATION LINKS */}
          <button
            onClick={() => this.QSetViewInParent({ page: "homeView" })}
            type="submit"
            className="btn btn-secondary "
          >
            home
          </button>
          <button
            onClick={() => this.QSetViewInParent({ page: "userView" })}
            type="submit"
            className="btn btn-secondary"
          >
            User
          </button>
          <button
            onClick={() => this.QSetViewInParent({ page: "tournamentView" })}
            type="submit"
            className="btn btn-secondary"
          >
            Tournaments
          </button>
          <button
            onClick={() => this.QSetViewInParent({ page: "fieldView" })}
            type="submit"
            className="btn btn-secondary"
          >
            Fields
          </button>
        </div>

        {/* ACCOUNT STATUS FOOTER */}
        <div className="mt-auto pt-4 border-top border-secondary w-100">
          <div className="d-flex align-items-center gap-2">
            <span
              className={`p-1 ${statusBadgeColor} rounded-circle d-inline-block`}
              style={{ width: "25px", height: "25px" }}
            ></span>

            <div className="d-flex flex-column">
              <span className=" small" style={{ fontSize: "0.75rem" }}>
                Account Status:
              </span>
              <span
                className="fw-semibold text-truncate"
                style={{ maxWidth: "150px" }}
              >
                {userStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
