import { Component } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Styles/NavBar.css";

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
    const username = this.props.currentUser;

    const userStatus = username ? username : "Not Registered";
    const statusBadgeColor = username ? "bg-success" : "bg-secondary";

    const sidebarStyle = {
      overflowX: "hidden",
      overflowY: "auto",
    };

    return (
      <div
        className="col-3 bg-dark text-white sticky-top vh-100 p-4 d-flex flex-column my-custom-sidebar"
        style={sidebarStyle}
      >
        <div className="mb-4 d-flex flex-column align-items-center gap-4 w-100">
          <h2 className="card-title sports-title-scoreboard">Look&Book</h2>
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
            <i className="bi bi-house-door"></i>
            <span> Home</span>
          </button>
          <button
            onClick={() => this.QSetViewInParent({ page: "userView" })}
            type="submit"
            className="btn btn-secondary"
          >
            <i className="bi bi-person"></i>
            <span> User</span>
          </button>
          <button
            onClick={() => this.QSetViewInParent({ page: "tournamentView" })}
            type="submit"
            className="btn btn-secondary"
          >
            <i className="bi bi-trophy"></i>
            <span> Tournaments</span>
          </button>
          <button
            onClick={() => this.QSetViewInParent({ page: "fieldView" })}
            type="submit"
            className="btn btn-secondary"
          >
            <i className="bi bi-geo-alt"></i>
            <span> Fields</span>
          </button>
        </div>

        {/* ACCOUNT STATUS FOOTER */}
        <div className="mt-auto pt-4 border-top border-secondary w-100 px-2">
          <div
            className={`card border-0 shadow-sm transition-all text-center p-3 ${
              username
                ? "bg-success bg-opacity-25 text-success-light border-start border-success border-4"
                : "bg-secondary bg-opacity-10 text-muted"
            }`}
          >
            <div className="d-flex flex-column align-items-center">
              <span
                className="text-uppercase text-white-50 tracking-wider fw-bold mb-1"
                style={{ fontSize: "0.65rem", letterSpacing: "0.05rem" }}
              >
                Account User
              </span>

              <span
                className={`fw-bold text-truncate w-100 ${username ? "text-success" : "text-white-50"}`}
                style={{ fontSize: "1rem", maxWidth: "160px" }}
                title={userStatus}
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
