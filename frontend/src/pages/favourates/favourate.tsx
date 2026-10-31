import { useEffect } from "react";
import styles from "./favourates.module.css"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../Redux/store";
import {fetchFavourites,deleteFavourites,} from "../../components/features/favourateslice"

export const favourite = () => {
  const favourites = useSelector((state: RootState) => state.favourites.favourites);
  const loading = useSelector((state: RootState) => state.favourites.loading);
  const error = useSelector((state: RootState) => state.favourites.error);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/Login");
      return;
    }
    dispatch(fetchFavourites());
  }, [dispatch, navigate]);

  return (
    <div className={styles.favourites}>
      <div className={styles.top}>
        <Link to="/" className={styles.back}>Back to hotels</Link>
        <h1 className={styles.heading}>My favourites ♡</h1>
      </div>

      {loading && <p className={styles.note}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && favourites.length === 0 && (
        <p className={styles.note}>You have no favourite hotels yet.</p>
      )}

      <div className={styles.favouritesList}>
        {favourites.map((hotel) => (
          <div key={hotel.hotel_id} className={styles.card}>
            {hotel.image_url && (
              <img src={hotel.image_url} alt={hotel.name} className={styles.image} />
            )}
            <div className={styles.body}>
              <h2 className={styles.title}>{hotel.name}</h2>
              <p className={styles.where}>{hotel.address}, {hotel.city}, {hotel.country}</p>
              <div className={styles.actions}>
                <Link to={`/hotels/${hotel.hotel_id}/rooms`}>
                  <button type="button" className={styles.view}>View rooms</button>
                </Link>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => hotel.hotel_id && dispatch(deleteFavourites(hotel.hotel_id))}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default favourite;
