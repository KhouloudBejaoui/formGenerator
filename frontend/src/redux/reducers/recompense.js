
  import {
    CREATE_RECOMPENSE,
    RETRIEVE_RECOMPENSES,
    UPDATE_RECOMPENSE,
    DELETE_RECOMPENSE,
    DELETE_ALL_RECOMPENSES
  } from "../actions/types";
  
  const initialState = [];
  
  function recompenseReducer(recompenses = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case CREATE_RECOMPENSE:
        return [...recompenses, payload];
  
      case RETRIEVE_RECOMPENSES:
        return payload;
  
      case UPDATE_RECOMPENSE:
        return recompenses.map((recompense) => {
          if (recompense.id === payload.id) {
            return {
              ...recompense,
              ...payload,
            };
          } else {
            return recompense;
          }
        });
  
      case DELETE_RECOMPENSE:
        return recompenses.filter(({ id }) => id !== payload.id);
  
      case DELETE_ALL_RECOMPENSES:
        return [];
  
      default:
        return recompenses;
    }
  };
  
  export default recompenseReducer;