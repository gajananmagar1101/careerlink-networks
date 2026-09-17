import type { EmploymentType } from '../types/domain';

export function formatMoney(value?: number) {
  if (!value) return 'Not disclosed';
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

export function formatSalary(min?: number, max?: number) {
  if (!min && !max) return 'Salary not disclosed';
  if (min && max) return `${formatMoney(min)} - ${formatMoney(max)}`;
  return min ? `From ${formatMoney(min)}` : `Up to ${formatMoney(max)}`;
}

export function formatDate(value?: string) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function employmentLabel(value?: EmploymentType | '') {
  if (!value) return 'Any type';
  return value.replace('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function initials(name?: string) {
  if (!name) return 'CL';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function splitTags(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
