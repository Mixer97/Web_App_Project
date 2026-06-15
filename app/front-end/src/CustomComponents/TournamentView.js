import { Component } from "react";

class TournamentView extends Component {
  render() {
    return (
      <div className="row row-cols-1 row-cols-md-3 g-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Tournament page</h2>
              <p className="card-text">Tournament page content</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TournamentView;
