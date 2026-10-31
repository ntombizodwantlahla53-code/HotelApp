import { useDispatch, useSelector } from "react-redux";
import styles from "./payment.module.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../../Redux/store";
import { startPayment } from "../../components/features/paymentslice";

export const payment = () => {
  const loading = useSelector((state: RootState) => state.payment.loading);
  const error = useSelector((state: RootState) => state.payment.error);

  const dispatch = useDispatch<AppDispatch>();
  const { booking_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const total = Number(location.state?.total || 0);

  const handlePay = () => {
    dispatch(startPayment(Number(booking_id)))
      .unwrap()
      .then((payment_url) => {
        window.location.href = payment_url;
      })
      .catch(() => {});
  };

  return (
    <div className={styles.payment}>
      <h1>Pay for your booking</h1>
      <h2>Booking number: {booking_id}</h2>
      <h2>Amount: R{total.toFixed(2)}</h2>
      {error && <p>{error}</p>}
      <button onClick={handlePay} disabled={loading}>
        {loading ? "Please wait..." : "Pay with Paystack"}
      </button>
      <button onClick={() => navigate("/")}>Pay later</button>
    </div>
  );
};

export default payment;