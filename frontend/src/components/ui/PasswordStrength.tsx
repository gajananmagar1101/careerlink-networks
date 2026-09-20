export function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['Too short', 'Fair', 'Good', 'Strong'];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className={`h-1.5 flex-1 rounded-full ${index < score ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">Password strength: {labels[Math.max(0, score - 1)]}</p>
    </div>
  );
}
