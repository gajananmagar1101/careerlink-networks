import type { Job } from '../types/domain';

export function isJobExpired(job: Pick<Job, 'applicationDeadline'>) {
  if (!job.applicationDeadline) return false;
  const deadline = new Date(`${job.applicationDeadline}T23:59:59`);
  return Number.isNaN(deadline.getTime()) ? false : deadline.getTime() < Date.now();
}

export function isJobOpen(job: Pick<Job, 'status' | 'applicationDeadline'>) {
  return job.status === 'OPEN' && !isJobExpired(job);
}

export function sortJobs(jobs: Job[], sort: string) {
  const copy = [...jobs];
  copy.sort((a, b) => {
    switch (sort) {
      case 'salary':
        return (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0);
      case 'experience':
        return a.experienceRequired - b.experienceRequired;
      case 'deadline':
        return (a.applicationDeadline ?? '').localeCompare(b.applicationDeadline ?? '');
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return (b.createdAt ?? '').localeCompare(a.createdAt ?? '') || a.title.localeCompare(b.title);
    }
  });
  return copy;
}

export function matchesJobExtras(job: Job, extras: { minExperience?: number; minSalary?: number }) {
  if (extras.minExperience != null && !Number.isNaN(extras.minExperience) && job.experienceRequired < extras.minExperience) {
    return false;
  }
  if (extras.minSalary != null && !Number.isNaN(extras.minSalary)) {
    const salary = job.salaryMax ?? job.salaryMin ?? 0;
    if (salary < extras.minSalary) return false;
  }
  return true;
}

export function jobDescriptionSections(description: string) {
  const text = description.trim();
  if (!text) return [{ title: 'About the role', body: '' }];

  const matches = [...text.matchAll(/^(responsibilities|requirements|benefits|about the role|about)\s*:?\s*$/gim)];
  if (!matches.length) {
    return [{ title: 'About the role', body: text }];
  }

  const sections: { title: string; body: string }[] = [];
  const firstIndex = matches[0].index ?? 0;
  if (firstIndex > 0) {
    const intro = text.slice(0, firstIndex).trim();
    if (intro) sections.push({ title: 'About the role', body: intro });
  }

  matches.forEach((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? text.length) : text.length;
    const heading = match[1].toLowerCase();
    const title = heading === 'about' ? 'About the role' : heading.replace(/\b\w/g, (char) => char.toUpperCase());
    const body = text.slice(start, end).trim();
    if (body) sections.push({ title, body });
  });

  return sections.length ? sections : [{ title: 'About the role', body: text }];
}

export function jobMatchesQuery(job: Job, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [job.title, job.companyName, job.location, job.category, ...job.skills].some((value) =>
    value.toLowerCase().includes(needle)
  );
}
