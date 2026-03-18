/**
 * useAnalytics — lightweight analytics event dispatcher
 * Ready for GA4, Meta Pixel, or any analytics platform integration.
 */
export function trackEvent(eventName, data = {}) {
  // Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, data);
  }

  // Meta Pixel
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, data);
  }

  // Custom dataLayer (GTM)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...data });

  // Dev logging
  if (import.meta.env.DEV) {
    console.log(`[analytics] ${eventName}`, data);
  }
}

export function trackCTA(ctaId, section) {
  trackEvent("cta_click", { cta_id: ctaId, section });
}

export function trackFormOpen(formType) {
  trackEvent("form_open", { form_type: formType });
}

export function trackFormSubmit(formType, fields = {}) {
  trackEvent("form_submit", { form_type: formType, ...fields });
}

export function trackScrollDepth(depth) {
  trackEvent("scroll_depth", { depth });
}
