// Test-only clock for reproducible launch-boundary builds. Never loaded by the site.
if (process.env.SITE_BUILD_DATE) {
  const NativeDate = globalThis.Date;
  const timestamp = NativeDate.parse(process.env.SITE_BUILD_DATE);
  if (!Number.isFinite(timestamp)) throw new Error('Invalid SITE_BUILD_DATE');
  globalThis.Date = class extends NativeDate {
    constructor(...args) { if (args.length) super(...args); else super(timestamp); }
    static now() { return timestamp; }
  };
}
