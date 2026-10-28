import styles from './admin.module.css'
import {navbar as Navbar} from '../../components/navbar/navbar'
import { Link } from 'react-router-dom'
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store";
import { fetchHotel} from "../../components/features/hotelslice";
import { fetchUsers, deleteUsers } from "../../components/features/userslice";
import { HiEye } from "react-icons/hi";
import {payments as Payments} from '../payments/payments'
import {reservations as Reservations} from '../reservation/reservation'

export const admin = () => {
  const dispatch = useDispatch<AppDispatch>();
const hotels = useSelector((state: RootState) => state.hotels.hotels);
const loading = useSelector((state: RootState) => state.hotels.loading);
const error = useSelector((state: RootState) => state.hotels.error);
const saveUser = localStorage.getItem("user");
const adminProfile = saveUser ? JSON.parse(saveUser) : null
const users = useSelector((state: RootState) => state.users.users);
const usersLoading = useSelector((state: RootState) => state.users.loading);
const usersError = useSelector((state: RootState) => state.users.error);

useEffect(() => {
  dispatch(fetchHotel());
  dispatch(fetchUsers());
}, [dispatch]);

const handleDelete = (id: number, name: string) => {
  if (window.confirm(`Delete user ${name}?`)) {
    dispatch(deleteUsers(id));
  }
};

  return (
    <div>
        <div className={styles.landing}>
            <Navbar/>

        </div>
        <div>
          <h2>profile</h2>
          {adminProfile ? (
            <div>
              <p>Name: {adminProfile.name}</p>
              <p>Email: {adminProfile.email}</p>
              <p>Role: {adminProfile.role}</p>
            </div>
          ) : (
            <p>no profile</p>
          )}
        </div>
        <div>
          <h2>Registered users</h2>
          {usersLoading && <p>Loading users...</p>}
          {usersError && <p>{usersError}</p>}
          <div className={styles.flex}>
            {users.map((user) => (
              <div key={user.id} className={styles.ad}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>Role: {user.role}</p>
                {user.role === "Customer" && (
                  <button type="button" onClick={() => handleDelete(user.id, user.name)}>
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <Payments/>
        <Reservations/>
        <Payments/>
        <div>

            {adminProfile?.role === "Admin" && (
              <Link to="/hotels">
                <h2 className={styles.hotels}>Add Hotels</h2>
              </Link>
            )}

{loading && <p>Loading hotels...</p>}
{error && <p>{error}</p>}

            {!loading && !error && hotels.length === 0 && (
  <p>No hotels are available yet.</p>
)}
        </div>
<div className={styles.flex}>
  {hotels.map((hotel) => (
    <div className={styles.firstplace} key={hotel.hotel_id}>
      {hotel.image_url && (
                  <img src= {hotel.image_url} alt ={hotel.name} className={styles.image}/>
                )}
      <h2>{hotel.name}</h2>
      <p>{hotel.description}</p>
      
      <p>{hotel.address}, {hotel.city}, {hotel.country}</p>
      <p>Amenities: {hotel.ammenities}</p>
      <p>Star rating:{hotel.star_rating ?? "Not rated"}</p>
         <Link to={`/Admin/hotels/${hotel.hotel_id}/rooms`}>
                    <div className={styles.buttnV}>
                      <button className={styles.viewb}><HiEye/></button>
                    </div>
                  </Link>
            <Link to={`/Hotels/${hotel.hotel_id}`}>
           <button type="button">Edit hotel</button>
         </Link>
    </div>
  ))}
</div>
  </div>
  )
}

export default admin