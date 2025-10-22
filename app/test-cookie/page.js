'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../service/authApi';
import Cookies from 'js-cookie';

export default function TestCookiePage() {
  const [debugData, setDebugData] = useState({
    rawCookie: null,
    parsedCookie: null,
    getCurrentUserResult: null,
    localStorage: null,
    error: null
  });

  const testCookieData = () => {
    try {
      // Get raw cookie data
      const rawCookie = Cookies.get('user');
      console.log('Raw cookie data:', rawCookie);
      
      // Try to parse cookie
      let parsedCookie = null;
      let parseError = null;
      
      if (rawCookie) {
        try {
          parsedCookie = JSON.parse(rawCookie);
          console.log('Parsed cookie data:', parsedCookie);
        } catch (error) {
          parseError = error.message;
          console.error('Cookie parse error:', error);
        }
      }
      
      // Test getCurrentUser
      const currentUserResult = getCurrentUser();
      console.log('getCurrentUser result:', currentUserResult);
      
      // Check localStorage
      const localStorageData = localStorage.getItem('user');
      console.log('localStorage data:', localStorageData);
      
      setDebugData({
        rawCookie,
        parsedCookie,
        getCurrentUserResult: currentUserResult,
        localStorage: localStorageData,
        error: parseError
      });
      
    } catch (error) {
      console.error('Test error:', error);
      setDebugData(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  const clearAllData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    Cookies.remove('user');
    Cookies.remove('token');
    console.log('All data cleared');
    testCookieData();
  };

  const setTestCookieData = () => {
    const testUser = {
      "id": "cmgnuj1590000nwn0jebo2idc",
      "username": "mdtanvirahamdsanto987",
      "email": "mdtanvirahamdsanto987@gmail.com",
      "role": "client",
      "name": "Md Tanvir Ahamed Shanto",
      "profilePhoto": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2689740604719782&height=50&width=50&ext=1762874125&hash=AT_xXjQ0zw-jUqBc0Wjaoq1S",
      "location": null,
      "socialLinks": null,
      "socialLogin": {
        "id": "2689740604719782",
        "provider": "facebook",
        "displayName": "Md Tanvir Ahamed Shanto"
      },
      "resetPasswordToken": null,
      "resetTokenExpiry": null,
      "lastLogin": null,
      "isActive": true,
      "createdAt": "2025-10-12T15:15:25.965Z",
      "updatedAt": "2025-10-12T15:15:25.965Z"
    };
    
    Cookies.set('user', JSON.stringify(testUser), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    console.log('Test cookie data set');
    testCookieData();
  };

  useEffect(() => {
    testCookieData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cookie Debug Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Raw Cookie Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
              {debugData.rawCookie || 'No cookie data'}
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Parsed Cookie Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
              {debugData.parsedCookie ? 
                JSON.stringify(debugData.parsedCookie, null, 2) : 
                'No parsed data'
              }
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">getCurrentUser() Result</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
              {debugData.getCurrentUserResult ? 
                JSON.stringify(debugData.getCurrentUserResult, null, 2) : 
                'No user data returned'
              }
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">localStorage Data</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
              {debugData.localStorage || 'No localStorage data'}
            </pre>
          </div>
        </div>
        
        {debugData.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {debugData.error}
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={testCookieData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Test
            </button>
            <button 
              onClick={setTestCookieData}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Set Test Cookie Data
            </button>
            <button 
              onClick={clearAllData}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear All Data
            </button>
          </div>
        </div>
        
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside mt-2">
            <li>Check the browser console for detailed logs</li>
            <li>Use "Set Test Cookie Data" to simulate your exact cookie data</li>
            <li>Check if getCurrentUser() returns the expected result</li>
            <li>Verify localStorage synchronization</li>
          </ol>
        </div>
      </div>
    </div>
  );
}