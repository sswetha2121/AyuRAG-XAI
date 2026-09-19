/**
 * AyuRAG-XAI Central API Service
 * Handles communication with Django Clinical Backend with role-based authentication.
 */

const BASE_URL = '/api';

async function fetchJson(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important: sends Django session cookies
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401 || response.status === 403) {
    const errorData = await response.json().catch(() => ({ detail: 'Authentication error' }));
    const error = new Error(errorData.detail || errorData.error || 'Unauthorized');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Server error' }));
    const error = new Error(errorData.detail || errorData.error || `HTTP error ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

export const api = {
  // Authentication & Session
  async getAuthMe() {
    return fetchJson('/auth/me/');
  },

  async login(username, password) {
    return fetchJson('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout() {
    return fetchJson('/auth/logout/', {
      method: 'POST',
    });
  },

  async switchDemo(role) {
    return fetchJson('/auth/demo-switch/', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },

  // Doctor Clinical Dashboard & Patients
  async getDoctorDashboard() {
    return fetchJson('/doctor/dashboard/');
  },

  async getDoctorPatients(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.prakriti) query.set('prakriti', params.prakriti);
    if (params.review_status) query.set('review_status', params.review_status);
    if (params.sort) query.set('sort', params.sort);
    
    const qs = query.toString();
    return fetchJson(`/doctor/patients/${qs ? `?${qs}` : ''}`);
  },

  async getDoctorPatientDetail(patientId) {
    return fetchJson(`/doctor/patients/${patientId}/`);
  },

  // Clinical Reviews
  async getDoctorReviews(statusFilter = '') {
    const qs = statusFilter ? `?status=${statusFilter}` : '';
    return fetchJson(`/doctor/reviews/${qs}`);
  },

  async getDoctorReviewDetail(reviewId) {
    return fetchJson(`/doctor/reviews/${reviewId}/`);
  },

  async createDoctorReview(reviewData) {
    return fetchJson('/doctor/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  async updateDoctorReview(reviewId, updateData) {
    return fetchJson(`/doctor/reviews/${reviewId}/`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  },

  // Reports
  async getDoctorReports() {
    return fetchJson('/doctor/reports/');
  },
};
