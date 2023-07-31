import { FastifyRequest } from 'fastify';

const logBlacklist: { userAgent: string; url: string }[] = [
  { userAgent: 'kube-probe/', url: '/api/health' },
  { userAgent: 'Prometheus/', url: '/api/metrics' },
];

export function isItWorthLogging(req: FastifyRequest): boolean {
  const userAgent: string | undefined = req.headers['user-agent'];
  const url: string | undefined = req.url;
  if (!userAgent || !url) {
    return true;
  }

  for (const item of logBlacklist) {
    if (userAgent.startsWith(item.userAgent) && url === item.url) {
      return false;
    }
  }

  return true;
}
