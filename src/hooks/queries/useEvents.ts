import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  markEventCompleted,
  cancelEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventRegistrations,
} from "@/api/events.api";
import type {
  EventQuery,
  CreateEventInput,
  UpdateEventInput,
} from "@/api/events.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const extractError = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? error.message ?? fallback)
    : fallback;

// ── queries ───────────────────────────────────────────────────────────────────

export const useEvents = (query: EventQuery = {}) =>
  useQuery({
    queryKey: queryKeys.events.all(query),
    queryFn: () => getEvents(query),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useEvent = (id: string) =>
  useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => getEventById(id),
    enabled: !!id,
  });

export const useEventRegistrations = (eventId: string) =>
  useQuery({
    queryKey: queryKeys.events.registrations(eventId),
    queryFn: () => getEventRegistrations(eventId),
    enabled: !!eventId,
  });

// ── mutations ─────────────────────────────────────────────────────────────────

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEventInput) => createEvent(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      toast.success("Event created");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to create event")),
  });
};

export const useUpdateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEventInput }) =>
      updateEvent(id, input),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(id) });
      toast.success("Event updated");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to update event")),
  });
};

export const useMarkEventCompleted = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markEventCompleted(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(id) });
      toast.success("Event marked as completed");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to mark event completed")),
  });
};

export const useCancelEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelEvent(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(id) });
      toast.success("Event cancelled");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to cancel event")),
  });
};

export const useDeleteEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      toast.success("Event deleted");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to delete event")),
  });
};

export const useRegisterForEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      guest,
    }: {
      eventId: string;
      guest?: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
      };
    }) => registerForEvent(eventId, guest),
    onSuccess: (_data, { eventId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      qc.invalidateQueries({
        queryKey: queryKeys.events.registrations(eventId),
      });
      toast.success("Registered for event");
    },
    onError: (error) => toast.error(extractError(error, "Failed to register")),
  });
};

export const useUnregisterFromEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => unregisterFromEvent(eventId),
    onSuccess: (_data, eventId) => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all() });
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      qc.invalidateQueries({
        queryKey: queryKeys.events.registrations(eventId),
      });
      toast.success("Unregistered from event");
    },
    onError: (error) =>
      toast.error(extractError(error, "Failed to unregister")),
  });
};
