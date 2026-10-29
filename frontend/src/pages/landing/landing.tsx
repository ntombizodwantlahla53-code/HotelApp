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
import { fetchAvailable, updateSearch, clearSearch } from "../../components/features/searchslice"
import {sharebutton as Sharebutton} from '../../components/sharebutton/sharebutton'

export const landing = () => {
  const dispatch = useDispatch<AppDispatch>();
const hotels = useSelector((state: RootState) => state.hotels.hotels);
const loading = useSelector((state: RootState) => state.hotels.loading);
const error = useSelector((state: RootState) => state.hotels.error);
const favourites = useSelector((state: RootState) => state.favourites.favourites);
const info = useSelector((state: RootState) => state.search.info);
const results = useSelector((state: RootState) => state.search.results);
const searched = useSelector((state: RootState) => state.search.searched);
const searching = useSelector((state: RootState) => state.search.loading);
const searchError = useSelector((state: RootState) => state.search.error);
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

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();

  if ((info.check_in || info.check_out) &&
     (!info.check_in || !info.check_out || info.check_out <= info.check_in)) {
    alert("Enter both dates, and check-out must be after check-in.");
    return;
  }
  dispatch(fetchAvailable(info));
};

  if (token && isAdmin) {
    return <Navigate to="/Admin" replace />;
  }

  return (
    <div>
      
        <div className={styles.landing}>
            <Navbar/>
            <div className={styles.heroContent}>
                <p className={styles.eyebrow}>YOUR NEXT HAPPY PLACE</p>
                <h1 className={styles.texts}>Find your little <span>escape.</span></h1>
                <p className={styles.explore}>Beautiful stays, special moments, and little getaways to remember.</p>
                <a href="#hotels" className={styles.exploreButton}>Explore stays ♡</a>
            </div>
        </div>


        <div className={styles.hotelslist} id="hotels">
            <p className={styles.sectionLabel}>A LITTLE GETAWAY</p>
            <h2 className={styles.hotels}>Find your kind of stay</h2>
            <p className={styles.sectionText}>Discover lovely places for your next trip.</p>

                      <form onSubmit={handleSearch}>
              <label>Hotel name
                <input type="text" placeholder="Hotel name" value={info.hotel_name}
                  onChange={(e) => dispatch(updateSearch({ hotel_name: e.target.value }))} />
              </label>

              <label>Location
                <input type="text" placeholder="City, country or address" value={info.location}
                  onChange={(e) => dispatch(updateSearch({ location: e.target.value }))} />
              </label>

              <label>Min price
                <input type="number" min="0" placeholder="0" value={info.min_price}
                  onChange={(e) => dispatch(updateSearch({ min_price: e.target.value }))} />
              </label>

              <label>Max price
                <input type="number" min="0" placeholder="5000" value={info.max_price}
                  onChange={(e) => dispatch(updateSearch({ max_price: e.target.value }))} />
              </label>

              <label>Check-in (YYYY-MM-DD)
                <input type="text" placeholder="2026-11-01" value={info.check_in}
                  onChange={(e) => dispatch(updateSearch({ check_in: e.target.value }))} />
              </label>

              <label>Check-out (YYYY-MM-DD)
                <input type="text" placeholder="2026-11-05" value={info.check_out}
                  onChange={(e) => dispatch(updateSearch({ check_out: e.target.value }))} />
              </label>

              <button type="submit" disabled={searching}>
                {searching ? "Searching..." : "Search"}
              </button>
              {searched && (
                <button type="button" onClick={() => dispatch(clearSearch())}>Show all hotels</button>)}
            </form>
{loading && <p>Loading hotels...</p>}
{error && <p>{error}</p>}

            {!searched && !loading && !error && hotels.length === 0 && (
  <p>No hotels are available yet.</p>
)}
            {searchError && <p>{searchError}</p>}
            {searched && !searching && results.length === 0 && (
              <p>No hotel is available for those dates.</p>
            )}
        </div>
<div className={styles.flex}>
  {(searched ? results : hotels).map((hotel) => {
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
                      <button className={styles.viewb}><HiEye/> Explore rooms</button>
                    </div>
                  </Link>
      <button type="button" onClick={() => handleFavourite(hotel.hotel_id, isFav)}>
        {isFav ? <FaHeart /> : <FaRegHeart />}
      </button>
       <Sharebutton hotel_id={hotel.hotel_id} name={hotel.name} />
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