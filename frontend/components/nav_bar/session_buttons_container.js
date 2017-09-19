import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import SessionButtons from "./session_buttons";
import {logged_in} from "../../reducers/selectors"
import {deleteSession} from "../../actions/session_actions";

const mapStateToProps = state => (
  {logged_in: logged_in(state)}
);

const mapDispatchToProps = dispatch => (
  {delete_session: () => dispatch(deleteSessionThunk())}
);

export default withRouter(connect(
  mapStateToProps, mapDispatchToProps)(SessionButtons));
