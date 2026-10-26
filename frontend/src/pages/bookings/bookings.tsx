import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../Redux/store"
import {addbooking, fetchbookingroom} from "../../components/features/bookingslice"

export const booking = () => {
    const { room_id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { room, loading, error } = useSelector(
        (state: RootState) => state.booking
    );

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [message, setMessage] = useState("");

    const today = new Date().toLocaleDateString("en-CA");

    const nights =
        checkIn && checkOut && checkOut > checkIn
            ? Math.round(
                (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
            ): 0;

    const total = room ? Number(room.price) * nights : 0;
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/Login", {
                state: { from: `/bookings/${room_id}` },
                replace: true
            });
            return;
        }

        if (room_id) {
            dispatch(fetchbookingroom(Number(room_id)));
        }
    }, [dispatch, room_id, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!room_id || nights < 1) {
            setMessage("Choose a check-out date after check-in.");
            return;
        }

        dispatch(addbooking({
            room_id: Number(room_id),
            check_in: checkIn,
            check_out: checkOut,
            guests
        }))
            .unwrap()
            .then((booking) => {
                setMessage(
                    `Booking successful! Total: R${Number(
                        booking.total_price
                    ).toFixed(2)}`
                );
            })
            .catch(() => {});
    };

    return (
        <div style={{ maxWidth: "650px", margin: "40px auto", padding: "20px" }}>
            <Link to={room ? `/hotels/${room.hotel_id}/rooms` : "/"}>Back to rooms
            </Link>
            <h1>Book a room</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {room && (
                <>
                    <h2>Room {room.room_id}</h2>
                    <p>{room.description}</p>
                    <p>
                        Price per night: R{Number(room.price).toFixed(2)}
                    </p>
                    <p>Room capacity: {room.capacity} guest(s)</p>

                    <form onSubmit={handleSubmit}>
                        <p>
                            <label>
                                Check-in date
                                <br />
                                <input
                                    type="date"
                                    min={today}
                                    value={checkIn}
                                    onChange={(e) => {
                                        setCheckIn(e.target.value);

                                        if (
                                            checkOut &&
                                            e.target.value >= checkOut
                                        ) {
                                            setCheckOut("");
                                        }
                                    }}
                                    required
                                />
                            </label>
                        </p>

                        <p>
                            <label>
                                Check-out date
                                <br />
                                <input
                                    type="date"
                                    min={checkIn || today}
                                    value={checkOut}
                                    onChange={(e) =>
                                        setCheckOut(e.target.value)
                                    }
                                    required
                                />
                            </label>
                        </p>

                        <p>
                            <label>
                                Number of guests
                                <br />
                                <input
                                    type="number"
                                    min="1"
                                    max={room.capacity}
                                    value={guests}
                                    onChange={(e) =>
                                        setGuests(Number(e.target.value))
                                    }
                                    required
                                />
                            </label>
                        </p>

                        <h3>Nights: {nights}</h3>
                        <h3>Total price: R{total.toFixed(2)}</h3>

                        <button
                            type="submit"
                            disabled={loading || nights < 1}
                        >
                            Confirm booking
                        </button>
                    </form>
                </>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};

export default booking;
