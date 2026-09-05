export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type Screen = 'dashboard' | 'surface' | 'hosts' | 'auth' | 'findings' | 'probes' | 'queue' | 'settings' | 'history' | 'logs' | 'help';

export interface TargetRoot { url: string; apex: string; authorized: boolean; }
export interface HostRecord {
  host: string;
  url: string;
  status: 'unknown' | 'live' | 'dead' | 'blocked';
  statusCode?: number;
  title?: string;
  technologies: string[];
  ips: string[];
  cname: string[];
  discoveredBy: string[];
  lastChecked?: string;
  error?: string;
}
export interface RouteRecord {
  url: string;
  host: string;
  status?: number;
  contentType?: string;
  depth: number;
  source: 'crawl' | 'robots' | 'sitemap' | 'common-route' | 'redirect' | 'asset';
  parameters: string[];
}
export interface InputPoint {
  pageUrl: string;
  kind: 'query' | 'path' | 'form';
  name: string;
  method?: string;
  action?: string;
  selector?: string;
  inputType?: string;
  password?: boolean;
}
export interface AuthSurface {
  url: string;
  score: number;
  reason: string[];
  method?: string;
  action?: string;
  passwordFields: FieldDescriptor[];
  identityFields: FieldDescriptor[];
  csrfLikeFields: FieldDescriptor[];
  formIndex?: number;
}
export interface FieldDescriptor {
  name?: string;
  id?: string;
  type: string;
  autocomplete?: string;
  selector: string;
}
export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  module: string;
  host: string;
  url: string;
  summary: string;
  evidence: Record<string, string>;
  firstSeen: string;
  probeId?: string;
  probeFile?: string;
}
export interface ProbeResult {
  id: string;
  family: string;
  stage: number;
  file: string;
  value: string;
  url: string;
  parameter?: string;
  status?: number;
  matched: boolean;
  signal?: string;
  timestamp: string;
}
export interface DiscoveryEvent {
  type: 'phase'|'host'|'route'|'auth'|'input'|'finding'|'probe'|'log'|'done'|'error';
  message?: string;
  host?: HostRecord;
  route?: RouteRecord;
  auth?: AuthSurface;
  input?: InputPoint;
  finding?: Finding;
  probe?: ProbeResult;
  done?: ScanSummary;
}
export interface ScanSummary {
  target: string;
  startedAt: string;
  finishedAt: string;
  hosts: number;
  liveHosts: number;
  routes: number;
  authSurfaces: number;
  findings: number;
  probes: number;
}
