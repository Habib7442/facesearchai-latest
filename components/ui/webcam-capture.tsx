"use client";

import Webcam from 'react-webcam';
import { useRef, useCallback, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconCameraSelfie } from '@tabler/icons-react';
import { toast } from 'sonner';
interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      return /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    };
    setIsMobile(checkMobile());
  }, []);

  // Check for camera support on mount
  useEffect(() => {
    const checkCamera = async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        toast.error('Camera not supported in this browser');
        setHasCamera(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            // Add advanced constraints for better mobile support
            ...(isMobile && {
              frameRate: { ideal: 30 },
              aspectRatio: { ideal: 16/9 }
            })
          }
        });

        // Stop the stream immediately after checking
        stream.getTracks().forEach(track => track.stop());
        setHasCamera(true);
      } catch (err) {
        console.error('Camera access error:', err);
        toast.error('Camera access denied or not available');
        setHasCamera(false);
      }
    };

    checkCamera();
  }, [facingMode, isMobile]);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode,
    // Enhanced mobile constraints
    ...(isMobile && {
      frameRate: { ideal: 30 },
      aspectRatio: { ideal: 16/9 },
      // Add specific mobile camera settings
      advanced: [{
        zoom: 1,
        focusMode: 'continuous',
        whiteBalanceMode: 'continuous',
        exposureMode: 'continuous'
      }]
    })
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    } else {
      toast.error('Failed to capture image');
    }
  }, [onCapture]);

  const toggleCamera = useCallback(() => {
    setFacingMode(prev => {
      const newMode = prev === 'user' ? 'environment' : 'user';
      // Reset the webcam when switching cameras
      if (webcamRef.current) {
        const video = webcamRef.current.video;
        if (video && video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
        }
      }
      return newMode;
    });
  }, []);

  if (!hasCamera) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Camera className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-center text-gray-500 mb-2">
          Camera is not available or permission was denied
        </p>
        <p className="text-sm text-gray-400">
          Please ensure you&apos;re using a supported browser and have granted camera permissions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[500px] mx-auto">
      <div className="relative rounded-[20px] overflow-hidden bg-surface-light-paper dark:bg-surface-dark-paper">
        <div className="aspect-video w-full max-h-[400px]"> {/* Changed to aspect-video */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMediaError={(err) => {
              console.error('Webcam error:', err);
              toast.error('Failed to access camera');
              // If environment camera fails, try falling back to user camera
              if (facingMode === 'environment') {
                setFacingMode('user');
              }
            }}
            className="w-full h-full object-cover"
            mirrored={facingMode === 'user'} // Mirror only front camera
          />
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        {isMobile && (
          <Button
            onClick={toggleCamera}
            variant="outline"
            className="rounded-full"
          >
            <IconCameraSelfie className="h-5 w-5 mr-2" />
            {facingMode === 'user' ? 'Back Camera' : 'Front Camera'}
          </Button>
        )}
        
        <Button
          onClick={capture}
          className="bg-primary-500 hover:bg-primary-600 rounded-full"
        >
          <Camera className="h-5 w-5 mr-2" />
          Capture Photo
        </Button>
      </div>
    </div>
  );
}
