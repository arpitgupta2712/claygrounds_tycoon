import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EmployeeSelect = ({ onSelect, className }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees`);
      if (response.data.success) {
        const activeEmployees = response.data.data.filter(
          emp => emp.employment_status === 'Active'
        );
        setEmployees(activeEmployees);
        
        // Extract unique designations
        const uniqueDesignations = [...new Set(
          activeEmployees.map(emp => emp.designation)
        )].sort();
        setDesignations(uniqueDesignations);
        
        if (uniqueDesignations.length > 0) {
          setSelectedDesignation(uniqueDesignations[0]);
        }
      }
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDesignationChange = (e) => {
    setSelectedDesignation(e.target.value);
  };

  const handleEmployeeSelect = (e) => {
    const selectedEmployee = employees.find(
      emp => emp.employee_id === e.target.value
    );
    onSelect(selectedEmployee);
  };

  if (loading) return <div className="cg-loading">Loading employees...</div>;
  if (error) return <div className="cg-error">{error}</div>;

  const filteredEmployees = employees.filter(
    emp => emp.designation === selectedDesignation
  );

  return (
    <div className={`cg-employee-select ${className || ''}`}>
      <div className="cg-select-group">
        <label htmlFor="designation" className="cg-label">Select Designation</label>
        <select
          id="designation"
          value={selectedDesignation}
          onChange={handleDesignationChange}
          className="cg-select"
        >
          {designations.map(designation => (
            <option key={designation} value={designation}>
              {designation}
            </option>
          ))}
        </select>
      </div>

      <div className="cg-select-group">
        <label htmlFor="employee" className="cg-label">Select Employee</label>
        <select
          id="employee"
          onChange={handleEmployeeSelect}
          className="cg-select"
        >
          <option value="">Select an employee</option>
          {filteredEmployees.map(employee => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {employee.employee_name} ({employee.nickname || 'No nickname'})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EmployeeSelect; 