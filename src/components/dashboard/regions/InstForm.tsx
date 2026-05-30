import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { INST_TYPES, type Institution } from "./regionData";
import FormField from "@/components/ui/FormField";
import Dropdown from "@/components/ui/Dropdown";

type InstFormData = Omit<Institution, "id">;

// ─── Component ────────────────────────────────────────────────────────────────

export const InstForm: React.FC<{
  initial?: Institution;
  onSave: (data: InstFormData) => void;
  onClose: () => void;
}> = ({ initial, onSave, onClose }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<InstFormData>({
    mode: "onChange",
    defaultValues: {
      name: initial?.name ?? "",
      shortName: initial?.shortName ?? "",
      location: initial?.location ?? "",
      type: initial?.type ?? "University",
    },
  });

  const typeOptions = INST_TYPES.map((t) => ({ value: t, label: t }));

  const submit = (data: InstFormData) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed w-full h-full backdrop-blur-sm inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-serif font-light text-[#0c0d0e] text-[20px] tracking-tight">
            {initial ? "Edit Institution" : "Add Institution"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)}>
          <div className="px-6 py-5 space-y-4">
            <FormField
              id="name"
              label="Full Name"
              placeholder="e.g. University of Ghana"
              registration={register("name", {
                required: "Full name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
              error={errors.name}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="shortName"
                label="Short Name"
                placeholder="e.g. UG"
                registration={register("shortName", {
                  required: "Short name is required",
                })}
                error={errors.shortName}
                required
              />

              <Dropdown
                label="Type"
                name="type"
                control={control}
                options={typeOptions}
                placeholder="Select type"
                error={errors.type}
                required
              />
            </div>

            <FormField
              id="location"
              label="Location"
              placeholder="e.g. Accra"
              registration={register("location", {
                required: "Location is required",
              })}
              error={errors.location}
              required
            />
          </div>

          <div className="px-6 pb-6 pt-2 flex gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 py-2.5 rounded-xl bg-[#0C447C] hover:bg-[#185FA5] text-white text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {initial ? "Save changes" : "Add institution"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InstForm;
