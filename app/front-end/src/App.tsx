import { Component } from "react";
import axios from "axios";
import HomeView from "./CustomComponents/HomeView";
import LoginView from "./CustomComponents/LoginView";
import NavBar from "./CustomComponents/NavBar";
import UserView from "./CustomComponents/UserView";
import FieldView from "./CustomComponents/FieldView";
import TournamentView from "./CustomComponents/TournamentView";
import AvailabilityView from "./CustomComponents/AvailabilityView";
import RegisterView from "./CustomComponents/RegisterView";
import WhoAmIView from "./CustomComponents/WhoAmIView";

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentPage: "",
      fieldID: "",
      date: "",
      bookedSlots: [],
      loggedInUser: null,
      loggedInUserId: null,
      tournamentId: null,
    };
  }

  componentDidMount() {
    this.checkAuthStatus();
  }

  checkAuthStatus = () => {
    axios
      .get("http://localhost:5000/api/whoami", { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.username) {
          this.setState({
            loggedInUser: res.data.username,
            loggedInUserId: res.data._id,
          });
        }
      })
      .catch(() => {
        this.setState({ loggedInUser: null, loggedInUserId: null });
      });
  };

  QSetView = (obj) => {
    this.setState({
      currentPage: obj.page || this.state.currentPage,
      fieldID: obj.id || this.state.fieldID,
      date: obj.date || this.state.date,
      bookedSlots: obj.bookedSlots || this.state.bookedSlots,
      loggedInUser: obj.loggedInUser || this.state.loggedInUser,
      loggedInUserId: obj.loggedInUserId || this.state.loggedInUserId,
    });
  };

  QGetView = (state) => {
    let page = state.currentPage;
    switch (page) {
      case "loginView":
        return (
          <LoginView
            QLoginDataFromChild={this.QHandlerUserLogin}
            QViewFromChild={this.QSetView}
          />
        );
      case "userView":
        return <UserView QViewFromChild={this.QSetView} />;
      case "fieldView":
        return (
          <FieldView
            QViewFromChild={this.QSetView}
            QHandlerFieldBookingFromChild={this.QSetView}
          />
        );
      case "tournamentView":
        return (
          <TournamentView
            QViewFromChild={this.QSetView}
            QHandlerTournamentBookingFromChild={this.QSetView}
          />
        );
      case "registerView":
        return (
          <RegisterView
            QRegistrationDataFromChild={this.QHandlerUserRegister}
            QViewFromChild={this.QSetView}
          />
        );
      case "tournamentRegisterView":
        return (
          <div
            className="card shadow border-0 p-4 mx-auto"
            style={{ maxWidth: "600px" }}
          >
            <h4 className="fw-bold mb-2">Register Your Team</h4>
            <p className="text-muted small">
              Championship Tournament Reference ID:{" "}
              <code>{this.state.tournamentID}</code>
            </p>
            <hr className="opacity-25" />
            {/* You can swap this block out with a dedicated <TournamentRegisterFormView /> component later */}
            <div className="d-flex gap-2 justify-content-end mt-4">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => this.QSetView({ page: "tournamentView" })}
              >
                Cancel
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={() => alert("Registration saved!")}
              >
                Submit Entry
              </button>
            </div>
          </div>
        );
      case "whoAmIView":
        return <WhoAmIView QViewFromChild={this.QSetView} />;
      case "userView":
        return <UserView QViewFromChild={this.QSetView} />;
      case "availabilityView":
        return (
          <AvailabilityView
            QViewFromChild={this.QSetView}
            fieldID={this.state.fieldID}
            date={this.state.date}
            bookedSlots={this.state.bookedSlots}
          />
        );
      default:
        return (
          <HomeView
            QViewFromChild={this.QSetView}
            currentUser={this.state.loggedInUser}
          />
        );
    }
  };

  QHandlerUserLogin = (obj) => {
    this.fetchIdLoggedInUser();
    this.QSetView({ page: "homeView", loggedInUser: obj.username });
  };

  QHandlerUserRegister = (obj) => {
    this.QSetView({ page: "homeView", loggedInUser: obj.username });
  };

  QHandlerFieldBookingFromChild = (obj) => {
    this.QSetView({
      page: "availabilityView",
      fieldID: obj.id,
      date: obj.date,
      bookedSlots: obj.bookedSlots,
    });
  };

  fetchIdLoggedInUser = () => {
    const url = `http://localhost:5000/api/whoami`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => this.setState({ loggedInUserId: res.data._id }))
      .catch((err) => console.log("Error: " + err.message));
  };

  render() {
    console.log(this.state);
    return (
      <div
        id="APP"
        className="container-fluid p-0"
        style={{ minWidth: "800px" }}
      >
        <div className="row g-0 flex-nowrap">
          <NavBar
            QViewFromChild={this.QSetView}
            currentUser={this.state.loggedInUser}
          />
          <div id="viewer" className="col bg-light p-4">
            <div>{this.QGetView(this.state)}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
