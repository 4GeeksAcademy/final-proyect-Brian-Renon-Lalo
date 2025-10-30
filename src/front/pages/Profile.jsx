import { useCallback, useEffect, useState } from "react";
import { getProfile,  updateProfile, uploadUserPhotoBase64 } from "../services/fetch";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; 
import { useNavigate, Link } from "react-router-dom";
import e from "cors";


const DEFAULT_AVATAR_URL = "/profile_pictures/rz-profile-img.png";



export const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { store, dispatch } = useGlobalReducer();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const [base64Image, setBase64Image] = useState(null);
   
    
    const userID = localStorage.getItem("user_id");

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!userID) {
                setError("User ID missing. Please try again");
                return;
            }

            const profileData = await getProfile();
            setUser(profileData);

            setEditData({ name: profileData.name, email: profileData.email });

        
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Error loading profile")
        } finally {
            setLoading(false);
        }
    },[userID]);


    
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);
    
    const handleEditChange = (e) => {
        setEditData({...editData, [e.target.name]: e.target.value});
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setError(null);

        let updateSuccessful = false;
    
        
        try { 
            if (!userID) throw new Error("User ID missing");

           
            const updateUser = await updateProfile( editData.name, editData.email);
            let finalUserData = updateUser;

            if (base64Image) {
                try {
                    const photoUpdateUser = await uploadUserPhotoBase64(base64Image); 
                    finalUserData = photoUpdateUser;
                    setBase64Image(null); 
                } catch (photoError) {
                    console.error("Error uploading photo:", photoError);
                    setError("Error updating photo: " + photoError.message);
                }
            }

            setUser(finalUserData);          
            await fetchUserData();
            updateSuccessful = true;
         
            if (!error) { 
                setError("Profile updated successfully!✅");   
            }
           
        } catch (err) { 
            console.error("Error saving profile:", err);
            setError(err.message || "Error al actualizar el perfil.");
        } finally {
            setLoading(false);
            if (updateSuccessful) {
                setIsEditing(false); 
        }
    }
};

    
    const avatarUrl = base64Image || user?.profile_picture_url || DEFAULT_AVATAR_URL;
        
    
    
    if (loading) return <div className="text-center mt-5"><p>Cargando Perfil...</p></div>;
    if (error && !error.includes("successfully")) return <p style={{color:"red"}}>{error}</p>
    if (!user) return<p>Error: No se encontró la informcaión de usuario.</p>

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    {error && (
                        <div className={`alert ${error.includes("successfully") ? 'alert-success' : 'alert-danger'}`} role="alert">
                            {error}
                        </div>
                    )}
                    
                    <div className="card shadow-sm">
                        <div className="card-header text-center bg-primary text-white">
                            <h3>Panel de Usuario</h3>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <img 
                                    src={avatarUrl} 
                                    alt={`${user.name}'s avatar`} 
                                    className="rounded-circle border border-3 border-secondary"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR_URL; }}
                                />
                                <h4 className="mt-3">{user.name}</h4>
                            </div>

                            {isEditing ? (
                                <div className="p-3">
                                    <h5 className="mb-3">Editando Perfil</h5>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            className="form-control" 
                                            value={editData.name || ''} 
                                            onChange={handleEditChange} 
                                        />
                                        {base64Image && <small className="text-success">Imagen cargada en memoria. Pulsa Guardar</small>}
                                   
                                        <label className="form-label">Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            className="form-control" 
                                            value={editData.email || ''} 
                                            onChange={handleEditChange} 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Foto de Perfil</label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            onChange={handleFileChange} 
                                        />
                                        </div>
                                            <button className="btn btn-success me-2" onClick={handleSaveProfile}>Guardar Cambios</button>
                                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
                                   
                                        </div>
                            ) : (
                                // --- VISTA NORMAL ---
                                <>
                                    <div className="list-group mb-4">
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            Email:
                                            <span className="fw-bold">{user.email}</span>
                                        </div>
                                        
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <button 
                                                className="btn btn-outline-primary w-100" 
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Editar Perfil
                                            </button>
                                        </div>
                                    </div>
                                    
                                    
                                </>
                            )}
                        </div>
                    </div>
                    <div className="container ">
                        <div className="row justify-content-center">
                            <Link to="/">
                                <button className="btn btn-primary text-white">RutasZero Guardadas</button>
                            </Link>
                        </div>    
                    </div>

                </div>
            </div>
            
        </div>
    );
};
                        
                        
