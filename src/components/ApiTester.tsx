import React, { useState } from 'react';
import { MedicalCaseItem, AppUser, SEEDED_USERS } from '../data/initialData';
import { Send, Key, CheckCircle, AlertCircle, Copy, Check, Terminal } from 'lucide-react';

interface ApiTesterProps {
  cases: MedicalCaseItem[];
  setCases: React.Dispatch<React.SetStateAction<MedicalCaseItem[]>>;
  currentUser: AppUser | null;
}

export const ApiTester: React.FC<ApiTesterProps> = ({ cases, setCases, currentUser }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'login' | 'logout' | 'list_cases' | 'create_case' | 'get_case' | 'update_case' | 'delete_case'>('list_cases');
  const [activeTokenRole, setActiveTokenRole] = useState<'admin' | 'viewer' | 'engineer' | 'none'>('admin');
  
  const [caseIdInput, setCaseIdInput] = useState('1');
  const [searchParam, setSearchParam] = useState('');
  const [statusParam, setStatusParam] = useState('');
  const [pageParam, setPageParam] = useState('1');

  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        case_number: 'CASE-0099',
        patient_reference: 'PT-99881',
        surgeon_name: 'Dr. Elena Rostova',
        implant_type: 'Titanium Cranial Plate',
        status: 'Planning',
        priority: 'High',
        surgery_date: '2026-11-20',
      },
      null,
      2
    )
  );

  const [responseStatus, setResponseStatus] = useState<number | null>(200);
  const [responseStatusText, setResponseStatusText] = useState('OK');
  const [responseBody, setResponseBody] = useState<any>({
    success: true,
    data: {
      items: cases.slice(0, 3),
      pagination: {
        current_page: 1,
        last_page: Math.ceil(cases.length / 10),
        per_page: 10,
        total: cases.length,
      },
    },
    message: 'Medical cases retrieved successfully.',
  });
  const [copied, setCopied] = useState(false);
  const [latencyMs, setLatencyMs] = useState(24);

  const handleExecuteRequest = () => {
    const start = performance.now();
    let status = 200;
    let statusText = 'OK';
    let body: any = null;

    const hasToken = activeTokenRole !== 'none';
    const isPublic = selectedEndpoint === 'login';

    if (!hasToken && !isPublic) {
      status = 401;
      statusText = 'Unauthorized';
      body = {
        message: 'Unauthenticated. Bearer token missing or invalid.',
      };
    } else {
      switch (selectedEndpoint) {
        case 'login': {
          let parsed: any = {};
          try {
            parsed = JSON.parse(requestBody);
          } catch {
            // fallback
          }
          if (parsed.email === 'admin@jajalmedical.test' && parsed.password === 'password123') {
            status = 200;
            statusText = 'OK';
            body = {
              success: true,
              data: {
                token: '1|sanctum_token_admin_98240f91a27e',
                token_type: 'Bearer',
                user: { id: 1, name: 'System Administrator', email: 'admin@jajalmedical.test', role: 'admin' },
              },
              message: 'Authentication successful. Token issued.',
            };
          } else if (parsed.email === 'viewer@jajalmedical.test' && parsed.password === 'password123') {
            status = 200;
            statusText = 'OK';
            body = {
              success: true,
              data: {
                token: '2|sanctum_token_viewer_48102a883e1c',
                token_type: 'Bearer',
                user: { id: 2, name: 'Clinical Viewer', email: 'viewer@jajalmedical.test', role: 'viewer' },
              },
              message: 'Authentication successful. Token issued.',
            };
          } else {
            status = 422;
            statusText = 'Unprocessable Content';
            body = {
              success: false,
              message: 'The given data was invalid.',
              errors: {
                email: ['These credentials do not match our registered records.'],
              },
            };
          }
          break;
        }

        case 'logout': {
          status = 200;
          statusText = 'OK';
          body = {
            success: true,
            data: null,
            message: 'Logged out successfully. Token revoked.',
          };
          break;
        }

        case 'list_cases': {
          const filtered = cases.filter(c => {
            const matchSearch = !searchParam || c.case_number.toLowerCase().includes(searchParam.toLowerCase()) || c.surgeon_name.toLowerCase().includes(searchParam.toLowerCase());
            const matchStatus = !statusParam || c.status === statusParam;
            return matchSearch && matchStatus;
          });
          status = 200;
          statusText = 'OK';
          body = {
            success: true,
            data: {
              items: filtered.slice(0, 10),
              pagination: {
                current_page: parseInt(pageParam) || 1,
                last_page: Math.ceil(filtered.length / 10) || 1,
                per_page: 10,
                total: filtered.length,
              },
            },
            message: 'Medical cases retrieved successfully.',
          };
          break;
        }

        case 'get_case': {
          const id = parseInt(caseIdInput);
          const found = cases.find(c => c.id === id);
          if (!found) {
            status = 404;
            statusText = 'Not Found';
            body = {
              success: false,
              data: null,
              message: `Medical case with ID ${id} was not found.`,
            };
          } else {
            status = 200;
            statusText = 'OK';
            body = {
              success: true,
              data: found,
              message: 'Medical case details retrieved successfully.',
            };
          }
          break;
        }

        case 'create_case': {
          if (activeTokenRole === 'viewer') {
            status = 403;
            statusText = 'Forbidden';
            body = {
              success: false,
              message: 'This action is unauthorized. Viewers cannot create medical cases.',
            };
          } else {
            try {
              const parsed = JSON.parse(requestBody);
              const exists = cases.some(c => c.case_number.toLowerCase() === parsed.case_number?.toLowerCase());
              if (exists) {
                status = 422;
                statusText = 'Unprocessable Content';
                body = {
                  success: false,
                  message: 'The case number has already been taken.',
                  errors: {
                    case_number: ['The case number has already been taken.'],
                  },
                };
              } else if (!parsed.case_number || !parsed.patient_reference || !parsed.surgeon_name || !parsed.implant_type) {
                status = 422;
                statusText = 'Unprocessable Content';
                body = {
                  success: false,
                  message: 'Validation failed.',
                  errors: {
                    case_number: !parsed.case_number ? ['The case number field is required.'] : [],
                    patient_reference: !parsed.patient_reference ? ['The patient reference field is required.'] : [],
                  },
                };
              } else {
                status = 201;
                statusText = 'Created';
                const created: MedicalCaseItem = {
                  id: Math.max(...cases.map(c => c.id), 0) + 1,
                  case_number: parsed.case_number,
                  patient_reference: parsed.patient_reference,
                  surgeon_name: parsed.surgeon_name,
                  implant_type: parsed.implant_type,
                  status: parsed.status || 'Draft',
                  priority: parsed.priority || 'Medium',
                  surgery_date: parsed.surgery_date || null,
                  created_by: activeTokenRole === 'admin' ? SEEDED_USERS[0] : SEEDED_USERS[2],
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                setCases(prev => [created, ...prev]);
                body = {
                  success: true,
                  data: created,
                  message: 'Medical case created successfully.',
                };
              }
            } catch {
              status = 400;
              statusText = 'Bad Request';
              body = { success: false, message: 'Invalid JSON payload.' };
            }
          }
          break;
        }

        case 'update_case': {
          if (activeTokenRole === 'viewer') {
            status = 403;
            statusText = 'Forbidden';
            body = {
              success: false,
              message: 'This action is unauthorized. Viewers cannot modify cases.',
            };
          } else {
            const id = parseInt(caseIdInput);
            const found = cases.find(c => c.id === id);
            if (!found) {
              status = 404;
              statusText = 'Not Found';
              body = { success: false, data: null, message: `Medical case with ID ${id} was not found.` };
            } else {
              const parsed = JSON.parse(requestBody);
              status = 200;
              statusText = 'OK';
              const updated = { ...found, ...parsed, updated_at: new Date().toISOString() };
              setCases(prev => prev.map(c => c.id === id ? updated : c));
              body = {
                success: true,
                data: updated,
                message: 'Medical case updated successfully.',
              };
            }
          }
          break;
        }

        case 'delete_case': {
          if (activeTokenRole !== 'admin') {
            status = 403;
            statusText = 'Forbidden';
            body = {
              success: false,
              message: 'Access Denied: Only administrators have permission to delete medical cases (CasePolicy@delete).',
            };
          } else {
            const id = parseInt(caseIdInput);
            const found = cases.find(c => c.id === id);
            if (!found) {
              status = 404;
              statusText = 'Not Found';
              body = { success: false, data: null, message: `Medical case with ID ${id} was not found.` };
            } else {
              setCases(prev => prev.filter(c => c.id !== id));
              status = 200;
              statusText = 'OK';
              body = {
                success: true,
                data: { deleted_id: id, case_number: found.case_number },
                message: `Medical case ${found.case_number} deleted successfully.`,
              };
            }
          }
          break;
        }
      }
    }

    const elapsed = Math.round(performance.now() - start) + Math.floor(Math.random() * 20 + 15);
    setLatencyMs(elapsed);
    setResponseStatus(status);
    setResponseStatusText(statusText);
    setResponseBody(body);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(responseBody, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Laravel Sanctum REST API Console</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            JSON responses follow the standard shape: <code className="font-mono text-teal-700 bg-teal-50 px-1 py-0.5 rounded">&#123; success, data, message &#125;</code>
          </p>
        </div>
        
        {/* Token Role Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
          <Key className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <span className="font-semibold text-slate-600">Bearer Token:</span>
          {(['admin', 'viewer', 'engineer', 'none'] as const).map(role => (
            <button
              key={role}
              onClick={() => setActiveTokenRole(role)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${activeTokenRole === role ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
              {role === 'none' ? 'No Token' : role}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector & Request Builder */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Endpoints
            </label>
            <div className="space-y-1">
              {[
                { id: 'list_cases', method: 'GET', path: '/api/cases', role: 'Admin, Viewer', desc: 'List cases (paginated)' },
                { id: 'get_case', method: 'GET', path: '/api/cases/{id}', role: 'Admin, Viewer', desc: 'Get single case details' },
                { id: 'create_case', method: 'POST', path: '/api/cases', role: 'Admin, Engineer', desc: 'Create new medical case' },
                { id: 'update_case', method: 'PUT', path: '/api/cases/{id}', role: 'Admin, Engineer', desc: 'Update existing case' },
                { id: 'delete_case', method: 'DELETE', path: '/api/cases/{id}', role: 'Admin only', desc: 'Delete case' },
                { id: 'login', method: 'POST', path: '/api/login', role: 'Anyone', desc: 'Issue Sanctum token' },
                { id: 'logout', method: 'POST', path: '/api/logout', role: 'Logged-in', desc: 'Revoke token' },
              ].map(ep => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpoint(ep.id as any);
                    if (ep.id === 'login') {
                      setRequestBody(JSON.stringify({ email: 'admin@jajalmedical.test', password: 'password123' }, null, 2));
                    } else if (ep.id === 'create_case') {
                      setRequestBody(JSON.stringify({
                        case_number: `CASE-${String(cases.length + 1).padStart(4, '0')}`,
                        patient_reference: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
                        surgeon_name: 'Dr. Sophia Patel, FRCS',
                        implant_type: 'Titanium Cranial Mesh',
                        status: 'Planning',
                        priority: 'High',
                        surgery_date: '2026-11-20',
                      }, null, 2));
                    }
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${selectedEndpoint === ep.id ? 'border-teal-500 bg-teal-50/40 text-teal-900 font-semibold shadow-xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[11px] text-slate-800">{ep.method}</span>
                    <span className="font-mono text-slate-600">{ep.path}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{ep.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          {(selectedEndpoint === 'get_case' || selectedEndpoint === 'update_case' || selectedEndpoint === 'delete_case') && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <label className="block font-semibold text-slate-700 mb-1">Target Case ID</label>
              <input
                type="number"
                value={caseIdInput}
                onChange={e => setCaseIdInput(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white font-mono text-xs"
                min="1"
              />
            </div>
          )}

          {selectedEndpoint === 'list_cases' && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">Search Query (search=)</label>
                <input
                  type="text"
                  value={searchParam}
                  onChange={e => setSearchParam(e.target.value)}
                  placeholder="CASE-0001 or Surgeon name"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Status Filter (status=)</label>
                  <select
                    value={statusParam}
                    onChange={e => setStatusParam(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-xs">
                    <option value="">All</option>
                    <option value="Approved">Approved</option>
                    <option value="In Review">In Review</option>
                    <option value="Planning">Planning</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Page (page=)</label>
                  <input
                    type="number"
                    value={pageParam}
                    onChange={e => setPageParam(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-xs"
                    min="1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Request Payload */}
          {(selectedEndpoint === 'create_case' || selectedEndpoint === 'update_case' || selectedEndpoint === 'login') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                JSON Request Payload
              </label>
              <textarea
                value={requestBody}
                onChange={e => setRequestBody(e.target.value)}
                rows={7}
                className="w-full p-2.5 font-mono text-xs border border-slate-300 rounded-lg bg-slate-900 text-teal-300 focus:outline-none"
              />
            </div>
          )}

          <button
            onClick={handleExecuteRequest}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center justify-center space-x-2 transition cursor-pointer">
            <Send className="w-3.5 h-3.5" />
            <span>Send Request</span>
          </button>
        </div>

        {/* Response Inspector */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Response</span>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${responseStatus === 200 || responseStatus === 201 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : responseStatus === 401 ? 'bg-amber-50 text-amber-800 border border-amber-200' : responseStatus === 403 ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-800'}`}>
                {responseStatus} {responseStatusText}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-mono">{latencyMs}ms</span>
              <button
                onClick={copyResponse}
                className="p-1 text-slate-500 hover:text-slate-800 border border-slate-200 rounded hover:bg-slate-50 transition"
                title="Copy JSON">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl p-4 font-mono text-xs overflow-auto max-h-[480px] border border-slate-800 text-slate-200">
            <pre className="text-teal-300">{JSON.stringify(responseBody, null, 2)}</pre>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-700">Standards Verified:</div>
            <div>&bull; Uniform JSON: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">&#123; success, data, message &#125;</code></div>
            <div>&bull; Viewer role DELETE triggers server-enforced <span className="font-semibold text-rose-600">403 Forbidden</span>.</div>
            <div>&bull; Duplicate Case Numbers return <span className="font-semibold text-purple-700">422 Unprocessable Content</span> with field validation bag.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
