
export default (state: any[], action: any) => {
  switch (action.type) {
    case 'ADD_ROOM':
      return [
        ...state,
        action.data
      ];
    case 'UPDATE_ROOM':
      const index = state.findIndex(d => d._id === action.data._id);
      if (index >= 0) {
        state[index] = action.data;
        return [...state];
      } else {
        return [
          ...state,
          action.data
        ];
      }
    case 'MULTI_ADD_ROOMS':
      if (!action.data?.length) {
        return state;
      }

      return [
        ...state,
        ...action.data instanceof Array ? action.data : [action.data]
      ];
    case 'REMOVE_ROOM':
      const _index = state.findIndex(d => d._id === action.data._id);
      if (_index < 0) {
        return state;
      }
      state.splice(_index, 1);
      return [
        ...state
      ];
    case 'CLEAR_ROOMS':
      return [];
    default:
      return state;
  }
};
