import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { RootState, AppDispatch } from "../../Redux/store";
import { verifyPayment } from "../../components/features/paymentslice";

export const paymentcallback = () => {
  const loading = useSelector((state: RootState) => state.payment.loading);
  const error = useSelector((state: RootState) => state.payment.error);
  const paid = useSelector((state: RootState) => state.payment.paid);

  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");

  useEffect(() => {
    if (reference) {
      dispatch(verifyPayment(reference));
    }
  }, []);

  return (
    <div>
      {loading && <h2>Checking your payment...</h2>}
      {error && <h2>{error}</h2>}
      {paid && <h2>Payment successful! Thank you.</h2>}
      <button onClick={() => navigate("/")}>Back to home</button>
    </div>
  );
};

export default paymentcallback;