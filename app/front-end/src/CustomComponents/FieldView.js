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
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex flex-column">
            <h2 className="card-title fs-4 fw-bold">{field.name}</h2>
            <p className="card-text text-muted small">{field.address}</p>

            <div className="mb-3">
              <label className="form-label text-muted small fw-bold d-block">
                Slots for {date}:
              </label>
              <div className="d-flex flex-wrap gap-2">
                {loading ? (
                  <span className="text-muted small">Checking slots...</span>
                ) : field.slots && field.slots.length > 0 ? (
                  field.slots.map((s, index) => {
                    const isBooked = !bookedSlots.includes(s);

                    return (
                      <span
                        className={`badge px-2 py-1.5 border ${
                          isBooked
                            ? "bg-light text-muted border-secondary-subtle"
                            : "bg-light text-success border-success"
                        }`}
                        key={index}
                        style={{
                          minWidth: "65px",
                          textAlign: "center",
                          opacity: isBooked ? 0.5 : 1,
                        }}
                        title={isBooked ? "Booked (Unavailable)" : "Available"}
                      >
                        {s}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-muted small">
                    No operating hours defined.
                  </span>
                )}
              </div>
            </div>

            <div className="mt-auto d-flex align-items-center justify-content-between">
              <span className="badge bg-secondary px-3 py-2">
                {field.sport}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => onSelect(bookedSlots)}
              >
                Book a slot
                <i className="bi bi-arrow-right ms-1"></i>
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
      <div className="row g-2">
        <div className="row align-items-center g-3">
          <div className="col-3">
            <div className="input-group">
              <span className="input-group-text bg-light border text-muted">
                <i className="bi bi-calendar-event"></i>
              </span>
              <input
                type="date"
                className="form-control"
                min={new Date().toISOString().split("T")[0]}
                value={this.state.selectedDate}
                onChange={(e) =>
                  this.setState({ selectedDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="col-3">
            <select
              className="form-select"
              value={this.state.selectedSport}
              onChange={(e) => this.QhandleSportChange(e)}
            >
              <option value="">All Sports (No Filter)</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Volleyball">Volleyball</option>
            </select>
          </div>

          <div className="col-6">
            <form onSubmit={this.QhandleTextSearchSubmit}>
              <div className="d-flex align-items-center">
                <input
                  type="search"
                  className="form-control flex-grow-1"
                  value={this.state.searchQuery}
                  placeholder="Find..."
                  onChange={(e) =>
                    this.setState({ searchQuery: e.target.value })
                  }
                />
                <button type="submit" className="btn btn-primary ms-2">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-2 g-3 mt-2">
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
            <div className="col-12 text-center p-5 text-muted">
              Loading fields...
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default FieldView;
