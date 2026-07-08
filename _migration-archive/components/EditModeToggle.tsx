import { useEditMode } from "@/hooks/useEditMode";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, X } from "lucide-react";

export default function EditModeToggle() {
  const { isStaff } = useAuth();
  const { enabled, toggle } = useEditMode();
  if (!isStaff) return null;

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 left-6 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border-2 font-bold text-sm transition-all ${
        enabled
          ? "bg-primary text-secondary border-primary"
          : "bg-secondary text-white border-white/20 hover:border-primary"
      }`}
      title={enabled ? "Exit edit mode" : "Enter edit mode — click any text to edit"}
    >
      {enabled ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
      {enabled ? "Exit Edit Mode" : "Edit Page"}
    </button>
  );
}
