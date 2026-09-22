import React from "react";
import { X, Copy, Check, ExternalLink } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, url }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&format=svg&data=${encodeURIComponent(
    url
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 border border-white/20 p-6 text-white shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition"
          aria-label="Close QR Modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white shadow-lg">
            📱
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Scan to Open on Mobile
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Scan with your phone camera to open and share your personalized greeting on WhatsApp & Instagram.
          </p>

          <div className="mt-5 mx-auto flex h-60 w-60 items-center justify-center rounded-2xl bg-white p-3 shadow-inner">
            <img
              src={qrImageUrl}
              alt="QR Code to share wish"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition border border-white/10"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? "Link Copied!" : "Copy Link"}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
