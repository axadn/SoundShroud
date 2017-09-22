import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import SessionButtons from "./session_buttons";
import {logged_in, current_user_id} from "../../reducers/selectors"
import {deleteSession} from "../../actions/session_actions";

const mapStateToProps = state => (
  {logged_in: logged_in(state),
    current_user_id: current_user_id(state)
  }
);

const mapDispatchToProps = dispatch => (
  {delete_session: () => dispatch(deleteSessionThunk())}
);

export default withRouter(connect(
  mapStateToProps, mapDispatchToProps)(SessionButtons));