import { GET_MEMOS, ADD_MEMO, DELETE_MEMO, LOGOUT, GET_ALL_MEMOS } from '../actions/types';

const initialState = {
  memos: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_MEMOS: {
      return { ...state, memos: action.payload };
    }
    case GET_MEMOS: {
      return { ...state, memos: { ...state.memos, [action.id]: action.payload } };
    }
    case ADD_MEMO: {
      return { ...state, memos: { ...state.memos, [action.id]: action.payload } };
    }
    case DELETE_MEMO: {
      const updatedMemos = removeMemo(state.memos, action.id);
      return { ...state, memos: updatedMemos };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

const removeMemo = (obj, id) =>
  Object.keys(obj).reduce((acc, key) => {
    if (key !== id) {
      return { ...acc, [key]: obj[key] };
    }
    return acc;
  }, {});
