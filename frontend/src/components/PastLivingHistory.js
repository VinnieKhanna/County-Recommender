import { useNavigate } from "react-router";

export default function PastLivingHistory() {
    const navigate = useNavigate();
    return (
        <>
            <h1>
                Past Living History Page
            </h1>
            <button onClick={() => navigate("/recommendations")}>
                Compile Recommendations
            </button>
        </>
    )
}