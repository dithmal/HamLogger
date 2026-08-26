import { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sampleContacts = [
  {
    callsign: '4S7RS',
    frequency: '7.060 MHz',
    mode: 'CW',
    rstSent: '599',
    rstReceived: '599',
    date: '2026-08-26'
  },
  {
    callsign: '4S7NAD',
    frequency: '21.006 MHz',
    mode: 'CW',
    rstSent: '559',
    rstReceived: '579',
    date: '2026-08-24'
  }
];

function formatContactDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric'
  }).format(new Date(`${date}T00:00:00Z`));
}


export function App() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section aria-labelledby="contact-form-title" className="max-w-5xl">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="border-b px-5 py-4 sm:px-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Logbook
              </p>
              <h1 id="contact-form-title" className="mt-1 text-xl font-semibold tracking-tight">
                New contact
              </h1>
            </div>

            <form
              className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-5"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="space-y-2">
                <label htmlFor="callsign" className="text-sm font-medium">
                  Callsign
                </label>
                <input
                  id="callsign"
                  name="callsign"
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="rst-sent" className="text-sm font-medium">
                  RST sent
                </label>
                <input
                  id="rst-sent"
                  name="rstSent"
                  defaultValue={599}
                  type="number"
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="rst-received" className="text-sm font-medium">
                  RST received
                </label>
                <input
                  id="rst-received"
                  type="number"
                  name="rstReceived"
                  defaultValue={599}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="frequency" className="text-sm font-medium">
                  Frequency
                </label>
                <div className="relative">
                  <input
                    id="frequency"
                    name="frequency"
                    inputMode="decimal"
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 pr-12 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                    MHz
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="mode" className="text-sm font-medium">
                  Mode
                </label>
                <Select defaultValue="CW" name='mode'>
                  <SelectTrigger id="mode" className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                  >
                    <SelectGroup>
                      <SelectItem value="CW">CW</SelectItem>
                      <SelectItem value="SSB">SSB</SelectItem>
                      <SelectItem value="FM">FM</SelectItem>
                      <SelectItem value="FT8">FT8</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end sm:col-span-2 lg:col-span-5">
                <Button type="button" className="w-full sm:w-auto">
                  Log contact
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section aria-labelledby="recent-contacts-title" className="mt-6 max-w-5xl">
          <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="border-b px-5 py-4 sm:px-6">
              <h2 id="recent-contacts-title" className="text-base font-semibold tracking-tight">
                Recent contacts
              </h2>
            </div>

            <Table className="min-w-[640px]">
              <caption className="sr-only">Two sample recent contacts</caption>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="px-5 sm:px-6">Callsign</TableHead>
                  <TableHead className="px-5 sm:px-6">Frequency</TableHead>
                  <TableHead className="px-5 sm:px-6">Mode</TableHead>
                  <TableHead className="px-5 sm:px-6">RST sent</TableHead>
                  <TableHead className="px-5 sm:px-6">RST received</TableHead>
                  <TableHead className="px-5 text-right sm:px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleContacts.map((contact, index) => (
                  <Fragment key={`${contact.callsign}-${contact.date}`}>
                    {(index === 0 || sampleContacts[index - 1].date !== contact.date) && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={6} className="px-5 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:px-6">
                          {formatContactDate(contact.date)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableHead scope="row" className="px-5 font-semibold sm:px-6">{contact.callsign}</TableHead>
                      <TableCell className="px-5 sm:px-6">{contact.frequency}</TableCell>
                      <TableCell className="px-5 sm:px-6">{contact.mode}</TableCell>
                      <TableCell className="px-5 tabular-nums sm:px-6">{contact.rstSent}</TableCell>
                      <TableCell className="px-5 tabular-nums sm:px-6">{contact.rstReceived}</TableCell>
                      <TableCell className="px-5 text-right sm:px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontalIcon />
                              <span className="sr-only">Open actions for {contact.callsign}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
