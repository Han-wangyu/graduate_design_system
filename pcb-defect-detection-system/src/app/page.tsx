'use client';

import { useState, useEffect } from 'react'; // 导入 useEffect
import { useSession, signOut } from 'next-auth/react'; // 导入 useSession 和 signOut
import { useRouter } from 'next/navigation'; // 导入 useRouter

interface Defect {
  type: string;
  confidence: number;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface DetectionResult {
  originalImage: string;
  detectedImage: string;
  defects: Defect[];
  processingTime: number;
}

export default function HomePage() {
  const { data: session, status } = useSession(); // 获取会话状态
  const router = useRouter(); // 获取 router 实例

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 如果未认证，则重定向到登录页面
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // 如果正在加载会话或未认证，则显示加载状态
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Clear previous results
      setError(null); // Clear previous errors
    }
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: DetectionResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const openFileDialog = () => {
    document.getElementById('fileInput')?.click();
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center"> {/* 修改 header 以包含登出按钮 */}
        <h1 className="text-3xl font-bold text-teal-400">PCB Defect Detection System</h1>
        {session && (
          <div className="flex items-center">
            <p className="mr-4 text-gray-300">Welcome, {session.user?.name || session.user?.email}</p>
            <button 
              onClick={() => signOut()} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-teal-300">Upload PCB Image</h2>
          <div 
            className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-teal-500 transition-colors"
            onClick={openFileDialog}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className="text-gray-400">Drag & drop your image here, or click to select</p>
            <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} accept="image/*" />
          </div>
          <button 
            className={`mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleDetect}
            disabled={isLoading}
          >
            {isLoading ? 'Detecting...' : 'Upload & Detect'}
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-teal-300">Detection Result</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-300">Original Image</h3>
              <div className="bg-gray-700 aspect-square rounded-lg flex items-center justify-center text-gray-500 overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Original PCB" className="w-full h-full object-contain" />
                ) : (
                  <p>Preview</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-300">Detected Defects</h3>
              <div className="bg-gray-700 aspect-square rounded-lg flex items-center justify-center text-gray-500 overflow-hidden">
                {result?.detectedImage ? (
                  <img src={result.detectedImage} alt="Detected Defects" className="w-full h-full object-contain" />
                ) : (
                  <p>Result</p>
                )}
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4 text-sm">Error: {error}</p>}
          {result && (
            <div className="mt-6 bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-teal-200">Detection Summary</h3>
              <p className="text-sm text-gray-300">Processing Time: {result.processingTime.toFixed(2)} seconds</p>
              {result.defects.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {result.defects.map((defect, index) => (
                    <li key={index} className="text-sm text-gray-400">
                      - {defect.type} (Confidence: {(defect.confidence * 100).toFixed(1)}%)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 mt-2">No defects found.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 shadow-md p-4 mt-auto">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} PCB Defect Detection System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
