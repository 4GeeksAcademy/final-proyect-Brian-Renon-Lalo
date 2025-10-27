import { useEffect, useState } from "react";
import { getProfile } from "../services/fetch";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rzBrand from "../assets/img/rz-brand.png";





export const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const {store, dispatch } = useGlobalReducer()
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile(dispatch);
                setUser(data);
            } catch (err) {
                console.error(err);
                setError("Invalid Authorization or token ❌");
            }
        };

        fetchProfile();
    },[]);

    if (error) return <p style={{color:"red"}}>{error}</p>
    if (!user) return<p>Loading Profile...</p>


    return (
        <div className="text-center mt-5">
            <h2>Welcome to your Profile {user.name}</h2>
            <p className="lead">
                <img src={rzBrand} className="img-fluid mb-3" />
            </p>
            <p>Email: {user.email}</p>
        </div>
    );
};