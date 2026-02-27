// Visitor Tracking - Tracks all visitors to the website
(async function() {
  'use strict';

  // Get visitor's IP address using a free API
  async function getVisitorIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Could not fetch IP:', error);
      return null;
    }
  }

  // Get additional IP info (country, city, etc.)
  async function getIPInfo(ip) {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return {
        country: data.country_name || null,
        city: data.city || null,
        region: data.region || null
      };
    } catch (error) {
      console.error('Could not fetch IP info:', error);
      return { country: null, city: null, region: null };
    }
  }

  // Track the visitor
  async function trackVisitor() {
    try {
      const ip = await getVisitorIP();
      const ipInfo = ip ? await getIPInfo(ip) : { country: null, city: null, region: null };
      
      const visitorData = {
        ip_address: ip,
        user_agent: navigator.userAgent,
        page_visited: window.location.pathname,
        referrer: document.referrer || null,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        country: ipInfo.country,
        city: ipInfo.city,
        region: ipInfo.region
      };

      const { error } = await supabase
        .from('visitors')
        .insert([visitorData]);

      if (error) {
        console.error('Error tracking visitor:', error);
      }
    } catch (error) {
      console.error('Visitor tracking failed:', error);
    }
  }

  // Run tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackVisitor);
  } else {
    trackVisitor();
  }
})();
