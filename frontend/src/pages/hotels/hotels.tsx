
import { FaBasketShopping } from "react-icons/fa6";
import style from "./hotels.module.css"
import { IoIosAddCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/store";
import {fetchHotels, setSortBy} from "../../components/features/hotelslice"
import { fetchRooms } from "../../components/features/roomslice"
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { BiSolidEditAlt } from "react-icons/bi";
import { HiEye } from "react-icons/hi";
import { FaShareNodes } from "react-icons/fa6";


export const Hotels = () => {
  const { links, loading, error, searchTerm ,sortBy} = useSelector((state: RootState) => state.addhotels);
  const { rooms } = useSelector((state: RootState) => state.rooms);
  const user = useSelector((state: RootState) => state.login.info); //extract login user infoo
  const dispatch = useDispatch<AppDispatch>();

  //filter links based on what i search on search
  const filteredLinks = links.filter((link) =>
    link.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //sort filtered links based on the selected sort option
  const sortedLinks= [...filteredLinks].sort((a,b)=>{
    if(sortBy==="az"){
      return a.name.localeCompare(b.name);
    }
   if(sortBy==="za"){
      return b.name.localeCompare(a.name);
    }
    if(sortBy==="oldest"){
      return (a.created_at ?? 0)-(b.created_at ?? 0);
    }
   if (sortBy==="newest"){
      return (b.created_at ?? 0)-(a.created_at ?? 0);
    }
    return 0;
  });
  const formatDate = (timestamp?:number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString([],{
      day: '2-digit',
      month:'short',
      year: 'numeric',
 
    })
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchHotels(user.id));
      dispatch(fetchRooms(user.id));
    }
  }, [user?.id, dispatch]);
  return (
    <div className={style.home}>
      {loading && links.length === 0 ? (
        <p>Loading lists...</p>
      ) : links.length === 0 ? (
        <>
          <h1 className={style.hometitle}>Hotels</h1>
          <div className={style.icon}><FaBasketShopping /></div>
          <div className={style.text}>
            <h2 className={style.list}>Hotel empty<br /></h2>
            <p className={style.txt}>create/add hotels</p>
          </div>
          <Link to="/addhotels">
            <button type="button"><IoIosAddCircle /> Add Hotel</button>
          </Link>
        </>
      ) : (
        <>
          <div className={style.new}>
            <h1 className={style.hometitle2}>HOTEL LIST</h1>
            
            <div className={style.button}>
              <Link to="/addhotels">
           
                <button type="button"><IoIosAddCircle /> Add</button>
              </Link>
            </div>
          </div>
          <select value={sortBy}
            onChange={(e)=> dispatch(setSortBy(e.target.value as any))} className={style.sort}>
              <option value={"newest"}>Newest to Oldest</option>
              <option value={"oldest"}>Oldest to Newest</option>
              <option value={"az"}>A to Z</option>
              <option value={"za"}>Z to A</option>
            </select>
          <div className={style.cater}>
            {sortedLinks.map((link, index) => {
              const count = rooms.filter((i) => i.description === link.ammenities).length;
              return (
                <div key={link.hotel_id?? index} className={style.yea}>
                  <div className={style.q}>
                  <h2 className={style.name}>{link.name}</h2>
                  <p className={style.count}>
                    {count} {count === 1? "room":"rooms"}
                  </p>
                  <p className={style.date}>{formatDate(link.created_at)}</p>
                  </div>

                  <div className={style.buttonz}>
                
                  <Link to={`/items/${link.name}`}>
                    <div className={style.buttnV}>
                      <button className={style.viewb}><HiEye/></button>
                    </div>
                  </Link>
 
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};