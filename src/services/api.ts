const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

interface ApiError {
  status?: number;
  message?: string;
}

interface Business {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

interface Agent {
  id: string;
  name: string;
  prompt: string;
  business_id: string;
  system_prompt: string | null;
  status: string;
  whatsapp_connected: boolean;
  whatsapp_instance_id: string | null;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    plan: string;
    plan_expires_at?: string;
  };
  message?: string;
}

/**
 * Helper para fazer requisições autenticadas
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: response.statusText,
    };

    try {
      const errorData = await response.json();
      error.message = errorData.message || errorData.error || response.statusText;
    } catch (e) {
      // Ignora erros de parsing do JSON
    }

    // Trial expirado — dispara evento global para o AuthContext recarregar
    if (response.status === 402) {
      window.dispatchEvent(new CustomEvent('trial-expired'));
    }

    throw error;
  }

  return response.json();
}

/**
 * GET /businesses/mine - Buscar negócio do usuário
 */
export async function getBusinesses(): Promise<Business[]> {
  const business = await fetchWithAuth('/businesses/mine');
  // backend retorna objeto único, normaliza para array
  return business ? [business] : [];
}

/**
 * POST /businesses - Criar novo negócio
 */
export async function createBusiness(data: { name: string; [key: string]: any }): Promise<Business> {
  return fetchWithAuth('/businesses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH /businesses/:id - Atualizar negócio existente
 */
export async function updateBusiness(id: string, data: { [key: string]: any }): Promise<Business> {
  return fetchWithAuth(`/businesses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * GET /agents - Listar agentes do usuário
 */
export async function getAgents(): Promise<Agent[]> {
  return fetchWithAuth('/agents');
}

/**
 * POST /agents - Criar novo agente
 */
export async function createAgent(data: {
  name: string;
  type: 'sdr' | 'attendant' | 'followup';
  business_id: string;
  system_prompt?: string;
  objectives?: string[];
  lead_action?: string;
}): Promise<Agent> {
  return fetchWithAuth('/agents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PATCH /agents/:id - Atualizar agente existente
 */
export async function updateAgent(id: string, data: { name?: string; system_prompt?: string; type?: string; objectives?: string[]; lead_action?: string }): Promise<Agent> {
  return fetchWithAuth(`/agents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Helper: Criar ou reutilizar agente existente
 * Evita erro 402 de "Limite de agentes do plano atingido"
 */
export async function createOrGetAgent(data: {
  name: string;
  type: 'sdr' | 'attendant' | 'followup';
  business_id: string;
  system_prompt?: string;
  objectives?: string[];
  lead_action?: string;
}): Promise<Agent> {
  try {
    return await createAgent(data);
  } catch (err: any) {
    // Plano atingiu o limite — reutiliza o agente existente
    if (err.status === 402 || (err.message && err.message.includes('Limite'))) {
      const agents = await getAgents();
      if (agents.length === 0) throw err;

      // Atualiza o agente existente com os novos dados do wizard
      const existing = agents[0];
      try {
        return await updateAgent(existing.id, {
          name: data.name,
          system_prompt: data.system_prompt,
          objectives: data.objectives,
          lead_action: data.lead_action,
        });
      } catch {
        return existing; // se PATCH falhar, usa o agente sem atualizar
      }
    }
    throw err;
  }
}

/**
 * POST /auth/signup - Criar nova conta
 */
export async function signup(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: response.statusText,
    };

    try {
      const errorData = await response.json();
      error.message = errorData.message || errorData.error || response.statusText;
    } catch (e) {
      // Ignora erros de parsing do JSON
    }

    throw error;
  }

  const data = await response.json();

  // Salva token no localStorage
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }

  return data;
}

/**
 * POST /auth/login - Fazer login
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: response.statusText,
    };

    try {
      const errorData = await response.json();
      error.message = errorData.message || errorData.error || response.statusText;
    } catch (e) {
      // Ignora erros de parsing do JSON
    }

    throw error;
  }

  const data = await response.json();

  // Salva token no localStorage
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }

  return data;
}

/**
 * POST /auth/logout - Fazer logout
 */
export async function logout(): Promise<void> {
  localStorage.removeItem('access_token');
}

/**
 * Helper: Criar ou atualizar negócio (lida com erro 409)
 */
export async function createOrUpdateBusiness(businessData: { name: string; [key: string]: any }): Promise<string> {
  try {
    // Tenta criar novo negócio
    const business = await createBusiness(businessData);
    return business.id;
  } catch (err: any) {
    if (err.status === 409) {
      // Negócio já existe, buscar o existente
      console.log('[API] Negócio já existe (409), buscando existente...');
      const businesses = await getBusinesses();

      if (businesses.length === 0) {
        throw new Error('Negócio não encontrado após erro 409');
      }

      // Retorna ID do primeiro negócio (assumindo que é do usuário atual)
      const businessId = businesses[0].id;
      console.log(`[API] Usando negócio existente: ${businessId}`);

      // Opcional: atualizar dados do negócio existente
      await updateBusiness(businessId, businessData);

      return businessId;
    } else {
      // Outro erro, propagar
      throw err;
    }
  }
}

// ─── WhatsApp ────────────────────────────────────────────────────────────────

interface WhatsAppInstance {
  instance_id: string;
  qr_code: string;        // data:image/png;base64,...
  message: string;
  status: 'pending' | 'connected' | 'disconnected';
}

interface WhatsAppStatus {
  connected: boolean;
  phone: string | null;
  status: 'pending' | 'connected' | 'disconnected';
  agent_id: string;
  agent_status: string;
}

/**
 * POST /whatsapp/create-instance — Cria instância e retorna QR code
 */
export async function createWhatsAppInstance(agentId: string): Promise<WhatsAppInstance> {
  return fetchWithAuth('/whatsapp/create-instance', {
    method: 'POST',
    body: JSON.stringify({ agent_id: agentId }),
  });
}

/**
 * GET /whatsapp/status/:instance_id — Verifica se WhatsApp conectou
 */
export async function getWhatsAppStatus(instanceId: string): Promise<WhatsAppStatus> {
  return fetchWithAuth(`/whatsapp/status/${instanceId}`);
}

/**
 * POST /whatsapp/reconnect/:agent_id — Gera novo QR code
 */
export async function reconnectWhatsApp(agentId: string): Promise<WhatsAppInstance> {
  return fetchWithAuth(`/whatsapp/reconnect/${agentId}`, { method: 'POST' });
}

// ─── Métricas ─────────────────────────────────────────────────────────────────

interface DailyMetric {
  date: string;
  messages_sent: number;
  messages_received: number;
  leads_identified: number;
  appointments: number;
}

export interface AgentMetrics {
  metrics: DailyMetric[];
  totals: {
    messages_sent: number;
    messages_received: number;
    leads_identified: number;
    appointments: number;
  };
  period_days: number;
}

/**
 * GET /agents/:id/metrics — Métricas do agente (últimos N dias)
 */
export async function getAgentMetrics(agentId: string, days = 7): Promise<AgentMetrics> {
  return fetchWithAuth(`/agents/${agentId}/metrics?days=${days}`);
}

/**
 * PATCH /auth/me - Atualizar email
 */
export async function updateEmail(email: string): Promise<{ user: { id: string; email: string; plan: string } }> {
  return fetchWithAuth('/auth/me', { method: 'PATCH', body: JSON.stringify({ email }) });
}

/**
 * PATCH /auth/password - Alterar senha
 */
export async function updatePassword(current_password: string, new_password: string): Promise<{ message: string }> {
  return fetchWithAuth('/auth/password', { method: 'PATCH', body: JSON.stringify({ current_password, new_password }) });
}

// ─── Conversas ────────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  agent_id: string;
  contact_phone: string;
  contact_name?: string;
  status: 'active' | 'closed' | 'handoff';
  lead_score: number;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'contact' | 'agent' | 'system';
  content: string;
  tokens_used: number;
  created_at: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

/**
 * GET /conversations - Listar conversas do agente
 */
export async function getConversations(params: {
  agent_id: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ConversationsResponse> {
  const qs = new URLSearchParams({ agent_id: params.agent_id });
  if (params.status) qs.set('status', params.status);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  return fetchWithAuth(`/conversations?${qs}`);
}

/**
 * GET /conversations/:id/messages - Mensagens de uma conversa
 */
export async function getConversationMessages(conversationId: string): Promise<{
  conversation: Conversation;
  messages: Message[];
}> {
  return fetchWithAuth(`/conversations/${conversationId}/messages`);
}

/**
 * PATCH /conversations/:id - Atualizar status da conversa
 */
export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'closed' | 'handoff'
): Promise<{ conversation: Conversation; message: string }> {
  return fetchWithAuth(`/conversations/${conversationId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ─── Google Calendar ──────────────────────────────────────────────────────────

export interface GoogleCalendar {
  id: string;
  name: string;
  primary: boolean;
  access_role: string;
}

export async function getGoogleCalendarAuthUrl(): Promise<{ auth_url: string }> {
  return fetchWithAuth('/google-calendar/auth-url');
}

export async function getGoogleCalendarStatus(): Promise<{ connected: boolean; email: string | null }> {
  return fetchWithAuth('/google-calendar/status');
}

export async function getGoogleCalendars(): Promise<{ calendars: GoogleCalendar[] }> {
  return fetchWithAuth('/google-calendar/calendars');
}

export async function saveGoogleCalendar(agentId: string, data: { calendar_id: string; calendar_name: string }): Promise<{ success: boolean }> {
  return fetchWithAuth(`/google-calendar/agents/${agentId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function removeGoogleCalendar(agentId: string): Promise<{ success: boolean }> {
  return fetchWithAuth(`/google-calendar/agents/${agentId}`, { method: 'DELETE' });
}

// ─── Cal.com ──────────────────────────────────────────────────────────────────

export interface CalcomEventType {
  id: number;
  slug: string;
  title: string;
  length: number;
  description?: string;
}

export async function getCalcomEventTypes(): Promise<{ event_types: CalcomEventType[] }> {
  return fetchWithAuth('/calcom/event-types');
}

export async function saveCalcomIntegration(agentId: string, data: { event_type_id: number; event_type_slug: string }): Promise<{ success: boolean }> {
  return fetchWithAuth(`/calcom/agents/${agentId}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function removeCalcomIntegration(agentId: string): Promise<{ success: boolean }> {
  return fetchWithAuth(`/calcom/agents/${agentId}`, { method: 'DELETE' });
}

// ─── Billing ──────────────────────────────────────────────────────────────────

/**
 * POST /billing/checkout - Criar sessão de checkout Stripe
 */
export async function createStripeCheckout(plan: 'starter' | 'pro' | 'business'): Promise<{ checkout_url: string }> {
  return fetchWithAuth('/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
}

/**
 * POST /billing/portal - Abrir portal do cliente Stripe
 */
export async function createStripePortal(): Promise<{ portal_url: string }> {
  return fetchWithAuth('/billing/portal', { method: 'POST' });
}

export default {
  signup,
  login,
  logout,
  getBusinesses,
  createBusiness,
  updateBusiness,
  createAgent,
  createOrUpdateBusiness,
  createWhatsAppInstance,
  getWhatsAppStatus,
  reconnectWhatsApp,
};
