export interface Settings {
  refreshMs: number;
  maxDepth: number;
  maxRoutesPerHost: number;
  maxHosts: number;
  concurrency: number;
  requestPerSecond: number;
  timeoutMs: number;
  maxBodyBytes: number;
  userAgent: string;
  followRedirects: boolean;
  privateNetworks: boolean;
  useCertificateTransparency: boolean;
  useDnsWordlist: boolean;
  dnsWordlist: string[];
  commonAuthRoutes: string[];
  payloadsPerParameter: number;
  authorizedRoots: string[];
  reportsDir: string;
}
export const defaults = (): Settings => ({
  refreshMs: 80,
  maxDepth: 2,
  maxRoutesPerHost: 250,
  maxHosts: 1000,
  concurrency: 6,
  requestPerSecond: 5,
  timeoutMs: 12000,
  maxBodyBytes: 1_500_000,
  userAgent: 'nightfall/0.4.0',
  followRedirects: true,
  privateNetworks: false,
  useCertificateTransparency: true,
  useDnsWordlist: false,
  dnsWordlist: ['www','app','api','dev','staging','test','admin','auth','login','portal','docs','cdn','assets','static','mail','status','vpn','git','gitlab','grafana','monitor'],
  commonAuthRoutes: ['/login','/signin','/sign-in','/auth','/auth/login','/account/login','/user/login','/users/sign_in','/wp-login.php','/admin/login','/dashboard/login','/oauth/authorize'],
  payloadsPerParameter: 64,
  authorizedRoots: [],
  reportsDir: '.nightfall/reports',
});
