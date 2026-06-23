import { Component } from "react";
import axios from "axios";
import HomeView from "./CustomComponents/HomeView";
import LoginView from "./CustomComponents/LoginView";
import NavBar from "./CustomComponents/NavBar";
import UserView from "./CustomComponents/UserView";
import FieldView from "./CustomComponents/FieldView";
import TournamentView from "./CustomComponents/TournamentView";
import TournamentCreateView from "./CustomComponents/TournamentCreateView";
import TournamentDetailView from "./CustomComponents/TournamentDetailView";
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
      currentPage: obj.page !== undefined ? obj.page : this.state.currentPage,
      fieldID: obj.id !== undefined ? obj.id : this.state.fieldID,
      date: obj.date !== undefined ? obj.date : this.state.date,
      bookedSlots: obj.bookedSlots !== undefined ? obj.bookedSlots : this.state.bookedSlots,
      loggedInUser: obj.loggedInUser !== undefined ? obj.loggedInUser : this.state.loggedInUser,
      loggedInUserId: obj.loggedInUserId !== undefined ? obj.loggedInUserId : this.state.loggedInUserId,
      tournamentId: obj.tournamentId !== undefined ? obj.tournamentId : this.state.tournamentId,
    });
  };

  QGetView = (state) => {
    switch (state.currentPage) {
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
            loggedInUserId={this.state.loggedInUserId}
          />
        );
      case "tournamentCreateView":
        return <TournamentCreateView QViewFromChild={this.QSetView} />;
      case "tournamentDetailView":
        return (
          <TournamentDetailView
            QViewFromChild={this.QSetView}
            tournamentId={this.state.tournamentId}
            loggedInUserId={this.state.loggedInUserId}
          />
        );
      case "registerView":
        return (
          <RegisterView
            QRegistrationDataFromChild={this.QHandlerUserRegister}
            QViewFromChild={this.QSetView}
          />
        );
      case "whoAmIView":
        return <WhoAmIView QViewFromChild={this.QSetView} />;
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
            loggedInUserId={this.state.loggedInUserId}
            currentPage={this.state.currentPage}
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

  fetchIdLoggedInUser = () => {
    axios
      .get("http://localhost:5000/api/whoami", { withCredentials: true })
      .then((res) => this.setState({ loggedInUserId: res.data._id }))
      .catch((err) => console.log("Error: " + err.message));
  };

  render() {
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
