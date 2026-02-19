import { useState, useEffect } from 'react';
import { Button, SearchBar } from '../common';
import organizationService from '../../services/organizationService';
import departmentService from '../../services/departmentService';

const BlogFilters = ({ onFilterChange, className = '' }) => {
  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    orgId: '',
    deptId: '',
    tags: '',
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (filters.orgId) {
      fetchDepartments(filters.orgId);
    } else {
      setDepartments([]);
      if (filters.deptId) {
        setFilters(prev => ({ ...prev, deptId: '' }));
      }
    }
  }, [filters.orgId]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationService.getOrganizations();
      setOrganizations(response.data.organizations);
    } catch (error) {
      console.error('Failed to fetch organizations');
    }
  };

  const fetchDepartments = async (orgId) => {
    try {
      const response = await departmentService.getDepartmentsByOrganization(orgId);
      setDepartments(response.data.departments);
    } catch (error) {
      console.error('Failed to fetch departments');
    }
  };

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      orgId: '',
      deptId: '',
      tags: '',
    });
  };

  return (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Clear All
        </Button>
      </div>

      <SearchBar
        placeholder="Search blogs..."
        value={filters.search}
        onChange={(value) => handleChange('search', value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Organization
        </label>
        <select
          value={filters.orgId}
          onChange={(e) => handleChange('orgId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Organizations</option>
          {organizations.map((org) => (
            <option key={org._id} value={org._id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {filters.orgId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            value={filters.deptId}
            onChange={(e) => handleChange('deptId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          value={filters.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="technology, programming"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <p className="text-xs text-gray-500 mt-1">Comma-separated tags</p>
      </div>
    </div>
  );
};

export default BlogFilters;