import React, { useContext, useReducer, createContext } from "react";
import PropTypes from "prop-types";

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

StateProvider.propTypes = {
  reducer: PropTypes.func.isRequired,
  initialState: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export const useStateValue = () => useContext(StateContext);

/*import React, {useContext,useReducer,createContext} from "react";

export const StateContext = createContext();

export const StateProvider = ({reducer,initialState,children})=>(
    <StateContext.Provider value={useReducer(reducer,initialState)}>{children}</StateContext.Provider>
)

export const useStateValue = ()=>useContext(StateContext);*/