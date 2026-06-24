import { Component } from "react";
import axios from "axios";

class FieldCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookedSlots: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchSlotStatus();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date) {
      this.fetchSlotStatus();
    }
  }

  fetchSlotStatus = () => {
    const { field, date } = this.props;
    this.setState({ loading: true });

    const url = `http://localhost:5000/api/fields/${field._id}/slots?date=${date}`;

    axios
      .get(url)
      .then((res) => {
        this.setState({ bookedSlots: res.data, loading: false });
      })
      .catch((err) => {
        console.error(`Error loading slots for ${field.name}:`, err.message);
        this.setState({ loading: false });
      });
  };

  render() {
    const { field, date, onSelect } = this.props;
    const { bookedSlots, loading } = this.state;

    return (
      <div className="col">
        <div className="card h-100 shadow-sm border-0 bg-light p-2">
          <div className="card-body d-flex flex-column justify-content-between p-3">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h4 className="fw-bold text-dark m-0">{field.name}</h4>
                <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 small fw-bold">
                  {field.sport}
                </span>
              </div>
              <p className="text-muted small mb-3">
                <i className="bi bi-geo-alt me-1"></i> {field.address}
              </p>

              <div className="mb-4">
                <span
                  className="text-muted text-uppercase fw-bold d-block mb-2"
                  style={{ fontSize: "0.65rem", letterSpacing: "0.05rem" }}
                >
                  Schedule Matrix for {date}
                </span>

                <div className="d-flex flex-wrap gap-2">
                  {loading ? (
                    <div className="text-muted placeholder-glow small py-1">
                      <span className="placeholder col-6"></span>
                    </div>
                  ) : field.slots && field.slots.length > 0 ? (
                    field.slots.map((s, index) => {
                      const isBooked = !bookedSlots.includes(s);

                      return (
                        <span
                          className={`badge rounded px-2 py-2 border transition-all text-center ${
                            isBooked
                              ? "bg-secondary bg-opacity-10 text-muted border-secondary border-opacity-25 opacity-50"
                              : "bg-success bg-opacity-10 text-success border-success border-opacity-50 fw-bold"
                          }`}
                          key={index}
                          style={{ minWidth: "70px", fontSize: "0.75rem" }}
                          title={
                            isBooked ? "Booked (Unavailable)" : "Available"
                          }
                        >
                          <i
                            className={`bi ${isBooked ? "bi-lock-fill" : "bi-unlock-fill"} me-1`}
                          ></i>
                          {s}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-muted small py-1">
                      <i className="bi bi-exclamation-circle me-1"></i> No
                      operating hours defined.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-top border-secondary border-opacity-10 mt-auto">
              <button
                type="button"
                className="btn btn-primary w-100 fw-medium d-flex align-items-center justify-content-center"
                onClick={() => onSelect(bookedSlots)}
              >
                <span>Book a slot</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class FieldView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      searchQuery: "",
      selectedSport: "",
      selectedDate: new Date().toISOString().split("T")[0],
    };
  }

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

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  QHandlerFieldBookingToParent = (obj) => {
    this.props.QHandlerFieldBookingFromChild(obj);
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
    let data = this.state.fields;
    return (
      <div className="container-fluid p-3 pt-2 mt-2">
        <div className="card shadow border-0 p-4 mb-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3 d-inline-flex align-items-center justify-content-center"
              style={{ width: "42px", height: "42px" }}
            >
              <i className="bi bi-sliders fs-5"></i>
            </div>
            <div>
              <h3 className="fw-bold text-dark m-0">
                Fields
              </h3>
              <p className="text-muted small m-0">
                Filter active field availability matrices in real-time
              </p>
            </div>
          </div>

          <hr className="text-muted opacity-25 mb-4" />

          <div className="row align-items-center g-3">
            <div className="col-md-3">
              <div className="input-group shadow-sm rounded">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-calendar-event"></i>
                </span>
                <input
                  type="date"
                  className="form-control bg-light border-start-0 ps-1"
                  min={new Date().toISOString().split("T")[0]}
                  value={this.state.selectedDate}
                  onChange={(e) =>
                    this.setState({ selectedDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group shadow-sm rounded">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-funnel"></i>
                </span>
                <select
                  className="form-select bg-light border-start-0 ps-1"
                  value={this.state.selectedSport}
                  onChange={(e) => this.QhandleSportChange(e)}
                >
                  <option value="">All Sports (No Filter)</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Volleyball">Volleyball</option>
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
                    placeholder="Search by facility name, court designation..."
                    onChange={(e) =>
                      this.setState({ searchQuery: e.target.value })
                    }
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
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 g-4">
          {data.length > 0 ? (
            data.map((d) => (
              <FieldCard
                key={d._id}
                field={d}
                date={this.state.selectedDate}
                onSelect={(slotsFromCard) => {
                  this.QHandlerFieldBookingToParent({
                    page: "availabilityView",
                    id: d._id,
                    date: this.state.selectedDate,
                    bookedSlots: slotsFromCard,
                  });
                }}
              />
            ))
          ) : (
            <div className="col-12 text-center p-5 border rounded bg-light shadow-sm text-muted">
              <div
                className="spinner-border text-primary spinner-border-sm me-2"
                role="status"
              ></div>
              <span>
                No sports complexes matched your active criteria rules...
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default FieldView;
