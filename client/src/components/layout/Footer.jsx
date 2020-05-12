import React,{Fragment} from 'react';
import {Link} from 'react-router-dom';
import { motion } from "framer-motion"

const Footer = () => {
    return (
        <Fragment>
            <motion.footer class="footer" initial={{opacity : 0}} animate={{opacity:1}} transition={{delay:1}}>
                <motion.div class="footer-inner"  initial={{opacity : 0}} animate={{opacity:1}} transition={{delay:2 , transition:.5}}>
                    <div className="bold">
                        <ion-icon name="globe-outline" size="large"></ion-icon> Developer By Meer Bahadin
                    </div>
                    <ul>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Developer</a></li>
                        <li><a href="#">Api</a></li>
                        <li><a href="#">Terms of use</a></li>
                        <li><a href="#">Ads</a></li>
                        <li><a href="#">&copy; Devbook 2020</a></li>
                    </ul>
                </motion.div>
             </motion.footer>
        </Fragment>
    )
}

export default Footer;