import { useEffect, useState } from "react";
import { getProfile } from "../services/fetch";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";





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
        <div className="profile">
            <h2>im the profile</h2>
            <p>Show me How to live</p>
            <p>Email: {user.email}</p>
        </div>
    );
};