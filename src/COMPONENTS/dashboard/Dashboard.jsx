import './Dashboard.css'
import React from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import valuesIn from 'lodash/valuesIn'
import Routes from './../../redux/routes'
import Loader from 'react-loader-spinner'
import Skeleton from 'react-loading-skeleton';



import {Input, Badge, Switch, Select, Avatar, Button} from 'antd'
import { UserOutlined } from '@ant-design/icons';


//-----Actions-------
import * as actions from './../../redux/actions/actions'


class Dashboard extends React.Component{
    state = {
        first_name:null,
        surname:null,
        marrital_status:null
    };
    componentDidMount(){
        this.props.persistState()
        this.props.getData()
    }

    handleInput = (e, field) => {
        if(field === 'first_name'){this.setState({first_name: e.target.value})}
        if(field === 'surname'){this.setState({surname: e.target.value})}
        if(field === 'marrital_status'){this.setState({marrital_status: e})}
    };
    logout = () => {
        sessionStorage.removeItem('token')
        this.props.logout()
    };
    submit = () => {
       let profile = {
           first_name:this.state.first_name,
           surname:this.state.surname,
           marrital_status:this.state.marrital_status
       }
       console.log('PROFILE', profile)
       this.props.submitProfile(profile)
    }
    render(){
        let token = this.props.token,
            session_token = sessionStorage.getItem('token')
        if(token === null){return <Redirect to={Routes.login}/>}

        const is_disabled =
                this.first_name  === null ||
                this.state.surname === null ||
                this.state.marrital_status === null

        const friends = this.props.friends,
              buddies = valuesIn(friends).filter(friend => {
                  return friend.body.buddy
              })

        return(
            <div className="dashboard" >
               <div className="header-db">
                   <div className="header-db-left">
                       Dashboard
                   </div>
                    <div className="header-db-right">

                        <span onClick={this.logout} style={{cursor:'pointer'}}>
                           <Avatar icon={<UserOutlined />} />
                            &nbsp;
                            Logout
                        </span>
                    </div>
               </div>
                <div className="row" style={{position:'relative', top: '100px'}}>
                    <div className="col-lg-6">
                        <div className="db-form-wrap">
                            {
                                this.props.isSubmittingBuddy?
                                    <div style={{marginTop:'40px'}}>
                                        <Loader
                                            type="Puff"
                                            color="#00BFFF"
                                            height={60}
                                            width={100}
                                        />
                                        <b>Submitting buddy</b>
                                        <br/><br/>
                                    </div>
                                        :
                                        <React.Fragment>
                                            <h2 style={{marginTop:'10px'}}>Add new buddy</h2>
                                            <div className="login-form" style={{
                                                marginTop:'0px', textAlign:'left', paddingLeft:'30px'
                                            }}>
                                                <div>
                                                    <b>First name</b>
                                                    <Input
                                                        placeholder="First name"
                                                        className="lg-input-field"
                                                        onChange={(e)=>this.handleInput(e, 'first_name')}
                                                    />
                                                </div>
                                                <div>
                                                    <b>Surname name</b>
                                                    <Input
                                                        placeholder="Surname"
                                                        className="lg-input-field"
                                                        onChange={(e)=>this.handleInput(e, 'surname')}
                                                    />
                                                </div>
                                                <div>
                                                    <b>Marrital status</b>
                                                    <div>
                                                        <Select className="lg-input-field"
                                                                onChange={(e)=>this.handleInput(e, 'marrital_status')}
                                                                defaultValue="Select a meal">
                                                            <option value="married">Married</option>
                                                            <option value="single">Single</option>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <Button disabled={is_disabled} className="login-btn"
                                                        onClick={this.submit}>
                                                    Submit
                                                </Button>
                                            </div>
                                            <div className="form-extra">
                                               </div>
                                        </React.Fragment>
                            }
                        </div>
                    </div>
                    <div className="col-lg-6 text-center">
                       <div style={{marginTop:'40px', padding:'0px 40px  20px 20px'}}>
                           <h3>
                               {
                                   this.props.isFetchingFriends? 'Fetching your buddies...'
                                       :
                                       <span>
                                           Your buddies&nbsp;
                                            <Badge count={valuesIn(buddies).length}>
                                            </Badge>
                                       </span>
                               }
                           </h3>
                           {
                               this.props.isFetchingFriends?
                                   <Skeleton count={10}/>
                                   :
                                   <div className="table table-responsive">
                                       <table className="table table-bordered">
                                           <thead>
                                           <tr style={{fontSize:'15px'}}>
                                               <th style={{minWidth:'30px'}}>ID#</th>
                                               <th style={{minWidth:'130px'}}>First name</th>
                                               <th style={{minWidth:'100px'}}>Surname</th>
                                               <th style={{minWidth:'100px'}}>Married?</th>
                                           </tr>
                                           </thead>
                                           <tbody>
                                           {
                                               valuesIn(buddies).map((buddy) => {
                                                   return(
                                                       <tr style={{fontSize:'14px'}}>
                                                           <th >{buddy.id}</th>
                                                           <th >{buddy.body.buddy.first_name}</th>
                                                           <th >{buddy.body.buddy.surname}</th>
                                                           <th >
                                                               {
                                                                   buddy.body.buddy.marrital_status === 'married' &&
                                                                       <Switch  defaultChecked/>
                                                               }
                                                               {
                                                                   buddy.body.buddy.marrital_status === 'single' &&
                                                                   <Switch  value={false}/>
                                                               }
                                                           </th>
                                                       </tr>
                                                   )
                                               })
                                           }

                                           </tbody>
                                       </table>
                                   </div>
                           }

                       </div>
                    </div>
                </div>

            </div>
        )
    }
}


const mapStateToProps = state => ({
      token: state.main.token,
      friends:state.main.friends,
      isSubmittingBuddy:state.main.isSubmittingBuddy,
      isFetchingFriends:state.main.isFetchingFriends
});

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout()),
        persistState: () => dispatch(actions.persistState()),
        submitProfile: (profile) => dispatch(actions.submitProfile(profile)),
        getData: () => dispatch(actions.getData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);