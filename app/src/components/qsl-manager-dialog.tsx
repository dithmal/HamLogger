import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { fetchContact, updateContact } from '@/lib/contacts-api';
import type { Contact, ContactDetails } from '@/types/contact';

type QslManagerDialogProps = { contact: Contact | null; onOpenChange: (open: boolean) => void; onSaved: () => Promise<void> };

export function QslManagerDialog({ contact, onOpenChange, onSaved }: QslManagerDialogProps) {
  const [details, setDetails] = useState<ContactDetails | null>(null);
  const [received, setReceived] = useState(false);
  const [sent, setSent] = useState(false);
  const [receivedDate, setReceivedDate] = useState<Date>();
  const [sentDate, setSentDate] = useState<Date>();
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
      setReceived(loaded.qslRcvd === 'Y');
      setSent(loaded.qslSent === 'Y');
      setReceivedDate(loaded.qslRdate ? parseISO(loaded.qslRdate) : undefined);
      setSentDate(loaded.qslSdate ? parseISO(loaded.qslSdate) : undefined);
    }).catch(() => setError('Unable to load QSL details.')).finally(() => setIsLoading(false));
  }, [contact]);

  async function handleSave() {
    if (!contact || !details) return;
    setIsSaving(true);
    setError(null);
    try {
      await updateContact(contact.id, {
        qslRcvd: received ? 'Y' : 'N',
        qslRdate: received && receivedDate ? format(receivedDate, 'yyyy-MM-dd') : null,
        qslSent: sent ? 'Y' : 'N',
        qslSdate: sent && sentDate ? format(sentDate, 'yyyy-MM-dd') : null
      });
      await onSaved();
      onOpenChange(false);
    } catch { setError('Unable to update QSL details. Check that the server is running.'); } finally { setIsSaving(false); }
  }

  function DateButton({ date, onSelect, label }: { date: Date | undefined; onSelect: (value: Date | undefined) => void; label: string }) {
    return <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 size-4" />{date ? format(date, 'MMM d, yyyy') : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={onSelect} />
      </PopoverContent>
    </Popover>;
  }

  return <Dialog open={contact !== null} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>QSL Manager</DialogTitle>
        <DialogDescription>Manage QSL details for contact with {contact?.call}.</DialogDescription>
      </DialogHeader>
      {isLoading && <p className="text-sm text-muted-foreground">Loading QSL details...</p>}
      {!isLoading && details && <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox id="qsl-sent" checked={sent} onCheckedChange={(checked) => setSent(checked === true)} />
            <label htmlFor="qsl-sent" className="text-sm font-medium">QSL sent</label>
          </div>{sent && <DateButton date={sentDate} onSelect={setSentDate} label="Set sent date" />}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox id="qsl-received" checked={received} onCheckedChange={(checked) => setReceived(checked === true)} />
            <label htmlFor="qsl-received" className="text-sm font-medium">QSL received</label>
          </div>{received && <DateButton date={receivedDate} onSelect={setReceivedDate} label="Set received date" />}</div>
      </div>}
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <DialogFooter>
        <Button variant="outline" disabled={isSaving} onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button disabled={isLoading || isSaving || !details} onClick={() => void handleSave()}>{isSaving ? 'Saving...' : 'Save changes'}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
