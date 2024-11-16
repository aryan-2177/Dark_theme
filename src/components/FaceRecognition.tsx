import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Database } from '../utils/db';
import { MenuItem } from '../data/menu';
import { Camera, Loader2 } from 'lucide-react';
import Toast from './Toast';

interface FaceRecognitionProps {
  onUserIdentified: (previousOrders: MenuItem[], isExisting: boolean, isFirstTime: boolean) => void;
  onComplete: () => void;
}

export default function FaceRecognition({ onUserIdentified, onComplete }: FaceRecognitionProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const db = new Database();

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        
        // Load models from CDN as fallback
        const modelUrl = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.load(modelUrl),
          faceapi.nets.faceLandmark68Net.load(modelUrl),
          faceapi.nets.faceRecognitionNet.load(modelUrl),
          faceapi.nets.faceExpressionNet.load(modelUrl)
        ]);

        setModelsLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading face recognition models:', error);
        setError('Failed to load face recognition system. Please try again later.');
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const captureAndAnalyze = async () => {
    if (!webcamRef.current || !modelsLoaded) return;

    try {
      setIsLoading(true);
      const videoEl = webcamRef.current.video;
      if (!videoEl) throw new Error('Video element not found');

      // Wait for the next frame to ensure video is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Detect face in real-time
      const detection = await faceapi
        .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        throw new Error('No face detected. Please ensure your face is clearly visible and well-lit.');
      }

      // Get face descriptor for matching
      const faceDescriptor = detection.descriptor;
      const existingUser = await db.findUserByFace(faceDescriptor);

      if (existingUser) {
        const previousOrders = await db.getPreviousOrders(existingUser.id);
        setToastMessage('Welcome back! You get 5% loyalty discount! 🎉');
        onUserIdentified(previousOrders, true, false);
      } else {
        const newUserId = await db.addNewUser(faceDescriptor);
        setToastMessage('Welcome to Spice Garden! Enjoy 10% off on your first order! 🎉');
        onUserIdentified([], false, true);
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onComplete();
      }, 3000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Continue Without Face Recognition
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to Spice Garden</h2>
        <p className="text-gray-600 mb-6">
          Please look at the camera for face recognition
        </p>
        <div className="relative aspect-video mb-6">
          <Webcam
            ref={webcamRef}
            mirrored
            className="rounded-lg w-full h-full object-cover"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user"
            }}
          />
        </div>
        <button
          onClick={captureAndAnalyze}
          disabled={isLoading || !modelsLoaded}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Analyzing Face...</span>
            </>
          ) : (
            <>
              <Camera size={20} />
              <span>Verify Identity</span>
            </>
          )}
        </button>
        <button
          onClick={onComplete}
          className="w-full mt-4 text-gray-600 py-2 hover:text-gray-800 transition-colors"
        >
          Skip Face Recognition
        </button>
      </div>
      {showToast && <Toast message={toastMessage} />}
    </div>
  );
}