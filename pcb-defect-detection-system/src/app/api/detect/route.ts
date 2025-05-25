import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // In a real application, you would process the uploaded image here.
  // For now, we'll simulate a delay and return mock data.
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock data - replace with actual image URLs or base64 encoded images
  const randomConfidence = () => Math.random() * (0.99 - 0.7) + 0.7;
  const randomProcessingTime = () => Math.random() * (2.5 - 0.5) + 0.5;

  const mockResult = {
    originalImage: '/images/mock_pcb_original.jpeg', // Placeholder path
    detectedImage: '/images/mock_pcb_detected.jpg', // Placeholder path
    defects: [
      { type: 'Missing Component', confidence: randomConfidence(), location: { x: 100, y: 150, width: 30, height: 20 } },
      { type: 'Short Circuit', confidence: randomConfidence(), location: { x: 250, y: 300, width: 50, height: 10 } },
    ],
    processingTime: randomProcessingTime(), // seconds
  };

  return NextResponse.json(mockResult);
}