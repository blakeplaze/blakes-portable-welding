"use client";

import { FormEvent, useState } from "react";

const services = ["Mobile Welding", "Aluminum", "Steel", "Stainless", "Other Exotic"];

export function EstimateForm({ id = "estimate" }: { id?: string }) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const chosen = services.filter((service) => data.get(service) === "on");
    const body = [
      `Name: ${data.get("name")}`,
      `Address: ${data.get("address")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Services: ${chosen.join(", ") || "None selected"}`,
      "",
      data.get("details") || "",
    ].join("\n");

    window.location.href = `mailto:Estimates@Bpweld.com?subject=${encodeURIComponent(
      "Estimate request from blakesportablewelding.com",
    )}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  }

  return (
    <section id={id} className="mx-auto w-full max-w-md px-5 py-8">
      <h2 className="mb-6 text-center text-2xl font-normal">Estimate Request</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          required
          name="name"
          className="field"
          placeholder="Name or Company Name *"
          aria-label="Name or Company Name (required)"
        />
        <input
          required
          name="address"
          className="field"
          placeholder="Address For Service *"
          aria-label="Address For Service (required)"
        />
        <input
          required
          type="email"
          name="email"
          className="field"
          placeholder="Email *"
          aria-label="Email (required)"
        />
        <input
          required
          type="tel"
          name="phone"
          className="field"
          placeholder="Phone *"
          aria-label="Phone (required)"
        />
        <textarea
          name="details"
          rows={4}
          className="field resize-y"
          placeholder="Provide any further details you think may be helpful to us."
        />
        <fieldset className="pt-3 text-left text-sm">
          <legend className="mb-2 font-medium">
            What services do you need (Check all that apply)? *
          </legend>
          {services.map((service) => (
            <label key={service} className="mb-1 flex items-center gap-2">
              <input type="checkbox" name={service} />
              {service}
              {service === "Mobile Welding" ? ":" : ""}
            </label>
          ))}
        </fieldset>
        <p className="pt-2 text-xs leading-5 text-muted">
          You may receive marketing and promotional materials. Contact the merchant
          for their privacy practices.{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>
          .
        </p>
        <button type="submit" className="btn mt-2 w-full">
          Submit
        </button>
        {status === "sent" ? (
          <p className="text-center text-sm text-muted">
            Your email app should open with the estimate request. If it does not,
            email Estimates@Bpweld.com.
          </p>
        ) : null}
      </form>
    </section>
  );
}
