"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Contact, QrCode, ScanLine, Wallet } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

type Mode = "nfc" | "scan" | "show";

type NdefReaderLike = {
  scan: () => Promise<void>;
  onreading?: ((event: { serialNumber?: string; message?: { records?: Array<{ recordType: string; data?: BufferSource }> } }) => void) | null;
};

declare global {
  interface Window {
    NDEFReader?: new () => NdefReaderLike;
    BarcodeDetector?: new (options?: { formats?: string[] }) => { detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>> };
  }
}

export default function WalletPage() {
  const [mode, setMode] = useState<Mode>("nfc");
  const [nfcSupported, setNfcSupported] = useState(false);
  const [nfcStatus, setNfcStatus] = useState("Przyłóż telefon do terminala NFC.");
  const [scanSupported, setScanSupported] = useState(false);
  const [scanStatus, setScanStatus] = useState("Uruchom kamerę i zeskanuj kod QR.");
  const [scannedValue, setScannedValue] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setNfcSupported(typeof window !== "undefined" && Boolean(window.NDEFReader));
    setScanSupported(typeof window !== "undefined" && Boolean(window.BarcodeDetector) && Boolean(navigator.mediaDevices?.getUserMedia));
    return () => stopCamera();
  }, []);

  const startNfc = async () => {
    if (!window.NDEFReader) {
      setNfcStatus("Twoja przeglądarka nie obsługuje Web NFC.");
      return;
    }

    try {
      const reader = new window.NDEFReader();
      await reader.scan();
      setNfcStatus("Skanowanie NFC aktywne. Przyłóż telefon do znacznika.");
      reader.onreading = (event) => {
        const serial = event.serialNumber ? `Tag: ${event.serialNumber}` : "Tag NFC odczytany.";
        setNfcStatus(`${serial} Płatność zatwierdzona.`);
      };
    } catch {
      setNfcStatus("Nie udało się uruchomić NFC. Sprawdź uprawnienia.");
    }
  };

  const stopCamera = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
  };

  const startQrScan = async () => {
    if (!window.BarcodeDetector || !navigator.mediaDevices?.getUserMedia) {
      setScanStatus("Skanowanie QR nie jest wspierane na tym urządzeniu.");
      return;
    }

    try {
      setScannedValue("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      cameraStreamRef.current = stream;

      if (!videoRef.current) {
        setScanStatus("Nie udało się uruchomić podglądu kamery.");
        return;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setScanStatus("Skanowanie aktywne...");

      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });

      const detectFrame = async () => {
        if (!videoRef.current) {
          return;
        }

        try {
          const barcodes = await detector.detect(videoRef.current);
          const first = barcodes[0]?.rawValue;
          if (first) {
            setScannedValue(first);
            setScanStatus("Kod QR zeskanowany pomyślnie.");
            stopCamera();
            return;
          }
        } catch {
          setScanStatus("Błąd podczas skanowania. Spróbuj ponownie.");
          stopCamera();
          return;
        }

        rafRef.current = requestAnimationFrame(detectFrame);
      };

      rafRef.current = requestAnimationFrame(detectFrame);
    } catch {
      setScanStatus("Brak dostępu do kamery. Zezwól na aparat.");
    }
  };

  const paymentQrValue = "superapp://pay?merchant=PL-SKLEP-01&amount=23.99&currency=PLN";

  return (
    <div className="min-h-[100dvh] max-w-md mx-auto p-4 flex flex-col gap-4">
      <header className="flex items-center gap-3 cs-panel p-4 rounded-md">
        <Link href="/" className="text-cs-orange hover:bg-white/5 p-2 rounded-full transition-colors">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
          <Wallet size={18} className="text-cs-orange" />
          Płatności
        </h1>
      </header>

      <div className="grid grid-cols-3 gap-2 bg-[#181818] p-1 rounded-xl">
        <button onClick={() => setMode("nfc")} className={`py-2 rounded-lg text-xs tracking-widest font-bold ${mode === "nfc" ? "bg-cs-orange text-black" : "text-white/70"}`}>
          NFC
        </button>
        <button onClick={() => setMode("scan")} className={`py-2 rounded-lg text-xs tracking-widest font-bold ${mode === "scan" ? "bg-cs-orange text-black" : "text-white/70"}`}>
          SKAN QR
        </button>
        <button onClick={() => setMode("show")} className={`py-2 rounded-lg text-xs tracking-widest font-bold ${mode === "show" ? "bg-cs-orange text-black" : "text-white/70"}`}>
          MÓJ QR
        </button>
      </div>

      {mode === "nfc" && (
        <section className="cs-panel rounded-xl p-5 flex-1 flex flex-col items-center justify-center text-center gap-4">
          <Contact size={64} className="text-cs-orange" />
          <p className="text-sm text-white/85 normal-case">{nfcStatus}</p>
          <button onClick={startNfc} className="cs-btn rounded-md w-full" disabled={!nfcSupported}>
            {nfcSupported ? "Uruchom NFC" : "NFC niedostępne"}
          </button>
          {!nfcSupported && <p className="text-xs text-white/50 normal-case">Web NFC działa głównie na Android + Chrome.</p>}
        </section>
      )}

      {mode === "scan" && (
        <section className="cs-panel rounded-xl p-4 flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-white/80">
            <ScanLine size={18} className="text-cs-orange" />
            <p className="text-sm normal-case">{scanStatus}</p>
          </div>

          <div className="bg-black rounded-lg overflow-hidden border border-white/10 min-h-[280px] flex items-center justify-center">
            <video ref={videoRef} className="w-full h-[280px] object-cover" muted playsInline />
          </div>

          <button onClick={startQrScan} className="cs-btn rounded-md w-full" disabled={!scanSupported}>
            {scanSupported ? "Start skanowania" : "Skaner niedostępny"}
          </button>
          <button onClick={stopCamera} className="border border-white/20 rounded-md py-3 text-sm font-bold tracking-widest">
            Zatrzymaj kamerę
          </button>

          {scannedValue ? (
            <div className="bg-[#151515] border border-cs-orange/40 rounded-md p-3">
              <p className="text-xs text-white/60 mb-1">Zeskanowany kod:</p>
              <p className="text-sm normal-case break-words">{scannedValue}</p>
            </div>
          ) : null}
        </section>
      )}

      {mode === "show" && (
        <section className="cs-panel rounded-xl p-5 flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <QrCode size={40} className="text-cs-orange" />
          <div className="bg-white p-3 rounded-lg">
            <QRCodeCanvas value={paymentQrValue} size={210} />
          </div>
          <p className="text-sm text-white/80 normal-case">Pokaż ten kod, aby odebrać płatność.</p>
        </section>
      )}
    </div>
  );
}
