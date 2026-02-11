import React, { useState } from "react";

const fields = [
  { label: "Age", value: "age" },
  { label: "CGPA", value: "cgpa" },
  { label: "Course Name", value: "courseName" },
  { label: "Email", value: "email" },
  { label: "Name", value: "name" }
];

const operators = [
  { label: "<", value: "<" },
  { label: "<=", value: "<=" },
  { label: "=", value: "=" },
  { label: ">=", value: ">=" },
  { label: ">", value: ">" }
];

const RuleBuilder = ({ rules, setRules, logic, setLogic }) => {
  const addRule = () => {
    setRules([...rules, { field: "age", operator: "<", value: "" }]);
  };

  const updateRule = (idx, key, val) => {
    const updated = [...rules];
    updated[idx][key] = val;
    setRules(updated);
  };

  const removeRule = (idx) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-sm font-medium text-gray-700">Combine rules with:</span>
        <select 
          value={logic} 
          onChange={e => setLogic(e.target.value)} 
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="AND">AND (all conditions must match)</option>
          <option value="OR">OR (any condition can match)</option>
        </select>
      </div>
      
      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
            {idx > 0 && (
              <div className="text-sm font-medium text-gray-500 uppercase">
                {logic}
              </div>
            )}
            
            <select 
              value={rule.field} 
              onChange={e => updateRule(idx, "field", e.target.value)} 
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fields.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            
            <select 
              value={rule.operator} 
              onChange={e => updateRule(idx, "operator", e.target.value)} 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {operators.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            
            <input
              type="text"
              value={rule.value}
              onChange={e => updateRule(idx, "value", e.target.value)}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Value"
            />
            
            <button 
              type="button" 
              onClick={() => removeRule(idx)} 
              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove rule"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <button 
        type="button" 
        onClick={addRule} 
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Another Rule</span>
      </button>
    </div>
  );
};

export default RuleBuilder;