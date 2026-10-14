import React, { useState, useMemo, useEffect } from 'react';
import { MedicalCaseItem, AppUser, SEEDED_USERS } from '../data/initialData';
import { fetchPublicHolidays, PublicHoliday } from '../utils/holidayApi';
import { 
  Plus, Search, Filter, Shield, AlertTriangle, CheckCircle, 
  Trash2, Edit3, Eye, ArrowLeft, Calendar, LogOut, Check,
  ArrowUpDown, UserCheck, Stethoscope, Clock
} from 'lucide-react';

interface BladeSimulatorProps {
  currentUser: AppUser | null;
  setCurrentUser: (user: AppUser | null) => void;
  cases: MedicalCaseItem[];
  setCases: React.Dispatch<React.SetStateAction<MedicalCaseItem[]>>;
}

export const BladeSimulator: React.FC<BladeSimulatorProps> = ({
  currentUser,
  setCurrentUser,
  cases,
  setCases,
}) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'cases' | 'create' | 'edit' | 'show'>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(1);
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@jajalmedical.test');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState<'case_number' | 'surgeon_name' | 'status' | 'priority' | 'surgery_date' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formCaseNumber, setFormCaseNumber] = useState('');
  const [formPatientRef, setFormPatientRef] = useState('');
  const [formSurgeonName, setFormSurgeonName] = useState('');
  const [formImplantType, setFormImplantType] = useState('');
  const [formStatus, setFormStatus] = useState<MedicalCaseItem['status']>('Draft');
  const [formPriority, setFormPriority] = useState<MedicalCaseItem['priority']>('Medium');
  const [formSurgeryDate, setFormSurgeryDate] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [policyModalError, setPolicyModalError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicHolidays(2026).then(setHolidays);
  }, []);

  const filteredCases = useMemo(() => {
    return cases.filter(item => {
      const matchesSearch = !searchTerm || 
        item.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.surgeon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patient_reference.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesPriority = !priorityFilter || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
      let valA: any = a[sortBy] ?? '';
      let valB: any = b[sortBy] ?? '';

      if (sortBy === 'surgery_date') {
        valA = a.surgery_date ? new Date(a.surgery_date).getTime() : 0;
        valB = b.surgery_date ? new Date(b.surgery_date).getTime() : 0;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [cases, searchTerm, statusFilter, priorityFilter, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCases.slice(start, start + itemsPerPage);
  }, [filteredCases, currentPage]);

  const selectedCase = useMemo(() => {
    return cases.find(c => c.id === selectedCaseId) || cases[0];
  }, [cases, selectedCaseId]);

  const metrics = useMemo(() => {
    const total = cases.length;
    const planning = cases.filter(c => c.status === 'Planning').length;
    const inReview = cases.filter(c => c.status === 'In Review').length;
    const approved = cases.filter(c => c.status === 'Approved').length;
    const completed = cases.filter(c => c.status === 'Completed').length;
    const draft = cases.filter(c => c.status === 'Draft').length;
    const cancelled = cases.filter(c => c.status === 'Cancelled').length;
    const highPriority = cases.filter(c => c.priority === 'High' && c.status !== 'Completed' && c.status !== 'Cancelled').length;

    return { total, planning, inReview, approved, completed, draft, cancelled, highPriority };
  }, [cases]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const user = SEEDED_USERS.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (user && loginPassword === 'password123') {
      setCurrentUser(user);
      setFlashMessage({ type: 'success', message: `Logged in as ${user.name} (${user.role.toUpperCase()}).` });
      setCurrentView('dashboard');
    } else {
      setLoginError('These credentials do not match our registered records. (Use password: password123)');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setFlashMessage({ type: 'success', message: 'You have been logged out successfully.' });
    setCurrentView('dashboard');
  };

  const openCreateForm = () => {
    if (!currentUser || currentUser.role === 'viewer') {
      setPolicyModalError('HTTP 403 Forbidden: Viewers are not authorized to create medical cases (Enforced by CasePolicy@create).');
      return;
    }
    const nextNum = `CASE-${String(cases.length + 1).padStart(4, '0')}`;
    setFormCaseNumber(nextNum);
    setFormPatientRef(`PT-${Math.floor(10000 + Math.random() * 90000)}`);
    setFormSurgeonName('');
    setFormImplantType('');
    setFormStatus('Draft');
    setFormPriority('Medium');
    setFormSurgeryDate('');
    setFormErrors({});
    setCurrentView('create');
  };

  const openEditForm = (caseItem: MedicalCaseItem) => {
    if (!currentUser || currentUser.role === 'viewer') {
      setPolicyModalError('HTTP 403 Forbidden: Viewers do not have permission to modify medical cases (Enforced by CasePolicy@update).');
      return;
    }
    setSelectedCaseId(caseItem.id);
    setFormCaseNumber(caseItem.case_number);
    setFormPatientRef(caseItem.patient_reference);
    setFormSurgeonName(caseItem.surgeon_name);
    setFormImplantType(caseItem.implant_type);
    setFormStatus(caseItem.status);
    setFormPriority(caseItem.priority);
    setFormSurgeryDate(caseItem.surgery_date || '');
    setFormErrors({});
    setCurrentView('edit');
  };

  const handleDeleteCase = (caseItem: MedicalCaseItem) => {
    if (!currentUser || currentUser.role !== 'admin') {
      setPolicyModalError(`HTTP 403 Forbidden: Access Denied. Only Administrators have permission to delete medical cases. Current user role '${currentUser?.role}' is restricted.`);
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete case ${caseItem.case_number}? This operation is audited.`)) {
      setCases(prev => prev.filter(c => c.id !== caseItem.id));
      setFlashMessage({ type: 'success', message: `Case ${caseItem.case_number} was deleted permanently.` });
      if (currentView === 'show') {
        setCurrentView('cases');
      }
    }
  };

  const handleSaveCase = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formCaseNumber.trim()) {
      errors.case_number = 'The Case Number is mandatory (e.g. CASE-0001).';
    } else {
      const existing = cases.find(c => 
        c.case_number.toLowerCase() === formCaseNumber.trim().toLowerCase() &&
        (currentView === 'create' || c.id !== selectedCaseId)
      );
      if (existing) {
        errors.case_number = 'This Case Number has already been registered in the system.';
      }
    }

    if (!formPatientRef.trim()) {
      errors.patient_reference = 'Patient Reference dummy code is required (no real names).';
    }

    if (!formSurgeonName.trim()) {
      errors.surgeon_name = 'The operating Surgeon Name is required.';
    }

    if (!formImplantType.trim()) {
      errors.implant_type = 'The Implant Type specification is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (currentView === 'create') {
      const newCase: MedicalCaseItem = {
        id: Math.max(...cases.map(c => c.id), 0) + 1,
        case_number: formCaseNumber.trim().toUpperCase(),
        patient_reference: formPatientRef.trim().toUpperCase(),
        surgeon_name: formSurgeonName.trim(),
        implant_type: formImplantType.trim(),
        status: formStatus,
        priority: formPriority,
        surgery_date: formSurgeryDate || null,
        created_by: currentUser || SEEDED_USERS[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCases(prev => [newCase, ...prev]);
      setSelectedCaseId(newCase.id);
      setFlashMessage({ type: 'success', message: `Medical case ${newCase.case_number} was successfully created.` });
      setCurrentView('show');
    } else if (currentView === 'edit' && selectedCaseId) {
      setCases(prev => prev.map(c => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            case_number: formCaseNumber.trim().toUpperCase(),
            patient_reference: formPatientRef.trim().toUpperCase(),
            surgeon_name: formSurgeonName.trim(),
            implant_type: formImplantType.trim(),
            status: formStatus,
            priority: formPriority,
            surgery_date: formSurgeryDate || null,
            updated_at: new Date().toISOString(),
          };
        }
        return c;
      }));
      setFlashMessage({ type: 'success', message: `Medical case ${formCaseNumber} has been updated successfully.` });
      setCurrentView('show');
    }
  };

  const surgeryHolidayNotice = useMemo(() => {
    if (!formSurgeryDate) return null;
    return holidays.find(h => h.date === formSurgeryDate);
  }, [formSurgeryDate, holidays]);

  const getStatusDot = (status: MedicalCaseItem['status']) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500';
      case 'In Review': return 'bg-amber-500';
      case 'Planning': return 'bg-blue-500';
      case 'Completed': return 'bg-teal-600';
      case 'Cancelled': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col font-sans">
      {/* Top Clinical Nav Header */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            <span className="font-bold text-slate-900 tracking-tight">Clinical Portal</span>
          </div>

          {currentUser && (
            <div className="hidden sm:flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-1.5 rounded-md font-medium transition ${currentView === 'dashboard' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                Dashboard
              </button>
              <button
                onClick={() => { setCurrentView('cases'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-md font-medium transition ${currentView === 'cases' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                Medical Cases
              </button>
            </div>
          )}
        </div>

        {currentUser ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-right">
              <span className="text-slate-800 font-medium">{currentUser.name}</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-500 uppercase font-mono text-[10px]">{currentUser.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded border border-rose-200 bg-rose-50/50 hover:bg-rose-100 transition cursor-pointer">
              Logout
            </button>
          </div>
        ) : (
          <div className="text-slate-500 text-[11px]">Guest &bull; Please Sign In</div>
        )}
      </div>

      {/* Global Flash Alerts */}
      {flashMessage && (
        <div className="px-6 pt-4">
          <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${flashMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
            <div className="flex items-center space-x-2">
              {flashMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>{flashMessage.message}</span>
            </div>
            <button onClick={() => setFlashMessage(null)} className="text-slate-400 hover:text-slate-700 font-bold">&times;</button>
          </div>
        </div>
      )}

      {/* Policy 403 Forbidden Modal */}
      {policyModalError && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">403 Forbidden &bull; Policy Blocked</h3>
                <span className="text-[11px] font-mono text-rose-600">CasePolicy::delete() rejected</span>
              </div>
            </div>
            <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-lg text-xs text-rose-900 font-mono">
              {policyModalError}
            </div>
            <p className="mt-3 text-xs text-slate-600 leading-relaxed">
              As required in the technical specification, Viewers are restricted to read-only access. Server-side policies strictly block any destructive requests.
            </p>
            <div className="mt-5 flex justify-end">
              <button 
                onClick={() => setPolicyModalError(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold">
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="p-6">
        {!currentUser ? (
          /* LOGIN SCREEN */
          <div className="max-w-md mx-auto py-8">
            <div className="bg-slate-50/70 p-6 sm:p-8 rounded-xl border border-slate-200">
              <div className="text-center mb-6">
                <div className="w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Sign in to Clinical Portal</h2>
                <p className="text-xs text-slate-500 mt-0.5">Session authentication with role-based policies</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                    placeholder="name@jajalmedical.test"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs transition cursor-pointer">
                  Log In
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center mb-2">
                  Seeded Test Users (Click to fill)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => { setLoginEmail('admin@jajalmedical.test'); setLoginPassword('password123'); }}
                    className="p-2 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg text-left transition">
                    <div className="font-bold text-slate-900">Admin</div>
                    <div className="text-[10px] text-slate-500">Full CRUD + Delete</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginEmail('viewer@jajalmedical.test'); setLoginPassword('password123'); }}
                    className="p-2 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg text-left transition">
                    <div className="font-bold text-slate-900">Viewer</div>
                    <div className="text-[10px] text-slate-500">Read-Only</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'dashboard' ? (
          /* DASHBOARD VIEW */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Clinical Case Dashboard</h2>
                <p className="text-xs text-slate-500 mt-0.5">Overview of active surgical implant workflows</p>
              </div>
              <div className="flex items-center space-x-2">
                {currentUser.role !== 'viewer' && (
                  <button
                    onClick={openCreateForm}
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Case</span>
                  </button>
                )}
                <button
                  onClick={() => { setCurrentView('cases'); setCurrentPage(1); }}
                  className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer">
                  Browse All Cases &rarr;
                </button>
              </div>
            </div>

            {/* KPI Cards (Total, Planning, In Review, Approved, Completed) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Cases</span>
                <div className="mt-1 text-2xl font-extrabold text-slate-900">{metrics.total}</div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">All records</span>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20">
                <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">Planning</span>
                <div className="mt-1 text-2xl font-extrabold text-blue-900">{metrics.planning}</div>
                <span className="text-[11px] text-blue-600 mt-0.5 block">Pre-op modeling</span>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/20">
                <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">In Review</span>
                <div className="mt-1 text-2xl font-extrabold text-amber-900">{metrics.inReview}</div>
                <span className="text-[11px] text-amber-600 mt-0.5 block">Clinical sign-off</span>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Approved</span>
                <div className="mt-1 text-2xl font-extrabold text-emerald-900">{metrics.approved}</div>
                <span className="text-[11px] text-emerald-600 mt-0.5 block">Ready for surgery</span>
              </div>

              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/20 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">Completed</span>
                <div className="mt-1 text-2xl font-extrabold text-teal-900">{metrics.completed}</div>
                <span className="text-[11px] text-teal-600 mt-0.5 block">Procedure done</span>
              </div>
            </div>

            {/* Quiet notice row */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 border border-slate-200 bg-slate-50/50 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-slate-500">Other states:</span>
                <span>Draft: <strong>{metrics.draft}</strong></span>
                <span className="text-slate-300">&bull;</span>
                <span>Cancelled: <strong>{metrics.cancelled}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 text-amber-700 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{metrics.highPriority} High Priority Cases Require Immediate Attention</span>
              </div>
            </div>

            {/* Recent Cases Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Recent Cases (Top 5)</h3>
                <button
                  onClick={() => { setCurrentView('cases'); setCurrentPage(1); }}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800">
                  View Full Table &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Case Number</th>
                      <th className="px-4 py-2.5 text-left">Patient Ref</th>
                      <th className="px-4 py-2.5 text-left">Surgeon</th>
                      <th className="px-4 py-2.5 text-left">Implant Type</th>
                      <th className="px-4 py-2.5 text-left">Status</th>
                      <th className="px-4 py-2.5 text-left">Priority</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {cases.slice(0, 5).map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-teal-700">
                          <button onClick={() => { setSelectedCaseId(item.id); setCurrentView('show'); }} className="hover:underline">
                            {item.case_number}
                          </button>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">{item.patient_reference}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{item.surgeon_name}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{item.implant_type}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${getStatusDot(item.status)}`}></span>
                            <span className="text-slate-800 font-medium">{item.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={item.priority === 'High' ? 'text-rose-600 font-semibold' : item.priority === 'Medium' ? 'text-amber-600 font-medium' : 'text-slate-500'}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => { setSelectedCaseId(item.id); setCurrentView('show'); }}
                            className="text-slate-600 hover:text-slate-900 font-medium">
                            View
                          </button>
                          {currentUser.role !== 'viewer' && (
                            <button
                              onClick={() => openEditForm(item)}
                              className="text-teal-700 hover:text-teal-900 font-medium">
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : currentView === 'cases' ? (
          /* CASE LIST VIEW */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Medical Case List</h2>
                <p className="text-xs text-slate-500">Paginated 10 per page, search by Case Number or Surgeon, filter by Status</p>
              </div>
              {currentUser.role !== 'viewer' && (
                <button
                  onClick={openCreateForm}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition cursor-pointer self-start sm:self-auto">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Case</span>
                </button>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end text-xs">
              <div className="lg:col-span-4">
                <label className="block font-semibold text-slate-600 mb-1">
                  Search Cases
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Case Number (CASE-0001) or Surgeon..."
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="block font-semibold text-slate-600 mb-1">
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white">
                  <option value="">All Statuses ({cases.length})</option>
                  <option value="Draft">Draft</option>
                  <option value="Planning">Planning</option>
                  <option value="In Review">In Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className="block font-semibold text-slate-600 mb-1">
                  Priority Filter (Bonus)
                </label>
                <select
                  value={priorityFilter}
                  onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white">
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                {(searchTerm || statusFilter || priorityFilter) && (
                  <button
                    onClick={() => { setSearchTerm(''); setStatusFilter(''); setPriorityFilter(''); setCurrentPage(1); }}
                    className="w-full py-1.5 border border-slate-300 text-slate-600 hover:text-slate-900 rounded-lg font-medium hover:bg-white transition">
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th 
                        onClick={() => { setSortBy('case_number'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                        className="px-4 py-3 text-left cursor-pointer hover:text-slate-800">
                        <div className="flex items-center space-x-1">
                          <span>Case Number</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left">Patient Ref</th>
                      <th 
                        onClick={() => { setSortBy('surgeon_name'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                        className="px-4 py-3 text-left cursor-pointer hover:text-slate-800">
                        <div className="flex items-center space-x-1">
                          <span>Surgeon Name</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left">Implant Type</th>
                      <th 
                        onClick={() => { setSortBy('status'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                        className="px-4 py-3 text-left cursor-pointer hover:text-slate-800">
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left">Priority</th>
                      <th 
                        onClick={() => { setSortBy('surgery_date'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                        className="px-4 py-3 text-left cursor-pointer hover:text-slate-800">
                        <div className="flex items-center space-x-1">
                          <span>Surgery Date</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedCases.length > 0 ? (
                      paginatedCases.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3 font-mono font-bold text-teal-700">
                            <button
                              onClick={() => { setSelectedCaseId(item.id); setCurrentView('show'); }}
                              className="hover:underline">
                              {item.case_number}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">
                            {item.patient_reference}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">{item.surgeon_name}</td>
                          <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={item.implant_type}>
                            {item.implant_type}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1.5">
                              <span className={`w-2 h-2 rounded-full ${getStatusDot(item.status)}`}></span>
                              <span className="text-slate-800 font-medium">{item.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={item.priority === 'High' ? 'text-rose-600 font-semibold' : item.priority === 'Medium' ? 'text-amber-600 font-medium' : 'text-slate-500'}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                            {item.surgery_date ? item.surgery_date : '—'}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => { setSelectedCaseId(item.id); setCurrentView('show'); }}
                                className="text-slate-600 hover:text-slate-900 font-medium">
                                View
                              </button>

                              {currentUser.role !== 'viewer' && (
                                <button
                                  onClick={() => openEditForm(item)}
                                  className="text-teal-700 hover:text-teal-900 font-medium">
                                  Edit
                                </button>
                              )}

                              {currentUser.role === 'admin' && (
                                <button
                                  onClick={() => handleDeleteCase(item)}
                                  className="text-rose-600 hover:text-rose-800 font-medium">
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                          No matching medical cases found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                <div>
                  Showing <span className="font-semibold text-slate-800">{Math.min(filteredCases.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
                  <span className="font-semibold text-slate-800">{Math.min(filteredCases.length, currentPage * itemsPerPage)}</span> of{' '}
                  <span className="font-semibold text-slate-800">{filteredCases.length}</span> cases
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="px-2.5 py-1 border border-slate-200 rounded bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-medium">
                    &larr; Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2.5 py-1 border rounded text-xs font-semibold ${currentPage === page ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1 border border-slate-200 rounded bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-medium">
                    Next &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'show' && selectedCase ? (
          /* CASE DETAILS VIEW */
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('cases')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Cases List</span>
              </button>
              <div className="flex items-center space-x-2">
                {currentUser.role !== 'viewer' && (
                  <button
                    onClick={() => openEditForm(selectedCase)}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Case</span>
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCase(selectedCase)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${currentUser.role === 'admin' ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'}`}>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Case {currentUser.role !== 'admin' && '(Blocked)'}</span>
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-2xl font-extrabold text-slate-900">{selectedCase.case_number}</span>
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(selectedCase.status)}`}></span>
                      <span className="text-xs font-bold text-slate-800">{selectedCase.status}</span>
                    </div>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs text-slate-600 font-medium">Priority: {selectedCase.priority}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    Internal Record ID: #{selectedCase.id}
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50/60 border border-slate-200/80">
                  <span className="text-slate-500 font-medium block">Patient Reference</span>
                  <span className="font-mono font-bold text-sm text-slate-900 mt-1 block">
                    {selectedCase.patient_reference}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Synthetic identifier (no real names)</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50/60 border border-slate-200/80">
                  <span className="text-slate-500 font-medium block">Surgeon Name</span>
                  <span className="font-bold text-sm text-slate-900 mt-1 block">
                    {selectedCase.surgeon_name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Operating Orthopedic Specialist</span>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-lg bg-slate-50/60 border border-slate-200/80">
                  <span className="text-slate-500 font-medium block">Implant System Type</span>
                  <span className="font-bold text-sm text-slate-900 mt-1 block">
                    {selectedCase.implant_type}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50/60 border border-slate-200/80">
                  <span className="text-slate-500 font-medium block">Scheduled Surgery Date</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-sm text-slate-900">
                      {selectedCase.surgery_date ? selectedCase.surgery_date : 'Not scheduled yet'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50/60 border border-slate-200/80">
                  <span className="text-slate-500 font-medium block">Workflow State</span>
                  <span className="font-bold text-sm text-slate-900 mt-1 block">
                    {selectedCase.status} &bull; Priority: {selectedCase.priority}
                  </span>
                </div>
              </div>

              {/* Creator Details and Timestamps */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-xs">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-3">Audit Trail &amp; Record Authorship</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-500 block">Created By:</span>
                    <span className="font-bold text-slate-900">{selectedCase.created_by.name}</span>
                    <span className="text-[11px] text-slate-500 block font-mono">({selectedCase.created_by.email} &bull; {selectedCase.created_by.role})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Created At:</span>
                    <span className="font-mono text-slate-800">{new Date(selectedCase.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Updated At:</span>
                    <span className="font-mono text-slate-800">{new Date(selectedCase.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CREATE OR EDIT FORM VIEW (_form.blade.php) */
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentView('cases')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Cases List</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">
                  {currentView === 'create' ? 'Create Medical Implant Case' : `Edit Medical Case ${formCaseNumber}`}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reusable form template (`_form.blade.php`) with backend validation checks
                </p>
              </div>

              <form onSubmit={handleSaveCase} className="p-6 space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Case Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formCaseNumber}
                      onChange={e => { setFormCaseNumber(e.target.value); delete formErrors.case_number; }}
                      className={`w-full px-3 py-2 border rounded-lg font-mono text-xs ${formErrors.case_number ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'}`}
                      placeholder="e.g. CASE-0001"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Unique constraint</span>
                    {formErrors.case_number && (
                      <p className="mt-1 text-rose-600 font-semibold">{formErrors.case_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Patient Reference <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formPatientRef}
                      onChange={e => { setFormPatientRef(e.target.value); delete formErrors.patient_reference; }}
                      className={`w-full px-3 py-2 border rounded-lg font-mono text-xs ${formErrors.patient_reference ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'}`}
                      placeholder="e.g. PT-49102"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Dummy code only</span>
                    {formErrors.patient_reference && (
                      <p className="mt-1 text-rose-600 font-semibold">{formErrors.patient_reference}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Surgeon Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formSurgeonName}
                      onChange={e => { setFormSurgeonName(e.target.value); delete formErrors.surgeon_name; }}
                      className={`w-full px-3 py-2 border rounded-lg text-xs ${formErrors.surgeon_name ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'}`}
                      placeholder="e.g. Dr. Marcus Vance, MD"
                    />
                    {formErrors.surgeon_name && (
                      <p className="mt-1 text-rose-600 font-semibold">{formErrors.surgeon_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Implant Type <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formImplantType}
                      onChange={e => { setFormImplantType(e.target.value); delete formErrors.implant_type; }}
                      className={`w-full px-3 py-2 border rounded-lg text-xs ${formErrors.implant_type ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'}`}
                      placeholder="e.g. Titanium Hip Stem (Modular)"
                    />
                    {formErrors.implant_type && (
                      <p className="mt-1 text-rose-600 font-semibold">{formErrors.implant_type}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Case Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white">
                      <option value="Draft">Draft</option>
                      <option value="Planning">Planning</option>
                      <option value="In Review">In Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Priority Level <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formPriority}
                      onChange={e => setFormPriority(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Surgery Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formSurgeryDate}
                      onChange={e => setFormSurgeryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>

                {surgeryHolidayNotice && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>
                      <strong>Notice:</strong> {formSurgeryDate} coincides with public holiday <strong>{surgeryHolidayNotice.name}</strong> (fetched via Nager.Date API).
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setCurrentView('cases')}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-xs transition">
                    {currentView === 'create' ? 'Save New Case' : 'Update Case'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
