import React from "react";

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

const RuleBuilder = ({ rules, setRules }) => {
  const addRule = () => {
    setRules([...rules, { field: "age", operator: ">", value: "", connector: "AND" }]);
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
    <div className="space-y-3">
      {rules.map((rule, idx) => (
        <div key={idx} className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg">
          {/* Connector selector (AND/OR) - only for rules after the first */}
          {idx > 0 ? (
            <select
              value={rule.connector || "AND"}
              onChange={e => updateRule(idx, "connector", e.target.value)}
              className={`w-20 border rounded-lg px-2 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                rule.connector === "OR" 
                  ? "bg-purple-50 border-purple-300 text-purple-700" 
                  : "bg-blue-50 border-blue-300 text-blue-700"
              }`}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          ) : (
            <div className="w-20 px-2 py-2 text-sm font-medium text-gray-400 text-center">
              WHERE
            </div>
          )}
          
          {/* Field selector */}
          <select 
            value={rule.field} 
            onChange={e => updateRule(idx, "field", e.target.value)} 
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fields.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          
          {/* Operator selector */}
          <select 
            value={rule.operator} 
            onChange={e => updateRule(idx, "operator", e.target.value)} 
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {operators.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          
          {/* Value input */}
          <input
            type="text"
            value={rule.value}
            onChange={e => updateRule(idx, "value", e.target.value)}
            className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Value"
          />
          
          {/* Remove button */}
          {rules.length > 1 && (
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
          )}
        </div>
      ))}
      
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