import { Component } from "react";
import axios from "axios";
import TournamentRegisterView from "./TournamentRegisterView";

class TournamentDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: null,
      teams: [],
      matches: [],
      standings: [],
      loading: true,
      error: "",
      success: "",
      showAddTeam: false,
      showEditForm: false,
      editName: "",
      editSport: "",
      editMaxTeams: "",
      editStartDate: "",
      resultMatchId: null,
      resultHome: "",
      resultAway: "",
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const { tournamentId } = this.props;
    try {
      const [detailRes, standingsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/tournaments/${tournamentId}`),
        axios.get(`http://localhost:5000/api/tournaments/${tournamentId}/standings`),
      ]);
      const t = detailRes.data.tournament;
      this.setState({
        tournament: t,
        teams: detailRes.data.teams,
        matches: detailRes.data.matches,
        standings: standingsRes.data,
        loading: false,
        editName: t.name,
        editSport: t.sport,
        editMaxTeams: t.maxTeams,
        editStartDate: t.startDate,
      });
    } catch {
      this.setState({ loading: false, error: "Failed to load tournament." });
    }
  };

  isCreator = () => {
    const { loggedInUserId } = this.props;
    const { tournament } = this.state;
    if (!tournament || !loggedInUserId) return false;
    return tournament.creatorId.toString() === loggedInUserId.toString();
  };

  handleDelete = async () => {
    if (!window.confirm("Delete this tournament and all its data?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/tournaments/${this.props.tournamentId}`,
        { withCredentials: true },
      );
      this.props.QViewFromChild({ page: "tournamentView" });
    } catch (err) {
      this.setState({ error: err.response?.data?.msg || "Failed to delete." });
    }
  };

  handleGenerateSchedule = async () => {
    this.setState({ error: "", success: "" });
    try {
      await axios.post(
        `http://localhost:5000/api/tournaments/${this.props.tournamentId}/matches/generate`,
        {},
        { withCredentials: true },
      );
      this.setState({ success: "Schedule generated!" });
      this.fetchData();
    } catch (err) {
      this.setState({ error: err.response?.data?.msg || "Failed to generate schedule." });
    }
  };

  handleEditSubmit = async (e) => {
    e.preventDefault();
    const { editName, editSport, editMaxTeams, editStartDate } = this.state;
    try {
      await axios.put(
        `http://localhost:5000/api/tournaments/${this.props.tournamentId}`,
        { name: editName, sport: editSport, maxTeams: Number(editMaxTeams), startDate: editStartDate },
        { withCredentials: true },
      );
      this.setState({ showEditForm: false, success: "Tournament updated." });
      this.fetchData();
    } catch (err) {
      this.setState({ error: err.response?.data?.msg || "Failed to update." });
    }
  };

  handleResultSubmit = async (matchId) => {
    const { resultHome, resultAway } = this.state;
    const home = parseInt(resultHome, 10);
    const away = parseInt(resultAway, 10);
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
      this.setState({ error: "Scores must be non-negative integers." });
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/matches/${matchId}/result`,
        { homeScore: home, awayScore: away },
        { withCredentials: true },
      );
      this.setState({ resultMatchId: null, resultHome: "", resultAway: "", success: "Result saved." });
      this.fetchData();
    } catch (err) {
      this.setState({ error: err.response?.data?.msg || "Failed to save result." });
    }
  };

  getTeamName = (teamId) => {
    const team = this.state.teams.find((t) => t._id.toString() === teamId?.toString());
    return team ? team.name : "Unknown";
  };

  canEnterResult = (match) => {
    if (!this.isCreator()) return false;
    if (match.status === "played") return false;
    const today = new Date().toISOString().split("T")[0];
    return match.startDate <= today;
  };

  render() {
    const {
      tournament, teams, matches, standings, loading,
      error, success, showAddTeam, showEditForm,
      editName, editSport, editMaxTeams, editStartDate,
      resultMatchId, resultHome, resultAway,
    } = this.state;

    if (loading) {
      return (
        <div className="text-center p-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      );
    }

    if (!tournament) {
      return <div className="alert alert-danger m-4">Tournament not found.</div>;
    }

    const creator = this.isCreator();
    const statusColor = {
      upcoming: "bg-warning text-dark",
      active: "bg-success text-white",
      completed: "bg-secondary text-white",
    }[tournament.status] || "bg-secondary text-white";

    return (
      <div className="container-fluid p-3 pt-2 mt-2">
        {/* Back button */}
        <button
          className="btn btn-sm btn-outline-secondary mb-3"
          onClick={() => this.props.QViewFromChild({ page: "tournamentView" })}
        >
          <i className="bi bi-arrow-left me-1"></i> Back to Tournaments
        </button>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {success && <div className="alert alert-success py-2 small">{success}</div>}

        {/* Header card */}
        <div className="card shadow border-0 p-4 mb-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h3 className="fw-bold text-dark m-0">{tournament.name}</h3>
              <div className="d-flex gap-2 mt-2 align-items-center">
                <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 small fw-bold">
                  {tournament.sport}
                </span>
                <span className={`badge px-2 py-1 small fw-bold ${statusColor}`}>
                  {tournament.status}
                </span>
                <span className="text-muted small">
                  <i className="bi bi-calendar3 me-1"></i>{tournament.startDate}
                </span>
                <span className="text-muted small">
                  <i className="bi bi-people me-1"></i>
                  {teams.length} / {tournament.maxTeams} teams
                </span>
              </div>
            </div>

            {creator && (
              <div className="d-flex gap-2 flex-wrap">
                {tournament.status === "upcoming" && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => this.setState({ showEditForm: !showEditForm, error: "", success: "" })}
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                    {teams.length >= 2 && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={this.handleGenerateSchedule}
                      >
                        <i className="bi bi-lightning me-1"></i>Generate Schedule
                      </button>
                    )}
                  </>
                )}
                <button className="btn btn-sm btn-outline-danger" onClick={this.handleDelete}>
                  <i className="bi bi-trash me-1"></i>Delete
                </button>
              </div>
            )}
          </div>

          {/* Edit form */}
          {showEditForm && (
            <form onSubmit={this.handleEditSubmit} className="mt-4 pt-3 border-top">
              <h6 className="fw-bold text-secondary small text-uppercase mb-3">Edit Tournament</h6>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={editName}
                    onChange={(e) => this.setState({ editName: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">Sport</label>
                  <select
                    className="form-select form-select-sm"
                    value={editSport}
                    onChange={(e) => this.setState({ editSport: e.target.value })}
                  >
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="volleyball">Volleyball</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">Max Teams</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="2"
                    value={editMaxTeams}
                    onChange={(e) => this.setState({ editMaxTeams: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Start Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={editStartDate}
                    onChange={(e) => this.setState({ editStartDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => this.setState({ showEditForm: false })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">Save Changes</button>
              </div>
            </form>
          )}
        </div>

        <div className="row g-4">
          {/* Teams section */}
          <div className="col-md-5">
            <div className="card shadow border-0 p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0">Teams</h5>
                {creator && tournament.status === "upcoming" && teams.length < tournament.maxTeams && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => this.setState({ showAddTeam: !showAddTeam })}
                  >
                    <i className="bi bi-plus me-1"></i>Add Team
                  </button>
                )}
              </div>

              {showAddTeam && (
                <div className="mb-3">
                  <TournamentRegisterView
                    id={tournament._id}
                    tournamentName={tournament.name}
                    onBack={() => this.setState({ showAddTeam: false })}
                    onSuccess={() => {
                      this.setState({ showAddTeam: false });
                      this.fetchData();
                    }}
                  />
                </div>
              )}

              {teams.length === 0 ? (
                <p className="text-muted small fst-italic">No teams registered yet.</p>
              ) : (
                teams.map((team) => (
                  <div key={team._id} className="mb-3">
                    <div className="fw-semibold text-dark small mb-1">
                      <i className="bi bi-shield-fill-check text-success me-1"></i>
                      {team.name}
                    </div>
                    {team.players && team.players.length > 0 ? (
                      <ul className="list-unstyled ms-3 mb-0">
                        {team.players.map((p, i) => (
                          <li key={i} className="text-muted small">
                            {p.jerseyNumber ? (
                              <span className="text-success fw-bold me-1">#{p.jerseyNumber}</span>
                            ) : null}
                            {p.name} {p.surname}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted small ms-3 fst-italic mb-0">No players.</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Matches + Standings */}
          <div className="col-md-7">
            {/* Matches */}
            <div className="card shadow border-0 p-4 mb-4">
              <h5 className="fw-bold mb-3">Matches</h5>
              {matches.length === 0 ? (
                <p className="text-muted small fst-italic">
                  {tournament.status === "upcoming"
                    ? "Schedule not generated yet."
                    : "No matches found."}
                </p>
              ) : (
                matches.map((match) => (
                  <div key={match._id} className="mb-3 pb-3 border-bottom border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small fw-semibold">
                        {this.getTeamName(match.homeTeamId)}{" "}
                        <span className="text-muted fw-normal">vs</span>{" "}
                        {this.getTeamName(match.awayTeamId)}
                      </span>
                      <span
                        className={`badge small ${match.status === "played" ? "bg-success" : "bg-warning text-dark"}`}
                      >
                        {match.status === "played" ? match.result : "upcoming"}
                      </span>
                    </div>
                    <div className="text-muted small mt-1">
                      <i className="bi bi-calendar3 me-1"></i>{match.startDate}
                    </div>

                    {this.canEnterResult(match) && (
                      resultMatchId === match._id ? (
                        <div className="d-flex gap-2 align-items-center mt-2">
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: "60px" }}
                            min="0"
                            placeholder="H"
                            value={resultHome}
                            onChange={(e) => this.setState({ resultHome: e.target.value })}
                          />
                          <span className="text-muted">-</span>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: "60px" }}
                            min="0"
                            placeholder="A"
                            value={resultAway}
                            onChange={(e) => this.setState({ resultAway: e.target.value })}
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => this.handleResultSubmit(match._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => this.setState({ resultMatchId: null })}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary mt-2"
                          onClick={() => this.setState({ resultMatchId: match._id, resultHome: "", resultAway: "", error: "" })}
                        >
                          Enter Result
                        </button>
                      )
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Standings */}
            {standings.length > 0 && (
              <div className="card shadow border-0 p-4">
                <h5 className="fw-bold mb-3">Standings</h5>
                <div className="table-responsive">
                  <table className="table table-sm table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="small">#</th>
                        <th className="small">Team</th>
                        <th className="small text-center">P</th>
                        <th className="small text-center">W</th>
                        <th className="small text-center">D</th>
                        <th className="small text-center">L</th>
                        <th className="small text-center">GF</th>
                        <th className="small text-center">GA</th>
                        <th className="small text-center">GD</th>
                        <th className="small text-center fw-bold">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((entry, i) => (
                        <tr key={entry.teamId}>
                          <td className="small text-muted">{i + 1}</td>
                          <td className="small fw-semibold">{entry.teamName}</td>
                          <td className="small text-center">{entry.played}</td>
                          <td className="small text-center">{entry.won}</td>
                          <td className="small text-center">{entry.drawn}</td>
                          <td className="small text-center">{entry.lost}</td>
                          <td className="small text-center">{entry.scored}</td>
                          <td className="small text-center">{entry.conceded}</td>
                          <td className="small text-center">{entry.diff}</td>
                          <td className="small text-center fw-bold text-success">{entry.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default TournamentDetailView;
