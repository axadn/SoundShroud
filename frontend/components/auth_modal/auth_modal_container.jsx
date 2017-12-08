import connect from "react-redux";
import AuthModal from "./auth_modal";

const mapStateToProps = (state, ownProps) => ({
  isOpen: state.auth_modal.login || state.auth_modal.register
});


export default connect(mapStateToProps)(AuthModal);
