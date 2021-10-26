import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function ({ store, route, redirect }) {
  onAuthStateChanged(getAuth(), (response) => {
    if (response && route.path !== '/') {
      store.commit('webapi/user', { uid: response.uid });
    }
    if (!response && route.path !== '/') {
      redirect('/');
    }
  });
}
