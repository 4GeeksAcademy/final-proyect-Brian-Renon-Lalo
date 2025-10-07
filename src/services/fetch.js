const BASE_URL=""//poner url base


//REGISTER
export const register = async (email, password) => {
    try {
        const response = await fetch (`${BASE_URL}/register`,
            {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({email,password}),
            });

            const data = await response.JSON();

            if (!response.ok) {
                throw new Error (data.msg || "Register error");
            }

            return data;
    }
    catch (error) {
        console.error("Error trying in the register:",error);
        throw error;
    }
};

//LOGIN
export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Error en el login");
    }

    if (!data.token) {
      throw new Error("No se recibió token del servidor");
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

    if (!response.ok) throw new Error("No autorizado o token inválido ❌");

    const data = await response.json();
    dispatch({ type: "set_perfilUsuario", payload: data });
    return data;
  } catch (error) {
    console.error("Error en getProfile:", error);
    throw error;
  }
};