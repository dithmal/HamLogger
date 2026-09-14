import { useEffect, useState } from 'react';
import { ContactForm } from '@/components/contact-form';
import { ContactsTable } from '@/components/contacts-table';
import { DeleteContactDialog } from '@/components/delete-contact-dialog';
import { EditContactDialog } from '@/components/edit-contact-dialog';
import { QslManagerDialog } from '@/components/qsl-manager-dialog';
import { deleteContact, fetchContacts } from '@/lib/contacts-api';
import type { Contact } from '@/types/contact';

export function HomeScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [qslContact, setQslContact] = useState<Contact | null>(null);

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

  return <>
    <HomeHeader />
    <ContactForm onSubmitted={loadContacts} />
    <ContactsTable contacts={contacts} isLoading={isLoading} error={error} onDelete={setSelectedContact} onEdit={setEditingContact} onQslManager={setQslContact} />
    <DeleteContactDialog contact={selectedContact} isDeleting={isDeleting} onOpenChange={(open) => { if (!open && !isDeleting) setSelectedContact(null); }} onConfirm={() => void handleDelete()} />
    <EditContactDialog contact={editingContact} onOpenChange={(open) => { if (!open) setEditingContact(null); }} onSaved={loadContacts} />
    <QslManagerDialog contact={qslContact} onOpenChange={(open) => { if (!open) setQslContact(null); }} onSaved={loadContacts} />
  </>;
}

function HomeHeader() {
  return <div className="mb-6"><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Logbook</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Home</h1></div>;
}
