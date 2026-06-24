import { Component } from "react";
import axios from "axios";

class TournamentCard extends Component {
  render() {
    const { tournament, onView } = this.props;

    const registeredCount = tournament.teamIds ? tournament.teamIds.length : 0;
    const isFull = registeredCount >= tournament.maxTeams;

    const statusColor =
      {
        upcoming: "bg-warning text-dark",
        active: "bg-success text-white",
        completed: "bg-secondary text-white",
      }[tournament.status] || "bg-secondary text-white";

    return (
      <div className="col">
        <div className="card h-100 shadow-sm border-0 bg-light p-2">
          <div className="card-body d-flex flex-column justify-content-between p-3">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h4 className="fw-bold text-dark m-0">{tournament.name}</h4>
                <span
                  className={`badge px-2 py-1 small fw-bold text-uppercase ${statusColor}`}
                >
                  {tournament.status}
                </span>
              </div>

              <div className="d-flex gap-2 mb-3 align-items-center">
                <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 small fw-bold">
                  {tournament.sport}
                </span>
                <span className="text-muted small">
                  <i className="bi bi-calendar3 me-1"></i>
                  {tournament.startDate}
                </span>
              </div>

            </div>

              {tournament.status === "upcoming" && <div className="mb-4">
                <span
                  className="text-muted text-uppercase fw-bold d-block mb-2"
                  style={{ fontSize: "0.65rem", letterSpacing: "0.05rem" }}
                >
                  Teams ({registeredCount} / {tournament.maxTeams})
                </span>
                <div
                  className="w-100 bg-secondary bg-opacity-10 rounded mb-2"
                  style={{ height: "6px" }}
                >
                  <div
                    className={`rounded h-100 ${isFull ? "bg-danger" : "bg-warning"}`}
                    style={{
                      width: `${Math.min((registeredCount / tournament.maxTeams) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <span className="small text-secondary">
                  {isFull ? (
                    <span className="text-danger fw-semibold">
                      <i className="bi bi-lock-fill me-1"></i>Full
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-people me-1"></i>
                      {tournament.maxTeams - registeredCount} slots available
                    </span>
                  )}
                </span>
              </div>}

            <div className="pt-2 border-top border-secondary border-opacity-10">
              <button
                type="button"
                className={`btn w-100 fw-medium btn-sm d-flex align-items-center justify-content-center ${{ upcoming: "btn-warning", active: "btn-success", completed: "btn-secondary" }[tournament.status] || "btn-secondary"}`}
                onClick={() => onView(tournament._id)}
              >
                <span>View Details</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TournamentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournaments: [],
      searchQuery: "",
      selectedSport: "",
      selectedStatus: "",
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (params = new URLSearchParams()) => {
    const url = `/api/tournaments?${params.toString()}`;
    axios
      .get(url)
      .then((res) => {
        const order = { upcoming: 0, active: 1, completed: 2 };
        const sorted = res.data.sort((a, b) => {
          const statusDiff = (order[a.status] ?? 3) - (order[b.status] ?? 3);
          if (statusDiff !== 0) return statusDiff;
          return a.startDate.localeCompare(b.startDate);
        });
        this.setState({ tournaments: sorted });
      })
      .catch((err) =>
        console.error("Error loading tournaments: " + err.message),
      );
  };

  QhandleSportChange = (e) => {
    const nextSport = e.target.value;
    this.setState({
      selectedSport: nextSport,
      selectedStatus: "",
      searchQuery: "",
    });
    const params = new URLSearchParams();
    if (nextSport) params.append("q", nextSport.toLowerCase());
    this.fetchData(params);
  };

  QhandleStatusChange = (e) => {
    const nextStatus = e.target.value;
    this.setState({
      selectedStatus: nextStatus,
      selectedSport: "",
      searchQuery: "",
    });
    const params = new URLSearchParams();
    if (nextStatus) params.append("q", nextStatus.toLowerCase());
    this.fetchData(params);
  };

  QhandleTextSearchSubmit = (e) => {
    e.preventDefault();
    this.setState({ selectedSport: "", selectedStatus: "" });
    const params = new URLSearchParams();
    if (this.state.searchQuery) params.append("q", this.state.searchQuery);
    this.fetchData(params);
  };

  render() {
    const { loggedInUserId } = this.props;
    const data = this.state.tournaments;
    return (
      <div className="container-fluid p-3 pt-2 mt-2">
        <div className="card shadow border-0 p-4 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center">
              <div
                className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3 d-inline-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-trophy fs-5"></i>
              </div>
              <div>
                <h3 className="fw-bold text-dark m-0">Tournaments</h3>
                <p className="text-muted small m-0">
                  Browse and manage competitions
                </p>
              </div>
            </div>

            {loggedInUserId && (
              <button
                className="btn btn-success btn-sm fw-semibold"
                onClick={() =>
                  this.props.QViewFromChild({ page: "tournamentCreateView" })
                }
              >
                <i className="bi bi-plus-lg me-1"></i>New Tournament
              </button>
            )}
          </div>

          <hr className="text-muted opacity-25 mb-4" />

          <div className="row align-items-center g-3">
            <div className="col-md-3">
              <div className="input-group shadow-sm rounded">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-funnel"></i>
                </span>
                <select
                  className="form-select bg-light border-start-0 ps-1"
                  value={this.state.selectedSport}
                  onChange={this.QhandleSportChange}
                >
                  <option value="">All Sports</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="volleyball">Volleyball</option>
                </select>
              </div>
            </div>

            <div className="col-md-3">
              <div className="input-group shadow-sm rounded">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-activity"></i>
                </span>
                <select
                  className="form-select bg-light border-start-0 ps-1"
                  value={this.state.selectedStatus}
                  onChange={this.QhandleStatusChange}
                >
                  <option value="">All Statuses</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <form onSubmit={this.QhandleTextSearchSubmit}>
                <div className="d-flex align-items-center shadow-sm rounded bg-light border px-2">
                  <i className="bi bi-search text-muted me-2"></i>
                  <input
                    type="search"
                    className="form-control border-0 bg-transparent flex-grow-1 shadow-none"
                    value={this.state.searchQuery}
                    placeholder="Search a tournament, team or player..."
                    onChange={(e) =>
                      this.setState({ searchQuery: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    className="btn btn-success btn-sm px-3 my-1 ms-2"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 g-4">
          {data.length > 0 ? (
            data.map((t) => (
              <TournamentCard
                key={t._id}
                tournament={t}
                onView={(id) =>
                  this.props.QViewFromChild({
                    page: "tournamentDetailView",
                    tournamentId: id,
                  })
                }
              />
            ))
          ) : (
            <div className="col-12 text-center p-5 border rounded bg-light shadow-sm text-muted">
              <span>No tournaments found.</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TournamentView;
