type GenericType<T> = T & { _id: string };

const reducer = <T,>(state: GenericType<T>[], action: any) => {
  switch (action.type) {
    case "ADD_DATA":
      return [...state, action.data];
    case "UPDATE_DATA":
      const index = state.findIndex((d) => d._id === action.data._id);
      if (index >= 0) {
        state[index] = action.data;
        return [...state];
      }
      return state;
    case "MULTI_ADD_DATA":
      if (!action.data?.length) {
        return state;
      }

      return [...action.data];
    case "REMOVE_DATA":
      const _index = state.findIndex((d) => d._id === action.data._id);
      if (_index < 0) {
        return state;
      }
      state.splice(_index, 1);
      return [...state];
    default:
      return state;
  }
};

export default reducer;
