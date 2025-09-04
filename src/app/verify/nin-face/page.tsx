"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Shield,
  User,
  ArrowLeft,
  CheckCircle,
  Home,
  Camera,
  RotateCw,
  AlertCircle,
  Video,
  Circle,
} from "lucide-react";
import Link from "next/link";

export default function FaceVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "scanning" | "processing" | "success" | "error"
  >("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [scanProgress, setScanProgress] = useState(0);
  const [showTips, setShowTips] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera only when verification starts
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setErrorMessage(
        "Camera access denied. Please allow camera access to continue."
      );
      setVerificationStatus("error");
    }
  };

  const startVerification = async () => {
    setVerificationStatus("scanning");
    setShowTips(true);

    // Initialize camera when starting verification
    await initCamera();

    // Start countdown
    let count = 3;
    setCountdown(count);

    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        captureFace();
      }
    }, 1000);
  };

  const captureFace = () => {
    setVerificationStatus("processing");
    setShowTips(false);

    // Simulate face scanning progress
    let progress = 0;
    setScanProgress(progress);

    if (progressRef.current) clearInterval(progressRef.current);

    progressRef.current = setInterval(() => {
      progress += 5;
      setScanProgress(progress);

      if (progress >= 100) {
        if (progressRef.current) clearInterval(progressRef.current);
        verifyFace();
      }
    }, 150);
  };

  const verifyFace = () => {
    setIsLoading(true);

    // Simulate API call to verify face
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo

      if (isSuccess) {
        setVerificationStatus("success");
      } else {
        setErrorMessage(
          "Face verification failed. Please ensure your face is clearly visible and try again."
        );
        setVerificationStatus("error");
      }
      setIsLoading(false);
    }, 1500);
  };

  const retryVerification = () => {
    setVerificationStatus("idle");
    setErrorMessage("");
    setScanProgress(0);
    // Don't initialize camera until user clicks Start Verification again
  };

  // Clean up camera on unmount or when leaving page
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (countdownRef.current) clearTimeout(countdownRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case "scanning":
        return "Get ready for scanning...";
      case "processing":
        return "Scanning your face...";
      case "success":
        return "Verification successful!";
      case "error":
        return "Verification failed";
      default:
        return "Face Verification";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg overflow-hidden">
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
              <h3 className="font-medium text-sm">Facial Recognition</h3>
            </div>
            <p className="text-foreground/70 text-xs">
              Fastest way to verify your identity using facial recognition
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {getStatusMessage()}
            </h2>
            <p className="text-foreground/70 mt-2">
              {verificationStatus === "idle" &&
                "Verify your identity instantly using facial recognition"}
              {verificationStatus === "scanning" &&
                `Scanning will begin in ${countdown}...`}
              {verificationStatus === "processing" &&
                "Please keep still while we verify your identity"}
              {verificationStatus === "success" &&
                "Your identity has been successfully verified!"}
              {verificationStatus === "error" &&
                "We couldn't verify your identity. Please try again."}
            </p>
          </div>

          <div className="relative bg-black rounded-xl overflow-hidden mb-6">
            {/* Camera feed - only show when scanning or processing */}
            {(verificationStatus === "scanning" ||
              verificationStatus === "processing") && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
            )}

            {/* Placeholder when camera is not active */}
            {verificationStatus === "idle" && (
              <div className="w-full h-64 bg-border flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-foreground/50 mx-auto mb-2" />
                  <p className="text-foreground/70 text-sm">
                    Camera will activate when verification starts
                  </p>
                </div>
              </div>
            )}

            {/* Scanning overlay */}
            {(verificationStatus === "scanning" ||
              verificationStatus === "processing") && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Scanning animation */}
                  <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
                  <div
                    className="absolute inset-0 border-4 border-primary/50 rounded-full animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  ></div>

                  {/* Face outline */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-48 border-4 border-primary rounded-xl"></div>
                  </div>

                  {/* Countdown during scanning phase */}
                  {verificationStatus === "scanning" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold text-white bg-primary/80 rounded-full w-16 h-16 flex items-center justify-center">
                        {countdown}
                      </div>
                    </div>
                  )}

                  {/* Progress during processing phase */}
                  {verificationStatus === "processing" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm">{scanProgress}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success overlay */}
            {verificationStatus === "success" && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                <div className="text-center p-6">
                  <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-white font-medium">
                    Verification Complete
                  </p>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {verificationStatus === "error" && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/5">
                <div className="text-center p-6">
                  <div className="bg-red-500/10 p-4 rounded-full inline-block mb-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                  <p className="text-white font-medium">Verification Failed</p>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {showTips && verificationStatus === "idle" && (
            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <Camera className="w-4 h-4 mr-2" /> Tips for best results
              </h3>
              <ul className="text-xs text-foreground/70 space-y-1">
                <li className="flex items-start">
                  <Circle className="w-2 h-2 mt-1 mr-2 flex-shrink-0" />
                  <span>Ensure good lighting on your face</span>
                </li>
                <li className="flex items-start">
                  <Circle className="w-2 h-2 mt-1 mr-2 flex-shrink-0" />
                  <span>Remove sunglasses or hats</span>
                </li>
                <li className="flex items-start">
                  <Circle className="w-2 h-2 mt-1 mr-2 flex-shrink-0" />
                  <span>Look directly at the camera</span>
                </li>
                <li className="flex items-start">
                  <Circle className="w-2 h-2 mt-1 mr-2 flex-shrink-0" />
                  <span>Keep a neutral expression</span>
                </li>
              </ul>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-500 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          {verificationStatus === "idle" && (
            <button
              onClick={startVerification}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center"
            >
              <Video className="w-5 h-5 mr-2" /> Start Verification
            </button>
          )}

          {verificationStatus === "success" && (
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-2" />
                  <h3 className="font-medium">Verification Complete</h3>
                </div>
                <p className="text-foreground/70 text-sm mt-1">
                  Your identity has been successfully verified.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center"
              >
                Continue to Dashboard
              </Link>
            </div>
          )}

          {(verificationStatus === "error" ||
            verificationStatus === "success") && (
            <button
              onClick={retryVerification}
              className="w-full border border-border px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition flex items-center justify-center mt-4"
            >
              <RotateCw className="w-5 h-5 mr-2" /> Verify Again
            </button>
          )}

          {/* Back to verification options link */}
          <div className="flex justify-center mt-6">
            <Link
              href="/verify/verification-options"
              className="text-primary hover:underline text-sm flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Other Verification Methods
            </Link>
          </div>

          {/* Desktop back to home link */}
          <div className="hidden md:flex justify-center mt-6">
            <Link
              href="/"
              className="text-primary hover:underline text-sm flex items-center"
            >
              <Home className="w-4 h-4 mr-1" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
