import React, {Component} from 'react';
import Login from './components/Login'
import Registration from './components/Register'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import Cookies from 'js-cookies'

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      chats: [],
      display: 'register',
      loggedIn: Cookies.get('Authorization')? true:false,
    }
    this.registerUser = this.registerUser.bind(this)
    this.logIn = this.logIn.bind(this)
    this.logOut = this.logOut.bind(this)
    this.getMessages = this.getMessages.bind(this)
  }
  componentDidMount(){
    this.getMessages();
    setInterval(this.getMessages, 1000);
  }
  getMessages(){
    const loggedIn = this.state.loggedIn;
      if (loggedIn === true){
        fetch ('api/v1/chats/')
        .then (response => response.json())
        .then (data => this.setState({chats: data}))
        .catch (error => console.log ('Error:', error));
      }
  }
  logIn(event, data){
    event.preventDefault();
    const csrftoken = Cookies.get('csrftoken');
    fetch ('api/v1/rest-auth/login/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(data),
    })
    .then (response => response.json())
    .then (data =>{if(data.key){
      Cookies.get('Authorization', `Token ${data.key}`);
      this.setState({loggedIn: true})
    }})
    .catch (error => console.log ('Error:', error));
}

    registerUser(event, data){
      event.preventDefault();
      const csrftoken = Cookies.get('csrftoken');
      fetch ('api/v1/rest-auth/registration', {
        method: 'POST',
        headers: {
          'X-CSRFTOKEN': csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then (response => response.json())
      .then (data => {if(data.key){
        Cookies.get('Authorization', `Token ${data.key}`);
        this.setState({loggedIn: true})
      }})
      .catch (error => console.log ('Error:', error));
    }

    postChat(event, data){
      event.preventDefault();
      const csrftoken = Cookies.get('csrftoken');
      fetch ('api/v1/chats/',{
        method: 'POST',
        headers: {
          'X-CSRFTOKEN': csrftoken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
        .then (response => response.json())
        .then (data => const chats = [...this.state.chats, data];
          this.setState({chats})
      }})
      .catch (error => console.log ('Error:', error));
    }

    logOut(){
      const csrfToken = Cookies.get('csrftoken');
      fetch ('api/v1/rest-auth/logout'),{
        method: 'POST',
        headers: {
          'X-CSRFTOKEN': csrfToken,
          'Content-Type': 'application/json',

        }}
        .then (response => response.json())
        .then (data => {if(data.detail === 'Logged Out')
          Cookies.remove('Authorization');
          this.setState({loggedIn:false})
      }})
      .catch (error => console.log ('Error:', error));
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
