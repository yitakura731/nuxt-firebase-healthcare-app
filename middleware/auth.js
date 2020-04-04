import firebase from '@/plugins/firebase';

export default function({ route, redirect }) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user && route.path !== '/') {
      redirect('/');
    }
  });
}
