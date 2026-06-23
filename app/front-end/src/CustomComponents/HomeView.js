import axios from "axios";
import { Component } from "react";

class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      fieldNames: {},
      fieldAddresses: {},
      myTournaments: [],
      loading: false,
      error: "",
    };
  }

  componentDidMount() {
    if (this.props.currentUser) {
      this.fetchUserBookings();
    }
    if (this.props.loggedInUserId) {
      this.fetchMyTournaments();
    }
  }

  componentDidUpdate(prevProps) {
    const userChanged = this.props.currentUser !== prevProps.currentUser;
    const idChanged = this.props.loggedInUserId !== prevProps.loggedInUserId;

    if (userChanged) {
      if (this.props.currentUser) {
        this.fetchUserBookings();
      } else {
        this.setState({
          bookings: [],
          fieldNames: {},
          fieldAddresses: {},
          myTournaments: [],
        });
      }
    }

    if (idChanged) {
      if (this.props.loggedInUserId) {
        this.fetchMyTournaments();
      } else {
        this.setState({ myTournaments: [] });
      }
    }

    const pageChanged = this.props.currentPage !== prevProps.currentPage;
    if (pageChanged && (this.props.currentPage === "homeView" || this.props.currentPage === "")) {
      if (this.props.currentUser) this.fetchUserBookings();
      if (this.props.loggedInUserId) this.fetchMyTournaments();
    }
  }

  fetchMyTournaments = () => {
    const { loggedInUserId } = this.props;
    if (!loggedInUserId) return;
    axios
      .get("http://localhost:5000/api/tournaments")
      .then((res) => {
        const mine = res.data.filter(
          (t) =>
            t.creatorId && t.creatorId.toString() === loggedInUserId.toString(),
        );
        this.setState({ myTournaments: mine });
      })
      .catch(() => {});
  };

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
    const { bookings, fieldNames, fieldAddresses } = this.state;
    const updatedNames = { ...fieldNames };
    const updatedAddresses = { ...fieldAddresses };
    const fetchPromises = [];

    bookings.forEach((booking) => {
      if (!booking.fieldId) return;

      const id =
        typeof booking.fieldId === "object"
          ? booking.fieldId._id
          : booking.fieldId;

      if (typeof booking.fieldId === "object") {
        if (booking.fieldId.name) updatedNames[id] = booking.fieldId.name;
        if (booking.fieldId.address)
          updatedAddresses[id] = booking.fieldId.address;
        if (booking.fieldId.name && booking.fieldId.address) return;
      }

      if (id && (!updatedNames[id] || !updatedAddresses[id])) {
        const promise = axios
          .get(`http://localhost:5000/api/fields/${id}`, {
            withCredentials: true,
          })
          .then((res) => {
            updatedNames[id] = res.data.name || "Unknown Field";
            updatedAddresses[id] = res.data.address || "No Address Provided";
          })
          .catch((err) => {
            console.error(`Error fetching field ${id}:`, err.message);
            updatedNames[id] = "Unnamed Field Location";
            updatedAddresses[id] = "Unknown Address";
          });
        fetchPromises.push(promise);
      }
    });

    if (fetchPromises.length > 0) {
      Promise.all(fetchPromises).then(() => {
        this.setState({
          fieldNames: updatedNames,
          fieldAddresses: updatedAddresses,
        });
      });
    } else {
      this.setState({
        fieldNames: updatedNames,
        fieldAddresses: updatedAddresses,
      });
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

  getFieldAddress = (fieldProp) => {
    if (!fieldProp) return "Unspecified Location";
    const id = typeof fieldProp === "object" ? fieldProp._id : fieldProp;
    return this.state.fieldAddresses[id] || "Loading Address...";
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
                    Sign into an existing profile.
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
                    Register a new profile.
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
                      Inspect your information and account details, including
                      your email and username.
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
                <h4 className="fw-bold text-dark m-0">My Fields</h4>
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
                        Location
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
                          <i className="bi bi-geo-alt me-1"></i>
                          {this.getFieldAddress(booking.fieldId)}
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

        {isLoggedIn && (
          <div
            className="card shadow-sm border-0 p-4 mx-auto mt-4"
            style={{ maxWidth: "900px" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <div
                  className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3 d-inline-flex align-items-center justify-content-center"
                  style={{ width: "42px", height: "42px" }}
                >
                  <i className="bi bi-trophy fs-5"></i>
                </div>
                <div>
                  <h4 className="fw-bold text-dark m-0">My Tournaments</h4>
                  <p className="text-muted small m-0">
                    Tournaments you have created
                  </p>
                </div>
              </div>
              <button
                className="btn btn-success btn-sm fw-semibold"
                onClick={() =>
                  this.QSetViewInParent({ page: "tournamentCreateView" })
                }
              >
                <i className="bi bi-plus-lg me-1"></i>New Tournament
              </button>
            </div>

            {this.state.myTournaments.length === 0 ? (
              <div className="text-center p-4 bg-light rounded border text-muted">
                <i className="bi bi-trophy d-block fs-2 mb-2 opacity-25"></i>
                <span className="small">
                  You have not created any tournaments yet.
                </span>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {this.state.myTournaments.map((t) => {
                  const statusColor =
                    {
                      upcoming: "bg-warning text-dark",
                      active: "bg-success text-white",
                      completed: "bg-secondary text-white",
                    }[t.status] || "bg-secondary text-white";

                  return (
                    <div className="col" key={t._id}>
                      <div
                        className="card border-0 bg-light p-3 h-100"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          this.QSetViewInParent({
                            page: "tournamentDetailView",
                            tournamentId: t._id,
                          })
                        }
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <span className="fw-semibold text-dark">
                            {t.name}
                          </span>
                          <span
                            className={`badge small fw-bold ms-2 flex-shrink-0 ${statusColor}`}
                          >
                            {t.status}
                          </span>
                        </div>
                        <div className="d-flex gap-2 mt-2 align-items-center">
                          <span className="badge bg-primary bg-opacity-10 text-primary small">
                            {t.sport}
                          </span>
                          <span className="text-muted small">
                            <i className="bi bi-calendar3 me-1"></i>
                            {t.startDate}
                          </span>
                          <span className="text-muted small">
                            <i className="bi bi-people me-1"></i>
                            {t.teamIds ? t.teamIds.length : 0}/{t.maxTeams}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default HomeView;
