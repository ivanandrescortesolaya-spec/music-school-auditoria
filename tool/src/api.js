
import { config } from './config.js';

export async function apiRequest(endpoint, options = {}) {
  const url = `${config.apiBaseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...config.headers,
        ...options.headers
      }
    });

    const responseText = await response.text();

    let data = {};

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `La API respondió con un formato no válido. HTTP ${response.status}`
        );
      }
    }

    if (!response.ok) {
      const error = new Error(
        data.mensaje || `Error HTTP ${response.status}`
      );

      error.status = response.status;
      error.data = data;

      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }

    throw new Error(
      `No fue posible conectar con la API: ${error.message}`
    );
  }
}
