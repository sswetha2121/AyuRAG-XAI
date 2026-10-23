/**
 * AyuRAG-XAI Central API Service
 * Handles communication with Django Clinical Backend with role-based authentication.
 */

const BASE_URL = (import.meta.env?.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

function getCsrfToken() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function extractErrorMessage(data, defaultMsg) {
  if (!data) return defaultMsg;
  if (typeof data.error === 'string') return data.error;
  if (typeof data.detail === 'string') return data.detail;
  if (typeof data === 'object') {
    const messages = [];
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (Array.isArray(val)) {
        messages.push(`${key}: ${val.join(' ')}`);
      } else if (typeof val === 'string') {
        messages.push(`${key}: ${val}`);
      }
    }
    if (messages.length > 0) return messages.join(' | ');
  }
  return defaultMsg;
}

async function fetchJson(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken && !headers['X-CSRFToken']) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }

  // Set timeout controller (35 seconds for complex clinical RAG / AI inference)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 35000);

  const config = {
    ...options,
    headers,
    signal: options.signal || controller.signal,
    credentials: 'include', // Sends Django session cookies
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (netErr) {
    clearTimeout(timeoutId);
    if (netErr.name === 'AbortError') {
      const error = new Error('Clinical backend request timed out. The AI inference service took too long to respond.');
      error.status = 504;
      throw error;
    }
    const error = new Error('Cannot connect to backend server. Please verify the Django API server is active and running on port 8000.');
    error.status = 503;
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401 || response.status === 403) {
    const errorData = await response.json().catch(() => ({ detail: 'Authentication error' }));
    const error = new Error(extractErrorMessage(errorData, response.status === 401 ? 'Authentication required' : 'Access denied'));
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => {
      if (response.status === 502 || response.status === 503 || response.status === 504) {
        return { detail: 'Backend service unavailable (gateway error). Please verify the Django server is running at http://127.0.0.1:8000.' };
      }
      if (response.status === 404) {
        return { detail: `Endpoint not found: ${endpoint}. Please verify API routing.` };
      }
      if (response.status >= 500) {
        return { detail: 'Backend service error. Please verify the Django server is active and reachable.' };
      }
      return { detail: `Request failed with HTTP status ${response.status}.` };
    });
    const error = new Error(extractErrorMessage(errorData, `HTTP error ${response.status}`));
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

  async updateProfile(profileData) {
    return fetchJson('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },


  async login(username, password) {
    return fetchJson('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async doctorLogin(username, password) {
    return fetchJson('/auth/doctor-login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async doctorRegister(doctorData) {
    return fetchJson('/auth/doctor-register/', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  },

  async register(patientData) {
    return fetchJson('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(patientData),
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

  // Clinical Verification Workflow
  async getPatientVerifications(patientId) {
    return fetchJson(`/doctor/patients/${patientId}/verification/`);
  },

  async verifyPatientField(patientId, { field_name, action, verified_value, doctor_note }) {
    return fetchJson(`/doctor/patients/${patientId}/verify-field/`, {
      method: 'POST',
      body: JSON.stringify({ field_name, action, verified_value, doctor_note }),
    });
  },

  async verifyAllFields(patientId) {
    return fetchJson(`/doctor/patients/${patientId}/verify-all/`, {
      method: 'POST',
    });
  },

  // Diet Plan Generation & Management
  async generateDietPlan(patientId) {
    return fetchJson(`/doctor/patients/${patientId}/diet/generate/`, {
      method: 'POST',
    });
  },

  async getPatientDietPlans(patientId) {
    return fetchJson(`/doctor/patients/${patientId}/diet-plans/`);
  },

  async getDietPlanDetail(planId) {
    return fetchJson(`/doctor/diet-plans/${planId}/`);
  },

  async updateDietPlan(planId, planData) {
    return fetchJson(`/doctor/diet-plans/${planId}/`, {
      method: 'PATCH',
      body: JSON.stringify(planData),
    });
  },

  async approveDietPlan(planId, approvalData = {}) {
    return fetchJson(`/doctor/diet-plans/${planId}/approve/`, {
      method: 'POST',
      body: JSON.stringify(approvalData),
    });
  },

  async rejectDietPlan(planId, reason = '') {
    return fetchJson(`/doctor/diet-plans/${planId}/reject/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async getPatientAuditLogs(patientId) {
    return fetchJson(`/doctor/patients/${patientId}/audit-logs/`);
  },

  async recordPatientAuditLog(patientId, { action, metadata = {} }) {
    return fetchJson(`/doctor/patients/${patientId}/audit-logs/`, {
      method: 'POST',
      body: JSON.stringify({ action, metadata }),
    });
  },

  // Patient Isolated Diet Plan & Assessment
  async getPatientCurrentDiet() {
    return fetchJson('/patient/diet/current/');
  },

  async getPatientDietHistory() {
    return fetchJson('/patient/diet/history/');
  },

  // AI Inference & Explainability Engine
  async runAiInference(payload) {
    return fetchJson('/clinical/ai/infer/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async submitPatientAssessment(payload) {
    return fetchJson('/patient/assessment/submit/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getPatientLatestAssessment() {
    return fetchJson('/patient/assessment/latest/');
  },

  // Grounded Clinical Knowledge Base & RAG Query
  async queryKnowledgeBase(question, prakriti = '', collection = null) {
    return fetchJson('/clinical/rag/query/', {
      method: 'POST',
      body: JSON.stringify({ question, prakriti, collection }),
    });
  },

  async getKnowledgeBaseStats() {
    return fetchJson('/clinical/rag/stats/');
  },

  async getPatientAssessmentHistory() {
    return fetchJson('/patient/assessment/history/');
  },

  async getPatientAssessmentDetail(assessmentId) {
    return fetchJson(`/patient/assessment/${assessmentId}/`);
  },

  async retryPatientAssessmentAnalysis(assessmentId) {
    return fetchJson(`/patient/assessment/${assessmentId}/retry-analysis/`, {
      method: 'POST',
    });
  },

  // Daily Meal Schedule & Tracking
  async getPatientMealSchedule(date = '') {
    const qs = date ? `?date=${date}` : '';
    return fetchJson(`/patient/meal-schedule/${qs}`);
  },

  async logPatientMeal(payload) {
    return fetchJson('/patient/meal-schedule/log/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Reminder Preferences
  async getPatientReminders() {
    return fetchJson('/patient/reminders/');
  },

  async updatePatientReminders(preferences) {
    return fetchJson('/patient/reminders/', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  },

  // Water Intake Tracking
  async logPatientWater(amountMl = 250, action = 'add') {
    return fetchJson('/patient/water/log/', {
      method: 'POST',
      body: JSON.stringify({ amount_ml: amountMl, action }),
    });
  },

  // Progress Metrics
  async getPatientProgress() {
    return fetchJson('/patient/progress/');
  },

  // Patient Diet Difficulty Reporting
  async reportPatientDifficulty(payload) {
    return fetchJson('/patient/diet/report-difficulty/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Doctor Patient Assignment
  async assignDoctorPatient(patientId, notes = '') {
    return fetchJson(`/doctor/patients/${patientId}/assign/`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },

  async unassignDoctorPatient(patientId) {
    return fetchJson(`/doctor/patients/${patientId}/unassign/`, {
      method: 'POST',
    });
  },

  // Food Catalogue & Nutritional Recalculation
  async getFoodCatalogue(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.dietary_preference) query.set('dietary_preference', params.dietary_preference);
    const qs = query.toString();
    return fetchJson(`/doctor/food-catalogue/${qs ? `?${qs}` : ''}`);
  },

  async getFoodSubstitutes(foodId) {
    return fetchJson(`/doctor/food-substitutes/?food_id=${foodId}`);
  },

  async recalculateDietPlan(planId, payload) {
    return fetchJson(`/doctor/diet-plans/${planId}/recalculate/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async supersedeDietPlan(planId, reason = '') {
    return fetchJson(`/doctor/diet-plans/${planId}/supersede/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Doctor Monitoring Dashboard & Patient Details
  async getDoctorMonitoring(params = {}) {
    const query = new URLSearchParams();
    if (params.patient_id) query.set('patient_id', params.patient_id);
    if (params.adherence_status) query.set('adherence_status', params.adherence_status);
    if (params.has_difficulties !== undefined && params.has_difficulties !== '') {
      query.set('has_difficulties', params.has_difficulties);
    }
    if (params.date) query.set('date', params.date);
    const qs = query.toString();
    return fetchJson(`/doctor/monitoring/${qs ? `?${qs}` : ''}`);
  },

  async getDoctorPatientMonitoring(patientId, days = 7) {
    return fetchJson(`/doctor/monitoring/${patientId}/?days=${days}`);
  },

  async reviewDifficultyReport(reportId, doctorNotes = '') {
    return fetchJson(`/doctor/monitoring/difficulty/${reportId}/review/`, {
      method: 'PATCH',
      body: JSON.stringify({ doctor_notes: doctorNotes }),
    });
  },

  // Patient-Doctor Persistent Messaging
  async getConversations() {
    return fetchJson('/messages/conversations/');
  },

  async getConversationMessages(userId) {
    return fetchJson(`/messages/${userId}/`);
  },

  async sendMessage(recipientId, body) {
    return fetchJson('/messages/send/', {
      method: 'POST',
      body: JSON.stringify({ recipient_id: recipientId, body }),
    });
  },

  // Notifications
  async getNotifications() {
    return fetchJson('/notifications/');
  },

  async markNotificationRead(notificationId) {
    return fetchJson(`/notifications/${notificationId}/read/`, {
      method: 'PATCH',
    });
  },

  async markAllNotificationsRead() {
    return fetchJson('/notifications/mark-all-read/', {
      method: 'POST',
    });
  },
};



