import firebase from '@/plugins/firebase';
import 'firebase/auth';

export default function({ route, redirect }) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user && route.path !== '/') {
      redirect('/');
    }
  });
}
