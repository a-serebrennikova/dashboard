import {
  createIncidentInputSchema,
  serviceSchema,
  type CreateIncidentInput,
  type Service,
} from "@package/dashboard-shared/dashboard";

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = await response.json();

    if (typeof body === "object" && body !== null && "error" in body) {
      const candidate = body.error;

      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return candidate;
      }
    }
  } catch {
    // Fall back to a generic message when the server response is not valid JSON.
  }

  return "Failed to create incident";
};

export const fetchServices = async (
  baseUrl: string,
  signal?: AbortSignal,
): Promise<Service[]> => {
  const response = await fetch(`${baseUrl}/api/services`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load services (${response.status})`);
  }

  const payload = await response.json();
  return serviceSchema.array().parse(payload);
};

export const createIncident = async (
  baseUrl: string,
  input: CreateIncidentInput,
): Promise<void> => {
  const payload = createIncidentInputSchema.parse(input);

  const response = await fetch(`${baseUrl}/api/incidents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await readErrorMessage(response);
    throw new Error(errorMessage);
  }
};
