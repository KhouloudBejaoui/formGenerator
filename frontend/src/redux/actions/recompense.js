import {
    CREATE_RECOMPENSE,
    RETRIEVE_RECOMPENSES,
    UPDATE_RECOMPENSE,
    DELETE_RECOMPENSE,
    DELETE_ALL_RECOMPENSES
} from "./types";

import RecompenseDataService from "../../services/recompense.service";

export const createRecompense = (data) => async (dispatch) => {
    try {
        const res = await RecompenseDataService.create(data);

        dispatch({
            type: CREATE_RECOMPENSE,
            payload: res.data,
        });

        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const retrieveRecompenses = () => async (dispatch) => {
    try {
        const res = await RecompenseDataService.getAll();
        
        dispatch({
            type: RETRIEVE_RECOMPENSES,
            payload: res.data,
        });
    } catch (err) {
        console.log(err);
    }
};

export const updateRecompense = (id, data) => async (dispatch) => {
    try {
        const res = await RecompenseDataService.update(id, data);

        dispatch({
            type: UPDATE_RECOMPENSE,
            payload: data,
        });

        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const deleteRecompense = (id) => async (dispatch) => {
    try {
        await RecompenseDataService.delete(id);

        dispatch({
            type: DELETE_RECOMPENSE,
            payload: { id },
        });
    } catch (err) {
        console.log(err);
    }
};

export const deleteAllRecompenses = () => async (dispatch) => {
    try {
        const res = await RecompenseDataService.deleteAll();

        dispatch({
            type: DELETE_ALL_RECOMPENSES,
            payload: res.data,
        });

        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const findRecompensesByRecompenseOperateur = (operateur) => async (dispatch) => {
    try {
        const res = await RecompenseDataService.findByOperateur(operateur);

        dispatch({
            type: RETRIEVE_RECOMPENSES,
            payload: res.data,
        });
    } catch (err) {
        console.log(err);
    }
};