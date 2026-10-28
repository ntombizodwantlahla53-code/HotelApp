import { query } from "../config/database";
import { Hotel, NewHotel } from "./../types/hotel.types"

interface SearchFilters {
  check_in: string | null;
  check_out: string | null;
  hotel_name: string;
  location: string;
  min_price: number | null;
  max_price: number | null;
}

export const createHotel = async (
  appData: NewHotel,
  user_id: number
): Promise<Hotel> => {
  const {name, description, address,city,country,ammenities,star_rating, image_url} = appData;
  const { rows } = await query(
    "INSERT INTO hotels (user_id, name, description, address, city, country, ammenities, star_rating, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [user_id, name, description, address, city, country, ammenities, star_rating, image_url],
  );
  return rows[0];
};
export const findAllHotels = async (): Promise<Hotel[]> => {
  const { rows } = await query(
    "SELECT * FROM hotels",
  );
  return rows;
};

export const updateHotel = async (
  hotel_id: number,
  appData: NewHotel
): Promise<Hotel | null> => {
  const {name, description, address, city, country, ammenities, star_rating, image_url} = appData;
  const { rows } = await query(
    `UPDATE hotels SET name = $1, description = $2, address = $3, city = $4, country = $5,
     ammenities = $6, star_rating = $7, image_url = $8, updated_at = NOW()
     WHERE hotel_id = $9 RETURNING *`,
    [name, description, address, city, country, ammenities, star_rating, image_url, hotel_id],
  );
  return rows[0] || null;
};

export const deleteHotel = async (
  hotel_id: number,
): Promise<Hotel | null> => {
  const { rows } = await query("DELETE FROM hotels WHERE hotel_id = $1 RETURNING *",
    [hotel_id],
  );
  return rows[0] || null;
};

export const findAvailableHotels = async (filters: SearchFilters): Promise<Hotel[]> => {
  const { check_in, check_out, hotel_name, location, min_price, max_price } = filters;
  const { rows } = await query(
    `SELECT hotels.* FROM hotels
     WHERE ($1::text = '' OR hotels.name ILIKE '%' || $1::text || '%')
     AND ($2::text = '' OR hotels.city ILIKE '%' || $2::text || '%'
          OR hotels.country ILIKE '%' || $2::text || '%'
          OR hotels.address ILIKE '%' || $2::text || '%')
     AND EXISTS (
       SELECT 1 FROM rooms
       WHERE rooms.hotel_id = hotels.hotel_id
       AND ($3::numeric IS NULL OR rooms.price >= $3::numeric)
       AND ($4::numeric IS NULL OR rooms.price <= $4::numeric)
       AND ($5::date IS NULL OR rooms.quantity > (
         SELECT COUNT(*) FROM bookings
         WHERE bookings.room_id = rooms.room_id
         AND bookings.booking_status <> 'Cancelled'
         AND bookings.check_in < $6::date
         AND bookings.check_out > $5::date
       ))
     )
     ORDER BY hotels.hotel_id`,
    [hotel_name, location, min_price, max_price, check_in, check_out]
  );
  return rows;
};