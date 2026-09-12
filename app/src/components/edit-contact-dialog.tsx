import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchContact, interpretBand, updateContact } from '@/lib/contacts-api';
import type { Contact, ContactDetails } from '@/types/contact';

type EditContactDialogProps = { contact: Contact | null; onOpenChange: (open: boolean) => void; onSaved: () => Promise<void> };

export function EditContactDialog({ contact, onOpenChange, onSaved }: EditContactDialogProps) {
  const [details, setDetails] = useState<ContactDetails | null>(null);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contact) return;
    setDetails(null);
    setError(null);
    setIsLoading(true);
    void fetchContact(contact.id).then((loaded) => {
      setDetails(loaded);
      setDate(parseISO(loaded.qsoDate));
      setTime(loaded.timeOn);
    }).catch(() => setError('Unable to load contact details.')).finally(() => setIsLoading(false));
  }, [contact]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact || !details || !date) return;
    const formData = new FormData(event.currentTarget);
    const frequency = Number(formData.get('frequency'));
    const band = interpretBand(frequency);
    if (!band) { setError('Enter a frequency in MHz that maps to a supported amateur band.'); return; }
    setIsSaving(true);
    setError(null);
    try {
      await updateContact(contact.id, {
        call: formData.get('callsign'), qsoDate: format(date, 'yyyy-MM-dd'), timeOn: formData.get('timeOn'), band,
        freq: frequency, mode: formData.get('mode'), rstSent: formData.get('rstSent'), rstRcvd: formData.get('rstReceived'),
        stationCallsign: details.stationCallsign, operator: details.operator
      });
      await onSaved();
      onOpenChange(false);
    } catch { setError('Unable to update contact. Check that the server is running.'); } finally { setIsSaving(false); }
  }

  const inputClass = 'flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30';

  return <Dialog open={contact !== null} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Edit contact</DialogTitle></DialogHeader>{isLoading && <p className="text-sm text-muted-foreground">Loading contact...</p>}{!isLoading && details && <form id="edit-contact-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
    <label className="space-y-2 text-sm font-medium" htmlFor="edit-callsign">Callsign<input id="edit-callsign" name="callsign" defaultValue={details.call} className={inputClass} /></label>
    <label className="space-y-2 text-sm font-medium" htmlFor="edit-frequency">Frequency<input id="edit-frequency" name="frequency" defaultValue={details.freq} inputMode="decimal" className={inputClass} /></label>
    <label className="space-y-2 text-sm font-medium" htmlFor="edit-rst-sent">RST sent<input id="edit-rst-sent" name="rstSent" defaultValue={details.rstSent} className={inputClass} /></label>
    <label className="space-y-2 text-sm font-medium" htmlFor="edit-rst-received">RST received<input id="edit-rst-received" name="rstReceived" defaultValue={details.rstRcvd} className={inputClass} /></label>
    <label className="space-y-2 text-sm font-medium" htmlFor="edit-mode">Mode<Select defaultValue={details.mode} name="mode"><SelectTrigger id="edit-mode" className="w-full"><SelectValue /></SelectTrigger><SelectContent position="popper"><SelectItem value="CW">CW</SelectItem><SelectItem value="SSB">SSB</SelectItem><SelectItem value="FM">FM</SelectItem><SelectItem value="FT8">FT8</SelectItem></SelectContent></Select></label>
    <div className="space-y-2"><span className="text-sm font-medium">QSO date</span><Popover><PopoverTrigger asChild><Button type="button" variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 size-4" />{date ? format(date, 'MMM d, yyyy') : 'Pick a date'}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent></Popover></div>
    <label className="space-y-2 text-sm font-medium" htmlFor="edit-time">QSO time<input id="edit-time" name="timeOn" type="time" step="1" value={time} onChange={(event) => setTime(event.target.value)} className={inputClass} /></label>
  </form>}{error && <p className="text-sm text-destructive" role="alert">{error}</p>}<DialogFooter><Button type="button" variant="outline" disabled={isSaving} onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" form="edit-contact-form" disabled={isLoading || isSaving || !details}>{isSaving ? 'Saving...' : 'Save changes'}</Button></DialogFooter></DialogContent></Dialog>;
}
