import { combineReducers } from "redux";
import users from "./users";
import admin from "./admin";
import form from "./form";
import response from "./response";

export default combineReducers({
  users,
  admin,
  form,
  response
});