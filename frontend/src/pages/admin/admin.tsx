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
    <div className={styles.page}>
      <div className={styles.landing}>
        <Navbar/>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>Registered users</h2>
        {usersLoading && <p className={styles.note}>Loading users...</p>}
        {usersError && <p className={styles.error}>{usersError}</p>}
        <div className={styles.flex}>
          {users.map((user) => (
            <div key={user.id} className={styles.ad}>
              <h3 className={styles.name}>{user.name}</h3>
              <p className={styles.email}>{user.email}</p>
              <p className={styles.role}>Role: {user.role}</p>
              {user.role === "Customer" && (
                <div>
                  <button type="button" className={styles.danger} onClick={() => handleDelete(user.id, user.name)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Payments/>
      <Reservations/>

      <div className={styles.section}>
        {adminProfile?.role === "Admin" && (
          <Link to="/hotels" className={styles.hotels}>+ Add Hotels</Link>
        )}

        {loading && <p className={styles.note}>Loading hotels...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && hotels.length === 0 && (
          <p className={styles.note}>No hotels are available yet.</p>
        )}
      </div>

      <div className={styles.flex}>
        {hotels.map((hotel) => (
          <div className={styles.firstplace} key={hotel.hotel_id}>
            {hotel.image_url && (
              <img src={hotel.image_url} alt={hotel.name} className={styles.image}/>
            )}
            <div className={styles.body}>
              <h2 className={styles.title}>{hotel.name}</h2>
              <p className={styles.stars}>{hotel.star_rating ? `★ ${hotel.star_rating}` : "Not rated"}</p>
              <p className={styles.text}>{hotel.description}</p>
              <p className={styles.where}>{hotel.address}, {hotel.city}, {hotel.country}</p>
              <p className={styles.where}>Amenities: {hotel.ammenities}</p>
              <div className={styles.actions}>
                <Link to={`/Admin/hotels/${hotel.hotel_id}/rooms`}>
                  <div className={styles.buttnV}>
                    <button className={styles.viewb}><HiEye/> Rooms</button>
                  </div>
                </Link>
                <Link to={`/Hotels/${hotel.hotel_id}`}>
                  <button type="button" className={styles.edit}>Edit hotel</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default admin
