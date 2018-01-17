import React from "react";
import * as UsersAPI from "../../utils/api_user_utils";
import UserRecommendationItem from "./user_recommendation_item";

export default class UserRecommendations extends React.Component{
    constructor(props){
        super(props);
        this.state = {loading: true,
            users: false};
    }

    componentDidMount(){
       UsersAPI.fetchRecommendedUsers().then(
           userData=>this.setState({loading: false, users: userData}));
    }
    componentWillReceiveProps(newProps){
        
    }
    render(){
        if(this.state.loading){
            return <div className="user-recommendations"/>
        }
        const userList = Object.keys(this.state.users).map(key =>
            <li key={`userRecommendation${this.state.users[key].id}`}>
                <UserRecommendationItem user={this.state.users[key]}/>
            </li>
        );
        
        return <div className="user-recommendations recommendations">
            <h4 className="recommendation-heading">Who to follow</h4>
            <ul>
                {userList}
            </ul>
        </div>
    }
}