import styles from './admin.module.css'
import {navbar as Navbar} from '../../components/navbar/navbar'
import { Link } from 'react-router-dom'


export const admin = () => {
  return (
    <div>
        <div className={styles.landing}>
            <Navbar/>
            <h1 className={styles.texts}> Hotel Booking System</h1>
            <p className={styles.explore}>Lets start exploring the world</p>

        </div>

        <div>
            <Link to="/hotels">
            <h2 className={styles.hotels}>Add Hotels</h2></Link>
            <p className={styles.hotels}>Explore</p>
        </div>

  </div>
  )
}
export default admin