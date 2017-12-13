import {connect} from "react-redux";
import AuthModal from "./auth_modal";

const mapStateToProps = (state, ownProps) => ({
  isOpen: state.authModal.login || state.authModal.register
});


export default connect(mapStateToProps)(AuthModal);
