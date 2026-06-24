import { Component } from "react";
import axios from "axios";

class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      tournaments: [],
      loadingTournaments: false,
      fetched: false,
    };
  }

  handleToggle = () => {
    const { expanded, fetched } = this.state;
    if (!expanded && !fetched) {
      this.setState({ expanded: true, loadingTournaments: true });
      axios
        .get(`/api/users/${this.props.user._id}`)
        .then((res) => {
          this.setState({
            tournaments: res.data.tournaments || [],
            loadingTournaments: false,
            fetched: true,
          });
        })
        .catch(() =>
          this.setState({ loadingTournaments: false, fetched: true }),
        );
    } else {
      this.setState({ expanded: !expanded });
    }
  };

  render() {
    const { user, onTournamentClick } = this.props;
    const { expanded, tournaments, loadingTournaments } = this.state;

    const statusColor = {
      upcoming: "bg-warning text-dark",
      active: "bg-success text-white",
      completed: "bg-secondary text-white",
    };

    return (
      <div className="card shadow-sm border-0 p-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
              style={{ width: "46px", height: "46px", fontSize: "1.1rem" }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold text-dark">
                {user.name} {user.surname}
              </div>
              <div className="text-muted small">@{user.username}</div>
            </div>
          </div>

          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={this.handleToggle}
            title={expanded ? "Hide tournaments" : "Show tournaments"}
          >
            <i className={`bi bi-trophy me-1`}></i>
            <i
              className={`bi bi-chevron-${expanded ? "up" : "down"} small`}
            ></i>
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-top border-opacity-25">
            <span
              className="text-muted text-uppercase fw-bold d-block mb-2"
              style={{ fontSize: "0.65rem", letterSpacing: "0.05rem" }}
            >
              Tournaments Created
            </span>

            {loadingTournaments ? (
              <div className="text-center py-2">
                <div
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                ></div>
              </div>
            ) : tournaments.length === 0 ? (
              <p className="text-muted small fst-italic mb-0">
                No tournaments created.
              </p>
            ) : (
              <ul className="list-unstyled mb-0">
                {tournaments.map((t) => (
                  <li
                    key={t._id}
                    className="d-flex align-items-center justify-content-between py-1 px-2 rounded mb-1"
                    style={{
                      cursor: "pointer",
                      background: "rgba(0,0,0,0.03)",
                    }}
                    onClick={() => onTournamentClick(t._id)}
                  >
                    <span className="small fw-medium text-dark">{t.name}</span>
                    <div className="d-flex align-items-center gap-1 ms-2">
                      <span
                        className="badge bg-primary bg-opacity-10 text-primary"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {t.sport}
                      </span>
                      <span
                        className={`badge ${statusColor[t.status] || "bg-secondary text-white"}`}
                        style={{ fontSize: "0.6rem" }}
                      >
                        {t.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }
}

class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      searchQuery: "",
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = (q = "") => {
    this.setState({ loading: true });
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    axios
      .get(`/api/users${params}`)
      .then((res) => this.setState({ users: res.data, loading: false }))
      .catch(() => this.setState({ loading: false }));
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.fetchUsers(this.state.searchQuery);
  };

  render() {
    const { users, searchQuery, loading } = this.state;

    return (
      <div className="container-fluid p-3 pt-2 mt-2">
        <div className="card shadow border-0 p-4 mb-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3 d-inline-flex align-items-center justify-content-center"
              style={{ width: "42px", height: "42px" }}
            >
              <i className="bi bi-people fs-5"></i>
            </div>
            <div>
              <h3 className="fw-bold text-dark m-0">Users</h3>
              <p className="text-muted small m-0">Browse registered players</p>
            </div>
          </div>

          <hr className="text-muted opacity-25 mb-3" />

          <form onSubmit={this.handleSearchSubmit}>
            <div className="d-flex align-items-center shadow-sm rounded bg-light border px-2">
              <i className="bi bi-search text-muted me-2"></i>
              <input
                type="search"
                className="form-control border-0 bg-transparent flex-grow-1 shadow-none"
                placeholder="Search by username, name or surname..."
                value={searchQuery}
                onChange={(e) => this.setState({ searchQuery: e.target.value })}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm px-3 my-1 ms-2"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <div
              className="spinner-border text-primary spinner-border-sm"
              role="status"
            ></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center p-5 border rounded bg-light shadow-sm text-muted">
            No users found.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {users.map((user) => (
              <div className="col" key={user._id}>
                <UserCard
                  user={user}
                  onTournamentClick={(id) =>
                    this.props.QViewFromChild({
                      page: "tournamentDetailView",
                      tournamentId: id,
                    })
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default UserView;
