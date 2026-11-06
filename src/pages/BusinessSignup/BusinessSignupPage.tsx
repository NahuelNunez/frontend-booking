import { useState, type ReactNode } from "react";
import axios from "axios";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { registerBusiness } from "../../services/businessService";
import { isApiErrorBody } from "../../types/api";
import type { CurrencyCode, RegisterBusinessPayload, RegisterBusinessResult } from "../../types/business";
import { slugify } from "../../utils/slugify";
import { FormField } from "./FormField";
import { inputClassName } from "./inputStyles";

interface SignupFormValues {
  owner: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
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
    addressLine1: string;
    city: string;
    countryCode: string;
    phone: string;
  };
}

// API error paths -> form inputs, so server messages land on the right field.
const SERVER_FIELDS: Record<string, FieldPath<SignupFormValues>> = {
  "owner.fullName": "owner.fullName",
  "owner.email": "owner.email",
  "owner.password": "owner.password",
  "business.name": "business.name",
  "business.slug": "business.slug",
  "location.name": "location.name",
  "location.timezone": "location.timezone",
  "location.currencyCode": "location.currencyCode",
  "location.addressLine1": "location.addressLine1",
  "location.city": "location.city",
  "location.countryCode": "location.countryCode",
  "location.phoneE164": "location.phone",
};

const CONFLICT_FIELDS: Record<string, FieldPath<SignupFormValues>> = {
  EMAIL_TAKEN: "owner.email",
  SLUG_TAKEN: "business.slug",
};

const COUNTRIES = [
  { code: "AR", name: "Argentina" },
  { code: "UY", name: "Uruguay" },
  { code: "CL", name: "Chile" },
  { code: "PY", name: "Paraguay" },
  { code: "BR", name: "Brasil" },
  { code: "MX", name: "México" },
  { code: "ES", name: "España" },
  { code: "US", name: "United States" },
];

const BROWSER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const TIMEZONES = Array.from(new Set([BROWSER_TIMEZONE, ...Intl.supportedValuesOf("timeZone")])).sort();

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PHONE_PATTERN = /^\+[1-9]\d{6,14}$/;
const RESERVED_SLUGS = ["www", "api", "admin", "app"];

const normalizePhone = (phone: string): string => phone.replace(/[\s\-()]/g, "");

const optional = (value: string): string | undefined => value.trim() || undefined;

const toPayload = (values: SignupFormValues): RegisterBusinessPayload => ({
  owner: {
    fullName: values.owner.fullName.trim(),
    email: values.owner.email.trim(),
    password: values.owner.password,
    takesAppointments: values.owner.takesAppointments,
  },
  business: {
    name: values.business.name.trim(),
    slug: values.business.slug.trim(),
  },
  location: {
    name: values.location.name.trim() || values.business.name.trim(),
    timezone: values.location.timezone,
    currencyCode: values.location.currencyCode,
    addressLine1: optional(values.location.addressLine1),
    city: optional(values.location.city),
    countryCode: optional(values.location.countryCode),
    phoneE164: optional(normalizePhone(values.location.phone)),
  },
});

export function BusinessSignupPage() {
  const [created, setCreated] = useState<RegisterBusinessResult | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SignupFormValues>({
    defaultValues: {
      owner: { fullName: "", email: "", password: "", confirmPassword: "", takesAppointments: true },
      business: { name: "", slug: "" },
      location: {
        name: "",
        timezone: BROWSER_TIMEZONE,
        currencyCode: "ARS",
        addressLine1: "",
        city: "",
        countryCode: "AR",
        phone: "",
      },
    },
  });

  const businessName = useWatch({ control, name: "business.name" });
  const slug = useWatch({ control, name: "business.slug" });

  const businessNameField = register("business.name", {
    required: "Business name is required",
    maxLength: { value: 100, message: "Keep it under 100 characters" },
  });
  const slugField = register("business.slug", {
    required: "Choose a URL for your booking page",
    minLength: { value: 3, message: "URL must be at least 3 characters" },
    maxLength: { value: 40, message: "URL must be 40 characters or fewer" },
    pattern: { value: SLUG_PATTERN, message: "Use lowercase letters, numbers and single dashes" },
    validate: (value) => !RESERVED_SLUGS.includes(value) || "This URL is reserved",
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const result = await registerBusiness(toPayload(values));
      // Token-in-body auth was chosen for this app; the session lives in localStorage.
      localStorage.setItem("auth_token", result.token);
      setCreated(result);
    } catch (error: unknown) {
      const body = axios.isAxiosError(error) ? error.response?.data : undefined;

      if (!isApiErrorBody(body)) {
        setError("root.server", {
          message: "We couldn't reach the server. Check your connection and try again.",
        });
        return;
      }

      const conflictField = CONFLICT_FIELDS[body.error.code];
      if (conflictField) {
        setError(conflictField, { message: body.error.message }, { shouldFocus: true });
        return;
      }

      let mappedAny = false;
      for (const detail of body.error.details ?? []) {
        const field = SERVER_FIELDS[detail.path];
        if (field) {
          setError(field, { message: detail.message });
          mappedAny = true;
        }
      }

      if (!mappedAny) {
        setError("root.server", { message: "Something went wrong. Please try again." });
      }
    }
  };

  if (created) {
    return <SignupSuccess result={created} />;
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Create your business</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Set up your account, your business and your first location. You can add more locations and
          staff later.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <Section title="Your account" description="You'll use this to sign in and manage your business.">
          <FormField id="owner-fullName" label="Full name" error={errors.owner?.fullName?.message}>
            <input
              id="owner-fullName"
              autoComplete="name"
              className={inputClassName}
              aria-invalid={Boolean(errors.owner?.fullName)}
              aria-describedby={errors.owner?.fullName ? "owner-fullName-error" : undefined}
              {...register("owner.fullName", {
                required: "Full name is required",
                maxLength: { value: 100, message: "Keep it under 100 characters" },
              })}
            />
          </FormField>

          <FormField id="owner-email" label="Email" error={errors.owner?.email?.message}>
            <input
              id="owner-email"
              type="email"
              autoComplete="email"
              className={inputClassName}
              aria-invalid={Boolean(errors.owner?.email)}
              aria-describedby={errors.owner?.email ? "owner-email-error" : undefined}
              {...register("owner.email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
              })}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="owner-password"
              label="Password"
              error={errors.owner?.password?.message}
              hint="At least 8 characters"
            >
              <input
                id="owner-password"
                type="password"
                autoComplete="new-password"
                className={inputClassName}
                aria-invalid={Boolean(errors.owner?.password)}
                aria-describedby={errors.owner?.password ? "owner-password-error" : undefined}
                {...register("owner.password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  maxLength: { value: 128, message: "Password is too long" },
                })}
              />
            </FormField>

            <FormField
              id="owner-confirmPassword"
              label="Confirm password"
              error={errors.owner?.confirmPassword?.message}
            >
              <input
                id="owner-confirmPassword"
                type="password"
                autoComplete="new-password"
                className={inputClassName}
                aria-invalid={Boolean(errors.owner?.confirmPassword)}
                aria-describedby={errors.owner?.confirmPassword ? "owner-confirmPassword-error" : undefined}
                {...register("owner.confirmPassword", {
                  required: "Confirm your password",
                  validate: (value, formValues) =>
                    value === formValues.owner.password || "Passwords don't match",
                })}
              />
            </FormField>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-indigo-600"
              {...register("owner.takesAppointments")}
            />
            <span>
              <span className="font-medium">I also take appointments</span>
              <span className="block text-zinc-500">
                Clients will be able to book with you at this location.
              </span>
            </span>
          </label>
        </Section>

        <Section title="Your business" description="This is what your clients will see.">
          <FormField id="business-name" label="Business name" error={errors.business?.name?.message}>
            <input
              id="business-name"
              autoComplete="organization"
              placeholder="Barbería El Rey"
              className={inputClassName}
              aria-invalid={Boolean(errors.business?.name)}
              aria-describedby={errors.business?.name ? "business-name-error" : undefined}
              {...businessNameField}
              onChange={(event) => {
                void businessNameField.onChange(event);
                if (!slugEdited) {
                  setValue("business.slug", slugify(event.target.value), { shouldValidate: isSubmitted });
                }
              }}
            />
          </FormField>

          <FormField
            id="business-slug"
            label="Booking page URL"
            error={errors.business?.slug?.message}
            hint={
              <>
                Your clients will book at{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {slug || "your-business"}.tuapp.com
                </span>
              </>
            }
          >
            <div className="flex items-stretch">
              <input
                id="business-slug"
                autoCapitalize="none"
                spellCheck={false}
                className={`${inputClassName} rounded-r-none`}
                aria-invalid={Boolean(errors.business?.slug)}
                aria-describedby={errors.business?.slug ? "business-slug-error" : undefined}
                {...slugField}
                onChange={(event) => {
                  setSlugEdited(true);
                  void slugField.onChange(event);
                }}
              />
              <span className="flex items-center rounded-r-lg border border-l-0 border-zinc-300 bg-zinc-100 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
                .tuapp.com
              </span>
            </div>
          </FormField>
        </Section>

        <Section title="First location" description="Where clients come for their appointments.">
          <FormField
            id="location-name"
            label="Location name"
            error={errors.location?.name?.message}
            hint="Leave empty to use your business name"
          >
            <input
              id="location-name"
              placeholder={businessName || "Centro"}
              className={inputClassName}
              aria-invalid={Boolean(errors.location?.name)}
              aria-describedby={errors.location?.name ? "location-name-error" : undefined}
              {...register("location.name", {
                maxLength: { value: 100, message: "Keep it under 100 characters" },
              })}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="location-timezone" label="Timezone" error={errors.location?.timezone?.message}>
              <select
                id="location-timezone"
                className={inputClassName}
                aria-invalid={Boolean(errors.location?.timezone)}
                {...register("location.timezone", { required: "Choose a timezone" })}
              >
                {TIMEZONES.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              id="location-currencyCode"
              label="Currency"
              error={errors.location?.currencyCode?.message}
            >
              <select
                id="location-currencyCode"
                className={inputClassName}
                aria-invalid={Boolean(errors.location?.currencyCode)}
                {...register("location.currencyCode", { required: "Choose a currency" })}
              >
                <option value="ARS">ARS: Peso argentino</option>
                <option value="USD">USD: US Dollar</option>
              </select>
            </FormField>
          </div>

          <FormField
            id="location-addressLine1"
            label="Address"
            optional
            error={errors.location?.addressLine1?.message}
          >
            <input
              id="location-addressLine1"
              autoComplete="street-address"
              placeholder="Av. Corrientes 1234"
              className={inputClassName}
              aria-invalid={Boolean(errors.location?.addressLine1)}
              {...register("location.addressLine1", {
                maxLength: { value: 200, message: "Address is too long" },
              })}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="location-city" label="City" optional error={errors.location?.city?.message}>
              <input
                id="location-city"
                autoComplete="address-level2"
                className={inputClassName}
                aria-invalid={Boolean(errors.location?.city)}
                {...register("location.city", {
                  maxLength: { value: 200, message: "City is too long" },
                })}
              />
            </FormField>

            <FormField
              id="location-countryCode"
              label="Country"
              optional
              error={errors.location?.countryCode?.message}
            >
              <select id="location-countryCode" className={inputClassName} {...register("location.countryCode")}>
                <option value="">Not specified</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField
            id="location-phone"
            label="Phone"
            optional
            error={errors.location?.phone?.message}
            hint="International format, e.g. +54 9 11 2233 4455"
          >
            <input
              id="location-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+54 9 11 2233 4455"
              className={inputClassName}
              aria-invalid={Boolean(errors.location?.phone)}
              aria-describedby={errors.location?.phone ? "location-phone-error" : undefined}
              {...register("location.phone", {
                validate: (value) =>
                  !value.trim() ||
                  PHONE_PATTERN.test(normalizePhone(value)) ||
                  "Use international format starting with +, e.g. +5491122334455",
              })}
            />
          </FormField>
        </Section>

        {errors.root?.server && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          >
            {errors.root.server.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-end"
        >
          {isSubmitting ? "Creating your business…" : "Create business"}
        </button>
      </form>
    </main>
  );
}

interface SectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mb-5">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

interface SignupSuccessProps {
  result: RegisterBusinessResult;
}

function SignupSuccess({ result }: SignupSuccessProps) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-6">
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{result.tenant.name} is ready</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        You're signed in as {result.user.email}. Your first location, {result.location.name}, has been
        created.
      </p>
      <p className="mt-6 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        Booking page: <span className="font-medium">{result.tenant.slug}.tuapp.com</span>
      </p>
    </main>
  );
}
