const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export { formatDate };
