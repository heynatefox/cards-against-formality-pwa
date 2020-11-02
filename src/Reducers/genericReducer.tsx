const reducer = (state: any[], action: any) => {
  switch (action.type) {
    case 'ADD_DATA':
      return [
        ...state,
        action.data
      ];
    case 'UPDATE_DATA':
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
    case 'MULTI_UPDATE_DATA':
      if (!(action.data instanceof Array)) {
        return state;
      }

      // Any items that are not in the incoming data set will be removed.
      return action.data.map((data: any) => {
        const multiUpdateIndex = state.findIndex(d => d._id === data._id);
        if (multiUpdateIndex >= 0) {
          const obj = state[multiUpdateIndex];
          return Object.assign(obj, data);
        }
        // If it's not already in the array, add it.
        return data;
      });
    case 'MULTI_ADD_DATA':
      if (!action.data?.length) {
        return state;
      }

      return [
        ...state,
        ...action.data
      ];
    case 'REMOVE_DATA':
      const _index = state.findIndex(d => d._id === action.data._id);
      if (_index < 0) {
        return state;
      }
      state.splice(_index, 1);
      return [
        ...state
      ];
    case 'CLEAR_DATA':
      return [];
    default:
      return state;
  }
};

export default reducer;
