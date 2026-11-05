import styles from "./roomlist.module.css"
import { IoIosAddCircle } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store"
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchRoom, deleteRoom } from "../../components/features/roomslice"
import { MdArrowBackIos } from "react-icons/md";
import { useEffect, useState } from "react";
import { fetchHotel } from "../../components/features/hotelslice";
import {sharebutton as Sharebutton} from '../../components/sharebutton/sharebutton'
import {reviews as Reviews} from '../../components/review/review'

export const roomlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotel_id } = useParams();
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const loading = useSelector((state: RootState) => state.rooms.loading);
  const error = useSelector((state: RootState) => state.rooms.error);
    const hotels = useSelector((state: RootState) => state.hotels.hotels);
  const hotel = hotels.find((item) => item.hotel_id === Number(hotel_id));
  const saveUser = localStorage.getItem("user");
  const profile = saveUser ? JSON.parse(saveUser) : null;
  const isAdmin = profile?.role === "Admin";
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = isAdmin && location.pathname.toLowerCase().startsWith("/admin");
  const [bigImage, setBigImage] = useState<string | null>(null);

  const handleBook = (room_id?: number) => {
    if (!localStorage.getItem("token")) {
      navigate("/Login");
      return;
    }

    navigate(`/bookings/${room_id}`);
  };

    useEffect(() => {
    dispatch(fetchHotel());
    if (hotel_id) {
      dispatch(fetchRoom(Number(hotel_id)));
    }
  }, [dispatch, hotel_id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBigImage(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hotelRooms = rooms.filter(
    (r) => Number(r.hotel_id) === Number(hotel_id)
  );

  return (
    <div className={styles.linkContainer}>
      <Link to={isAdminPage ? "/Admin" : "/"} className={styles.bc}>
        <MdArrowBackIos />
      </Link>

      <div className={styles.Topic}>
        <h1 className={styles.Mytitle}>Rooms for hotel {hotel_id}</h1>
        {hotel && (
          <div className={styles.hotel}>
            <h2 className={styles.name}>{hotel.name}</h2>
            <p className={styles.where}>{hotel.address}, {hotel.city}, {hotel.country}</p>
            <Sharebutton hotel_id={hotel.hotel_id} name={hotel.name} />
            <iframe title="Hotel map"
              className={styles.map}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${hotel.address}, ${hotel.city}, ${hotel.country}`)}&output=embed`}/>
          </div>
        )}
        {loading && <p className={styles.note}>Loading rooms...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && hotelRooms.length === 0 && (
          <p className={styles.note}>No rooms are available yet.</p>
        )}
        <div className={styles.flex}>
          {hotelRooms.map((room) => (
            <div className={styles.firstplace} key={room.room_id}>
              <div className={styles.gallery}>
                {room.image_urls?.filter((url) => url.trim()).map((url, index) => (
                  <img
                    key={index}
                    src={url.trim()}
                    alt={`Room view ${index + 1}`}
                    className={styles.image}
                    onClick={() => setBigImage(url.trim())}
                  />
                ))}
              </div>

              <div className={styles.details}>
                <p className={styles.title}>Room {room.room_id}</p>
                 <h2 className={styles.text}>{room.name}</h2>
                <p className={styles.text}>{room.description}</p>
                <div className={styles.chips}>
                  {room.ammenities?.split(",").map((a, i) => (
                    <span key={i} className={styles.chip}>{a.trim()}</span>
                  ))}
                </div>
                <p className={styles.fact}>Capacity: {room.capacity}</p>
                <p className={styles.fact}>Quantity: {room.quantity}</p>
                <p className={styles.price}>Price: {room.price}</p>
                <div>
                  {isAdminPage && (
                    <>
                    <Link to={`/EditRoom/${room.room_id}`}>
                      <button type="button" className={styles.inputting}>Edit room</button>
                    </Link>
                    <button type="button" className={styles.inputting}
                    onClick={() => {if (window.confirm(`Delete room ${room.room_id}?`)) dispatch(deleteRoom(room.room_id!));
                    }}>
                      Delete room
                      </button>
                      </>
                  )}
                  {!isAdminPage && (
                    <button
                      type="button"
                      className={styles.inputting}
                      onClick={() => handleBook(room.room_id)}>
                      Book now
                    </button>
                  )}
                </div>
                
              </div>
            </div>
          ))}
        </div>
        {hotel_id && <Reviews hotel_id={Number(hotel_id)} />}
        {isAdminPage && (
          <Link to={`/Rooms/${hotel_id}`}>
            <button type="button" className={styles.inputting}>
              <IoIosAddCircle />Add rooms
            </button>
          </Link>
        )}
      </div>

      {bigImage && (
        <div className={styles.lightbox} onClick={() => setBigImage(null)}>
          <img src={bigImage} alt="Room" className={styles.bigImage} />
        </div>
      )}
    </div>
  )
};
export default roomlist;
