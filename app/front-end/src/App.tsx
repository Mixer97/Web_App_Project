import { Component } from "react";
import HomeView from "./CustomComponents/HomeView";
import LoginView from "./CustomComponents/LoginView";
import NavBar from "./CustomComponents/NavBar";
import UserView from "./CustomComponents/UserView";
import FieldView from "./CustomComponents/FieldView";
import TournamentView from "./CustomComponents/TournamentView";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "home",
      id: 0,
    };
  }

  QSetView = (obj) => {
    this.setState({
      currentPage: obj.page,
      id: obj.id || 0,
    });
  };

  QGetView = (state) => {
    let page = state.currentPage;
    switch (page) {
      case "loginView":
        return <LoginView QUserFromChild={this.QHadlerUserLog} />;
      case "userView":
        return <UserView QViewFromChild={this.QSetView} />;
      case "fieldView":
        return <FieldView QViewFromChild={this.QSetView} />;
      case "tournamentView":
        return <TournamentView QViewFromChild={this.QSetView} />;
      default:
        return <HomeView />;
    }
  };

  QHadlerUserLog = (obj) => {
    this.QSetView({ page: "home" });
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
          <NavBar QViewFromChild={this.QSetView} />
          <div id="viewer" className="col bg-light p-4">
            <p>{this.QGetView(this.state)}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
