import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth';

const Navbar = ({auth : {isAuthenticated , loading} , logout}) => {

    const userLink = (
    <motion.ul initial={{x: -100,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:.3,delay:2}}>
        <li><Link to="/developers">Developers</Link></li>
        <li style={{cursor:'pointer'}}><a onClick={logout}>Logout</a></li>
    </motion.ul>
    )

    const guestLink = (
    <motion.ul initial={{x: -100,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:.3,delay:2}}>
        <li><Link to="/developers">Developers</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
    </motion.ul>
    )

    return (
        <motion.nav className="navbar bg-dark" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}>
            <motion.h1 initial={{x: -100,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:.3,delay:2}}>
                <Link to="/"><i className="fas fa-code"></i> Devbook</Link>
            </motion.h1>
            {/* { !loading && (<Fragment>{isAuthenticated ? userLink : guestLink}</Fragment>) } */}
            {/* OR *without loading */}
            {<Fragment>{isAuthenticated ? userLink : guestLink}</Fragment>}
    </motion.nav>
    )
}

Navbar.propTypes = {
    logout : PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
}


const mapStateToProps = state => ({ 
       auth : state.auth
   })

export default connect(mapStateToProps , {logout})(Navbar);