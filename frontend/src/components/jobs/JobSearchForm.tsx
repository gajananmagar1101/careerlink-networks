import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Fields';
import type { EmploymentType } from '../../types/domain';

export interface JobSearchValues {
  keyword: string;
  location: string;
  employmentType: EmploymentType | '';
  category?: string;
  minExperience?: string;
  minSalary?: string;
  sort?: string;
}

export function JobSearchForm({
  values,
  onChange,
  onClear,
  showExtras = false
}: {
  values: JobSearchValues;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  showExtras?: boolean;
}) {
  return (
    <div className="surface rounded-lg p-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <Input label="Job title, skills, or keywords" value={values.keyword} onChange={(e) => onChange('keyword', e.target.value)} placeholder="Java, React, Analyst" />
        <Input label="Location" value={values.location} onChange={(e) => onChange('location', e.target.value)} placeholder="Pune, Bengaluru, Remote" />
        <Select label="Employment type" value={values.employmentType} onChange={(e) => onChange('employmentType', e.target.value)}>
          <option value="">Any type</option>
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="REMOTE">Remote</option>
        </Select>
      </div>
      {showExtras ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          <Input label="Category" value={values.category ?? ''} onChange={(e) => onChange('category', e.target.value)} />
          <Input label="Min experience (years)" type="number" min={0} value={values.minExperience ?? ''} onChange={(e) => onChange('minExperience', e.target.value)} helper="Applied to the current result page" />
          <Input label="Min salary" type="number" min={0} value={values.minSalary ?? ''} onChange={(e) => onChange('minSalary', e.target.value)} helper="Applied to the current result page" />
          <Select label="Sort" value={values.sort ?? 'relevance'} onChange={(e) => onChange('sort', e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="title">Title</option>
            <option value="salary">Salary</option>
            <option value="experience">Experience</option>
            <option value="deadline">Deadline</option>
          </Select>
        </div>
      ) : null}
      <div className="mt-4 flex justify-end">
        <Button type="button" variant="secondary" onClick={onClear}>Clear filters</Button>
      </div>
    </div>
  );
}
