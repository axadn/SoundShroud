import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import SessionButtons from "./session_buttons";
import {logged_in, current_user_id} from "../../reducers/selectors"
import {deleteSessionThunk} from "../../actions/session_actions";
import {enableLogin, enableRegister} from "../../actions/auth_modal_actions";

const mapStateToProps = state => (
  {logged_in: logged_in(state),
    current_user: logged_in(state) ? state.session.current_user : null
  }
);

const mapDispatchToProps = dispatch => (
  {delete_session: () => dispatch(deleteSessionThunk()),
   enable_login: () => dispatch(enableLogin()),
   enable_register: () => dispatch(enableRegister())}
);

export default withRouter(connect(
  mapStateToProps, mapDispatchToProps)(SessionButtons));
