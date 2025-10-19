'use client';

import React, { useState } from 'react';

interface AiValidationResult {
  valid: boolean;
  message: string;
  confidence: number;
}

interface TestResult {
  courseValidation?: AiValidationResult;
  careerValidation?: AiValidationResult;
  timestamp: string;
}

const AiTestingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAiTest = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const response = await fetch('http://localhost:8080/api/ai-validation/test/simple', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'SUCCESS') {
        setTestResult(data.testResults);
      } else {
        setError(data.message || 'Test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const testConfiguration = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/ai-validation/test/configuration', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'SUCCESS') {
        alert(`Configuration Test: ${JSON.stringify(data.configurationTest, null, 2)}`);
      } else {
        setError(data.message || 'Configuration test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeColor = (valid: boolean, confidence: number) => {
    if (!valid) return 'bg-red-100 text-red-800 border-red-200';
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
            <span className="text-white text-2xl">🤖</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Validation Testing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the AI-powered content validation system to ensure course and career recommendations are accurate and relevant.
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Quick Tests</h3>
              
              <button
                onClick={runAiTest}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Testing AI...
                  </div>
                ) : (
                  '🧪 Run AI Validation Test'
                )}
              </button>

              <button
                onClick={testConfiguration}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                ⚙️ Test Configuration
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Test Information</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">What gets tested:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Course description validation</li>
                  <li>• Career information accuracy</li>
                  <li>• AI model response quality</li>
                  <li>• API connectivity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">❌</span>
              <div>
                <h3 className="text-red-800 font-semibold">Test Failed</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResult && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Results</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Course Validation Result */}
              {testResult.courseValidation && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Course Validation</h3>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getBadgeColor(testResult.courseValidation.valid, testResult.courseValidation.confidence)}`}>
                      {testResult.courseValidation.valid ? '✅ VALID' : '❌ INVALID'}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{testResult.courseValidation.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confidence Score:</span>
                    <span className={`text-lg font-bold ${getConfidenceColor(testResult.courseValidation.confidence)}`}>
                      {Math.round(testResult.courseValidation.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Career Validation Result */}
              {testResult.careerValidation && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Career Validation</h3>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getBadgeColor(testResult.careerValidation.valid, testResult.careerValidation.confidence)}`}>
                      {testResult.careerValidation.valid ? '✅ VALID' : '❌ INVALID'}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{testResult.careerValidation.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confidence Score:</span>
                    <span className={`text-lg font-bold ${getConfidenceColor(testResult.careerValidation.confidence)}`}>
                      {Math.round(testResult.careerValidation.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Test completed at: {new Date(testResult.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Use</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">For Users:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• AI validation runs automatically on test results</li>
                <li>• Look for the AI validation badge on results pages</li>
                <li>• Validation scores show content accuracy</li>
                <li>• Issues are flagged for review</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">For Developers:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Use this page to test AI integration</li>
                <li>• Check API endpoints for debugging</li>
                <li>• Monitor validation performance</li>
                <li>• Verify model responses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiTestingPage;
