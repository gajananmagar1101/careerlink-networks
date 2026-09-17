import type { Application, ApplicationStatus } from '../types/domain';

export function appliedDate(application: Application) {
  return application.appliedAt ?? application.createdAt;
}

export function normalizeApplication(application: Application): Application {
  return {
    ...application,
    createdAt: appliedDate(application),
    appliedAt: appliedDate(application)
  };
}

export function statusLabel(status: ApplicationStatus) {
  return status.replace(/_/g, ' ');
}

