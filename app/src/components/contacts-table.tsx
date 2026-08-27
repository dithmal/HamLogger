import { Fragment } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Contact } from '@/types/contact';

type ContactsTableProps = { contacts: Contact[]; isLoading: boolean; error: string | null; onDelete: (contact: Contact) => void };

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC', year: 'numeric' }).format(new Date(`${value}T00:00:00Z`));
}

export function ContactsTable({ contacts, isLoading, error, onDelete }: ContactsTableProps) {
  return <section aria-labelledby="recent-contacts-title" className="mt-6 max-w-5xl">
    <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="border-b px-5 py-4 sm:px-6">
        <h2 id="recent-contacts-title" className="text-base font-semibold tracking-tight">Recent contacts</h2>
      </div>
      <Table className="min-w-[640px]">
        <caption className="sr-only">Recent contacts loaded from the server</caption>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Callsign</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>RST sent</TableHead>
            <TableHead>RST received</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Loading contacts...</TableCell></TableRow>}
          {!isLoading && error && <TableRow><TableCell colSpan={6} className="py-8 text-center text-destructive">{error}</TableCell></TableRow>}
          {!isLoading && !error && contacts.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No contacts logged yet.</TableCell></TableRow>}
          {!isLoading && !error && contacts.map((contact, index) => <Fragment key={contact.id}>
            {(index === 0 || contacts[index - 1].qsoDate !== contact.qsoDate) && <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableCell colSpan={6} className="py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{formatDate(contact.qsoDate)}</TableCell>
            </TableRow>}
            <TableRow>
              <TableHead scope="row" className="font-semibold">{contact.call}</TableHead>
              <TableCell>{contact.freq} MHz</TableCell>
              <TableCell>{contact.mode}</TableCell>
              <TableCell className="tabular-nums">{contact.rstSent}</TableCell>
              <TableCell className="tabular-nums">{contact.rstRcvd}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open actions for {contact.call}</span></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete(contact)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </Fragment>)}
        </TableBody>
      </Table>
    </div>
  </section>;
}
