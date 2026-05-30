"use no memo";
import { useMemo, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { X, ImagePlus, Trash2 } from "lucide-react";
import { useRegionsFlat } from "@/hooks/queries/useRegions";
import type { EventType, NupsgEvent, CreateEventInput } from "@/api/events.api";
import Dropdown from "@/components/ui/Dropdown";
import FormField from "@/components/ui/FormField";

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: "conference", label: "Conference" },
  { value: "rally", label: "Rally" },
  { value: "prayer", label: "Prayer" },
  { value: "bible-study", label: "Bible Study" },
  { value: "other", label: "Other" },
];

const emptyEvent = (): CreateEventInput => ({
  title: "",
  description: "",
  type: "conference",
  status: "upcoming",
  date: "",
  time: "",
  location: "",
  regionId: "",
  presbyteryId: "",
  attendanceCap: 100,
});

// ─── Component ────────────────────────────────────────────────────────────────

const EventModal: React.FC<{
  event?: NupsgEvent | null;
  onClose: () => void;
  // Returns FormData so the caller can send multipart when an image is attached
  onSave: (data: CreateEventInput, imageFile?: File) => void;
}> = ({ event, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateEventInput>({
    mode: "onChange",
    defaultValues: event
      ? {
          title: event.title,
          description: event.description,
          type: event.type,
          status: event.status,
          date: event.date,
          time: event.time,
          location: event.location,
          regionId: event.regionId,
          presbyteryId: event.presbyteryId,
          attendanceCap: event.attendanceCap,
        }
      : emptyEvent(),
  });

  // ── Image state ────────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.image ?? null,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Regions ────────────────────────────────────────────────────────────────
  const { data: regions = [] } = useRegionsFlat();

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedRegionId = watch("regionId");
  const initialRegionId = event?.regionId;

  const regionOptions = useMemo(
    () => regions.map((r) => ({ value: r.id, label: r.name })),
    [regions],
  );

  const presbyteryOptions = useMemo(() => {
    const region = regions.find((r) => r.id === selectedRegionId);
    return (region?.presbyteries ?? []).map((p) => ({
      value: p.id,
      label: p.name,
    }));
  }, [regions, selectedRegionId]);

  useEffect(() => {
    if (selectedRegionId && selectedRegionId !== initialRegionId) {
      setValue("presbyteryId", "");
    }
  }, [selectedRegionId, initialRegionId, setValue]);

  const descReg = register("description", {
    required: "Description is required",
    minLength: { value: 10, message: "At least 10 characters" },
  });

  const handleFormSubmit = (data: CreateEventInput) => {
    onSave(data, imageFile ?? undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0d0e]/40 backdrop-blur-md">
      <div className="overflow-hidden rounded-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-xl modal-scroll shadow-md w-full sm:w-xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
            <h2 className="font-serif font-light text-[#0c0d0e] text-[22px] tracking-tight">
              {event ? "Edit Event" : "Create Event"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="px-6 py-5 space-y-5">
              {/* Image upload */}
              <div>
                <label className="block mb-1.5 font-semibold text-gray-500 text-sm">
                  Cover Image
                  <span className="text-slate-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-3/1">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#185FA5] hover:bg-slate-50 transition-colors text-slate-400 hover:text-[#185FA5]"
                  >
                    <ImagePlus size={20} />
                    <span className="text-[12px] font-medium">
                      Click to upload a cover image
                    </span>
                    <span className="text-[11px]">
                      JPG, PNG, WebP — max 5MB
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <FormField
                id="title"
                label="Title"
                placeholder="eg. National Delegates Conference"
                registration={register("title", {
                  required: "Title is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                })}
                error={errors.title}
                required
              />

              <div>
                <label
                  htmlFor="description"
                  className="block mb-1.5 font-semibold text-gray-500 text-sm"
                >
                  Description
                  <span className="text-red-500 ml-0.5" aria-hidden="true">
                    *
                  </span>
                </label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Brief description of the event..."
                  aria-invalid={Boolean(errors.description)}
                  className={`border rounded-md p-2.5 text-sm w-full resize-none focus:ring-2 focus:ring-offset-2 focus:outline-none transition-colors duration-150 ${
                    errors.description
                      ? "border-red-400 focus:ring-red-400"
                      : "border-blue-400 focus:ring-blue-400"
                  }`}
                  {...descReg}
                />
                {errors.description && (
                  <span
                    role="alert"
                    className="flex items-center gap-1 mt-1 text-xs text-red-500 font-medium tracking-wide"
                  >
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  label="Event Type"
                  name="type"
                  control={control}
                  options={EVENT_TYPE_OPTIONS}
                  placeholder="Select type"
                  error={errors.type}
                  required
                />
                <FormField
                  id="attendanceCap"
                  label="Attendance Cap"
                  type="number"
                  registration={register("attendanceCap", {
                    required: "Attendance cap is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Must be at least 1" },
                  })}
                  error={errors.attendanceCap}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="date"
                  label="Date"
                  type="date"
                  registration={register("date", {
                    required: "Date is required",
                  })}
                  error={errors.date}
                  required
                />
                <FormField
                  id="time"
                  label="Time"
                  type="time"
                  registration={register("time", {
                    required: "Time is required",
                  })}
                  error={errors.time}
                  required
                />
              </div>

              <FormField
                id="location"
                label="Location"
                placeholder="eg. KNUST, Kumasi"
                registration={register("location", {
                  required: "Location is required",
                })}
                error={errors.location}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Dropdown
                  label="Region"
                  name="regionId"
                  control={control}
                  options={regionOptions}
                  placeholder="Select region"
                  error={errors.regionId}
                  searchable
                  required
                />
                <Dropdown
                  label="Presbytery"
                  name="presbyteryId"
                  control={control}
                  options={presbyteryOptions}
                  placeholder={
                    !selectedRegionId
                      ? "Select a region first"
                      : "Select presbytery"
                  }
                  error={errors.presbyteryId}
                  searchable
                  required
                />
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex gap-3 sticky bottom-0 bg-white border-t border-slate-100">
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
                {event ? "Save changes" : "Create event"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EventModal;
