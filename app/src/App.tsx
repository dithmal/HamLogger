import { useEffect, useState } from 'react';
import { ContactForm } from '@/components/contact-form';
import { ContactsTable } from '@/components/contacts-table';
import { DeleteContactDialog } from '@/components/delete-contact-dialog';
import { deleteContact, fetchContacts } from '@/lib/contacts-api';
import type { Contact } from '@/types/contact';

export function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadContacts() {
    try {
      setContacts(await fetchContacts()); setError(null);
    } catch {
      setError('Unable to load contacts. Check that the server is running.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { void loadContacts(); }, []);

  async function handleDelete() {
    if (!selectedContact) return;
    setIsDeleting(true);
    try { await deleteContact(selectedContact.id); setSelectedContact(null); await loadContacts(); } catch { setError('Unable to delete contact. Check that the server is running.'); } finally { setIsDeleting(false); }
  }

  return <main className="min-h-svh bg-background text-foreground">
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <ContactForm onSubmitted={loadContacts} />
      <ContactsTable contacts={contacts} isLoading={isLoading} error={error} onDelete={setSelectedContact} />
      <DeleteContactDialog contact={selectedContact} isDeleting={isDeleting} onOpenChange={(open) => { if (!open && !isDeleting) setSelectedContact(null); }} onConfirm={() => void handleDelete()} />
    </div>
  </main>;
}
