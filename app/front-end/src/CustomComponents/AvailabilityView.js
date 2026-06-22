import axios from "axios";
import { Component } from "react";

class AvailabilityView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availabilitySlots: props.bookedSlots || [],
      fieldID: props.id || props.fieldID || "",
      selectedDate: props.date || "",
      selectedSlot: "",
      error: "",
      success: false
    };
  }

  createFieldBooking = () => {
    if (!this.state.selectedSlot) {
      this.setState({ error: "Please pick an available time slot first." });
      return;
    }

    this.setState({ error: "", success: false });
    const url = `http://localhost:5000/api/fields/${this.state.fieldID}/bookings`;

    axios
      .post(
        url,
        {
          date: this.state.selectedDate,
          slot: this.state.selectedSlot,
        },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        this.setState({ success: true, selectedSlot: "" });
        console.log("Booking successful!");
        setTimeout(() => this.QSetViewInParent({ page: "fieldView" }), 1500);
      })
      .catch((err) => {
        let message = err.response?.data?.msg || err.message;
        this.setState({ error: "Booking Failed: " + message });
      });
  };

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  render() {
    const { availabilitySlots, selectedDate, selectedSlot, error, success } = this.state;

    return (
      <div className="container-fluid p-3 pt-5 mt-2">
        <div className="card shadow border-0 p-4 mx-auto" style={{ maxWidth: "600px" }}>
          
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3 d-inline-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
              <i className="bi bi-alarm fs-5"></i>
            </div>
            <div>
              <h3 className="fw-bold text-dark m-0">Confirm Selection</h3>
              <p className="text-muted small m-0">Target window reservation scheduled for {selectedDate}</p>
            </div>
          </div>

          <hr className="text-muted opacity-25 mb-4" />

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              <div>Slot successfully locked! Redirecting back to fields...</div>
            </div>
          )}

          <div className="mb-4">
            <span className="text-muted text-uppercase fw-bold d-block mb-3" style={{ fontSize: "0.65rem", letterSpacing: "0.05rem" }}>
              Click to select an active session window:
            </span>

            <div className="row g-2 row-cols-3 row-cols-sm-4">
              {availabilitySlots.length > 0 ? (
                availabilitySlots.map((slot, index) => {
                  const isCurrentSelection = selectedSlot === slot;

                  return (
                    <div className="col" key={index}>
                      <button
                        type="button"
                        onClick={() => this.setState({ selectedSlot: slot, error: "" })}
                        className={`btn w-100 py-3 rounded border transition-all text-center fw-semibold ${
                          isCurrentSelection
                            ? "btn-primary shadow-sm scale-up"
                            : "btn-outline-success bg-success bg-opacity-10 border-success border-opacity-25"
                        }`}
                        style={{ fontSize: "0.85rem" }}
                      >
                        <i className={`bi ${isCurrentSelection ? "bi-check2-circle" : "bi-clock"} d-block mb-1 fs-5`}></i>
                        {slot}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center p-4 text-muted w-100 bg-light rounded border">
                  <i className="bi bi-calendar-x d-block fs-3 mb-2 text-danger opacity-50"></i>
                  <span>No unbooked periods remain open for this specific date range.</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-top border-secondary border-opacity-10 d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={() => this.QSetViewInParent({ page: "fieldView" })}
            >
              <i className="bi bi-arrow-left me-1"></i> Go Back
            </button>
            
            <button
              type="button"
              disabled={!selectedSlot || success}
              onClick={this.createFieldBooking}
              className="btn btn-primary flex-grow-1 fw-bold d-flex align-items-center justify-content-center"
            >
              <span>{selectedSlot ? `Confirm Booking for ${selectedSlot}` : "Choose a slot to lock"}</span>
              <i className="bi bi-shield-check ms-2"></i>
            </button>
          </div>

        </div>
      </div>
    );
  }
}

export default AvailabilityView;