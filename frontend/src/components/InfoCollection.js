import { useNavigate } from "react-router";

export default function InfoCollection() {
  const navigate = useNavigate();

    return (
        <>
            <h1>
                Info Collection Page
            </h1>
            <button onClick={() => navigate("/past-counties")}>
                Living History
            </button>
        </>
    )
}