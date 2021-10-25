import { getAuth } from 'firebase/auth';

export default function ({ store, route, redirect }) {
  const auth = getAuth();
  if (auth.currentUser && route.path !== '/') {
    store.commit('webapi/user', { uid: auth.currentUser.uid });
  }
  if (!auth.currentUser && route.path !== '/') {
    redirect('/');
  }
}
