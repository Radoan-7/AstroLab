const NASA_API_KEY = 'ecG1ia9eClYkh0VZEBxWkY8u8AuSUOYCXshDhsdx';

export interface EarthImageryData {
  imageUrl: string;
  date: string;
  cloudScore: number;
}

export async function fetchEarthImagery(
  lat: number,
  lon: number,
  date?: string
): Promise<EarthImageryData> {
  try {
    const dateParam = date ? `&date=${date}` : '';
    const url = `https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&dim=0.15${dateParam}&api_key=${NASA_API_KEY}`;
    
    const response = await fetch(url);

    // The Imagery API sometimes returns binary image data directly,
    // sometimes JSON with metadata. Handle both cases.
    if (response.headers.get("content-type")?.includes("application/json")) {
      const data = await response.json();

      return {
        imageUrl: data.url,
        date: data.date,
        cloudScore: data.cloud_score || 0,
      };
    } else {
      // If it's an image, just return the image URL
      return {
        imageUrl: url,
        date: date || new Date().toISOString().split("T")[0],
        cloudScore: 0,
      };
    }
  } catch (error) {
    console.error("NASA Earth Imagery API error:", error);

    // Fallback placeholder
    return {
      imageUrl:
        "https://via.placeholder.com/512x512/1a1a1a/FFD700?text=Earth+Impact+Site",
      date: date || new Date().toISOString().split("T")[0],
      cloudScore: 0.2,
    };
  }
}

// ==========================================
// BACKGROUND TEXTURE LOADER
// ==========================================
export interface BackgroundTexture {
  textureUrl: string;
  description: string;
}

export async function fetchBackgroundTexture(
  threatLevel: "SAFE" | "WARNING" | "CRITICAL"
): Promise<BackgroundTexture> {
  // For now, still placeholder. Later you can swap with NASA EPIC / GIBS
  const textures = {
    SAFE: {
      textureUrl:
        "https://via.placeholder.com/1920x1080/000011/ffffff?text=SAFE+SPACE",
      description: "Calm starfield with Earth in distance",
    },
    WARNING: {
      textureUrl:
        "https://via.placeholder.com/1920x1080/110000/ff0000?text=WARNING",
      description: "Red nebula approaching Earth",
    },
    CRITICAL: {
      textureUrl:
        "https://via.placeholder.com/1920x1080/220000/ffff00?text=CRITICAL",
      description: "Asteroid collision course",
    },
  };

  return textures[threatLevel];
}
