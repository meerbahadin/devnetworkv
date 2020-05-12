import React, { Fragment } from "react";
import { Link , Redirect } from "react-router-dom";
import { motion } from "framer-motion";
import { connect } from "react-redux";
import PropTypes from "react";
import Footer from "./Footer";


const Landing = ({ isAuthenticated }) => {
  if(isAuthenticated) {
    return <Redirect to='/dashboard'/>
  }
  return (
    <Fragment>
      <motion.section
        className="landing"
        initial={{ height: 0 }}
        animate={{ height: "100vh" }}
        transition={{ duration: 0.8 }}
      >
        <div className="dark-overlay">
          <motion.div
            className="landing-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <h1 className="x-large">Developer Connector</h1>
            <p className="lead">
              Create a developer profile/portfolio, share posts and get help
              from other developers
            </p>
            <div className="buttons">
              <Link to="/register" className="btn btn-success">
                Sign Up
              </Link>
              <Link to="/login" className="btn btn-less-light">
                Login
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </motion.section>
    </Fragment>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
