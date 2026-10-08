import React from 'react'
import styles from './navbar.module.css'


export const navbar = () => {
  return (
    <nav>
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <h1 className={styles.blue}>Book</h1>
                <h1>Hotel</h1>
            </div>
            
            <div className={styles.links}>
            <a href="/#" className={styles.link}>Sign In</a>
            <a href="/#" className={styles.link}>Sign Up</a>
            </div>
        </div>


    </nav>
  )
}
export default navbar