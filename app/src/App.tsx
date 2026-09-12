import { useEffect, useState } from 'react';
import { ContactForm } from '@/components/contact-form';
import { ContactsTable } from '@/components/contacts-table';
import { DeleteContactDialog } from '@/components/delete-contact-dialog';
import { EditContactDialog } from '@/components/edit-contact-dialog';
import { QslManagerDialog } from '@/components/qsl-manager-dialog';
import { deleteContact, fetchContacts } from '@/lib/contacts-api';
import type { Contact } from '@/types/contact';

const spaceBackgroundUrl = 'https://app.worldradioleague.com/static/media/spaceBg.346ffa44f3f8196bfdff7cdc4a60c738.svg';

export function App() {
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

  return <main
    className="min-h-svh bg-background text-foreground"
    style={{ backgroundImage: `url(${spaceBackgroundUrl})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
  >
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <ContactForm onSubmitted={loadContacts} />
      <ContactsTable contacts={contacts} isLoading={isLoading} error={error} onDelete={setSelectedContact} onEdit={setEditingContact} onQslManager={setQslContact} />
      <DeleteContactDialog contact={selectedContact} isDeleting={isDeleting} onOpenChange={(open) => { if (!open && !isDeleting) setSelectedContact(null); }} onConfirm={() => void handleDelete()} />
      <EditContactDialog contact={editingContact} onOpenChange={(open) => { if (!open) setEditingContact(null); }} onSaved={loadContacts} />
      <QslManagerDialog contact={qslContact} onOpenChange={(open) => { if (!open) setQslContact(null); }} onSaved={loadContacts} />
    </div>
  </main>;
}
