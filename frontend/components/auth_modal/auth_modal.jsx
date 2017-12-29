import React from "react";
import Modal from "react-modal";
import SessionFormContainer from "../session_form/session_form_container";

const AuthModal = props =>(
  <Modal isOpen={props.isOpen}
   overlayClassName = "modal-overlay"
   className = "auth-modal">
   <div className ="auth-modal-exit" onClick = {props.disable}>
    X</div>
    <SessionFormContainer></SessionFormContainer>
  </Modal>
);

export default AuthModal;
