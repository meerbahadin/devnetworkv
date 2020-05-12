import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route , Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({component : Component , auth : {isAuthenticated , loading} , ...rest}) => (
    <Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to='/login'/>) : 
    (<Component {...props}/>)}/>
)

// const PrivateRoute = ({component : Component , auth : {isAuthenticated , loading} , ...rest}) => {
//     return (
//         <Route {...rest} render={props => {
//             if(!isAuthenticated && !loading) {
//                 return <Redirect to='/login'/>
//             } else {
//                 return <Component {...props}/>
//             }
//         }}/>
//     )
// }

PrivateRoute.propTypes = {
 auth : PropTypes.object.isRequired,
} 

const mapStateToProps = state => ({
    auth:state.auth
})

export default connect(mapStateToProps)(PrivateRoute);
