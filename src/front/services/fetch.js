const API_URL = "https://supreme-fiesta-pvqxx5xx66c4gr-3001.app.github.dev/api";
// User Register
export const register = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Error to Registre");
    }

    return data;
  } catch (error) {
    console.error("Error to register:", error);
    throw error;
  }
};

// Login de usuario
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Error to login");
    }


    if (!data.token) {
      throw new Error("no Token");
    }


    localStorage.setItem("token", data.token);

    return data; 
  } catch (error) {
    console.error("Error en login:", error);
    throw error; 
  }
};


export const getProfile = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Not Authorized or invalid token ⛔");

    const data = await response.json();
    dispatch({ type: "set_perfilUsuario", payload: data });
    return data;
  } catch (error) {
    console.error("Error en getProfile:", error);
    throw error;
  }
};