import { combineReducers } from "redux";
import users from "./users";
import admin from "./admin";
import form from "./form";

export default combineReducers({
  users,
  admin,
  form
});