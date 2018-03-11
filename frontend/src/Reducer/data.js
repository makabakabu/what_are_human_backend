const data = (state, action) => {
  switch (action.type) {
    case 'DATA_SELECT_VIEWMODE':
      return state.set('viewMode', action.viewMode);

    case 'DATA_SELECT_RANGE':
        state = state.set('start', action.dates[0].format('YYYY-MM-DD'));
        return state.set('end', action.dates[1].format('YYYY-MM-DD'));

    default:
      return state;
  }
};

export default data;
