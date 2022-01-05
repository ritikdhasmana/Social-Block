import React, {Component} from "react";
import Identicon from 'identicon.js';
class Navbar extends Component{


    render(){
        return (
            <nav className="navbar navbar-dark p-1 mb-1 bg-dark text-white fixed-top flex-md-nowrap shadow" >
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
        src="./fave.ico"
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt=""
      />{'  '}
          Social Block
        </a>
        <ul className="navbar-nav px-3 mt-auto">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>
            { this.props.account
              ? <img style={{borderRadius : '50%'}} 
                className='ml-2'
                width='30'
                height='30'
                
                // border-radius = '50%'
                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                alt="description"
              />
              : <span></span>
            }
          </li>
        </ul>
      </nav>
        );
        
    }
}

export default Navbar;