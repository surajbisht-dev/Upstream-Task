export const formatDate = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "-";
  }
};

export const formatDateTime = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "-";
  }
};

export const daysLeft = (iso) => {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};
