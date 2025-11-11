const API_URL = import.meta.env.VITE_BACKEND_URL;


// User Register
export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Error to Register");
    }

    return data;
  } catch (error) {
    console.error("Error to register:", error);
    throw error;
  }
};

// Login de usuario
export const login = async (email, password, dispatch) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Error to login");
    }


    if (!data.token || !data.user?.id) {
      throw new Error("invalid login response");
    }


    localStorage.setItem("token", data.token);
    dispatch({
      type: "set_Logged",
      payload: true
    });
    return data; 
  } catch (error) {
    console.error("Error en login:", error);
    throw error; 
  }
};

//Obtener perfil

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("user_id");

    if (!token || !userID) { throw new Error("No token or user ID found"); }

    const response = await fetch (`${API_URL}/api/user/${userID}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error fetching profile");
    }
    
    return data;
  } catch (error) {
    console.error("Error in getProfile:", error);
    throw error;
  }
};

// actualizar perfil

export const updateProfile = async ( name, email) => {
  try {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("user_id");

    if (!token) { throw new Error("No token found"); }

    const response = await fetch(`${API_URL}/api/user/${userID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email })
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Error updating profile");
    }

    return data;
    } catch (error) {
      console.error("Error updateProfile:", error);
      throw error;
    }
};

//Subir foto

export const uploadUserPhotoBase64 = async (base64Image) => {
  const userID = localStorage.getItem("user_id");
  const API_URL_PHOTO = `${import.meta.env.VITE_BACKEND_URL}/api/user/${userID}/photo`;

  const token = localStorage.getItem("token");

  const response = await fetch(API_URL_PHOTO, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ base64_image: base64Image}),
  
  });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Failed to upload photo");
    }
    
    return await response.json();
}

//obtener rutas guardadas

export const getSavedRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("user_id")
      

      if (!token || !userID) {
        throw new Error("No token or user ID found. User not logged.");
      }
      
      const response = await fetch(`${API_URL}/api/user/${userID}/saved-routes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error fetching saved routes");
      }

      return data.routes || [];
  }catch (error) {
    console.error("Error in getSavedRoutes", error);
    throw error;
  }
};

//guardar rutas

export const saveRoute = async (routeId) => {
    try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("user_id");

        if (!token || !userID) {
            throw new Error("No token or user ID found. User not logged.");
        }

        const response = await fetch(`${API_URL}/api/user/${userID}/saved-routes`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ route_id: routeId }), 
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || "Error saving route");
        }

        return data;
    } catch (error) {
        console.error("Error in saveRoute:", error);
        throw error;
    }
};

//eliminar ruta guardada

export const unsaveRoute = async (routeId) => {
    try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("user_id");

        if (!token || !userID) {
            throw new Error("No token or user ID found. User not logged.");
        }

        const response = await fetch(`${API_URL}/api/user/${userID}/saved-routes/${routeId}`, {
            method: "DELETE", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 204) { 
            return { msg: "Route successfully unsaved" };
        }
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || "Error unsaving route");
        }

        return data; 
    } catch (error) {
        console.error("Error in unsaveRoute:", error);
        throw error;
    }
};

//comprobar rutas guardadas

export const isRouteSaved = async (routeId) => {
    try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("user_id");

        if (!token || !userID) {
            return false;
        }

        const response = await fetch(`${API_URL}/api/user/${userID}/saved-routes/status/${routeId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 404) {
            return false;
        }

        if (!response.ok) {
            throw new Error(`Failed to check saved status (Status: ${response.status})`);
        }
        
        const data = await response.json(); 
        return data.is_saved;

    } catch (error) {
        console.error("Error checking saved status:", error);
        return false;
    }
};

// FETCH DE CIUDADES Y RUTAS

export const getCities = async () => {
  try {
    const response = await fetch (`${API_URL}/api/cities`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json()

    if (!response.ok) {
      throw new Error("Error fetching cities");
    }

    return data;
  } catch (error) {
    console.error("Error getting cities:", error);
    throw error;
  }
}

export const getCityById = async (cityId) => {
  try {
    const response = await fetch (`${API_URL}/api/cities/${cityId}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json()

    if (!response.ok) {
      throw new Error("Error fetching cities");
    }

    return data;
  } catch (error) {
    console.error("Error getting cities:", error);
    throw error;
  }
}


export const getRouteById = async (RouteId) => {
  try {
    const response = await fetch (`${API_URL}/api/routes/${RouteId}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json()

    if (!response.ok) {
      throw new Error("Error fetching route");
    }

    return data;
  } catch (error) {
    console.error("Error getting route:", error);
    throw error;
  }
}

export const getRoutesByCityId = async (cityId) => {
  try {
    const response = await fetch (`${API_URL}/api/cities/${cityId}/routes`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json()

    if (!response.ok) {
      throw new Error("Error fetching routes");
    }

    return data;
  } catch (error) {
    console.error("Error getting routes:", error);
    throw error;
  }
}
