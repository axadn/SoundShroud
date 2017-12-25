import {connect} from "react-redux";
import {enableLogin, enableRegister} from "../../actions/auth_modal_actions";
import LandingPage from "./landing_page";

const mapDispatchToProps = dispatch =>({
  enableLogin: () => dispatch(enableLogin()),
  enableRegister: () => dispatch(enableRegister())
});

export default connect(undefined, mapDispatchToProps)(LandingPage);
