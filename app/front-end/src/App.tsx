import { Component } from "react";
import HomeView from "./CustomComponents/HomeView";
import LoginView from "./CustomComponents/LoginView";
import NavBar from "./CustomComponents/NavBar";
import UserView from "./CustomComponents/UserView";
import FieldView from "./CustomComponents/FieldView";
import TournamentView from "./CustomComponents/TournamentView";
import AvailabilityView from "./CustomComponents/AvailabilityView";
import RegisterView from "./CustomComponents/RegisterView";

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentPage: "",
      fieldID: "",
      date: "",
      bookedSlots: [],
      loggedInUser: null,
    };
  }

  QSetView = (obj) => {
    this.setState({
      currentPage: obj.page || this.state.currentPage,
      fieldID: obj.id || this.state.fieldID,
      date: obj.date || this.state.date,
      bookedSlots: obj.bookedSlots || this.state.bookedSlots,
      loggedInUser: obj.loggedInUser || this.state.loggedInUser,
    });
  };

  QGetView = (state) => {
    let page = state.currentPage;
    switch (page) {
      case "loginView":
        return <LoginView QLoginDataFromChild={this.QHandlerUserLogin} />;
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
        return <TournamentView QViewFromChild={this.QSetView} />;
      case "registerView":
        return <RegisterView QRegistrationDataFromChild={this.QHandlerUserRegister} />;
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
        return <HomeView QViewFromChild={this.QSetView} />;
    }
  };

  QHandlerUserLogin = (obj) => {
    this.QSetView({ page: "home", loggedInUser: obj.username });
  };

  QHandlerUserRegister = (obj) => {
    this.QSetView({ page: "home" , loggedInUser: obj.username });
  };

  QHandlerFieldBookingFromChild = (obj) => {
    this.QSetView({
      page: "availabilityView",
      fieldID: obj.id,
      date: obj.date,
      bookedSlots: obj.bookedSlots,
    });
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
          <NavBar QViewFromChild={this.QSetView} currentUser={this.state.loggedInUser} />
          <div id="viewer" className="col bg-light p-4">
            <div>{this.QGetView(this.state)}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
