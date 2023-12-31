import { combineReducers } from "redux";
import users from "./users";
import admin from "./admin";
import form from "./form";
import response from "./response";
import email from "./email";
import recompense from "./recompense";

export default combineReducers({
  users,
  admin,
  form,
  response,
  email,
  recompense
});