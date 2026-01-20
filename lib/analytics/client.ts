/**
 * Analytics client wrapper
 * Provides analytics tracking with GDPR-compliant consent management
 */

/**
 * Check if user has given consent for analytics
 */
function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      return false;
    }

    const preferences = JSON.parse(consent);
    return preferences.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string): void {
  if (!hasAnalyticsConsent()) {
    return;
  }

  // Plausible Analytics (if using Plausible)
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('pageview', {
      props: {
        url,
        title: title || document.title,
      },
    });
  }

  // Google Analytics 4 (if using GA4)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }

  // PostHog (if using PostHog)
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture('$pageview', {
      $current_url: url,
      $page_title: title || document.title,
    });
  }
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
): void {
  if (!hasAnalyticsConsent()) {
    return;
  }

  // Plausible Analytics
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, {
      props: properties || {},
    });
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties || {});
  }

  // PostHog
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(eventName, properties || {});
  }
}

/**
 * Initialize analytics (call once on app load)
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) {
    return;
  }

  // Plausible script injection (if domain is configured)
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }

  // Google Analytics 4 (if measurement ID is configured)
  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);
  }

  // PostHog (if API key is configured)
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}',{api_host:'${process.env.NEXT_PUBLIC_POSTHOG_HOST}'})
    `;
    document.head.appendChild(script);
  }
}
