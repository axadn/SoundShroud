import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import UserShow from "./user_show";
import React from "react";
import {receiveMainContentLoading,
   receiveMainContentLoaded} from "../../actions/loading_actions";
import {fetchUserThunk} from "../../actions/user_actions";
const mapDisplayStateToProps = (state, props) =>({
  loading: state.loading.mainContent,
  user: state.entities.users[props.userId]
});

const mapContainerStateToProps = (state, props) => ({
  userId: props.match.params.userId
});

const mapContainerDispatchToProps = (dispatch, props) =>({
  fetchUser: () =>{
    dispatch(receiveMainContentLoading());
    dispatch(fetchUserThunk(props.match.params.userId, () =>
      dispatch(receiveMainContentLoaded())));
    }
});
const ConnectedDisplayComponent = withRouter(connect(mapDisplayStateToProps,
  mapDisplayDispatchToProps)(UserShow))
const mapDisplayDispatchToProps = ({

});

class UserShowContainer extends React.Component{
  componentWillMount(){
    this.props.fetchUser();
  }
  componentWillReceiveProps(newProps){
    if(this.props.userId !== newProps.userId){
      this.props.fetchUser();
    }
  }
  render(){
    return <ConnectedDisplayComponent userId={this.props.userId}/>;
  }
}

export default withRouter(connect(mapContainerStateToProps,
   mapContainerDispatchToProps)(UserShowContainer));
