export type CurrencyCode = "USD" | "ARS";

export interface RegisterBusinessPayload {
  owner: {
    fullName: string;
    email: string;
    password: string;
    takesAppointments: boolean;
  };
  business: {
    name: string;
    slug: string;
  };
  location: {
    name: string;
    timezone: string;
    currencyCode: CurrencyCode;
    addressLine1?: string;
    city?: string;
    countryCode?: string;
    phoneE164?: string;
  };
}

export interface RegisterBusinessResult {
  token: string;
  user: { id: string; email: string };
  tenant: { id: string; name: string; slug: string };
  location: { id: string; name: string };
}
