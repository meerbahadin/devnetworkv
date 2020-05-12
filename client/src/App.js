import React , {Fragment , useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Route , Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import Create from './components/profile/Create';
import Edit from './components/profile/Edit';

//Private Route
import PrivateRoute from './components/routing/PrivateRoute';



//Redux Stuff
import { Provider } from 'react-redux';
import store from './store';

if (localStorage.token) {
  setAuthToken(localStorage.token)
} 

//we wrap everything with provider and we pass a store wich acts like our data for cloud 

const  App = () => {

useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={ store }>
          <Router>
          <Fragment>
                <Navbar/>
                <Route exact path='/' component={Landing}/>
                <section className='container'>
                <Alert/>
                {/* switch only can have routes in it so we cant render alert inside it */}
                  <Switch>
                  <Route exact path='/register' component={Register}/>
                  <Route exact path='/login' component={Login}/>
                  <PrivateRoute exact path='/dashboard' component={Dashboard}/>
                  <PrivateRoute exact path='/create-profile' component={Create}/>
                  <PrivateRoute exact path='/edit-profile' component={Edit}/>
                  </Switch>
                </section>
              </Fragment>
          </Router>
    </Provider>
  )
}


export default App;
