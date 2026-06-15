import { Component } from "react";

class HomeView extends Component {
  render() {
    return (
      <div className="row row-cols-1 row-cols-md-3 g-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Home page</h2>
              <p className="card-text">home page content</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeView;
