import React, { Component } from "react";
import axios from "axios";

class TournamentRegisterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "",
      playerName: "",
      playerSurname: "",
      playerJerseyNumber: "",
      playersList: [],
      errorMessage: "",
      successMessage: "",
    };
  }

  handleAddPlayer = (e) => {
    e.preventDefault();
    const { playerName, playerSurname, playerJerseyNumber, playersList } =
      this.state;

    if (!playerName.trim() || !playerSurname.trim()) {
      this.setState({ errorMessage: "Player Name and Surname are required." });
      return;
    }

    const newPlayer = {
      name: playerName.trim(),
      surname: playerSurname.trim(),
      jerseyNumber: playerJerseyNumber.trim(),
    };

    this.setState({
      playersList: [...playersList, newPlayer],
      playerName: "",
      playerSurname: "",
      playerJerseyNumber: "",
      errorMessage: "",
    });
  };

  handleRemovePlayer = (indexToRemove) => {
    this.setState({
      playersList: this.state.playersList.filter(
        (_, idx) => idx !== indexToRemove,
      ),
    });
  };

  handleSubmitTeam = async (e) => {
    e.preventDefault();
    const { teamName, playersList } = this.state;
    const tournamentId = this.props.id;

    if (!teamName.trim()) {
      this.setState({ errorMessage: "Team Name cannot be empty." });
      return;
    }

    if (playersList.length === 0) {
      this.setState({
        errorMessage: "You must add at least one player to the team roster.",
      });
      return;
    }

    try {
      const url = `/api/tournaments/${tournamentId}/teams`;
      const response = await axios.post(
        url,
        { name: teamName.trim(), players: playersList },
        { withCredentials: true },
      );

      this.setState({
        successMessage: response.data.msg || "Team registered successfully!",
        errorMessage: "",
        teamName: "",
        playersList: [],
      });

      setTimeout(() => {
        if (this.props.onSuccess) {
          this.props.onSuccess();
        } else {
          this.props.onBack();
        }
      }, 1500);
    } catch (error) {
      const fallbackMsg =
        error.response?.data?.msg || "Failed to register team.";
      this.setState({ errorMessage: fallbackMsg, successMessage: "" });
    }
  };

  render() {
    return (
      <div className="card bg-white border border-success border-opacity-20 p-4 rounded shadow-sm my-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold text-success m-0">
              Add Team to: {this.props.tournamentName}
            </h4>
            <p className="text-muted small m-0">
              Build your team roster and submit into the bracket
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={this.props.onBack}
          >
            Cancel
          </button>
        </div>

        <hr className="text-muted opacity-25 my-2" />

        {this.state.errorMessage && (
          <div className="alert alert-danger py-2 small">
            {this.state.errorMessage}
          </div>
        )}
        {this.state.successMessage && (
          <div className="alert alert-success py-2 small">
            {this.state.successMessage}
          </div>
        )}

        <form onSubmit={this.handleSubmitTeam}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-dark">
              Team Name
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Enter team name..."
              value={this.state.teamName}
              onChange={(e) => this.setState({ teamName: e.target.value })}
            />
          </div>

          <div className="card bg-light border-0 p-3 mb-3">
            <h6 className="fw-bold text-secondary mb-2 small text-uppercase">
              Add Roster Players
            </h6>

            <div className="row g-2 align-items-end">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="First Name"
                  value={this.state.playerName}
                  onChange={(e) =>
                    this.setState({ playerName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Surname"
                  value={this.state.playerSurname}
                  onChange={(e) =>
                    this.setState({ playerSurname: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="#"
                  value={this.state.playerJerseyNumber}
                  onChange={(e) =>
                    this.setState({ playerJerseyNumber: e.target.value })
                  }
                />
              </div>
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-success btn-sm w-100"
                  onClick={this.handleAddPlayer}
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-3">
              <span className="small text-muted d-block mb-1">
                Roster ({this.state.playersList.length} Players):
              </span>
              {this.state.playersList.length > 0 ? (
                <ul className="list-group list-group-flush border rounded bg-white">
                  {this.state.playersList.map((p, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center py-1 small"
                    >
                      <span>
                        {index + 1}.{" "}
                        {p.jerseyNumber && (
                          <strong className="text-success me-1">#{p.jerseyNumber}</strong>
                        )}{" "}
                        {p.name} {p.surname}
                      </span>
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 m-0 text-decoration-none small shadow-none"
                        onClick={() => this.handleRemovePlayer(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted small fst-italic">
                  No players drafted yet.
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success btn-sm w-100 fw-semibold"
          >
            Submit Team Entry
          </button>
        </form>
      </div>
    );
  }
}

export default TournamentRegisterView;
