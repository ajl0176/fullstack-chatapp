import React, { Component} from 'react';


class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
    }
this.handleChange = this.handleChange.bind(this)
}
handleChange(event){
  this.setState({[event.target.name]: event.target.value})
}

render(){
  return(
    <form className="col-12 col-md-6" onSubmit={(event) => this.props.registerUser(event, this.state)}>
       <h5 className="Register">Login</h5>
       <div className="form-group">
         <label htmlFor="username">Username</label>
         <input type='text' className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleChange}/>
       </div>
       <div className="form-group">
         <label htmlFor="password">Password</label>
         <input type='text' className="form-control" id="password1" name="password1" value={this.state.password1} onChange={this.handleChange}/>
       </div>
       <div className="create-Account-Btn">
         <button className="btn btn-primary">Login</button>
       </div>
     </form>
  );
  }
}

export default Login;
