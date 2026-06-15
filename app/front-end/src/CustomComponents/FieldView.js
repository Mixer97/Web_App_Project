import { Component } from "react";
import axios from "axios";

class FieldView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      searchQuery: "",
      selectedSport: "",
    };
  }
  /*
  componentDidMount() {
    axios
      .get("http://localhost:5000/api/fields")
      .then((res) => {
        this.setState({ fields: res.data });
      })
      .catch((err) => {
        if (err) {
          console.log("Error: " + err.message);
        }
      });
  }
*/

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (params = new URLSearchParams()) => {
    const url = `http://localhost:5000/api/fields?${params.toString()}`;
    axios
      .get(url)
      .then((res) => this.setState({ fields: res.data }))
      .catch((err) => console.log("Error: " + err.message));
  };

QhandleSportChange = (e) => {
  const nextSport = e.target.value;
  this.setState({ selectedSport: nextSport, searchQuery: "" });
  const params = new URLSearchParams();
  if (nextSport) params.append("q", nextSport); 
  this.fetchData(params);
};

QhandleTextSearchSubmit = (e) => {
  e.preventDefault();
  this.setState({ selectedSport: "" });
  const params = new URLSearchParams();
  if (this.state.searchQuery) params.append("q", this.state.searchQuery); 
  this.fetchData(params);
};

  render() {
    console.log(this.state);
    let data = this.state.fields;
    return (
      <div className="row g-2">
        <div className="row align-items-center g-2">
          <div className="col-6">
            <select
              className="form-select"
              value={this.state.selectedSport}
              onChange={(e) => this.QhandleSportChange(e)}
              aria-label="Default select example"
            >
              <option value="">All Sports (No Filter)</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Volleyball">Volleyball</option>
            </select>
          </div>
          <div className="col">
            <form onSubmit={this.QhandleTextSearchSubmit}>
              <div className="mb">
                <div className="d-flex align-items-center">
                  <input
                    type="search"
                    className="form-control flex-grow-1"
                    value={this.state.searchQuery} 
                    id="sidebarSearch"
                    placeholder="Find..."
                    onChange={(e) =>
                      this.setState({ searchQuery: e.target.value })
                    }
                  />
                  <button type="submit" className="btn btn-primary ms-2">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {data.length > 0
            ? data.map((d) => {
                return (
                  <div className="col" key={d._id}>
                    <div className="card">
                      <div className="card-body">
                        <h2 className="card-title">{d.name}</h2>
                        <p className="card-text">{d.address}</p>
                        <p className="card-text">{d.slots}</p>
                        <p className="card-text">{d.sport}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            : "Loading..."}
        </div>
      </div>
    );
  }
}

export default FieldView;
