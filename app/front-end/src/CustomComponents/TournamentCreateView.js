import { Component } from "react";
import axios from "axios";

class TournamentCreateView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      sport: "football",
      maxTeams: "",
      startDate: "",
      error: "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, sport, maxTeams, startDate } = this.state;

    if (!name.trim() || !startDate) {
      this.setState({ error: "All fields are required." });
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/tournaments",
        { name: name.trim(), sport, maxTeams: Number(maxTeams), startDate },
        { withCredentials: true },
      );
      this.props.QViewFromChild({ page: "tournamentView" });
    } catch (err) {
      this.setState({ error: err.response?.data?.msg || "Failed to create tournament." });
    }
  };

  render() {
    const { name, sport, maxTeams, startDate, error } = this.state;
    return (
      <div className="container-fluid p-3 pt-2 mt-2">
        <div className="card shadow border-0 p-4" style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div className="d-flex align-items-center mb-3">
            <div
              className="bg-success bg-opacity-10 text-success rounded-circle p-2 me-3 d-inline-flex align-items-center justify-content-center"
              style={{ width: "42px", height: "42px" }}
            >
              <i className="bi bi-trophy fs-5"></i>
            </div>
            <div>
              <h4 className="fw-bold text-dark m-0">Create Tournament</h4>
              <p className="text-muted small m-0">Set up a new competition</p>
            </div>
          </div>

          <hr className="text-muted opacity-25 mb-3" />

          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}

          <form onSubmit={this.handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Tournament Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Summer Cup 2025"
                value={name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Sport</label>
              <select
                className="form-select form-select-sm"
                value={sport}
                onChange={(e) => this.setState({ sport: e.target.value })}
              >
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="volleyball">Volleyball</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Max Teams</label>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="e.g. 8"
                min="2"
                value={maxTeams}
                onChange={(e) => this.setState({ maxTeams: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">Start Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => this.setState({ startDate: e.target.value })}
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm flex-grow-1"
                onClick={() => this.props.QViewFromChild({ page: "tournamentView" })}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success btn-sm flex-grow-1 fw-semibold">
                Create Tournament
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default TournamentCreateView;
