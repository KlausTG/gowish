import { Dialog } from "@/components/ui/dialog";

import { CreateWishForm } from "./create-wish-form";

type CreateWishDialogProps = {
  visible: boolean;
  onClose: () => void;
};

export function CreateWishDialog({ visible, onClose }: CreateWishDialogProps) {
  return (
    <Dialog visible={visible} title="Add a wish" onClose={onClose}>
      <CreateWishForm onSuccess={onClose} />
    </Dialog>
  );
}
