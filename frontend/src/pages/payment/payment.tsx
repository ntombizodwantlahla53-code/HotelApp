import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../../Redux/store";
import { payBooking } from "../../components/features/paymentslice"

export const payment = () => {
  const loading = useSelector((state: RootState) => state.payment.loading);
  const error = useSelector((state: RootState) => state.payment.error);

  const dispatch = useDispatch<AppDispatch>();
  const { booking_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const total = Number(location.state?.total || 0);

  const handlePay = () => {
    dispatch(payBooking(Number(booking_id)))
      .unwrap()
      .then(() => {
        alert("Payment successful!");
        navigate("/");
      })
      .catch(() => {});
  };

  return (
    <div>
      <h1>PayFast</h1>
      <p>Test payment, no real money is taken</p>
      <h2>Booking number: {booking_id}</h2>
      <h2>Amount: R{total.toFixed(2)}</h2>
      {error && <p>{error}</p>}
      <button onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : "Pay with PayFast"}
      </button>
      <button onClick={() => navigate("/")}>Pay later</button>
    </div>
  );
};

export default payment;