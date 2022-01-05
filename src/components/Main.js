import React, {Component} from "react";
import Identicon from 'identicon.js';
class Main extends Component{


  render(){  
        return (
            <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 ml-auto mr-auto"
              style={{maxWidth : '1000px'}}>
                <div className="content mr-auto ml-auto">

                <form className="form-horizontal" action="/action_page.php"
                onSubmit={(event)=>{
                    event.preventDefault()
                    const content = this.postContent.value
                    this.props.createPost(content)
                    
                }}>
                    <div className="form-group">
                      <label className="control-label col-sm-2" >What's up?</label>
                      <div className="col-sm-10">
                        <input type="text"
                        ref = {(input)=>{this.postContent =input}}
                        className="form-control" id="postContent" placeholder="Enter here" required/>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-offset-2 col-sm-10">
                        <button type="submit" className="btn btn-primary">Post</button>
                      </div>
                    </div>
                </form>
                <br></br>
                <div> </div>
                  {this.props.posts.map((post,key)=>{
                    return(
                      <div key={key} className="card mt-5">
                          {/* <br></br> */}
                        <div className="card-header">
                        <img
                          style={{borderRadius : '50%'}} 
                          className='mr-2'
                          width='30'
                          height='30'
                          alt="description"
                          src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}` }
                        />
                        <small className="text-muted">{post.author}</small>
                        </div>
                        <ul id="postList" className="list-group list-group-flush">
                        <li  className="list-group-item">
                          <p>{post.content}</p>
                        </li>
                        <li  className="list-group-item py-2">
                          <small className="text-muted">
                            Donations: {window.web3.utils.fromWei(post.donations.toString(), 'Ether')} ETH
                          </small>
                          <button
                            className="btn btn-primary btn-sm float-right pt-0"
                            name={post.id}
                            onClick={(event) => {
                              let amount = window.web3.utils.toWei('0.01', 'Ether')
                              console.log(event.target.name, amount)
                              this.props.donatePost(event.target.name, amount)
                            }}
                          >
                            Donate 0.01 ETH
                          </button>
                        </li>
                      </ul>
                      </div>
                      
                    )
                  })}
                </div>
              </main>
            </div>
          </div>
        );
        
    }
}

export default Main;