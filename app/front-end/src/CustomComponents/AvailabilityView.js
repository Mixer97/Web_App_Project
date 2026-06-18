import axios from "axios";
import { Component } from "react";

class AvailabilityView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availabilitySlots: props.bookedSlots,
      fieldID: props.fieldID || "",
      selectedDate: props.date || "",
    };
  }

  componentDidMount() {
  }

  QSetViewInParent = (obj) => {
    this.props.QViewFromChild(obj);
  };

  render() {
    console.log(this.state);
    return (
      <div className="row row-cols-1 row-cols-md-3 g-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Availability page</h2>
              <p className="card-text">Availability page content</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AvailabilityView;
