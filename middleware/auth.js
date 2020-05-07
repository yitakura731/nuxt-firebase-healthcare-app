import Cookies from 'js-cookie';

export default function({ req, route, store, redirect }) {
  if (process.server) {
    const firebaseAdmin = require('@/plugins/firebase-admin').default;
    const cookieparser = require('cookieparser');
    if (req.headers.cookie) {
      const token = cookieparser.parse(req.headers.cookie).__session;
      firebaseAdmin
        .auth()
        .verifyIdToken(token)
        .then(decodedToken => {
          store.commit('webapi/user', { uid: decodedToken.uid });
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          store.commit('webapi/user', null);
          Cookies.remove('__session');
          redirect('/');
        });
    } else {
      store.commit('webapi/user', null);
      redirect('/');
    }
  } else {
    const user = store.state.webapi.user;
    if (!user && route.path !== '/') {
      Cookies.remove('__session');
      redirect('/');
    }
  }
}
