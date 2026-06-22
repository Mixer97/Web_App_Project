import axios from "axios";
import { Component } from "react";

class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      fieldNames: {},
      loading: false,
      error: "",
    };
  }

  componentDidMount() {
    if (this.props.currentUser) {
      this.fetchUserBookings();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentUser !== prevProps.currentUser) {
      if (this.props.currentUser) {
        this.fetchUserBookings();
      } else {
        this.setState({ bookings: [], fieldNames: {} });
      }
    }
  }

  fetchUserBookings = () => {
    this.setState({ loading: true, error: "" });
    const url = "http://localhost:5000/api/fields/bookings/user";

    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        this.setState({ bookings: res.data, loading: false }, () => {
          this.resolveFieldNames();
        });
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err.message);
        this.setState({ loading: false, error: "Failed to load bookings." });
      });
  };

  resolveFieldNames = () => {
    const { bookings, fieldNames } = this.state;
    const updatedNames = { ...fieldNames };
    const fetchPromises = [];

    bookings.forEach((booking) => {
      if (!booking.fieldId) return;

      let id = typeof booking.fieldId === "object" ? booking.fieldId._id : booking.fieldId;

      if (typeof booking.fieldId === "object" && booking.fieldId.name) {
        updatedNames[id] = booking.fieldId.name;
        return;
      }
      if (id && !updatedNames[id]) {
        const promise = axios
          .get(`http://localhost:5000/api/fields/${id}`, {
            withCredentials: true,
          })
          .then((res) => {
            updatedNames[id] = res.data.name || "Unknown Field";
          })
          .catch((err) => {
            console.error(`Error fetching field ${id}:`, err.message);
            updatedNames[id] = "Unnamed Field Location";
          });
        fetchPromises.push(promise);
      }
    });

    if (fetchPromises.length > 0) {
      Promise.all(fetchPromises).then(() => {
        this.setState({ fieldNames: updatedNames });
      });
    } else {
      this.setState({ fieldNames: updatedNames });
    }
  };

  handleCancelBooking = (fieldProp, bookingId) => {
    const fieldId =
      fieldProp && typeof fieldProp === "object" ? fieldProp._id : fieldProp;

    if (!fieldId) {
      this.setState({
        error: "Cannot cancel booking: Missing association id metadata.",
      });
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    this.setState({ error: "" });
    const url = `http://localhost:5000/api/fields/${fieldId}/bookings/${bookingId}`;

    axios
      .delete(url, { withCredentials: true })
      .then(() => {
        this.setState((prevState) => ({
          bookings: prevState.bookings.filter((b) => b._id !== bookingId),
        }));
      })
      .catch((err) => {
        let message = err.response?.data?.msg || err.message;
        this.setState({ error: "Failed to cancel booking: " + message });
      });
  };

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  getFieldName = (fieldProp) => {
    if (!fieldProp) return "Unspecified Field Location";
    
    const id = typeof fieldProp === "object" ? fieldProp._id : fieldProp;
    return this.state.fieldNames[id] || "Loading Field Name...";
  };

  render() {
    const isLoggedIn = !!this.props.currentUser;
    const { bookings, loading, error } = this.state;

    return (
      <div className="container-fluid p-3 pt-3 mt-2">
        <div className="mb-5 text-center justify-content-center">
          <h2 className="fw-bold text-dark mb-1">Welcome to LOOK&BOOK</h2>
          <p className="text-muted small">
            Select an action panel below to manage your account.
          </p>
        </div>

        <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 justify-content-center mb-5">
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
                  Open Login Portal <i className="bi bi-chevron-right ms-1"></i>
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

        {isLoggedIn && (
          <div
            className="card shadow-sm border-0 p-4 mx-auto"
            style={{ maxWidth: "900px" }}
          >
            <div className="d-flex align-items-center mb-4">
              <div
                className="bg-danger bg-opacity-10 text-danger rounded-circle p-2 me-3 d-inline-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-calendar-check fs-5"></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark m-0">
                  Your Active Field Reservations
                </h4>
                <p className="text-muted small m-0">
                  Review schedule metrics or cancel upcoming slots
                </p>
              </div>
            </div>

            {error && (
              <div
                className="alert alert-danger d-flex align-items-center mb-3"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{error}</div>
              </div>
            )}

            {loading ? (
              <div className="text-center p-4">
                <div
                  className="spinner-border text-primary spinner-border-sm me-2"
                  role="status"
                ></div>
                <span className="text-muted small">
                  Loading active schedules...
                </span>
              </div>
            ) : bookings.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle border-0 m-0">
                  <thead className="table-light">
                    <tr>
                      <th
                        className="border-0 text-muted small text-uppercase"
                        style={{ letterSpacing: "0.05rem" }}
                      >
                        Field Name
                      </th>
                      <th
                        className="border-0 text-muted small text-uppercase"
                        style={{ letterSpacing: "0.05rem" }}
                      >
                        Target Date
                      </th>
                      <th
                        className="border-0 text-muted small text-uppercase"
                        style={{ letterSpacing: "0.05rem" }}
                      >
                        Time Window
                      </th>
                      <th
                        className="border-0 text-end text-muted small text-uppercase"
                        style={{ letterSpacing: "0.05rem" }}
                      >
                        Management
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="fw-bold text-dark">
                          {this.getFieldName(booking.fieldId)}
                          {booking.fieldId?.sport && (
                            <span
                              className="badge bg-primary bg-opacity-10 text-primary ms-2 fw-semibold"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {booking.fieldId.sport}
                            </span>
                          )}
                        </td>
                        <td className="text-secondary small">
                          <i className="bi bi-calendar3 me-1"></i>{" "}
                          {booking.date}
                        </td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1.5 fw-semibold">
                            <i className="bi bi-clock me-1"></i> {booking.slot}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm px-3 fw-medium"
                            onClick={() =>
                              this.handleCancelBooking(
                                booking.fieldId,
                                booking._id,
                              )
                            }
                          >
                            <i className="bi bi-trash3-fill me-1"></i> Cancel
                            Slot
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-5 bg-light rounded border text-muted">
                <i className="bi bi-emoji-neutral d-block fs-2 mb-2 text-secondary opacity-50"></i>
                <span className="small">
                  You do not have any active field reservations recorded yet.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default HomeView;