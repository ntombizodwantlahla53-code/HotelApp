import styles from './landing.module.css'
import {navbar as Navbar} from '../../components/navbar/navbar'
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store";
import { fetchHotel} from "../../components/features/hotelslice";
import { Link } from 'react-router-dom';
import { HiEye } from "react-icons/hi";

export const landing = () => {
  const dispatch = useDispatch<AppDispatch>();
const hotels = useSelector((state: RootState) => state.hotels.hotels);
const loading = useSelector((state: RootState) => state.hotels.loading);
const error = useSelector((state: RootState) => state.hotels.error);

useEffect(() => {
  dispatch(fetchHotel());
}, [dispatch]);


  return (
    <div>
        <div className={styles.landing}>
            <Navbar/>
            <h1 className={styles.texts}> Hotel Booking System</h1>
            <p className={styles.explore}>Lets start exploring the world</p>

        </div>

        <div>
            <h2 className={styles.hotels}>Available Hotels</h2>
            <p className={styles.hotels}>Explore</p>
{loading && <p>Loading hotels...</p>}
{error && <p>{error}</p>}

            {!loading && !error && hotels.length === 0 && (
  <p>No hotels are available yet.</p>
)}
        </div>
        <div className={styles.flex}>

    </div>

<div className={styles.secrow}>
            
<div className={styles.fourthplace}>
</div>
<div className={styles.flex}>
  {hotels.map((hotel) => (
    <div className={styles.firstplace} key={hotel.hotel_id}>
      <h2>{hotel.name}</h2>
      <p>{hotel.description}</p>
      
      <p>{hotel.address}, {hotel.city}, {hotel.country}</p>
      <p>Amenities: {hotel.ammenities}</p>
      <p>Star rating:{hotel.star_rating ?? "Not rated"}</p>
                <Link to="/Roomlist">
                    <div className={styles.buttnV}>
                      <button className={styles.viewb}><HiEye/></button>
                    </div>
                  </Link>
    </div>
  ))}
</div>

<div className={styles.lastplace}> 
</div>

   
</div>

  </div>
  )
}
export default landing

