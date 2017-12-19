import {connect} from "react-redux";
import AuthModal from "./auth_modal";
import {disableAuthModal} from "../../actions/auth_modal_actions";

const mapStateToProps = (state, ownProps) => ({
  isOpen: state.authModal.login || state.authModal.register
});

const mapDispatchToProps = dispatch => ({
  disable: () => dispatch(disableAuthModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal);
