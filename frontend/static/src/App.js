import React, {Component} from 'react';
import Login from './components/Login'
import Register from './components/Register'
import ChatForm from './components/ChatForm'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Cookies from 'js-cookie'

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      display: 'register',
      loggedIn: Cookies.get('Authorization')? true:false,
    }
    this.registerUser = this.registerUser.bind(this)
    this.logIn = this.logIn.bind(this)
    this.handlePost = this.handlePost.bind(this)
    this.logOut = this.logOut.bind(this)
    this.fetchMessages = this.fetchMessages.bind(this)
  }
  componentDidMount(){
    this.fetchMessages();
    setInterval(this.fetchMessages, 2000);
  }
  fetchMessages(){
    const loggedIn = this.state.loggedIn;
      if (loggedIn === true){
        fetch ('api/v1/chats/')
        .then (response => response.json())
        .then (data => this.setState({messages: data}))
        .catch (error => console.log ('Error:', error));
      }
  }

  async registerUser(e, obj){
    e.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj),
    };

    const handleError = (err) => console.warn(err);
    const response = await fetch('api/v1/rest-auth/registration/', options)
    const data = await response.json().catch(handleError)

    if(data.key){
      Cookies.set('Authorization', `Token ${data.key}`);
    }
  }

  async logIn(e, obj){
    e.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    };

    const handleError = (err) => console.warn(err);
    const response = await fetch('api/v1/rest-auth/login/', options)
    const data = await response.json().catch(handleError)

  if(data.key){
    Cookies.set('Authorization', `Token ${data.key}`);
    }
  }

  async handlePost(e, msg, usr){
     e.preventDefault();
    const obj = {user: usr, message: msg}
     const options = {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'X-CSRFToken': Cookies.get('csrftoken'),
       },
       body: JSON.stringify(obj)
     };

     const handleError = (err) => console.warn(err);
     const response = await fetch('/api/v1/chats/', options);
     const data = await response.json().catch(handleError);

     if(data.key){
       Cookies.set('Authorization', `Token ${data.key}`)
     }

   }

   async logOut(e){
       e.preventDefault();

       const options = {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'X-CSRFToken': Cookies.get('csrftoken'),
         },
       };

       const handleError = (err) => console.warn(err);
       const responce = await fetch('/api/v1/rest-auth/logout/', options);
       const data = await responce.json().catch(handleError);

       if(data.detail === "Successfully logged out."){
         Cookies.remove('Authorization');
         this.setState({page: 'login'});
       }

     }


render(){
  console.log(this.state.loggedIn);
  let html;
  const display = this.state.display;
  if (display === 'register'){
    html = <div className='form'><Register registerUser={this.registerUser}/></div>
  } else if (display === 'login') {
    html = <div className='form'><Login logIn={this.logIn}/></div>
  }

  let chat;
  const loggedIn  = this.state.loggedIn;
  if (loggedIn === true){
    chat = <div className='ChatForm'><ChatForm chats={this.state.chats} postChat={this.postChat} logOut={this.logOut}/></div>
  } else {
    chat= ''
  }
    return(
      <React.Fragment>
      {loggedIn === false?<div className="mt-6">
        {html}
        <div className="form">
          <button onClick={() => this.setState({display:'login'})} type='button'className="btn btn-link">Already have an account?</button>
          <button onClick={() => this.setState({display:'register'})} type='button'className="btn btn-link">Don't have an account?</button>
        </div>
      </div>
      : <div>{chat}</div>
      }
      </React.Fragment>
    );
    }
  }


export default App;
