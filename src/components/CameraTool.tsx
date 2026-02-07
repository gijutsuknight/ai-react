import * as React from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { getApiBaseUrl, UPLOAD_FILE_PATH } from '../config/api';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export const CameraTool: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const photoUrlRef = React.useRef<string | null>(null);
  const videoUrlRef = React.useRef<string | null>(null);

  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = React.useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [videoBlob, setVideoBlob] = React.useState<Blob | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = React.useState<UploadStatus>('idle');

  const stopStream = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
  }, []);

  const resetMedia = React.useCallback(() => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setPhotoUrl(null);
    setVideoUrl(null);
    setPhotoBlob(null);
    setVideoBlob(null);
  }, [photoUrl, videoUrl]);

  const startCamera = async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access is not supported in this browser.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          // Prefer back camera on phones, fallback to any video source.
          facingMode: { ideal: 'environment' },
        },
        audio: true,
      });

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      setError('Unable to access camera. Please check permissions and device.');
    }
  };

  const capturePhoto = () => {
    setError(null);
    if (!videoRef.current || !canvasRef.current || !stream) {
      setError('Camera must be running to capture a photo.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Unable to capture photo from video stream.');
      return;
    }

    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Failed to create image from canvas.');
          return;
        }
        if (photoUrl) {
          URL.revokeObjectURL(photoUrl);
        }
        const url = URL.createObjectURL(blob);
        setPhotoBlob(blob);
        setPhotoUrl(url);
      },
      'image/png',
      1
    );
  };

  const recordVideo = () => {
    setError(null);
    if (!stream) {
      setError('Camera must be running to record video.');
      return;
    }
    if (typeof MediaRecorder === 'undefined') {
      setError('Media recording is not supported in this browser.');
      return;
    }

    try {
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
        }
        const url = URL.createObjectURL(blob);
        setVideoBlob(blob);
        setVideoUrl(url);
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);

      // Automatically stop after 5 seconds.
      setTimeout(() => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      }, 5000);
    } catch (err) {
      setIsRecording(false);
      setError('Failed to start video recording.');
    }
  };

  const downloadBlob = (blob: Blob | null, filename: string) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const uploadMedia = async (blob: Blob | null, filename: string) => {
    if (!blob) return;
    setUploadStatus('uploading');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', blob, filename);

      const response = await fetch(`${getApiBaseUrl()}${UPLOAD_FILE_PATH}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message ?? 'Upload failed');
      }

      setUploadStatus('success');
    } catch (err) {
      setUploadStatus('error');
      setError(
        err instanceof Error ? err.message : 'Failed to upload media. Ensure your backend is running at /api/upload/file.'
      );
    }
  };

  React.useEffect(() => {
    photoUrlRef.current = photoUrl;
    videoUrlRef.current = videoUrl;
  }, [photoUrl, videoUrl]);

  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (photoUrlRef.current) {
        URL.revokeObjectURL(photoUrlRef.current);
      }
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
    };
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Use this tool to access your webcam or phone camera, capture a photo or
        a 5-second video, download the result, and send it to your backend for
        further processing.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', borderRadius: 8, backgroundColor: '#000' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Button variant="contained" onClick={startCamera} disabled={!!stream}>
          Start camera
        </Button>
        <Button variant="outlined" onClick={stopStream} disabled={!stream}>
          Stop camera
        </Button>
        <Button
          variant="outlined"
          onClick={capturePhoto}
          disabled={!stream}
        >
          Capture photo
        </Button>
        <Button
          variant="outlined"
          onClick={recordVideo}
          disabled={!stream || isRecording}
        >
          {isRecording ? 'Recording…' : 'Record 5s video'}
        </Button>
      </Stack>

      {(photoUrl || videoUrl) && (
        <Stack spacing={2}>
          {photoUrl && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Captured photo
              </Typography>
              <Box
                component="img"
                src={photoUrl}
                alt="Captured"
                sx={{ maxWidth: '100%', borderRadius: 1, mb: 1 }}
              />
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => downloadBlob(photoBlob, 'photo.png')}
                >
                  Download photo
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => uploadMedia(photoBlob, 'photo.png')}
                >
                  Send photo to backend
                </Button>
              </Stack>
            </Box>
          )}

          {videoUrl && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Recorded video (5 seconds)
              </Typography>
              <Box sx={{ mb: 1 }}>
                <video
                  src={videoUrl}
                  controls
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => downloadBlob(videoBlob, 'video.webm')}
                >
                  Download video
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => uploadMedia(videoBlob, 'video.webm')}
                >
                  Send video to backend
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      )}

      {uploadStatus === 'success' && (
        <Alert severity="success">
          Media uploaded successfully. Check your backend for the received file.
        </Alert>
      )}
      {uploadStatus === 'uploading' && (
        <Alert severity="info">Uploading media to backend…</Alert>
      )}
    </Stack>
  );
}

