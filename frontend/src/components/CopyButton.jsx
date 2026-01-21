import Button from "./Button";

export default function CopyButton({ text, label = "Copy" }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (e) {
      alert("Copy failed. You can manually select and copy.");
    }
  };

  return (
    <Button variant="secondary" onClick={copy} type="button">
      {label}
    </Button>
  );
}
