import React, { useState, useMemo } from 'react';
import { Folder, FolderOpen, FileText, Search, Plus, CheckCircle, Lock } from 'lucide-react';

// Sample School-Specific Chart of Accounts Data
const initialAccountsData = [
  {
    code: '1000',
    name: 'ASSETS',
    type: 'Asset',
    isParent: true,
    children: [
      {
        code: '1100',
        name: 'Cash & Cash Equivalents',
        type: 'Asset',
        isParent: true,
        children: [
          { code: '1110', name: 'Main Operating Bank Account', type: 'Asset', isParent: false, balance: 42500.00, systemLocked: true },
          { code: '1120', name: 'Cafeteria Petty Cash', type: 'Asset', isParent: false, balance: 500.00, systemLocked: false }
        ]
      },
      {
        code: '1200',
        name: 'Receivables',
        type: 'Asset',
        isParent: true,
        children: [
          { code: '1210', name: 'Tuition Receivable', type: 'Asset', isParent: false, balance: 85000.00, systemLocked: true },
          { code: '1220', name: 'Hostel Fee Receivable', type: 'Asset', isParent: false, balance: 12000.00, systemLocked: false }
        ]
      }
    ]
  },
  {
    code: '4000',
    name: 'REVENUE',
    type: 'Revenue',
    isParent: true,
    children: [
      {
        code: '4100',
        name: 'Academic Fees',
        type: 'Revenue',
        isParent: true,
        children: [
          { code: '4110', name: 'Tuition Fee Revenue', type: 'Revenue', isParent: false, balance: 145000.00, systemLocked: true },
          { code: '4120', name: 'Library & Lab Fees', type: 'Revenue', isParent: false, balance: 15000.00, systemLocked: false }
        ]
      }
    ]
  }
];

// Sample Recent Activity Feed for Details View
const sampleActivity = {
  '1210': [
    { date: '2026-06-15', ref: 'INV-042', desc: 'Grade 10 Tuition Q1 Billing', debit: 5000, credit: 0 },
    { date: '2026-06-16', ref: 'REC-881', desc: 'Payment received - Student #402', debit: 0, credit: 2500 },
  ],
  '1110': [
    { date: '2026-06-16', ref: 'REC-881', desc: 'Tuition Deposit - Student #402', debit: 2500, credit: 0 },
  ]
};

export default function ChartOfAccounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({ '1000': true, '1100': true, '1200': true, '4000': true, '4100': true });

  const toggleExpand = (code) => {
    setExpandedNodes(prev => ({ ...prev, [code]: !prev[code] }));
  };

  // Helper component to recursively render account nodes
  const AccountNode = ({ node, depth = 0 }) => {
    const isExpanded = expandedNodes[node.code];
    const hasChildren = node.children && node.children.length > 0;
    
    // Simple filter matching node name or code
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) || node.code.includes(searchTerm);
    
    if (searchTerm && !matchesSearch && !hasChildren) return null;

    return (
      <div className="select-none">
        <div 
          style={{ paddingLeft: `${depth * 1.25}rem` }}
          className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-colors ${
            selectedAccount?.code === node.code ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'
          }`}
          onClick={() => !node.isParent && setSelectedAccount(node)}
        >
          <div className="flex items-center gap-2">
            {node.isParent ? (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleExpand(node.code); }}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? <FolderOpen size={16} className="text-amber-500" /> : <Folder size={16} className="text-amber-500" />}
              </button>
            ) : (
              <FileText size={16} className="text-blue-400 ml-1" />
            )}
            <span className="font-mono text-sm text-gray-500">{node.code}</span>
            <span className={node.isParent ? "font-semibold text-gray-900" : "text-sm"}>{node.name}</span>
          </div>
          
          {!node.isParent && (
            <span className="text-sm font-mono font-medium text-gray-900">
              ${node.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {node.isParent && isExpanded && (
          <div className="mt-1">
            {node.children.map(child => (
              <AccountNode key={child.code} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Chart of Accounts</h1>
          <p className="text-xs text-gray-500">Manage your school ERP ledger framework and system accounts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus size={16} />
          Add Account
        </button>
      </header>

      {/* Main Content Workspace Split-Pane */}
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        
        {/* Left Side: Hierarchy Tree View */}
        <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts by code or name..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {initialAccountsData.map(rootNode => (
              <AccountNode key={rootNode.code} node={rootNode} />
            ))}
          </div>
        </div>

        {/* Right Side: Account Context & Activity Details */}
        <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-y-auto">
          {selectedAccount ? (
            <div>
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-mono">
                      {selectedAccount.type}
                    </span>
                    {selectedAccount.systemLocked && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                        <Lock size={12} /> System Locked
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-2">{selectedAccount.name}</h2>
                  <p className="text-sm font-mono text-gray-500 mt-0.5">Account Code: {selectedAccount.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Current Balance</p>
                  <p className="text-3xl font-mono font-bold text-gray-900 mt-1">
                    ${selectedAccount.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Account Configurations Summary */}
              <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 block">Currency</span>
                  <span className="text-sm font-medium text-gray-800">USD ($)</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Status</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full mt-0.5">
                    <CheckCircle size={12} /> Active
                  </span>
                </div>
              </div>

              {/* Recent Activity Table Ledger */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Ledger Activity</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                        <th className="p-3">Date</th>
                        <th className="p-3">Ref #</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-right">Debit</th>
                        <th className="p-3 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-mono text-gray-700 divide-y divide-gray-100">
                      {sampleActivity[selectedAccount.code]?.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50/50">
                          <td className="p-3 whitespace-nowrap text-xs text-gray-500">{row.date}</td>
                          <td className="p-3 font-semibold text-blue-600">{row.ref}</td>
                          <td className="p-3 font-sans text-xs text-gray-600 max-w-[180px] truncate">{row.desc}</td>
                          <td className="p-3 text-right text-emerald-600">{row.debit > 0 ? `$${row.debit.toLocaleString()}` : '-'}</td>
                          <td className="p-3 text-right text-rose-600">{row.credit > 0 ? `$${row.credit.toLocaleString()}` : '-'}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-xs font-sans text-gray-400">
                            No ledger entries found for this tracking cycle period.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
              <FileText size={48} className="text-gray-300 mb-3" />
              <h3 className="text-sm font-semibold text-gray-700">No Account Selected</h3>
              <p className="text-xs text-gray-400 max-w-xs mt-1">
                Select a transactional (child) account code from the sidebar structure to review configurations, balance matrices, and audit trailing logs.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}