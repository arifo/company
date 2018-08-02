import { GET_MEMOS, GET_CURRENT_MEMO, TOGGLE_MEMO_FETCHING } from '../actions/types';

const initialState = {
  memos: [],
  currentMemo: {},
  isFetching: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_MEMOS: {
      return { ...state, memos: action.payload };
    }
    case GET_CURRENT_MEMO: {
      return { ...state, currentMemo: action.memo, isFetching: action.isFetching };
    }
    case TOGGLE_MEMO_FETCHING: {
      return {
        ...state,
        isFetching: action.payload
      };
    }
    default:
      return state;
  }
};
