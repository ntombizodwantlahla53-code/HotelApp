import styles from './landing.module.css'
import {navbar as Navbar} from '../../components/navbar/navbar'
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store";
import { fetchHotel} from "../../components/features/hotelslice";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { HiEye } from "react-icons/hi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { fetchFavourites, addFavourites, deleteFavourites } from "../../components/features/favourateslice"

export const landing = () => {
  const dispatch = useDispatch<AppDispatch>();
const hotels = useSelector((state: RootState) => state.hotels.hotels);
const loading = useSelector((state: RootState) => state.hotels.loading);
const error = useSelector((state: RootState) => state.hotels.error);
const favourites = useSelector((state: RootState) => state.favourites.favourites);
const navigate = useNavigate();
const token = localStorage.getItem("token");
const saveUser = localStorage.getItem("user");
const isAdmin = saveUser ? JSON.parse(saveUser).role === "Admin" : false;

useEffect(() => {
  dispatch(fetchHotel());
  if (token && !isAdmin) dispatch(fetchFavourites());
}, [dispatch, token, isAdmin]);

const handleFavourite = (hotel_id?: number, isFav?: boolean) => {
  if (!hotel_id) return;
  if (!token) {
    navigate("/Login");
    return;
  }
  if (isFav) {
    dispatch(deleteFavourites(hotel_id));
  } else {
    dispatch(addFavourites(hotel_id));
  }
};

  if (token && isAdmin) {
    return <Navigate to="/Admin" replace />;
  }

  return (
    <div>
        <div className={styles.landing}>
            <Navbar/>
            <h1 className={styles.texts}> Hotel Booking System</h1>
            <p className={styles.explore}>Lets start exploring the world</p>
        </div>

        <div className={styles.hotelslist}>
            <h2 className={styles.hotels}>Available Hotels</h2>
            <p className={styles.hotels}>Explore</p>
{loading && <p>Loading hotels...</p>}
{error && <p>{error}</p>}

            {!loading && !error && hotels.length === 0 && (
  <p>No hotels are available yet.</p>
)}
        </div>
<div className={styles.flex}>
  {hotels.map((hotel) => {
    const isFav = favourites.some((f) => f.hotel_id === hotel.hotel_id);
    return (
    <div className={styles.firstplace} key={hotel.hotel_id}>
      {hotel.image_url && (
                  <img src= {hotel.image_url} alt ={hotel.name} className={styles.image}/>
                )}
      <h2 >{hotel.name}</h2>
      <p>{hotel.description}</p>
      
      <p>{hotel.address}, {hotel.city}, {hotel.country}</p>
      <p>Amenities: {hotel.ammenities}</p>
      <p>Star rating:{hotel.star_rating ?? "Not rated"}</p>
                <Link to={`/hotels/${hotel.hotel_id}/rooms`}>
                    <div className={styles.buttnV}>
                      <button className={styles.viewb}><HiEye/></button>
                    </div>
                  </Link>
      <button type="button" onClick={() => handleFavourite(hotel.hotel_id, isFav)}>
        {isFav ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
    );
  })}
</div>
<div className={styles.lastplace}> 
</div>

  </div>
  )
}
export default landing