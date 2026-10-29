import { FaShareAlt } from "react-icons/fa";

interface ShareProps {
  hotel_id?: number;
  name: string;
}

export const sharebutton = ({ hotel_id, name }: ShareProps) => {
  const handleShare = async () => {
    const link = `${window.location.origin}/hotels/${hotel_id}/rooms`;

    if (navigator.share) {
      await navigator.share({ title: name, text: `Check out ${name}`, url: link }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied. Paste it to share!");
    } catch {
      window.prompt("Copy this link:", link);
    }
  };

  return (
    <button type="button" onClick={handleShare}>
      <FaShareAlt /> Share
    </button>
  );
};

export default sharebutton;