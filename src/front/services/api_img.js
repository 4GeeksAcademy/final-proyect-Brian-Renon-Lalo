const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export const getCityImageFromPexels = async (cityName) => {
    if (!PEXELS_API_KEY) {
        console.warn("PEXELS_API_KEY no definida. Usando imagen placeholder.");
        return null;
    }

    const query = `${cityName} skyline`;
    const apiUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=medium&per_page=1`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": PEXELS_API_KEY, 
            },
        });

        if (!response.ok) {
            console.error(`Error de Pexels: ${response.status} - ${response.statusText}`);
            return null; 
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.medium; 
        }

        return null;
    } catch (error) {
        console.error("Error al buscar imagen de Pexels:", error);
        return null;
    }
};

export const getPlaceImageFromPexels = async (placeName) => {
    if (!PEXELS_API_KEY) {
        console.warn("PEXELS_API_KEY no definida.");
        return null;
    }

    const query = `${placeName}`; 
    const apiUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&size=medium&per_page=1`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": PEXELS_API_KEY, 
            },
        });

        if (!response.ok) {
            console.error(`Error de Pexels: ${response.status} - ${response.statusText}`);
            return null; 
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.medium; 
        }

        return null;
    } catch (error) {
        console.error("Error al buscar imagen de lugar:", error);
        return null;
    }
};