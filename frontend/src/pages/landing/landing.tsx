import React from 'react'
import styles from './landing.module.css'
import {navbar as Navbar} from '../../components/navbar/navbar'


export const landing = () => {
  return (
    <div>
        <div className={styles.landing}>
            <Navbar/>
            <h1 className={styles.texts}> Hotel Booking System</h1>
            <p className={styles.explore}>Lets start exploring the world</p>

        </div>

        <div>
            <h2 className={styles.hotels}>Available Hotels</h2>
        </div>
</div>

  
  )
}
export default landing