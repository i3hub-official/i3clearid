"use client";

// Add FaceDetector type for browsers that support it
declare global {
  interface Window {
    FaceDetector?: typeof FaceDetector;
  }
  // Minimal FaceDetector type definition
  // Remove if you have a polyfill or @types/face-api.js
  // This is for TypeScript only, not runtime
  var FaceDetector: {
    new (options?: { fastMode?: boolean; maxDetectedFaces?: number }): {
      detect: (image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => Promise<
        Array<{
          boundingBox: DOMRectReadOnly;
          landmarks?: Array<{ x: number; y: number }>;
        }>
      >;
    };
  };
}

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  RotateCw,
  Home,
  ArrowLeft,
  Mic,
  MapPin,
} from "lucide-react";

export default function FaceNINVerification() {
  type Step =
    | "intro"
    | "permissions"
    | "camera"
    | "processing"
    | "success"
    | "error";
  type VStatus = "idle" | "verifying" | "success" | "error";

  const [step, setStep] = useState<Step>("intro");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(false);
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    location: false,
  });
  const [autoCapture, setAutoCapture] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [faceHint, setFaceHint] = useState<string | null>(null);
  const [isHoldingSteady, setIsHoldingSteady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const holdStartRef = useRef<number | null>(null);

  // ------- Permission flow
  const requestPermissions = async () => {
    try {
      setStep("permissions");

      // CAMERA
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        s.getTracks().forEach((t) => t.stop());
        setPermissions((p) => ({ ...p, camera: true }));
      } catch (err) {
        setErrorMessage(
          "Camera access is required for facial verification. Please enable camera permissions."
        );
        setStep("error");
        return;
      }

      // MICROPHONE (optional)
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        s.getTracks().forEach((t) => t.stop());
        setPermissions((p) => ({ ...p, microphone: true }));
      } catch {
        console.warn("Microphone permission denied");
      }

      // LOCATION (optional)
      if ("geolocation" in navigator) {
        try {
          await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
            })
          );
          setPermissions((p) => ({ ...p, location: true }));
        } catch {
          console.warn("Location permission denied");
        }
      }

      setStep("camera");
      initializeCamera();
    } catch (error) {
      setErrorMessage(
        "Failed to request necessary permissions. Please check your browser settings."
      );
      setStep("error");
    }
  };

  // ------- Camera setup / teardown
  const initializeCamera = async () => {
    try {
      stopCameraStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", "true");
      videoRef.current.muted = true;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current
          ?.play()
          .then(() => {
            streamRef.current = stream;
            setIsCameraActive(true);
            startDetectionLoop();
          })
          .catch(() => {
            setErrorMessage("Failed to start camera. Please try again.");
            setStep("error");
          });
      };
    } catch {
      setErrorMessage(
        "Camera access denied. Please allow camera permissions to continue."
      );
      setStep("error");
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // ------- Detection & Auto-capture
  const startDetectionLoop = () => {
    cancelDetectionLoop();
    const FaceDetectorCtor: typeof FaceDetector | undefined = (window as typeof window).FaceDetector;
    const hasFaceDetector = typeof FaceDetectorCtor === "function";
    const detector = hasFaceDetector
      ? new FaceDetectorCtor({ fastMode: true, maxDetectedFaces: 1 })
      : null;

    const HOLD_MS = 1200;
    const MIN_BOX_RATIO = 0.22;

    const loop = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const video = videoRef.current;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      let faceOk = false;

      if (hasFaceDetector && detector) {
        try {
          const faces: Array<{
            boundingBox: DOMRectReadOnly;
            landmarks?: Array<{ x: number; y: number }>;
          }> = await detector.detect(video);
          if (faces && faces.length > 0) {
            const box = faces[0].boundingBox as DOMRectReadOnly;
            const centerX = box.x + box.width / 2;
            const centerY = box.y + box.height / 2;

            const centeredX = centerX > vw * 0.35 && centerX < vw * 0.65;
            const centeredY = centerY > vh * 0.3 && centerY < vh * 0.7;
            const bigEnough = box.height / vh >= MIN_BOX_RATIO;

            faceOk = centeredX && centeredY && bigEnough;
            setFaceHint(
              faceOk
                ? "Hold still… capturing"
                : !bigEnough
                ? "Move closer"
                : "Center your face"
            );
          } else {
            setFaceHint("We can’t see your face");
          }
        } catch {
          console.warn("FaceDetector error/fallback");
        }
      } else {
        setFaceHint("Align your face within the oval");
      }

      const now = performance.now();
      if (autoCapture && faceOk) {
        if (holdStartRef.current == null) holdStartRef.current = now;
        const heldFor = now - (holdStartRef.current ?? now);
        setIsHoldingSteady(heldFor >= HOLD_MS * 0.5);
        if (heldFor >= HOLD_MS && step === "camera" && !isCounting) {
          capturePhoto();
        }
      } else {
        holdStartRef.current = null;
        setIsHoldingSteady(false);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  const cancelDetectionLoop = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // ------- Capture
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.readyState < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    setShowPreview(true);

    cancelDetectionLoop();
    stopCameraStream();
    setIsCounting(true);
  };

  // ------- Verification simulation
  useEffect(() => {
    if (isCounting && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (isCounting && countdown === 0) {
      setIsCounting(false);
      setCountdown(3);
      processVerification();
    }
  }, [isCounting, countdown]);

  const processVerification = () => {
    setStep("processing");
    setVerificationStatus("verifying");

    processingTimeoutRef.current = setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      if (isSuccess) {
        setVerificationStatus("success");
        setStep("success");
      } else {
        setErrorMessage(
          "Face verification failed. Please try again or use another method."
        );
        setVerificationStatus("error");
        setStep("error");
      }
      processingTimeoutRef.current = null;
    }, 2000);
  };

  // ------- Retry / Start / Cancel
  const handleRetry = () => {
    setStep("camera");
    setVerificationStatus("idle");
    setErrorMessage("");
    setCapturedImage(null);
    setShowPreview(false);
    holdStartRef.current = null;
    initializeCamera();
  };

  const startVerification = () => {
    requestPermissions();
  };

  const cleanupEverything = () => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }

    setIsCounting(false);
    setCountdown(3);

    cancelDetectionLoop();
    stopCameraStream();

    setCapturedImage(null);
    setShowPreview(false);
    setVerificationStatus("idle");
    setErrorMessage("");
    holdStartRef.current = null;
    setFaceHint(null);
    setIsHoldingSteady(false);

    setStep("intro");
  };

  useEffect(() => {
    return () => {
      cleanupEverything();
    };
  }, []);

  const controlsDisabled =
    step === "processing" || verificationStatus === "verifying" || isCounting;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center mb-2">
                <Shield className="w-8 h-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold">SecureID</h1>
              </div>
              <p className="text-sm text-foreground/70">
                National ID facial authentication
              </p>
            </div>
            <Link
              href="/"
              className="md:hidden text-primary hover:underline flex items-center text-sm"
            >
              <Home className="w-4 h-4 mr-1" /> Home
            </Link>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center mb-2">
              <User className="w-4 h-4 text-primary mr-2" />
              <h3 className="font-medium text-sm">NIN Facial Verification</h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Secure verification using your National Identity Number
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === "intro" && (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-full p-4 inline-flex mb-6">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                NIN Face Verification
              </h3>
              <p className="text-foreground/70 mb-6">
                To verify your NIN using facial recognition, we need access to
                your camera and optionally your microphone for enhanced
                security.
              </p>

              <div className="bg-primary/5 rounded-lg p-4 text-left mb-6">
                <h4 className="font-medium text-primary mb-2">
                  Required Access:
                </h4>
                <ul className="text-sm text-foreground/80 space-y-3">
                  <li className="flex items-start">
                    <Camera className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Camera</span>
                      <p className="text-foreground/60">
                        To capture your face for verification against NIN
                        records
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Mic className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Microphone (Optional)</span>
                      <p className="text-foreground/60">
                        For liveness detection to prevent spoofing
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Location (Optional)</span>
                      <p className="text-foreground/60">
                        To enhance security by verifying your location
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="flex items-center mb-4 justify-center">
                <input
                  type="checkbox"
                  id="autoCapture"
                  checked={autoCapture}
                  onChange={(e) => setAutoCapture(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="autoCapture"
                  className="text-sm text-foreground/80"
                >
                  Enable auto-capture when your face is centered
                </label>
              </div>

              <button
                onClick={startVerification}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Camera className="h-5 w-5 mr-2" /> Allow Access & Continue
              </button>

              <Link
                href="/verify/nin"
                className="inline-block mt-4 text-primary hover:text-primary/80 text-sm font-medium"
              >
                Use traditional verification instead
              </Link>
            </div>
          )}

          {step === "camera" && (
            <div className="text-center py-2">
              <h3 className="text-xl font-bold text-foreground mb-2">
                NIN Face Verification
              </h3>
              <p className="text-foreground/70 mb-4">
                Position your face inside the oval. Good light helps.
              </p>

              <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-4 aspect-[3/4]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <svg viewBox="0 0 320 400" className="w-64 h-80 opacity-90">
                    <ellipse
                      cx="160"
                      cy="180"
                      rx="120"
                      ry="160"
                      fill="none"
                      stroke="white"
                      strokeDasharray="8 10"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
                {faceHint && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">
                    {faceHint}
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="mb-4">
                <p className="text-sm text-foreground/70 mb-2">Preview:</p>
                <div className="relative mx-auto w-32 h-32 border border-border rounded-lg overflow-hidden bg-muted">
                  {capturedImage ? (
                    <Image
                      src={capturedImage}
                      alt="Captured face preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-foreground/50">
                      Image will appear here
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={capturePhoto}
                disabled={!isCameraActive || isCounting || controlsDisabled}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {isCounting
                  ? `Verifying in ${countdown}…`
                  : isHoldingSteady
                  ? "Hold still… capturing"
                  : "Capture Image"}
              </button>

              {!controlsDisabled && (
                <button
                  onClick={cleanupEverything}
                  className="w-full mt-3 text-foreground/70 hover:text-foreground py-2 font-medium"
                >
                  Cancel Verification
                </button>
              )}
            </div>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Verifying Your NIN
              </h3>
              <p className="text-foreground/70">
                Comparing your facial data with the national ID database…
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                NIN Verified Successfully
              </h3>
              <p className="text-foreground/70 mb-4">
                Your facial data matches your National Identification Number.
              </p>

              {capturedImage && (
                <div className="relative mx-auto w-32 h-32 border border-border rounded-lg overflow-hidden bg-muted mb-4">
                  <Image
                    src={capturedImage}
                    alt="Captured face"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <Link
                href="/dashboard"
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors inline-block"
              >
                Continue
              </Link>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-6">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                NIN Verification Failed
              </h3>
              <p className="text-foreground/70 mb-4">{errorMessage}</p>

              {capturedImage && (
                <div className="relative mx-auto w-32 h-32 border border-border rounded-lg overflow-hidden bg-muted mb-4">
                  <Image
                    src={capturedImage}
                    alt="Captured face"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <button
                onClick={handleRetry}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-3 flex items-center justify-center"
              >
                <RotateCw className="h-5 w-5 mr-2" /> Try Again
              </button>

              <Link
                href="/verify/nin"
                className="block text-primary hover:text-primary/80 text-sm font-medium"
              >
                Use traditional verification instead
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted/50 p-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center text-sm text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
          <span className="text-xs text-foreground/50">
            Secure verification powered by SecureID
          </span>
        </div>
      </div>
    </div>
  );
}
