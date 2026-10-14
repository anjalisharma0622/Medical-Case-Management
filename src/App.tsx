/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { INITIAL_CASES, SEEDED_USERS, MedicalCaseItem, AppUser } from './data/initialData';
import { BladeSimulator } from './components/BladeSimulator';
import { ApiTester } from './components/ApiTester';
import { TestRunner } from './components/TestRunner';
import { CodeExplorer } from './components/CodeExplorer';
import { DocViewer } from './components/DocViewer';
import { 
  Monitor, Cpu, CheckCircle2, FolderGit2, BookOpen, 
  Stethoscope, User, ChevronDown
} from 'lucide-react';

export default function App() {
  const [cases, setCases] = useState<MedicalCaseItem[]>(INITIAL_CASES);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(SEEDED_USERS[0]);
  const [activeTab, setActiveTab] = useState<'blade' | 'api' | 'tests' | 'code' | 'docs'>('blade');
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Production Clinical Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Title */}
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-base tracking-tight">Jajal Medical</span>
                  <span className="text-slate-300 font-light">&vert;</span>
                  <span className="text-xs font-semibold text-teal-800">Case Management System</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  ISO 13485 &bull; IEC 62304 Compliant Surgical Implant Tracking
                </div>
              </div>
            </div>

            {/* Profile & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs transition cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px]">
                  {currentUser ? currentUser.name[0] : 'G'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-800 leading-tight">
                    {currentUser ? currentUser.name : 'Guest User'}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">
                    {currentUser ? `Role: ${currentUser.role}` : 'Signed Out'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div 
                  className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs animate-in fade-in duration-100"
                  onClick={() => setShowRoleMenu(false)}>
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => setCurrentUser(SEEDED_USERS[0])}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition ${currentUser?.role === 'admin' ? 'bg-teal-50 text-teal-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <div>
                      <div className="font-semibold">System Administrator</div>
                      <div className="text-[10px] text-slate-500">Full CRUD &bull; Delete Access</div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">Admin</span>
                  </button>
                  <button
                    onClick={() => setCurrentUser(SEEDED_USERS[1])}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition ${currentUser?.role === 'viewer' ? 'bg-teal-50 text-teal-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <div>
                      <div className="font-semibold">Clinical Viewer</div>
                      <div className="text-[10px] text-slate-500">Read-Only &bull; Restricted</div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">Viewer</span>
                  </button>
                  <button
                    onClick={() => setCurrentUser(SEEDED_USERS[2])}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition ${currentUser?.role === 'engineer' ? 'bg-teal-50 text-teal-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <div>
                      <div className="font-semibold">Biomedical Engineer</div>
                      <div className="text-[10px] text-slate-500">Create &bull; Edit &bull; Status</div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Engineer</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => setCurrentUser(null)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition font-medium ${currentUser === null ? 'bg-rose-50 font-bold' : ''}`}>
                    Sign Out (Guest View)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Clean Module Tabs */}
          <div className="flex items-center space-x-1 border-t border-slate-100 py-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('blade')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-2 transition ${activeTab === 'blade' ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
              <Monitor className="w-3.5 h-3.5" />
              <span>Medical Cases Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-2 transition ${activeTab === 'api' ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
              <Cpu className="w-3.5 h-3.5" />
              <span>Sanctum REST API</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-2 transition ${activeTab === 'tests' ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Automated Test Suite</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-2 transition ${activeTab === 'code' ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Source Repository</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center space-x-2 transition ${activeTab === 'docs' ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
              <BookOpen className="w-3.5 h-3.5" />
              <span>Compliance &amp; Traceability</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'blade' && (
          <BladeSimulator
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            cases={cases}
            setCases={setCases}
          />
        )}

        {activeTab === 'api' && (
          <ApiTester
            cases={cases}
            setCases={setCases}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'tests' && (
          <TestRunner />
        )}

        {activeTab === 'code' && (
          <CodeExplorer />
        )}

        {activeTab === 'docs' && (
          <DocViewer />
        )}
      </main>

      {/* Authentic Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Jajal Medical</span>
            <span aria-hidden="true">&bull;</span>
            <span>Orthopedic &amp; Surgical Implant Case Management</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500 font-mono text-[11px]">
            <span>Laravel 11.x</span>
            <span aria-hidden="true">&bull;</span>
            <span>MySQL 8.0</span>
            <span aria-hidden="true">&bull;</span>
            <span>Sanctum v4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
