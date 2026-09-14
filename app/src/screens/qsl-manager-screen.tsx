import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { bulkUpdateQsl, fetchQslContacts } from '@/lib/contacts-api';
import type { Contact } from '@/types/contact';

const inputClass = 'flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30';

type QslRow = Contact;
type QslAction = 'unchanged' | 'Y' | 'N';

export function QslManagerScreen() {
  const [qsoDateRange, setQsoDateRange] = useState<DateRange>();
  const [filterSent, setFilterSent] = useState(false);
  const [filterReceived, setFilterReceived] = useState(false);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [bulkSent, setBulkSent] = useState<QslAction>('unchanged');
  const [bulkReceived, setBulkReceived] = useState<QslAction>('unchanged');
  const [bulkSentDate, setBulkSentDate] = useState<Date>();
  const [bulkReceivedDate, setBulkReceivedDate] = useState<Date>();
  const [callsign, setCallsign] = useState('');
  const [rows, setRows] = useState<QslRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function loadRows() {
    setIsLoading(true);
    try {
      setRows(await fetchQslContacts({ call: callsign, qslSent: filterSent ? 'Y' : undefined, qslRcvd: filterReceived ? 'Y' : undefined, qsoDateFrom: qsoDateRange?.from ? format(qsoDateRange.from, 'yyyy-MM-dd') : undefined, qsoDateTo: qsoDateRange?.to ? format(qsoDateRange.to, 'yyyy-MM-dd') : undefined }));
      setError(null);
    } catch { setError('Unable to load QSL contacts. Check that the server is running.'); } finally { setIsLoading(false); }
  }

  useEffect(() => { void loadRows(); }, []);

  async function handleBulkUpdate() {
    if (!selectedRows.length || (bulkSent === 'unchanged' && bulkReceived === 'unchanged')) return;
    setIsSaving(true);
    try {
      await bulkUpdateQsl(selectedRows, { qslSent: bulkSent !== 'unchanged' ? bulkSent : undefined, qslSdate: bulkSent === 'Y' ? (bulkSentDate ? format(bulkSentDate, 'yyyy-MM-dd') : null) : bulkSent === 'N' ? null : undefined, qslRcvd: bulkReceived !== 'unchanged' ? bulkReceived : undefined, qslRdate: bulkReceived === 'Y' ? (bulkReceivedDate ? format(bulkReceivedDate, 'yyyy-MM-dd') : null) : bulkReceived === 'N' ? null : undefined });
      setSelectedRows([]);
      await loadRows();
    } catch { setError('Unable to update QSL contacts. Check that the server is running.'); } finally { setIsSaving(false); }
  }

  function toggleRow(id: string, checked: boolean) { setSelectedRows((current) => checked ? [...current, id] : current.filter((rowId) => rowId !== id)); }
  function toggleAllRows(checked: boolean) { setSelectedRows(checked ? rows.map((row) => row.id) : []); }

  return <section aria-labelledby="qsl-manager-title" className="max-w-6xl">
    <h1 id="qsl-manager-title" className="mb-4 mt-1 text-2xl font-semibold tracking-tight">QSL Manager</h1>
    <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-stretch">
      <div className={`rounded-xl border bg-card p-6 text-card-foreground shadow-sm ${bulkEdit ? 'sm:flex-1' : 'w-full'}`}>
        <div className="border-b pb-4"><h2 className="text-xl font-semibold tracking-tight">Search for QSOs</h2></div>
        <form className="grid gap-5 pt-5 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); void loadRows(); }}>
          <label className="space-y-2 text-sm font-medium" htmlFor="qsl-search-callsign">Callsign<input id="qsl-search-callsign" name="callsign" value={callsign} onChange={(event) => setCallsign(event.target.value)} className={inputClass} /></label>
          <div className="space-y-3"><span className="block text-sm font-medium">QSL status</span><div className="flex gap-5">
            <label className="flex items-center gap-2 text-sm font-normal"><Checkbox checked={filterSent} onCheckedChange={(checked) => setFilterSent(checked === true)} />QSL sent</label>
            <label className="flex items-center gap-2 text-sm font-normal"><Checkbox checked={filterReceived} onCheckedChange={(checked) => setFilterReceived(checked === true)} />QSL received</label>
          </div></div>
          <DateRangeButton range={qsoDateRange} onSelect={setQsoDateRange} />
          <label className="flex items-center gap-2 self-end text-sm font-medium"><Checkbox checked={bulkEdit} onCheckedChange={(checked) => setBulkEdit(checked === true)} />Bulk Edit</label>
          <div className="sm:col-span-2"><Button type="submit" className="gradient-pill-button">Search</Button></div>
        </form>
      </div>
      {bulkEdit && <div className="flex grow sm:flex-1 sm:h-auto"><BulkEditCard sent={bulkSent} received={bulkReceived} sentDate={bulkSentDate} receivedDate={bulkReceivedDate} onSentChange={setBulkSent} onReceivedChange={setBulkReceived} onSentDateChange={setBulkSentDate} onReceivedDateChange={setBulkReceivedDate} onApply={() => void handleBulkUpdate()} isSaving={isSaving} selectedCount={selectedRows.length} /></div>}
    </div>
    <QslResultsTable rows={rows} isLoading={isLoading} error={error} selectedRows={selectedRows} onToggleRow={toggleRow} onToggleAll={toggleAllRows} />
  </section>;
}

function BulkEditCard({ sent, received, sentDate, receivedDate, onSentChange, onReceivedChange, onSentDateChange, onReceivedDateChange, onApply, isSaving, selectedCount }: { sent: QslAction; received: QslAction; sentDate: Date | undefined; receivedDate: Date | undefined; onSentChange: (value: QslAction) => void; onReceivedChange: (value: QslAction) => void; onSentDateChange: (value: Date | undefined) => void; onReceivedDateChange: (value: Date | undefined) => void; onApply: () => void; isSaving: boolean; selectedCount: number }) {
  return <div className="flex flex-1 flex-col rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold tracking-tight">Bulk edit QSL status</h2>
      <p className="mt-1 text-sm text-muted-foreground">Select QSOs below, then apply the changes here.</p>
    </div>
    <div className="space-y-5 pt-5">
      <QslDateField id="bulk-sent" label="QSL sent" value={sent} date={sentDate} onChange={onSentChange} onDateChange={onSentDateChange} />
      <QslDateField id="bulk-received" label="QSL received" value={received} date={receivedDate} onChange={onReceivedChange} onDateChange={onReceivedDateChange} />
      <Button type="button" className="gradient-pill-button" disabled={!selectedCount || (sent === 'unchanged' && received === 'unchanged') || isSaving} onClick={onApply}>{isSaving ? 'Applying...' : `Apply to ${selectedCount} selected QSO${selectedCount === 1 ? '' : 's'}`}</Button>
    </div>
  </div>;
}

function QslDateField({ id, label, value, date, onChange, onDateChange }: { id: string; label: string; value: QslAction; date: Date | undefined; onChange: (value: QslAction) => void; onDateChange: (value: Date | undefined) => void }) {
  return <div className="space-y-3">
    <label className="space-y-2 text-sm font-medium" htmlFor={id}>
      {label}
      <Select value={value} onValueChange={(next) => onChange(next as QslAction)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="unchanged">Select Value</SelectItem>
          <SelectItem value="Y">Yes</SelectItem>
          <SelectItem value="N">No</SelectItem>
        </SelectContent>
      </Select>
    </label>{value === 'Y' && <DateButton date={date} onSelect={onDateChange} label={`Set ${label.toLowerCase()} date`} />}
  </div>;
}

function DateRangeButton({ range, onSelect }: { range: DateRange | undefined; onSelect: (value: DateRange | undefined) => void }) {
  const label = range?.from ? range.to ? `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}` : format(range.from, 'MMM d, yyyy') : 'Select QSO date range';

  return <div className="space-y-2 sm:col-span-2">
    <span className="block text-sm font-medium">QSO dates</span>
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 size-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="range" selected={range} onSelect={onSelect} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  </div>;
}

function DateButton({ date, onSelect, label }: { date: Date | undefined; onSelect: (value: Date | undefined) => void; label: string }) {
  return <Popover>
    <PopoverTrigger asChild>
      <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
        <CalendarIcon className="mr-2 size-4" />
        {date ? format(date, 'MMM d, yyyy') : label}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar mode="single" selected={date} onSelect={onSelect} />
    </PopoverContent>
  </Popover>;
}

function QslResultsTable({ rows, isLoading, error, selectedRows, onToggleRow, onToggleAll }: { rows: QslRow[]; isLoading: boolean; error: string | null; selectedRows: string[]; onToggleRow: (id: string, checked: boolean) => void; onToggleAll: (checked: boolean) => void }) {
  const allSelected = rows.length > 0 && selectedRows.length === rows.length;
  return <section aria-labelledby="qsl-results-title" className="mt-6 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
    <div className="border-b px-5 py-4 sm:px-6">
      <h2 id="qsl-results-title" className="text-base font-semibold tracking-tight">QSO results</h2>
    </div>
    <div className="overflow-x-auto">
      <Table className="min-w-[980px]">
        <caption className="sr-only">QSO results for QSL management</caption>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12">
              <Checkbox aria-label="Select all QSOs" checked={allSelected} onCheckedChange={(checked) => onToggleAll(checked === true)} />
            </TableHead>
            <TableHead>Callsign</TableHead>
            <TableHead>QSO date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>QSL received</TableHead>
            <TableHead>Received date</TableHead>
            <TableHead>QSL sent</TableHead>
            <TableHead>Sent date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <TableRow>
            <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Loading QSOs...</TableCell>
          </TableRow> : error ? <TableRow>
            <TableCell colSpan={8} className="py-8 text-center text-destructive">{error}</TableCell>
          </TableRow> : rows.length === 0 ? <TableRow>
            <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No QSOs found.</TableCell>
          </TableRow> : rows.map((row) => <TableRow key={row.id}>
            <TableCell>
              <Checkbox aria-label={`Select ${row.call}`} checked={selectedRows.includes(row.id)} onCheckedChange={(checked) => onToggleRow(row.id, checked === true)} />
            </TableCell>
            <TableCell className="font-semibold">{row.call}</TableCell>
            <TableCell>{formatTableDate(row.qsoDate)}</TableCell>
            <TableCell className="tabular-nums">{row.timeOn?.slice(0, 5)}</TableCell>
            <TableCell>{row.qslRcvd === 'Y' ? 'Yes' : 'No'}</TableCell>
            <TableCell>{row.qslRdate ? formatTableDate(row.qslRdate) : '-'}</TableCell>
            <TableCell>{row.qslSent === 'Y' ? 'Yes' : 'No'}</TableCell>
            <TableCell>{row.qslSdate ? formatTableDate(row.qslSdate) : '-'}</TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </div>
  </section>;
}

function formatTableDate(value: string) { return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC', year: 'numeric' }).format(new Date(`${value}T00:00:00Z`)); }
