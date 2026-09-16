import { Dialog } from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { type SortOrder, type ViewOptions } from "./view-options";

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "default", label: "Default order" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

type ListSortDialogProps = {
  visible: boolean;
  options: ViewOptions;
  onClose: () => void;
  onChange: (options: ViewOptions) => void;
};

export function ListSortDialog({
  visible,
  options,
  onClose,
  onChange,
}: ListSortDialogProps) {
  return (
    <Dialog visible={visible} title="Sort" onClose={onClose}>
      <RadioGroup
        options={SORT_OPTIONS}
        value={options.sortOrder}
        onChange={(sortOrder) => {
          onChange({ ...options, sortOrder });
          onClose();
        }}
      />
    </Dialog>
  );
}
