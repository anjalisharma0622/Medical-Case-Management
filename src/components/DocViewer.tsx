import React, { useState } from 'react';
import { BookOpen, Database, ShieldAlert, Cloud, FileText, Check, Copy } from 'lucide-react';

export const DocViewer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'vscode' | 'traceability' | 'database' | 'deployment' | 'readme' | 'postman'>('traceability');
  const [copied, setCopied] = useState(false);

  const docs = [
    { id: 'traceability', title: 'Traceability Matrix', icon: ShieldAlert, path: 'docs/traceability.md' },
    { id: 'database', title: 'Database Schema', icon: Database, path: 'docs/database.md' },
    { id: 'deployment', title: 'AWS Cloud Hosting', icon: Cloud, path: 'docs/deployment.md' },
    { id: 'vscode', title: 'VS Code Setup', icon: FileText, path: 'docs/vscode-setup.md' },
    { id: 'readme', title: 'README', icon: BookOpen, path: 'README.md' },
    { id: 'postman', title: 'Postman Collection', icon: FileText, path: 'docs/postman_collection.json' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Documentation &amp; Medical Compliance</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Technical specifications, entity relationships, medical software traceability (IEC 62304 / ISO 13485), and cloud deployment.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {docs.map(doc => {
            const Icon = doc.icon;
            return (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition whitespace-nowrap ${activeDoc === doc.id ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{doc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeDoc === 'traceability' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-teal-50/60 border border-teal-200 rounded-lg text-xs text-teal-900 leading-relaxed">
            <span className="font-bold">Medical Device Software Engineering Standard:</span> Under IEC 62304 / ISO 13485 quality systems, every system specification requirement (Input) is linked to its architectural code implementation (Output) and verified by automated feature tests.
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3 text-left">Requirement ID</th>
                  <th className="px-4 py-3 text-left">Requirement (Input)</th>
                  <th className="px-4 py-3 text-left">Implementation (Output)</th>
                  <th className="px-4 py-3 text-left">Verification (Test)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-teal-700">REQ-001</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    Admin shall be able to create a case with valid fields; creator ID set automatically.
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 text-[11px]">
                    CaseController@store + StoreCaseRequest
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">
                    Feature test: test_admin_can_create_case
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-teal-700">REQ-002</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    Case Number shall be unique across the system; duplicates rejected with 422.
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 text-[11px]">
                    Unique DB index on cases.case_number + Form Request rule
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">
                    Feature test: test_duplicate_case_number_fails_with_422
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-teal-700">REQ-003</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    Only Admin shall delete cases; Viewer and unauthorized roles blocked with 403 Forbidden.
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 text-[11px]">
                    CasePolicy@delete enforced via $this-&gt;authorize('delete')
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">
                    Feature test: test_viewer_cannot_delete_case_receives_403
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-teal-700">REQ-004</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    All case pages &amp; APIs require authenticated credentials; guest access rejected.
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 text-[11px]">
                    routes/web.php (middleware('auth')) &amp; routes/api.php
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">
                    Feature test: test_guest_cannot_access_cases_web_or_api
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-teal-700">REQ-005</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    Dashboard reports accurate counts for Total, Planning, In Review, Approved, Completed.
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 text-[11px]">
                    DashboardController@index aggregations
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">
                    Feature test: test_dashboard_displays_accurate_status_counts
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-bold text-teal-700">REQ-006</td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    REST API produces consistent JSON envelope ({`{ success, data, message }`}) with status codes.
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 text-[11px]">
                    CaseApiController &amp; CaseResource serialization
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">
                    Feature test: test_sanctum_api_crud_lifecycle
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeDoc === 'database' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/60">
              <h3 className="font-bold text-sm text-slate-900 mb-2">Table: users</h3>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div>&bull; <strong className="text-teal-700">id</strong>: BIGINT UNSIGNED (PK, Auto-increment)</div>
                <div>&bull; <strong>name</strong>: VARCHAR(255)</div>
                <div>&bull; <strong>email</strong>: VARCHAR(255) <span className="text-purple-700 font-bold">(UNIQUE INDEX)</span></div>
                <div>&bull; <strong>password</strong>: VARCHAR(255) (Bcrypt hash)</div>
                <div>&bull; <strong>role</strong>: ENUM('admin', 'viewer', 'engineer') <span className="text-slate-500">(DEFAULT: 'viewer')</span></div>
                <div>&bull; <strong>created_at, updated_at</strong>: TIMESTAMP</div>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/60">
              <h3 className="font-bold text-sm text-slate-900 mb-2">Table: cases</h3>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div>&bull; <strong className="text-teal-700">id</strong>: BIGINT UNSIGNED (PK, Auto-increment)</div>
                <div>&bull; <strong>case_number</strong>: VARCHAR(50) <span className="text-purple-700 font-bold">(UNIQUE INDEX)</span></div>
                <div>&bull; <strong>patient_reference</strong>: VARCHAR(100) (Dummy de-identified code)</div>
                <div>&bull; <strong>surgeon_name</strong>: VARCHAR(255) <span className="text-blue-700 font-bold">(INDEX)</span></div>
                <div>&bull; <strong>implant_type</strong>: VARCHAR(255)</div>
                <div>&bull; <strong>status</strong>: ENUM('Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled') <span className="text-blue-700 font-bold">(INDEX)</span></div>
                <div>&bull; <strong>priority</strong>: ENUM('Low', 'Medium', 'High') <span className="text-blue-700 font-bold">(INDEX)</span></div>
                <div>&bull; <strong>surgery_date</strong>: DATE (Nullable)</div>
                <div>&bull; <strong>created_by</strong>: BIGINT UNSIGNED <span className="text-emerald-700 font-bold">(FK -&gt; users.id, ON DELETE RESTRICT)</span></div>
                <div>&bull; <strong>created_at, updated_at</strong>: TIMESTAMP</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
            <div className="text-teal-400 font-bold mb-1">Entity-Relationship Cardinality:</div>
            <div>users (1) ───────&lt; cases (N) [users.id = cases.created_by]</div>
            <div className="text-slate-400 mt-2">Constraint: ON DELETE RESTRICT prevents deleting active user records who have authored medical audit logs.</div>
          </div>
        </div>
      )}

      {activeDoc === 'deployment' && (
        <div className="space-y-4 text-xs">
          <div className="p-3.5 border border-blue-200 bg-blue-50/30 rounded-xl text-blue-900">
            <span className="font-bold">AWS Production Architecture Overview (Bonus):</span> Designed for medical regulatory compliance, zero single-point-of-failure, encryption at rest, and automated scalability.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 border border-slate-200 rounded-lg bg-white">
              <span className="font-bold text-slate-900 block mb-1">1. Application Layer (EC2 + ALB)</span>
              <p className="text-slate-600 text-[11px]">
                AWS Application Load Balancer terminating TLS 1.3 with ACM certificates, routing to Auto-Scaling EC2 instances in private subnets with PHP 8.3-FPM &amp; Nginx.
              </p>
            </div>
            <div className="p-3.5 border border-slate-200 rounded-lg bg-white">
              <span className="font-bold text-slate-900 block mb-1">2. Database Tier (RDS MySQL)</span>
              <p className="text-slate-600 text-[11px]">
                Amazon RDS for MySQL 8.0 in Multi-AZ configuration across isolated private subnets. Encrypted with AWS KMS (`aws/rds`). Automated point-in-time recovery.
              </p>
            </div>
            <div className="p-3.5 border border-slate-200 rounded-lg bg-white">
              <span className="font-bold text-slate-900 block mb-1">3. File Storage &amp; Secrets</span>
              <p className="text-slate-600 text-[11px]">
                Amazon S3 for surgical planning scans with Block Public Access and expiring pre-signed URLs. Secrets managed via AWS Secrets Manager.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeDoc === 'vscode' && (
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-teal-50/60 border border-teal-200 rounded-lg text-teal-900">
            <span className="font-bold">VS Code Quick Start:</span> Run the native Laravel 11 application or this interactive simulator directly inside VS Code.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/60 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">Run Laravel 11 Backend (PHP &amp; MySQL)</h4>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 font-mono text-[11px]">
                <li>cd laravel-app</li>
                <li>composer install</li>
                <li>cp .env.example .env &amp;&amp; php artisan key:generate</li>
                <li>php artisan migrate --seed</li>
                <li>php artisan serve</li>
              </ol>
              <p className="text-[11px] text-slate-500 pt-1">
                Access at: <strong className="text-teal-700">http://127.0.0.1:8000</strong>
              </p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/60 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">Recommended VS Code Extensions</h4>
              <ul className="space-y-1.5 text-slate-700 text-[11px]">
                <li>&bull; <strong className="text-teal-700">PHP Intelephense:</strong> Autocomplete &amp; syntax</li>
                <li>&bull; <strong className="text-teal-700">Thunder Client:</strong> Test Sanctum APIs with <code className="bg-white px-1 rounded border">docs/postman_collection.json</code></li>
                <li>&bull; <strong className="text-teal-700">Laravel Blade Snippets:</strong> Blade templating</li>
                <li>&bull; <strong className="text-teal-700">PHPUnit:</strong> Run feature tests via UI</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeDoc === 'readme' && (
        <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl text-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Project Setup &amp; Dummy Credentials</h3>
          <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
            <div>Admin: <span className="text-teal-700 font-bold">admin@jajalmedical.test</span> / password: <span className="font-bold">password123</span></div>
            <div>Viewer: <span className="text-slate-700 font-bold">viewer@jajalmedical.test</span> / password: <span className="font-bold">password123</span></div>
            <div>Engineer: <span className="text-blue-700 font-bold">engineer@jajalmedical.test</span> / password: <span className="font-bold">password123</span></div>
          </div>
          <p className="text-slate-600">
            For local setup, clone the repository, run <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">composer install</code>, copy <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">.env.example</code>, run <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">php artisan migrate --seed</code>, and execute <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">php artisan test</code>.
          </p>
        </div>
      )}

      {activeDoc === 'postman' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Import <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">docs/postman_collection.json</code> directly into Postman or Thunder Client in VS Code to test all Sanctum authentication endpoints.
          </p>
          <div className="p-4 bg-slate-950 text-teal-300 font-mono text-[11px] rounded-xl overflow-x-auto max-h-96">
            <pre>{`{
  "info": {
    "name": "Jajal Medical - Case Management API (Sanctum)",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    { "name": "POST /api/login", "request": { "method": "POST", "url": "{{base_url}}/login" } },
    { "name": "GET /api/cases", "request": { "method": "GET", "url": "{{base_url}}/cases" } },
    { "name": "POST /api/cases", "request": { "method": "POST", "url": "{{base_url}}/cases" } },
    { "name": "DELETE /api/cases/{id}", "request": { "method": "DELETE", "url": "{{base_url}}/cases/1" } }
  ]
}`}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
