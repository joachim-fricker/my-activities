const API_BASE_URL = 'http://localhost:3000/api'

const request = async (endpoint, options = {}, toast = null, showSuccess = false) => {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const message = errorData.message || `Fehler ${response.status}`
      toast.error("Daten konnten nicht geladen werden:",errorData.message);
      throw new Error(message)
    }

    const data = await response.json()
    if (showSuccess && toast) toast.success('Erfolgreich geladen!')
    return data
  } catch (error) {
    if (toast) toast.error(`Fehlgeschlagen: ${error.message}`)
    throw error
  }
}

export const ApiService = {
  getAllTracks: (toast) => request('/allTracks', {}, toast),
  getTrack: (id, toast) => request(`/tracks/${id}`, {}, toast),
  getSummary: (toast) => request('/summary', {}, toast),
  getYearSummary: (toast) => request('/yearSummary', {}, toast),
  createTrack: (trackData, toast) =>
    request('/tracks', {
      method: 'POST',
      body: JSON.stringify(trackData)
    }, toast, true)
}
