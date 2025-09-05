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
  FileText,
  HelpCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function FaceNINVerification() {
  const [step, setStep] = useState<
    | "intro"
    | "permissions"
    | "camera"
    | "processing"
    | "success"
    | "error"
    | "permission-help"
  >("intro");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(false);
  const [browser, setBrowser] = useState<
    "chrome" | "firefox" | "safari" | "edge" | "other"
  >("chrome");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Detect browser on component mount
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("chrome") > -1 && !(userAgent.indexOf("edg") > -1)) {
      setBrowser("chrome");
    } else if (
      userAgent.indexOf("safari") > -1 &&
      userAgent.indexOf("chrome") === -1
    ) {
      setBrowser("safari");
    } else if (userAgent.indexOf("firefox") > -1) {
      setBrowser("firefox");
    } else if (userAgent.indexOf("edg") > -1) {
      setBrowser("edge");
    } else {
      setBrowser("other");
    }
  }, []);

  // Check and request permissions
  const requestPermissions = async () => {
    try {
      setStep("permissions");

      // Check if the browser supports the mediaDevices API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage(
          "Your browser doesn't support camera access. Please try using a modern browser like Chrome, Firefox, or Safari."
        );
        setStep("error");
        return;
      }

      // Request camera access
      try {
        // Just test if we can get permission, but don't keep the stream yet
        const testStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        // Immediately stop the test stream
        testStream.getTracks().forEach((track) => track.stop());

        // Now proceed to initialize the actual camera
        setStep("camera");
        initializeCamera();
      } catch (err) {
        console.error("Camera permission denied:", err);
        setStep("permission-help");
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
      setErrorMessage(
        "Failed to request camera permissions. Please check your browser settings."
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

        // Wait for the video to be ready before showing it
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setStep("permission-help");
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) return;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

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

  // Browser-specific permission instructions
  const getBrowserInstructions = () => {
    switch (browser) {
      case "chrome":
        return [
          "Click the camera icon in the address bar",
          "Select 'Always allow' from the dropdown menu",
          "Refresh the page and try again",
        ];
      case "firefox":
        return [
          "Click the camera icon in the address bar",
          "Select 'Allow' for camera access",
          "Refresh the page and try again",
        ];
      case "safari":
        return [
          "Go to Safari > Preferences > Websites",
          "Select Camera from the left sidebar",
          "Find this website and set permission to 'Allow'",
          "Refresh the page and try again",
        ];
      case "edge":
        return [
          "Click the camera icon in the address bar",
          "Select 'Always allow' from the dropdown menu",
          "Refresh the page and try again",
        ];
      default:
        return [
          "Check your browser settings for camera permissions",
          "Ensure this website is allowed to access your camera",
          "Refresh the page and try again",
        ];
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center mb-2">
                <Shield className="w-8 h-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold">NationalID</h1>
              </div>
              <p className="text-sm text-foreground/70">
                Government-verified identity authentication
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
              <FileText className="w-4 h-4 text-primary mr-2" />
              <h3 className="font-medium text-sm">NIN Facial Verification</h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Secure NIN verification using facial recognition technology
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
                To verify your National Identification Number using facial
                recognition, we need access to your camera for identity
                confirmation.
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
                        your NIN records
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
                  Your biometric data is encrypted, processed securely by the
                  National Identity Management Commission, and never stored on
                  external servers.
                </p>
              </div>

              <button
                onClick={startVerification}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Camera className="h-5 w-5 mr-2" />
                Allow Camera Access
              </button>

              <Link
                href="/verify/nin"
                className="inline-block mt-4 text-primary hover:text-primary/80 text-sm font-medium"
              >
                Use traditional NIN verification instead
              </Link>
            </div>
          )}

          {step === "permissions" && (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-full p-4 inline-flex mb-6">
                <Settings className="h-10 w-10 text-primary" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                Requesting Permissions
              </h3>
              <p className="text-foreground/70 mb-6">
                Please allow camera access when prompted by your browser to
                continue with NIN verification.
              </p>

              <div className="bg-primary/5 rounded-lg p-4 text-left mb-6">
                <div className="flex items-center mb-3">
                  <Camera className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">Camera Access</span>
                </div>
                <p className="text-foreground/70 text-sm mt-1 pl-7">
                  Look for a permission prompt from your browser. If you
                  don&apos;t see it, check your address bar for a camera icon.
                </p>
              </div>

              <div className="rounded-lg p-4 bg-amber-50 border border-amber-200 mb-6">
                <p className="text-amber-700 text-sm flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    If you don&apos;t see permission prompts, check your
                    browser&apos;s address bar for camera icons.
                  </span>
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

          {step === "permission-help" && (
            <div className="text-center py-4">
              <div className="bg-primary/5 rounded-full p-4 inline-flex mb-6">
                <HelpCircle className="h-10 w-10 text-primary" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                Camera Access Required
              </h3>
              <p className="text-foreground/70 mb-6">
                To continue with NIN verification, you need to allow camera
                access.
              </p>

              <div className="bg-primary/5 rounded-lg p-4 text-left mb-6">
                <h4 className="font-medium text-primary mb-2 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  How to enable camera access in{" "}
                  {browser.charAt(0).toUpperCase() + browser.slice(1)}
                </h4>
                <ul className="text-sm text-foreground/70 space-y-2 mt-2">
                  {getBrowserInstructions().map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={requestPermissions}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center mb-3"
              >
                <Camera className="h-5 w-5 mr-2" />
                Try Again
              </button>

              <button
                onClick={() => setStep("intro")}
                className="w-full border border-border text-foreground py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Go Back
              </button>
            </div>
          )}

          {step === "camera" && (
            <div className="text-center py-2">
              <h3 className="text-xl font-bold text-foreground mb-4">
                NIN Face Verification
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
                  compared to your NIN records for identity verification.
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
                    Verifying Your NIN
                  </h3>
                  <p className="text-foreground/70">
                    Comparing your facial data with the National Identity
                    Database...
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
                NIN Verification Successful!
              </h3>
              <p className="text-foreground/70 mb-6">
                Your National Identification Number has been successfully
                verified using facial recognition.
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
                    <span className="font-medium">NIN Match Confirmed</span>
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
                NIN Verification Failed
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
                  href="/nin-verification"
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
            Your facial data is encrypted and processed securely for NIN
            verification purposes only. We comply with the National Identity
            Management Commission&apos;s data protection guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
