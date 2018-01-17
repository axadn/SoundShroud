import React from "react";
import * as UsersAPI from "../../utils/api_user_utils";

export default class UserRecommendations extends React.Component{
    constructor(props){
        super(props);
        this.state = {loading: true,
            users: false};
    }

    componentDidMount(){
       UsersAPI.fetchRecommendedUsers.then(
           userData=>this.setState({loading: false, users: userData}));
    }
    componentWillRecieveProps(newProps){
        
    }
    render(){
        let userList;
        if(this.state.loading){
            userListList = "";
        }
        else{
            userList = this.state.users.map(user =>{
                <li key={`userRecommendation${user.id}`}>
                    {user.username}
                </li>
            });
        }
        
        return <div className="user-recommendations">
            <ul>
                {userList}
            </ul>
        </div>
    }
}