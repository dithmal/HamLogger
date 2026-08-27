import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Contact } from '@/types/contact';

type DeleteContactDialogProps = { contact: Contact | null; isDeleting: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void };

export function DeleteContactDialog({ contact, isDeleting, onOpenChange, onConfirm }: DeleteContactDialogProps) {
  return <Dialog open={contact !== null} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete contact?</DialogTitle>
        <DialogDescription>This will permanently remove the contact with <span className="font-medium text-foreground">{contact?.call}</span></DialogDescription>
      </DialogHeader>
      <DialogFooter><Button variant="outline" disabled={isDeleting} onClick={() => onOpenChange(false)}>Cancel</Button><Button variant="destructive" disabled={isDeleting} onClick={onConfirm}>{isDeleting ? 'Deleting...' : 'Delete contact'}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
