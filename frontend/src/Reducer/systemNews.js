const systemNews = (state, action) => {
  switch (action.type) {
    case 'SYSTEMNEWS_CHANGE_TEXT':
      return state.set('text', action.text);

    case 'SYSTEMNEWS_DELETE_TEXT':
      return state.set('text', '');

    case 'SYSTEMNEWS_SELECT_USER':
      return state.set('userName', action.userName);

    default:
      return state;
  }
};

export default systemNews;
