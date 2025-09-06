"use client";

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
  CreditCard,
  Fingerprint,
} from "lucide-react";

export default function FaceBVNVerification() {
  type Step =
    | "intro"
    | "bvn-input"
    | "nin-input"
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
  const [bvn, setBvn] = useState("");
  const [nin, setNin] = useState("");
  const [bvnError, setBvnError] = useState("");
  const [ninError, setNinError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const autoCaptureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const [ovalColor, setOvalColor] = useState<"yellow" | "red" | "green">(
    "yellow"
  );

  // Validate BVN format (11 digits)
  const validateBvn = (value: string): boolean => {
    const bvnRegex = /^\d{11}$/;
    return bvnRegex.test(value);
  };

  // Validate NIN format (11 digits)
  const validateNin = (value: string): boolean => {
    const ninRegex = /^\d{11}$/;
    return ninRegex.test(value);
  };

  // Handle BVN input
  const handleBvnSubmit = () => {
    if (validateBvn(bvn)) {
      setBvnError("");
      setStep("nin-input");
    } else {
      setBvnError("BVN must be 11 digits");
    }
  };

  // Handle NIN input and matching logic
  const handleNinSubmit = () => {
    if (!validateNin(nin)) {
      setNinError("NIN must be 11 digits");
      return;
    }

    setNinError("");

    // In a real application, this would be an API call to verify the BVN-NIN match
    // For demo purposes, we'll simulate a successful match if the last 4 digits are the same
    const bvnLastFour = bvn.slice(-4);
    const ninLastFour = nin.slice(-4);

    if (bvnLastFour === ninLastFour) {
      setStep("permissions");
    } else {
      setErrorMessage("BVN and NIN do not match. Please check your details.");
      setStep("error");
    }
  };

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
        console.error("Camera permission denied:", err);
        setErrorMessage(
          "Camera access is required for facial verification. Please enable camera permissions in your browser settings."
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
      } catch (err) {
        console.warn("Microphone permission denied:", err);
      }

      // LOCATION (optional)
      if ("geolocation" in navigator) {
        try {
          await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 300000,
            })
          );
          setPermissions((p) => ({ ...p, location: true }));
        } catch (err) {
          console.warn("Location permission denied:", err);
        }
      }

      setStep("camera");
      initializeCamera();
    } catch (error) {
      console.error("Error requesting permissions:", error);
      setErrorMessage(
        "Failed to request necessary permissions. Please check your browser settings."
      );
      setStep("error");
    }
  };

  // ------- Camera setup / teardown
  const initializeCamera = async () => {
    try {
      // Stop any existing stream first
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
      // Helpful attributes for mobile autoplay policies
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
          .catch((err) => {
            console.error("Error playing video:", err);
            setErrorMessage("Failed to start camera. Please try again.");
            setStep("error");
          });
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
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

    const FaceDetectorCtor: typeof FaceDetector | undefined = (
      window as typeof window
    ).FaceDetector;
    const hasFaceDetector = typeof FaceDetectorCtor === "function";
    const detector = hasFaceDetector
      ? new FaceDetectorCtor({ fastMode: true, maxDetectedFaces: 1 })
      : null;

    const HOLD_MS = 1200; // require steady face for this long before auto-capture
    const MIN_BOX_RATIO = 0.22; // min face box height relative to video height

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
    if (video.readyState < 2) return; // HAVE_CURRENT_DATA

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // match canvas to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Mirror drawing (to match user-facing preview)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
    setShowPreview(true);

    // Stop camera and detection to freeze the frame
    cancelDetectionLoop();
    stopCameraStream();

    // Begin countdown to processing
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

    // Simulate API call
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
    setStep("bvn-input");
  };

  const cleanupEverything = () => {
    // stop timers/timeouts
    if (autoCaptureTimeoutRef.current) {
      clearTimeout(autoCaptureTimeoutRef.current);
      autoCaptureTimeoutRef.current = null;
    }
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }

    // stop countdown
    setIsCounting(false);
    setCountdown(3);

    // stop camera + detection
    cancelDetectionLoop();
    stopCameraStream();

    // reset state
    setCapturedImage(null);
    setShowPreview(false);
    setVerificationStatus("idle");
    setErrorMessage("");
    holdStartRef.current = null;
    setFaceHint(null);
    setIsHoldingSteady(false);
    setBvn("");
    setNin("");
    setBvnError("");
    setNinError("");

    // return to intro
    setStep("intro");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupEverything();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------- UI helpers
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
                Bank-verified identity authentication
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
              <h3 className="font-medium text-sm">
                BVN-NIN Facial Verification
              </h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Secure BVN to NIN verification using facial recognition technology
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === "intro" && (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-full p-4 inline-flex mb-6">
                <Fingerprint className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                BVN to NIN Verification
              </h3>
              <p className="text-foreground/70 mb-6">
                To verify your identity by matching your BVN with your NIN using
                facial recognition, we need access to your camera and optionally
                your microphone for enhanced security.
              </p>

              <div className="bg-primary/5 rounded-lg p-4 text-left mb-6">
                <h4 className="font-medium text-primary mb-2">
                  Required Access:
                </h4>
                <ul className="text-sm text-foreground/80 space-y-3">
                  <li className="flex items-start">
                    <CreditCard className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">BVN & NIN</span>
                      <p className="text-foreground/60">
                        Your Bank Verification Number and National
                        Identification Number
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Camera className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">Camera</span>
                      <p className="text-foreground/60">
                        To capture your facial image for verification
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
                </ul>
              </div>

              {/* Auto-capture option */}
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
                <Fingerprint className="h-5 w-5 mr-2" /> Start Verification
              </button>

              <Link
                href="/verify/verification-options"
                className="inline-block mt-4 text-primary hover:text-primary/80 text-sm font-medium"
              >
                Use other verification methods
              </Link>
            </div>
          )}

          {step === "bvn-input" && (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-full p-4 inline-flex mb-6">
                <CreditCard className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Enter Your BVN
              </h3>
              <p className="text-foreground/70 mb-6">
                Please provide your 11-digit Bank Verification Number
              </p>

              <div className="mb-4">
                <input
                  type="text"
                  value={bvn}
                  onChange={(e) =>
                    setBvn(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  placeholder="Enter your 11-digit BVN"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {bvnError && (
                  <p className="text-red-500 text-sm mt-1">{bvnError}</p>
                )}
              </div>

              <button
                onClick={handleBvnSubmit}
                disabled={bvn.length !== 11}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Continue to NIN
              </button>

              <button
                onClick={cleanupEverything}
                className="w-full mt-3 text-foreground/70 hover:text-foreground py-2 font-medium"
              >
                Cancel
              </button>
            </div>
          )}

          {step === "nin-input" && (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-full p-4 inline-flex mb-6">
                <Fingerprint className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Enter Your NIN
              </h3>
              <p className="text-foreground/70 mb-6">
                Please provide your 11-digit National Identification Number
              </p>

              <div className="mb-4">
                <input
                  type="text"
                  value={nin}
                  onChange={(e) =>
                    setNin(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  placeholder="Enter your 11-digit NIN"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {ninError && (
                  <p className="text-red-500 text-sm mt-1">{ninError}</p>
                )}
              </div>

              <button
                onClick={handleNinSubmit}
                disabled={nin.length !== 11}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Verify & Continue
              </button>

              <button
                onClick={() => setStep("bvn-input")}
                className="w-full mt-3 text-foreground/70 hover:text-foreground py-2 font-medium"
              >
                Back to BVN
              </button>
            </div>
          )}

          {step === "permissions" && (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-full p-4 inline-flex mb-6">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Requesting Permissions
              </h3>
              <p className="text-foreground/70 mb-6">
                Please allow the following permissions when prompted by your
                browser to continue with BVN to NIN verification.
              </p>

              <div className="bg-primary/5 rounded-lg p-4 text-left mb-6">
                <div className="flex items-center mb-3">
                  <Camera className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Camera Access</span>
                </div>
                <div className="flex items-center mb-3">
                  <Mic className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">
                    Microphone Access (Optional)
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">
                    Location Access (Optional)
                  </span>
                </div>
              </div>

              <div className="rounded-lg p-4 bg-amber-50 border border-amber-200 mb-6">
                <p className="text-amber-700 text-sm flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    If you don’t see permission prompts, check the address bar
                    for camera/microphone icons.
                  </span>
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

          {step === "camera" && (
            <div className="text-center py-2">
              <h3 className="text-xl font-bold text-foreground mb-2">
                BVN to NIN Face Verification
              </h3>
              <p className="text-foreground/70 mb-4">
                Position your face inside the oval. Good light helps.
              </p>

              <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-4 aspect-[3/4]">
                {/* Live video */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />

                {/* Human-face overlay (SVG silhouette + guides) */}
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

                {/* subtle status chip */}
                {faceHint && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">
                    {faceHint}
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Preview box always present; shows live placeholder until capture */}
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

              <div className="bg-primary/5 rounded-lg p-3 mb-4">
                <p className="text-xs text-foreground/70">
                  <strong>Verification in progress:</strong> Your image will be
                  compared with your BVN and NIN records.
                </p>
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

              {/* Cancel hidden/disabled during verification */}
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
              {verificationStatus === "verifying" && (
                <>
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Verifying Your BVN to NIN Match
                  </h3>
                  <p className="text-foreground/70">
                    Comparing your facial data with your bank&apos;s BVN and NIN
                    records…
                  </p>
                  <div className="mt-6 bg-border rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <div className="bg-green-100 rounded-full p-4 inline-flex mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                BVN to NIN Verification Successful!
              </h3>
              <p className="text-foreground/70 mb-6">
                Your Bank Verification Number has been successfully matched with
                your National Identification Number using facial recognition.
              </p>
              <div className="bg-primary/5 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-foreground mb-2">
                  Verification Details
                </h4>
                <div className="text-sm text-foreground/70 space-y-1">
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="font-medium">Facial Recognition</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BVN-NIN Match:</span>
                    <span className="font-medium">Confirmed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">Less than 30 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-600">Verified</span>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="block w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Continue to Dashboard
              </Link>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-6">
              <div className="bg-red-100 rounded-full p-4 inline-flex mb-6">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                BVN to NIN Verification Failed
              </h3>
              <p className="text-foreground/70 mb-4">{errorMessage}</p>

              {capturedImage && (
                <div className="mb-6">
                  <div className="relative mx-auto w-40 h-40 border border-border rounded-lg overflow-hidden">
                    <Image
                      src={capturedImage}
                      alt="Captured face"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <RotateCw className="h-5 w-5 mr-2" /> Try Again
                </button>
                <Link
                  href="/identity"
                  className="flex-1 border border-border hover:bg-primary/5 text-foreground py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Other Method
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-primary/5 p-4 text-center border-t border-border">
          <p className="text-xs text-foreground/70">
            Your BVN, NIN, and facial data are encrypted and processed securely
            for verification purposes only. We do not store your biometric
            information.
          </p>
        </div>
      </div>
    </div>
  );
}
