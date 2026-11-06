import { api } from "../lib/api";
import type { ApiSuccess } from "../types/api";
import type { RegisterBusinessPayload, RegisterBusinessResult } from "../types/business";

export const registerBusiness = async (
  payload: RegisterBusinessPayload,
): Promise<RegisterBusinessResult> => {
  const { data } = await api.post<ApiSuccess<RegisterBusinessResult>>("/businesses", payload);
  return data.data;
};
