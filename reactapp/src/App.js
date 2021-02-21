import React, { useEffect } from 'react'; // React imports
import { Component } from 'react';
import { io } from 'socket.io-client';
import { connect } from "react-redux";
import { Header } from 'rsuite';
import { Route, Switch, Redirect } from 'react-router-dom';

import 'rsuite/dist/styles/rsuite-dark.css'; // Dark theme for rsuite components
// import 'bootstrap/dist/css/bootstrap.css'; //only used for global nav (black bar)

import './App.css';

import Actions from './components/Actions';
import Control from './components/navigation/control';
import HomePage from './components/navigation/homepage';
import MyCharacter from './components/navigation/myCharacter';
import NavigationBar from './components/navigation/navigationBar';
import OtherCharacters from './components/navigation/OtherCharacters';
import ControlTerminal from './components/navigation/ControlTerminal';
// import Registration from './components/navigation/Registration';

import Login from './components/Login';
import NotFound from './components/notFound';
import initUpdate from './redux/initUpdate';
import { charactersReceived } from './redux/entities/characters';
import { assetsReceived } from './redux/entities/assets';
import { gamestateReceived } from './redux/entities/gamestate';
import { playerActionsReceived } from './redux/entities/playerActions';

const socket = io(`ws://localhost:5000/`)

// React App Component
class App extends Component  {


  componentDidMount = () => {
    socket.on('connect', () => { console.log('UwU I made it') });    
    socket.on('updateCharacters', (data) => { this.props.charactersReceived(data) });
    socket.on('updateActions', (data) => { this.props.playerActionsReceived(data) });
    socket.on('updateGamestate', (data) => { this.props.gamestateReceived(data) });
    socket.on('updateAssets', (data) => { this.props.assetsReceived(data) });
  }

  render() {
    return (
        <div className="App" style={this.props.loading ? loading : done}>
          <React.Fragment>
            {this.props.login && this.props.characters.length > 0 && this.props.actions.length > 0  && !this.props.loading && <Header>
              <NavigationBar/>
            </Header> }
            <Switch>
              <Route exact path='/login' render={(props) => (
                <Login {...props} />
              )} />
              <Route exact path='/home' render={(props) => (
                <HomePage {...props} /> 
              )} />
              <Route exact path='/character' render={(props) => (
                <MyCharacter {...props} />
              )}/>
              <Route exact path='/controllers' render={(props) => (
                <Control {...props} />
              )} />
              <Route exact path='/others' render={(props) => (
                <OtherCharacters {...props} />
              )} />
              <Route exact path='/actions' render={(props) => (
                <Actions {...props} />
              )} />
              <Route exact path='/control' render={(props) => (
                <ControlTerminal {...props} />
              )} />
              <Route exact path='/not-found' render={(props) => (
                <NotFound {...props} />
              )} />
              <Redirect from="/" exact to="login" />
              <Redirect to="/not-found" />
            </Switch>
          </React.Fragment>
        </div>
    );
  }
}


const loading = {
  position: 'fixed', backgroundColor: '#000000', top: 0, bottom: 0, width: '100%',
};

const done = {
  position: 'fixed', top: 0, bottom: 0, width: '100%',
}

const mapStateToProps = (state) => ({
	user: state.auth.user,
  actions: state.actions.list,
	loading: state.auth.loading,
	error: state.auth.error,
  login: state.auth.login,
  characters: state.characters.list,
});

const mapDispatchToProps = (dispatch) => ({
  charactersReceived:(data) => dispatch(charactersReceived(data)),
  playerActionsReceived: (data) => dispatch(playerActionsReceived(data)),
  gamestateReceived: (data) => dispatch(gamestateReceived(data)),
  assetsReceived: (data) => dispatch(assetsReceived(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
