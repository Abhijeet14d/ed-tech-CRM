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

const RuleBuilder = ({ rules, setRules, logic, setLogic }) => {
  const addRule = () => {
    setRules([...rules, { field: "age", operator: ">", value: "" }]);
  };

  const updateRule = (idx, key, val) => {
    const updated = [...rules];
    updated[idx][key] = val;
    setRules(updated);
  };

  const removeRule = (idx) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  const toggleLogic = () => {
    setLogic(logic === "AND" ? "OR" : "AND");
  };

  return (
    <div className="space-y-4">
      {/* Logic Selector */}
      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Combine rules with:</span>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setLogic("AND")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              logic === "AND" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            AND
          </button>
          <button
            type="button"
            onClick={() => setLogic("OR")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              logic === "OR" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            OR
          </button>
        </div>
        <span className="text-xs text-gray-500">
          {logic === "AND" ? "(all conditions must match)" : "(any condition can match)"}
        </span>
      </div>
      
      <div className="space-y-2">
        {rules.map((rule, idx) => (
          <div key={idx}>
            {/* Logic connector between rules - clickable to toggle */}
            {idx > 0 && (
              <div className="flex items-center justify-center py-2">
                <button
                  type="button"
                  onClick={toggleLogic}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    logic === "AND" 
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                  title="Click to toggle AND/OR"
                >
                  {logic}
                </button>
              </div>
            )}
            
            {/* Rule Row */}
            <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
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
                className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Value"
              />
              
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