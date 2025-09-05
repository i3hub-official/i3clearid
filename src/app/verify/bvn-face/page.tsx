"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Video,
} from "lucide-react";
import Link from "next/link";

export default function FaceBVNVerification() {
  const [step, setStep] = useState<
    "intro" | "permissions" | "camera" | "processing" | "success" | "error"
  >("intro");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(false);
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    location: false,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check and request permissions
  const requestPermissions = async () => {
    try {
      setStep("permissions");

      // Request camera access
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        cameraStream.getTracks().forEach((track) => track.stop());
        setPermissions((prev) => ({ ...prev, camera: true }));
      } catch (err) {
        console.error("Camera permission denied:", err);
        setErrorMessage(
          "Camera access is required for facial verification. Please enable camera permissions in your browser settings."
        );
        setStep("error");
        return;
      }

      // Request microphone access (for liveness detection)
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        micStream.getTracks().forEach((track) => track.stop());
        setPermissions((prev) => ({ ...prev, microphone: true }));
      } catch (err) {
        console.warn("Microphone permission denied:", err);
        // Continue without microphone as it's not critical for basic verification
      }

      // Request location access (for security purposes)
      if ("geolocation" in navigator) {
        try {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 300000,
            });
          });
          setPermissions((prev) => ({ ...prev, location: true }));
        } catch (err) {
          console.warn("Location permission denied:", err);
          // Continue without location as it's not critical for verification
        }
      }

      // After permissions are handled, proceed to camera
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

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setErrorMessage(
        "Camera access denied. Please allow camera permissions to continue."
      );
      setStep("error");
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data URL
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        setIsCameraActive(false);
      }

      // Start countdown before processing
      setIsCounting(true);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (isCounting && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isCounting && countdown === 0) {
      setIsCounting(false);
      setCountdown(3);
      processVerification();
    }
  }, [isCounting, countdown]);

  // Process verification
  const processVerification = () => {
    setStep("processing");
    setVerificationStatus("verifying");

    // Simulate API call
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo

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
    }, 3000);
  };

  // Retry verification
  const handleRetry = () => {
    setStep("camera");
    setVerificationStatus("idle");
    setErrorMessage("");
    setCapturedImage(null);
    initializeCamera();
  };

  // Start verification
  const startVerification = () => {
    requestPermissions();
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
              <h3 className="font-medium text-sm">BVN Facial Verification</h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Secure BVN verification using facial recognition technology
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
                BVN Face Verification
              </h3>
              <p className="text-foreground/70 mb-6">
                To verify your BVN using facial recognition, we need access to
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
                        To capture your facial image for verification against
                        your BVN records
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

              <div className="bg-blue-50 rounded-lg p-4 text-left mb-6 border border-blue-100">
                <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-1" /> Security Assurance
                </h4>
                <p className="text-blue-600 text-sm">
                  Your biometric data is encrypted, processed securely, and
                  never stored. This verification is conducted in partnership
                  with your bank.
                </p>
              </div>

              <button
                onClick={startVerification}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Camera className="h-5 w-5 mr-2" />
                Allow Access & Continue
              </button>

              <Link
                href="/verify/bvn"
                className="inline-block mt-4 text-primary hover:text-primary/80 text-sm font-medium"
              >
                Use traditional verification instead
              </Link>
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
                browser to continue with BVN verification.
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
                    If you don&apos;t see permission prompts, check your browser&apos;s
                    address bar for camera/microphone icons.
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
              <h3 className="text-xl font-bold text-foreground mb-4">
                BVN Face Verification
              </h3>
              <p className="text-foreground/70 mb-4">
                Position your face in the center of the frame for verification
              </p>

              <div className="relative bg-border rounded-lg overflow-hidden mb-4 aspect-[3/4]">
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-foreground/50">
                      Initializing camera...
                    </div>
                  </div>
                )}

                {/* Face guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white border-dashed rounded-full h-48 w-48 flex items-center justify-center">
                    <div className="bg-white/20 rounded-full h-40 w-40"></div>
                  </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="bg-primary/5 rounded-lg p-3 mb-4">
                <p className="text-xs text-foreground/70">
                  <strong>Verification in progress:</strong> This image will be
                  compared to your BVN records for identity verification.
                </p>
              </div>

              <button
                onClick={capturePhoto}
                disabled={!isCameraActive}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {isCounting ? `Verifying in ${countdown}...` : "Capture Image"}
              </button>

              <button
                onClick={() => {
                  if (streamRef.current) {
                    streamRef.current
                      .getTracks()
                      .forEach((track) => track.stop());
                  }
                  setStep("intro");
                }}
                className="w-full mt-3 text-foreground/70 hover:text-foreground py-2 font-medium"
              >
                Cancel Verification
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              {verificationStatus === "verifying" ? (
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
                    Verifying Your BVN
                  </h3>
                  <p className="text-foreground/70">
                    Comparing your facial data with your bank&apos;s BVN records...
                  </p>

                  <div className="mt-6 bg-border rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <div className="bg-green-100 rounded-full p-4 inline-flex mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">
                BVN Verification Successful!
              </h3>
              <p className="text-foreground/70 mb-6">
                Your Bank Verification Number has been successfully verified
                using facial recognition.
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
                    <span>Verification:</span>
                    <span className="font-medium">BVN Match Confirmed</span>
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
                BVN Verification Failed
              </h3>
              <p className="text-foreground/70 mb-4">{errorMessage}</p>

              {capturedImage && (
                <div className="mb-6">
                  <p className="text-sm text-foreground/50 mb-2">
                    Captured Image:
                  </p>
                  <img
                    src={capturedImage}
                    alt="Captured face"
                    className="mx-auto rounded-lg border border-border max-h-40"
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <RotateCw className="h-5 w-5 mr-2" />
                  Try Again
                </button>

                <Link
                  href="/bvn-verification"
                  className="flex-1 border border-border hover:bg-primary/5 text-foreground py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Other Method
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-primary/5 p-4 text-center border-t border-border">
          <p className="text-xs text-foreground/70">
            Your facial data is encrypted and processed securely for BVN
            verification purposes only. We do not store your biometric
            information.
          </p>
        </div>
      </div>
    </div>
  );
}
