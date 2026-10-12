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
            <p className={styles.hotels}>Explore ..................jkjnkkk</p>
        </div>
        <div className={styles.flex}>
            <div className={styles.firstplace} >
              <h2 className={styles.durban}> Durban</h2>  </div>
<div className={styles.secondplace}>
  <h2 className={styles.cape}> Cape Town</h2>
</div>
    </div>

<div className={styles.secrow}>
            <div className={styles.thirdplace} >
              <h2 className={styles.jhb}> Johannesburg</h2>
              </div>
<div className={styles.fourthplace}>
  <h2 className={styles.pmb}>Pietermaritzburg</h2> 
</div>

<div className={styles.lastplace}>
 <h2 className={styles.EL}>East London</h2> 
</div>
   
</div>

  </div>
  )
}
export default landing