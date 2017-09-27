import {combineReducers} from "redux";
import sessionErrorsReducer from "./session_errors_reducer";
import uploadErrorsReducer from "./upload_errors_reducer";
import uploadParamsErrorsReducer from  "./upload_params_errors_reducer";
export default combineReducers({
  session: sessionErrorsReducer,
  upload: uploadErrorsReducer,
  uploadParams: uploadParamsErrorsReducer
});
