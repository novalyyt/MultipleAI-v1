import React, { useState } from 'react';

export default function ApiKeyInput({ 
  value, 
  onChange, 
  placeholder, 
  provider,
  onTest 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testMessage, setTestMessage] = useState('');

  const handleTest = async () => {
    if (!value.trim() || !onTest) return;
    
    setIsTesting(true);
    setTestResult(null);
    setTestMessage('');

    try {
      const isValid = await onTest(value);
      if (isValid) {
        setTestResult('success');
        setTestMessage('API Key valid dan dapat digunakan!');
      } else {
        setTestResult('error');
        setTestMessage('API Key tidak valid atau tidak memiliki akses.');
      }
    } catch (error) {
      setTestResult('error');
      setTestMessage(error.message || 'Terjadi kesalahan saat testing API Key.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {provider} API Key
        </label>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Dapatkan API Key →
        </a>
      </div>
      
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title={isVisible ? 'Sembunyikan' : 'Tampilkan'}
          >
            {isVisible ? '👁️' : '👁️‍🗨️'}
          </button>
          
          {onTest && value.trim() && (
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                isTesting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
              title="Test API Key"
            >
              {isTesting ? '⏳' : '🧪'}
            </button>
          )}
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${
          testResult === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <span className="text-base">
            {testResult === 'success' ? '✅' : '❌'}
          </span>
          <span>{testMessage}</span>
        </div>
      )}

      {/* API Key Info */}
      {!value && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
          <p className="font-medium mb-1">💡 Cara mendapatkan API Key:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Buka <strong>Google AI Studio</strong></li>
            <li>Login dengan akun Google Anda</li>
            <li>Klik <strong>"Get API Key"</strong></li>
            <li>Copy dan paste API Key di sini</li>
          </ol>
        </div>
      )}
    </div>
  );
}