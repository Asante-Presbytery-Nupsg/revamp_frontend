import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export type EventType =
  | "conference"
  | "rally"
  | "prayer"
  | "bible-study"
  | "other";
export type EventStatus = "upcoming" | "completed" | "cancelled";

export interface EventAttendee {
  id: string;
  initials: string;
}

export interface NupsgEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: string;
  time: string;
  location: string;
  image: string | null; // ← added
  regionId: string;
  presbyteryId: string;
  attendanceCap: number;
  registered: number;
  attendees: EventAttendee[]; // ← added
  isRegistered: boolean; // ← added
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string | null;
  guestFirstName: string | null;
  guestLastName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  registeredAt: string;
}

export interface EventQuery {
  search?: string;
  status?: EventStatus;
  type?: EventType;
  regionId?: string;
  presbyteryId?: string;
  page?: number;
  limit?: number;
}

export interface CreateEventInput {
  title: string;
  description: string;
  type: EventType;
  status?: EventStatus;
  date: string;
  time: string;
  location: string;
  regionId: string;
  presbyteryId: string;
  attendanceCap: number;
  image?: string;
}

export type UpdateEventInput = Partial<CreateEventInput>;

export interface GuestRegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getEvents = async (
  query: EventQuery = {},
): Promise<PaginatedResponse<NupsgEvent>> => {
  const { data } = await BASE_API.get<PaginatedResponse<NupsgEvent>>(
    "/events",
    {
      params: query,
    },
  );
  return data;
};

export const getEventById = async (id: string): Promise<NupsgEvent> => {
  const { data } = await BASE_API.get<ApiResponse<NupsgEvent>>(`/events/${id}`);
  return data.data;
};

export const getEventRegistrations = async (
  eventId: string,
): Promise<EventRegistration[]> => {
  const { data } = await BASE_API.get<ApiResponse<EventRegistration[]>>(
    `/events/${eventId}/registrations`,
  );
  return data.data;
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createEvent = async (
  input: CreateEventInput,
): Promise<NupsgEvent> => {
  const { data } = await BASE_API.post<ApiResponse<NupsgEvent>>(
    "/events",
    input,
  );
  return data.data;
};

const toFormData = (
  input: CreateEventInput | UpdateEventInput,
  file?: File,
) => {
  const fd = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      fd.append(key, String(value));
    }
  });
  if (file) fd.append("image", file);
  return fd;
};

export const createEventWithImage = async (
  input: CreateEventInput,
  file?: File,
): Promise<NupsgEvent> => {
  const { data } = await BASE_API.post<ApiResponse<NupsgEvent>>(
    "/events",
    toFormData(input, file),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
};

export const updateEventWithImage = async (
  id: string,
  input: UpdateEventInput,
  file?: File,
): Promise<NupsgEvent> => {
  const { data } = await BASE_API.patch<ApiResponse<NupsgEvent>>(
    `/events/${id}`,
    toFormData(input, file),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
};

export const updateEvent = async (
  id: string,
  input: UpdateEventInput,
): Promise<NupsgEvent> => {
  const { data } = await BASE_API.patch<ApiResponse<NupsgEvent>>(
    `/events/${id}`,
    input,
  );
  return data.data;
};

export const markEventCompleted = async (id: string): Promise<NupsgEvent> => {
  const { data } = await BASE_API.patch<ApiResponse<NupsgEvent>>(
    `/events/${id}/complete`,
  );
  return data.data;
};

export const cancelEvent = async (id: string): Promise<NupsgEvent> => {
  const { data } = await BASE_API.patch<ApiResponse<NupsgEvent>>(
    `/events/${id}/cancel`,
  );
  return data.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await BASE_API.delete(`/events/${id}`);
};

// ─── Registrations ────────────────────────────────────────────────────────────

export const registerForEvent = async (
  eventId: string,
  guest?: GuestRegistrationInput,
): Promise<EventRegistration> => {
  const { data } = await BASE_API.post<ApiResponse<EventRegistration>>(
    `/events/${eventId}/register`,
    guest ?? {},
  );
  return data.data;
};

export const unregisterFromEvent = async (eventId: string): Promise<void> => {
  await BASE_API.delete(`/events/${eventId}/register`);
};
