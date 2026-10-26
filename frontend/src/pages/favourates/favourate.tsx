import { useEffect } from "react";
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
    <div >
      <Link to="/">Back to hotels</Link>
      <h1>My favourites</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && favourites.length === 0 && (
        <p>You have no favourite hotels yet.</p>
      )}

      {favourites.map((hotel) => (
        <div key={hotel.hotel_id}>
          {hotel.image_url && (
            <img src={hotel.image_url} alt={hotel.name}   />
          )}
          <h2>{hotel.name}</h2>
          <p>{hotel.address}, {hotel.city}, {hotel.country}</p>
          <Link to={`/hotels/${hotel.hotel_id}/rooms`}>View rooms</Link>
          <br />
          <button
            type="button"
            onClick={() => hotel.hotel_id && dispatch(deleteFavourites(hotel.hotel_id))}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default favourite;