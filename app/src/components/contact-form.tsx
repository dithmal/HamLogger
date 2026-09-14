import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createContact } from '@/lib/contacts-api';

type ContactFormProps = { onSubmitted: () => Promise<void> };

export function ContactForm({ onSubmitted }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await createContact(new FormData(form));
      form.reset();
      await onSubmitted();
      setMessage('Contact logged.');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to save contact.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = 'flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30';

  return (
    <section aria-labelledby="contact-form-title" className="max-w-5xl">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="border-b px-5 py-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Logbook</p>
          <h1 id="contact-form-title" className="mt-1 text-xl font-semibold tracking-tight">New contact</h1>
        </div>
        <form className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-5" onSubmit={handleSubmit}>
          <label className="space-y-2 text-sm font-medium" htmlFor="callsign">Callsign<input id="callsign" name="callsign" className={inputClass} /></label>
          <label className="space-y-2 text-sm font-medium" htmlFor="rst-sent">RST sent<input id="rst-sent" name="rstSent" defaultValue={599} type="number" className={inputClass} /></label>
          <label className="space-y-2 text-sm font-medium" htmlFor="rst-received">RST received<input id="rst-received" name="rstReceived" defaultValue={599} type="number" className={inputClass} /></label>
          <label className="space-y-2 text-sm font-medium" htmlFor="frequency">Frequency<span className="relative block"><input id="frequency" name="frequency" inputMode="decimal" className={`${inputClass} pr-12`} /><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-normal text-muted-foreground">MHz</span></span></label>
          <label className="space-y-2 text-sm font-medium" htmlFor="mode">Mode<Select defaultValue="CW" name="mode"><SelectTrigger id="mode" className="w-full"><SelectValue /></SelectTrigger><SelectContent position="popper"><SelectItem value="CW">CW</SelectItem><SelectItem value="SSB">SSB</SelectItem><SelectItem value="FM">FM</SelectItem><SelectItem value="FT8">FT8</SelectItem></SelectContent></Select></label>
          <div className="flex items-end sm:col-span-2 lg:col-span-5">
            <Button type="submit" disabled={isSubmitting} className="gradient-pill-button">{isSubmitting ? 'Logging...' : 'Log contact'}</Button>
          </div>
        </form>
        {(error || message) && <p className={`border-t px-5 py-3 text-sm sm:px-6 ${error ? 'text-destructive' : 'text-muted-foreground'}`} role={error ? 'alert' : 'status'}>{error ?? message}</p>}
      </div>
    </section>
  );
}
